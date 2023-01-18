const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
const request = require("request");
const cl_tlab = require("../models/cl_tlab");
const admins = require("../models/admins");
// const User = require('../models/user')
// colleges.
// const ObjectId = mongoose.Types.ObjectId;

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
  // code here for multi select
  // console.log()
  let user_cluster;
  let ans;
  try {
    user_cluster = await admins.find(
      { username: res.user.username },
      { Cluster: 1 }
    );
    // res.json(user_cluster);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  // console.log(user_cluster[0]);
  // console.log(typeof user_cluster.Cluster);
  // console.log(typeof(String(req.body.Cluster)))
  // if (user_cluster[0].Cluster === req.user.Cluster) ans = "yes";

  res.json({ user_cluster, ans });
  // res.send(res.user.username);
});

// Getting one
router.get("/:id", authenticateToken, getCollege, async (req, res) => {
  const ans = res.college.MCB;

  res.send(res.college);
  // const prop = 'age'
  // const ans=res.college.customId
  // res.send(String(res.college[0].AC));
  // res.send({
  //   AC: String(res.college[0].AC),
  //   Flooring: String(res.college[0].Flooring),
  // });
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
    // const updatedCollege = res.college[0].save();
    const updatedCollege = await res.college[0].save();
    res.json(updatedCollege);
  } catch (err) {
    res.status(404).send("No");
  }
});

// Deleting One
router.delete("/:id", getCollege, async (req, res) => {
  // try {
  //   await res.college.remove();
  //   res.json({ message: "College Deleted" });
  // } catch (err) {
  //   res.json({ message: "No College found hence not deleted" });
  // }
});

async function getCollege(req, res, next) {
  let college;
  //   customId = ObjectId(req.params.id)
  //   let customId = new ObjectId(req.params.id);
  try {
    college = await cl_tlab.find({ customId: req.params.id });
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
  let cluster;
  //   customId = ObjectId(req.params.id)
  //   let customId = new ObjectId(req.params.id);
  try {
    cluster = await cl_tlab.find({ Cluster: req.body.Cluster });
    // console.log(cluster)
    if (cluster == null) {
      return res.status(404).json({ message: "Cannot find cluster" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.cluster = cluster;
  next();
}

async function updateAccess(req, res, next) {
  //NOTE i think we need to find the cluster according to logged in user and then check with cluster according to id
  let user_cluster;
  try {
    user_cluster = await cl_tlab.find(
      { customId: req.params.id },
      { Cluster: 1 }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  // console.log(user_cluster[0].Cluster);
  // console.log(req.body.Cluster);
  if (user_cluster[0].Cluster === req.body.Cluster) {
    res.cluster = user_cluster[0].Cluster;
    next();
  } else res.sendStatus(401);
}

// need to implement this on above functions now
async function authenticateToken(req, res, next) {
  // Bearer TOKEN
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.sendStatus(403);
    }
    res.user = { username: payload.username, Cluster: payload.Cluster };
    console.log(payload);
    // console.log(res.user.Cluster);
    next();
  });
}

module.exports = router;
