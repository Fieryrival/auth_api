const jwt = require("jsonwebtoken");

const cl_tlab = require("../models/cl_tlab");
const cl_wshop = require("../models/cl_wshop");
const dy_tlab = require("../models/dy_tlab");
const dy_wshop = require("../models/dy_wshop");
const in_tlab = require("../models/in_tlab");
const in_wshop = require("../models/in_wshop");
const Forms = require("../models/forms");
// const Users = require("../models/users");
const tn_cl_tlab = require("../models/tn_cl_tlab");
const tn_cl_wshop = require("../models/tn_cl_wshop");
const tn_dy_tlab = require("../models/tn_dy_tlab");
const tn_dy_wshop = require("../models/tn_dy_wshop");
const tn_in_wshop = require("../models/tn_in_wshop");
const tn_in_tlab = require("../models/tn_in_tlab");
const tn_courses = require("../models/tn_courses");
const latestUpdate = require("../models/latestUpdate");
const courses = require("../models/courses");

async function masterAdmin(req, res, next) {
  if (req.username === "master_admin" && req.userId === 100) {
    next();
  } else {
    return res.sendStatus(403);
  }
}

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

const authenticateToken = async (req, res, next) => {
  // Bearer TOKEN
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    { algorithm: "HS256" },
    (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      // console.log(user)
      req.username = user.username;
      req.userId = user.userId;
      req.authState = user.userState;
      next();
    }
  );
};

async function authorizeUpdate(req, res, next) {
  let userId = req.userId;
  let authorized = false;
  for (let i = 0; i < res.admins.length; i++) {
    if (res.admins[i] === userId) {
      authorized = true;
      break;
    }
  }
  if (req.userId === 100 && req.username === "master_admin") authorized = true;
  if (authorized) {
    next();
  } else {
    res.status(401).send("Unauthorized Request");
  }
}

async function getCluster(req, res, next) {
  let college;
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

async function getReadiness(req, res, next) {
  const colls = {
    1000: [cl_tlab, cl_wshop],
    2000: [dy_tlab, dy_wshop],
    3000: [in_tlab, in_wshop],
    4000: [tn_cl_tlab, tn_cl_wshop],
    5000: [tn_dy_tlab, tn_dy_wshop],
    6000: [tn_in_tlab, tn_in_wshop],
  };
  const c1 = colls[req.query.formCode][0];
  const c2 = colls[req.query.formCode][1];
  const sizes = {
    1000: [15, 16],
    2000: [15, 16],
    3000: [15, 16],
    4000: [15, 16],
    5000: [15, 16],
    6000: [15, 16],
  };
  const s1 = sizes[req.query.formCode][0];
  const s2 = sizes[req.query.formCode][1];
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
    final_ans.push(tmp);
  }
  let stats = {
    tech_actual: tech_actual,
    wks_actual: wks_actual,
    tech_overall: tech_overall,
    wks_overall: wks_overall,
  };
  res.tech_actual = tech_actual;
  res.wks_actual = wks_actual;
  res.tech_overall = tech_overall;
  res.wks_overall = wks_overall;
  res.cluster_data = [final_ans, stats];

  next();
}

async function updateStats(req, res, next) {
  // console.log(typeof res.college[0])
  // const originalDoc = res.college[0];
  let originalDoc = res.college[0];
  const changes = {};
  let status = "incpl";
  res.college = res.college.map((college) => {
    Object.keys(req.body).forEach((key) => {
      // console.log(key)
      if (req.body[key] !== null && !isNaN(req.body[key])) {
        if (req.body[key] !== college[key]) {
          let tmp_status;
          if (req.body[key] === 1) tmp_status = "cpl";
          if (req.body[key] === 0) tmp_status = "wip";
          if (req.body[key] === -1) tmp_status = "yts";
          changes[key] = [college[key], req.body[key], String(tmp_status)];
        }
        college[key] = req.body[key];
      }
    });
    return college;
  });
  // console.log(changes);
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
  if (completed === res.sz) {
    res.college[0].deliverable = 1;
    // changes["completed"] = 1;
    res.status = "cpl";
  } else {
    res.status = "incpl";
    res.college[0].deliverable = 0;
  }
  const final_update = await res.college[0].save();
  // console.log(final_update);
  // console.log(originalDoc);
  // above two documents are changed after update operation so cant log changes from there

  res.changes = changes;
  res.college[0] = final_update;
  next();
}

async function logChanges(req, res, next) {
  const statename = req.authState;
  if (statename === "ALL") next();
  let excludedKeys = ["__v", "_id"];
  // console.log(res.changes);
  const changeId = (await latestUpdate.countDocuments().then()) + 1;
  let spec;
  let formNo = req.query.form_Id;
  if (formNo % 2 === 0) spec = "workshop";
  else spec = "techlab";
  let desc;
  if (res.changes["completed"] === 1) desc = "this got completed";
  // console.log(res.changes);
  // for (let k in res.changes) {
  //   console.log(k, res.changes[k][2]);
  // }
  // console.log(res.tabl.name,typeof (res.tabl));
  // console.log(res.tabl.Object)
  const newUpdate = new latestUpdate({
    userId: req.userId,
    userName: req.username,
    changeId: changeId,
    collegeName: res.college[0]._doc["ITI_Name"],
    spec: spec,
    formName: res.formName,
    status: res.status,
    formId: formNo,
    changes: res.changes,
    description: desc,
    dateUpdate: Date.now(),
    stateName: req.authState,
  });
  await newUpdate.save();
  next();
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
    tn_cl_tlab: tn_cl_tlab,
    tn_cl_wshop: tn_cl_wshop,
    tn_dy_tlab: tn_dy_tlab,
    tn_dy_wshop: tn_dy_wshop,
    tn_in_tlab: tn_in_tlab,
    tn_in_wshop: tn_in_wshop,
  };
  const sizes = {
    cl_tlab: 15,
    cl_wshop: 16,
    dl_tlab: 15,
    dl_wshop: 16,
    ins_tlab: 15,
    ins_wshop: 16,
    tn_cl_tlab: 15,
    tn_cl_wshop: 16,
    tn_dy_tlab: 15,
    tn_dy_wshop: 16,
    tn_in_tlab: 15,
    tn_in_wshop: 16,
  };
  res.formName = form["formName"];
  const tabl = models[form["formName"]];
  res.sz = sizes[form["formName"]];
  res.admins = form["formAdmins"];
  res.tabl = tabl;
  next();
}

async function getUniqueCluster(req, res, next) {
  let clusters = [];
  const tabl_Cluster = {
    1000: cl_tlab,
    2000: cl_tlab,
    3000: cl_tlab,
    4000: tn_cl_tlab,
    5000: tn_cl_tlab,
    6000: tn_cl_tlab,
  };
  // console.log(tabl_Cluster[req.query.formCode]);
  const x = tabl_Cluster[req.query.formCode];
  try {
    clusters = await x.distinct("Cluster").then();
  } catch (err) {
    res.status(500).send("Error fetching distinct Clusters");
    return;
  }
  res.clist = clusters;
  next();
}

const deleteOldLogs = async (req, res, next) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Get the start and end of the current day
    const startOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

    // Delete logs that are not from the current day
    await latestUpdate.deleteMany({
      dateUpdate: {
        $lt: startOfDay,
        $gt: endOfDay,
      },
    });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting old logs.");
  }
};

async function getCourseDb(req, res, next) {
  const form = await Forms.findOne(
    { formId: req.query.form_Id },
    { formName: 1, formAdmins: 1 }
  ).exec();
  const models = {
    courses: courses,
    tn_courses: tn_courses,
  };
  res.formName = form["formName"];
  const tabl = models[form["formName"]];
  res.admins = form["formAdmins"];
  res.tabl = tabl;
  next();
}

async function authenticateState(req, res, next) {
  next();
}

const checkAndUpdateChanges = async (req, res, next) => {
  try {
    const stateChangesCount = await latestUpdate.countDocuments({
      stateName: req.authState,
    });

    if (stateChangesCount > 20) {
      const oldestChange = await latestUpdate
        .findOne({ stateName: req.authState })
        .sort({ changeId: 1 })
        .limit(1);

      await latestUpdate.findByIdAndDelete(oldestChange._id);
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateToken,
  getCluster,
  authorizeUpdate,
  getReadiness,
  updateStats,
  getForm,
  getUniqueCluster,
  getCollege,
  logChanges,
  masterAdmin,
  getCourseDb,
  checkAndUpdateChanges,
};
