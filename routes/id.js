const express = require("express");
const { default: mongoose, Model } = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
const request = require("request");
const cl_tlab = require("../models/cl_tlab");
const cl_wshop = require("../models/cl_wshop");
const dy_tlab = require("../models/dy_tlab");
const dy_wshop = require("../models/dy_wshop");
const in_tlab = require("../models/in_tlab");
const in_wshop = require("../models/in_wshop");
const Forms = require("../models/forms");
const Users = require("../models/users");

router.get("/form", async (req, res) => {
  const form = await Forms.findOne({ formId: req.body.form_Id });
  if (!form) {
    return res.status(404).json({ message: "form not found" });
  }
  req.formName = form.formName;
  res.json({ formName: form.formName });
});

// Getting all
router.get("/", authenticateToken, async (req, res) => {
  try {
    const college = await cl_tlab.find().limit(2);
    res.json(college);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting by Cluster
router.get("/cluster", authenticateToken, getCluster, async (req, res) => {
  res.json(res.college);
});

// Getting one
router.get("/:id", authenticateToken, getCollege, async (req, res) => {
  // console.log(req.userId);
  res.send(res.college);
});

router.patch("/", getCollege, async (req, res) => {
  // some code here for updating multiple colleges by id
});

// Updating One ...need to use patch bcoz put updates all cols
router.patch("/:id", authenticateToken, getCollege, async (req, res) => {
  res.college = res.college.map((college) => {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== null && !isNaN(req.body[key])) {
        college[key] = req.body[key];
      }
    });
    return college;
  });
  try {
    const updatedCollege = await res.college[0].save();
    res.json(updatedCollege);
  } catch (err) {
    res.status(404).send("No");
  }
});

// Deleting One
router.delete("/:id", getCollege, async (req, res) => {});

// middleware to get college data by id
async function getCollege(req, res, next) {
  let college;
  const form = await Forms.findOne(
    { formId: req.body.form_Id },
    { formName: 1 }
  ).exec();
  const models = {
    cl_tlab: cl_tlab,
    cl_wshop: cl_wshop,
    dl_tlab: dy_tlab,
    dl_wshop: dy_wshop,
    ins_tlab: in_tlab,
    ins_wshop: in_wshop,
  };
  const tabl = models[form["formName"]];
  try {
    college = await tabl.find({ customId: req.params.id });

    if (college == null) {
      return res.status(404).json({ message: "Cannot find subscriber" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.college = college;
  next();
}

async function getCluster(req, res, next) {
  let college;
  const form = await Forms.findOne(
    { formId: req.body.form_Id },
    { formName: 1 }
  ).exec();
  const models = {
    cl_tlab: cl_tlab,
    cl_wshop: cl_wshop,
    dl_tlab: dy_tlab,
    dl_wshop: dy_wshop,
    ins_tlab: in_tlab,
    ins_wshop: in_wshop,
  };
  const tabl = models[form["formName"]];
  try {
    college = await tabl.find({ Cluster: req.body.Cluster });

    if (college == null) {
      return res.status(404).json({ message: "Cannot find subscriber" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.college = college;
  next();
}

async function authorizeClusterbyId(req, res, next) {
  let clusterById;
  try {
    clusterById = await cl_tlab.find({ customId: req.params.id }).then();

    if (clusterById == null) {
      return res.status(404).json({ message: "Cannot find cluster" });
    }
    if (clusterById[0].Cluster === req.cluster) {
      res.cluster = clusterById[0].Cluster;
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function updateAccess(req, res, next) {
  //NOTE i think we need to find the cluster according to logged in user and then check with cluster according to id
  let admin_cluster;
  try {
    admin_cluster = await Users.findOne(
      { username: res.user.username },
      { Cluster: 1 }
    ).exec();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  // console.log(user_cluster[0].Cluster);
  // console.log(req.body.Cluster);
  if (admin_cluster[0].Cluster === req.body.Cluster) {
    res.cluster = user_cluster[0].Cluster;
    next();
  } else res.sendStatus(401);
}

// this not only authenticates the user but also assigns the userId to the req parameter
async function authenticateToken(req, res, next) {
  // Bearer TOKEN
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    // console.log(user)
    req.username = user.username;
    req.userId = user.userId;
    next();
  });
}

module.exports = router;
