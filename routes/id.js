const express = require("express");
const { default: mongoose, Model } = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cl_tlab = require("../models/cl_tlab");
const cl_wshop = require("../models/cl_wshop");
const dy_tlab = require("../models/dy_tlab");
const dy_wshop = require("../models/dy_wshop");
const in_tlab = require("../models/in_tlab");
const in_wshop = require("../models/in_wshop");
const Forms = require("../models/forms");
const Users = require("../models/users");

const {
  getCluster,
  authenticateToken,
  authorizeUpdate,getReadiness,updateStats
} = require("../middlewares/middleware");

router.get("/dataDashboard", authenticateToken, getForm, async (req, res) => {
  //
  const data = await res.tabl
    .find(
      {},
      { wip: 1, completed_percentage: 1, completed: 1, yts: 1, deliverable: 1 }
    )
    .then();
  let wip = 0;
  let cpl = 0;
  let yts = 0;
  let tot = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i]._doc["completed"] === 0 && data[i]._doc["wip"] === 0) {
      yts++;
    } else if (data[i]._doc["wip"] >= 0 && data[i]._doc["deliverable"] !== 1)
      wip++;
    else cpl++;
    tot++;
  }
  res.json({ tot, wip, cpl, yts });
});

router.get(
  "/test",
  authenticateToken,
  getUniqueCluster,
  getReadiness,
  async (req, res) => {
    let results = {};
    res.send(res.cluster_data);
  }
);

async function getUniqueCluster(req, res, next) {
  let clusters = [];
  try {
    clusters = await cl_tlab.distinct("Cluster").then();
  } catch (err) {
    res.status(500).send("Error fetching distinct Clusters");
    return;
  }
  res.clist = clusters;
  next();
}

router.get("/form", authenticateToken, async (req, res) => {
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
    res.json(college[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get(
  "/getCluster",
  authenticateToken,
  getForm,
  getCluster,
  async (req, res) => {
    res.send(res.college);
  }
);

router.get(
  "/getId",
  authenticateToken,
  getForm,
  getCollege,
  async (req, res) => {
    res.send(res.college);
  }
);

router.patch("/", getCollege, async (req, res) => {
  // some code here for updating multiple colleges by id
});


router.patch("/update", authenticateToken, getCollege, async (req, res) => {
  res.college = res.college.map((college) => {
    Object.keys(req.body).forEach((key) => {
      // console.log(key)
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
    res.status(404).send("Error In Updating");
  }
});

router.patch(
  "/update_tmp",
  authenticateToken,
  getForm,
  authorizeUpdate,
  getCollege,
  updateStats,
  async (req, res) => {
    res.json(res.college);
  }
);

// Deleting One
router.delete("/:id", getCollege, async (req, res) => {});

// middleware to get college data by id
async function getCollege(req, res, next) {
  let college;
  try {
    college = await res.tabl.find({ customId: req.query.id });

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



async function getForm(req, res, next) {
  const form = await Forms.findOne(
    { formId: req.query.form_Id },
    { formName: 1, formAdmins: 1 }
  ).exec();
  const models = {
    cl_tlab: cl_tlab,
    cl_wshop: cl_wshop,
    dl_tlab: dy_tlab,
    dl_wshop: dy_wshop,
    ins_tlab: in_tlab,
    ins_wshop: in_wshop,
  };
  const sizes = {
    cl_tlab: 15,
    cl_wshop: 16,
    dl_tlab: 17,
    dl_wshop: 15,
    ins_tlab: 17,
    ins_wshop: 15,
  };
  const tabl = models[form["formName"]];
  res.sz = sizes[form["formName"]];
  res.admins = form["formAdmins"];
  res.tabl = tabl;
  next();
}


module.exports = router;
