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
const tn_cl_tlab = require("../models/tn_cl_tlab");
const tn_cl_wshop = require("../models/tn_cl_wshop");
const tn_dy_tlab = require("../models/tn_dy_tlab");
const tn_dy_wshop = require("../models/tn_dy_wshop");
const tn_in_wshop = require("../models/tn_in_wshop");
const tn_in_tlab = require("../models/tn_in_tlab");
const tn_courses = require("../models/tn_courses");

const Forms = require("../models/forms");
const Users = require("../models/users");
const latestUpdate = require("../models/latestUpdate");

const {
  getCluster,
  authenticateToken,
  authorizeUpdate,
  getReadiness,
  updateStats,
  getForm,
  getUniqueCluster,
  getCollege,
  logChanges,
  checkAndUpdateChanges,
} = require("../middlewares/middleware");
// const latestUpdate = require("../models/latestUpdate");

router.get("/getUsername", authenticateToken, async (req, res) => {
  res.status(200).json(req.username);
});

router.get("/dataDashboard", authenticateToken, getForm, async (req, res) => {
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
    // res.json({Done:"Done"})
  }
);

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

router.patch(
  "/update_tmp",
  authenticateToken,
  getForm,
  authorizeUpdate,
  getCollege,
  updateStats,
  logChanges,
  checkAndUpdateChanges,
  async (req, res) => {
    res.json(res.college);
  }
);

router.get("/lastChanges", authenticateToken, async (req, res) => {
  let tmp_changes;
  try {
    const tmp_changes = await latestUpdate
      .find({ stateName: req.authState })
      .sort({ changeId: -1 })
      .limit(20)
      .then();
    // let year = tmp_changes[0]._doc["dateUpdate"].getFullYear();

    // console.log(hours + ":" + minutes);
    res.send({ tmp_changes });
  } catch (err) {
    res.send(err);
  }
});

router.get("/deleteAllLogs", authenticateToken, async (req, res) => {
  try {
    const deletedLogs = await latestUpdate.deleteMany().then();
    res.send(deletedLogs);
  } catch (err) {
    res.send(err);
  }
});
// Deleting One or resetting all values to -1
// router.delete("/", getCollege, async (req, res) => {});

router.get("/editableForms", authenticateToken, async (req, res) => {
  let allowedForms;
  let userId = req.userId;
  try {
    allowedForms = await Forms.find(
      { formAdmins: { $in: [userId] } },
      { formId: 1, formName: 1 }
    ).then();
    res.send(allowedForms);
  } catch (err) {
    res.send({ err: "Error finding authorized forms" });
  }
});

module.exports = router;
