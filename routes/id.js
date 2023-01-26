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


router.get("/dataDashboard",authenticateToken, getForm, async (req, res) => {
  //
  const data = await res.tabl
    .find({}, { wip: 1, completed_percentage: 1, completed: 1, yts: 1 })
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

router.get("/test",authenticateToken, getUniqueCluster, getReadiness, async (req, res) => {
  let results = {};
  res.send(res.cluster_data);
});

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

async function getReadiness(req, res, next) {
  //
  const colls = {
    1000: [cl_tlab, cl_wshop],
    2000: [dy_tlab, dy_wshop],
    3000: [in_tlab, in_wshop],
  };
  const c1 = colls[req.query.formCode][0];
  const c2 = colls[req.query.formCode][1];
  // console.log(colls[1000][0]);
  // let models = colls[req.query.formCode];
  const sizes = {
    1000: [15, 16],
    2000: [17, 15],
    3000: [17, 15],
  };
  const s1 = sizes[req.query.formCode][0];
  const s2 = sizes[req.query.formCode][1];
  // console.log(s1, s2);
  // let answer1;
  let tech_overall = 0;
  let wks_overall = 0;
  let tech_actual = 0;
  let wks_actual = 0;
  let final_ans = [];
  for (let clu in res.clist) {
    let tmp = { Cluster: res.clist[clu] };
    let answer1 = await c1
      .aggregate([
        { $match: { Cluster: res.clist[clu] } },
        {
          $group: {
            _id: null,
            completed: { $sum: "$completed" },
            Tot: { $sum: 1 },
          },
        },
      ])
      .then();
    let answer2 = await c2
      .aggregate([
        { $match: { Cluster: res.clist[clu] } },
        {
          $group: {
            _id: null,
            completed: { $sum: "$completed" },
            Tot: { $sum: 1 },
          },
        },
      ])
      .then();
    let tech_tot = answer1[0]["Tot"] * s1;
    tech_overall += tech_tot;
    let wks_tot = answer2[0]["Tot"] * s2;
    wks_overall += wks_tot;
    let tech_done = answer1[0]["completed"];
    tech_actual += tech_done;
    let wks_done = answer2[0]["completed"];
    wks_actual += wks_done;

    tmp["completed"] = {
      tech: Math.ceil((tech_done / tech_tot) * 100),
      wks: Math.ceil((wks_done / wks_tot) * 100),
      tech_tot: tech_tot,
      wks_tot: wks_tot,
    };
    // console.log(answer);
    final_ans.push(tmp);
  }
  let stats = {
    tech_actual: tech_actual,
    wks_actual: wks_actual,
    tech_overall: tech_overall,
    wks_overall: wks_overall,
    // cluster_data : final_ans,
  };
  res.tech_actual = tech_actual;
  res.wks_actual = wks_actual;
  res.tech_overall = tech_overall;
  res.wks_overall = wks_overall;
  res.cluster_data = [final_ans, stats];

  next();
}

router.get("/wip", authenticateToken, async (req, res) => {});
router.get("/yts", authenticateToken, async (req, res) => {});
router.get("/completed", authenticateToken, async (req, res) => {});

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

// Updating One ...need to use patch bcoz put updates all cols

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

async function updateStats(req, res, next) {
  // console.log(typeof res.college[0])
  res.college = res.college.map((college) => {
    Object.keys(req.body).forEach((key) => {
      // console.log(key)
      if (req.body[key] !== null && !isNaN(req.body[key])) {
        college[key] = req.body[key];
      }
    });
    return college;
  });
  const updatedCollege = await res.college[0].save();
  // res.json(updatedCollege);
  // res.college[0] = updatedCollege;
  let completed = 0;
  let wip = 0;
  let yts = 0;
  // res.college = res.college.map((college) => {
  //   Object.keys().forEach((key) => {
  //     console.log(key)
  //     if (req.body[key] !== null && !isNaN(req.body[key])) {
  //       college[key] = req.body[key];
  //     }
  //   });
  //   return college;
  // });
  for (const key in res.college[0]) {
    if (res.college[0].hasOwnProperty(key)) {
      // console.log(key, res.college[0][key])
    }
  }
  for (const [key, value] of Object.entries(res.college[0])) {
    if (key !== "isNew") {
      // console.log(key, value)
    }
  }
  Object.keys(res.college[0]).forEach((key) => {
    // console.log(key);
  });

  for (let key in res.college[0]._doc) {
    if (
      !isNaN(res.college[0]._doc[key]) &&
      key !== "__v" &&
      key !== "yts" &&
      key !== "customId" &&
      key !== "completed" &&
      key !== "wip" &&
      key !== "deliverable" &&
      key !== "completed_percentage"
    ) {
      if (res.college[0]._doc[key] === 1) completed++;
      if (res.college[0]._doc[key] === 0) wip++;
      if (res.college[0]._doc[key] === -1) yts++;
      // console.log(key, res.college[0]._doc[key]);
    }
  }
  // console.log(completed,yts,wip)
  // console.log(typeof res.college);
  // for (let x in res.college[0]) console.log(x);
  // console.log(res.college[0].keys())
  res.college[0].completed = completed;
  res.college[0].wip = wip;
  res.college[0].yts = yts;
  res.college[0].completed_percentage = Math.ceil((completed / res.sz) * 100);
  if (completed === res.sz) res.college[0].deliverable = 1;
  const final_update = await res.college[0].save();
  res.college[0] = final_update;
  next();
}

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

async function getCluster(req, res, next) {
  let college;
  // const form = await Forms.findOne(
  //   { formId: req.query.form_Id },
  //   { formName: 1 }
  // ).exec();
  // const models = {
  //   cl_tlab: cl_tlab,
  //   cl_wshop: cl_wshop,
  //   dl_tlab: dy_tlab,
  //   dl_wshop: dy_wshop,
  //   ins_tlab: in_tlab,
  //   ins_wshop: in_wshop,
  // };
  // res.tabl = models[form["formName"]];
  try {
    college = await res.tabl.find({ Cluster: req.query.cluster });

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
async function authorizeUpdate(req, res, next) {
  // let authorized = false;
  let userId = req.userId;
  let authorized = false;
  // console.log(userId);
  // console.log(res.admins);
  // const admins = form["formAdmins"];
  // console.log(admins);
  for (let i = 0; i < res.admins.length; i++) {
    if (res.admins[i] === userId) {
      authorized = true;
      break;
    }
  }
  if (authorized) {
    next();
  } else {
    res.status(401).send("Unauthorized Request");
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
  // const
  res.sz = sizes[form["formName"]];
  // console.log(res.sz);
  res.admins = form["formAdmins"];
  res.tabl = tabl;
  next();
}

// async function authorizeUpdate(req, res, next) {}

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
