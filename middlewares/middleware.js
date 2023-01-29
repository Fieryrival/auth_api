const jwt = require("jsonwebtoken");

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
  };
  const c1 = colls[req.query.formCode][0];
  const c2 = colls[req.query.formCode][1];
  const sizes = {
    1000: [15, 16],
    2000: [17, 15],
    3000: [17, 15],
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

module.exports = {
  authenticateToken,
  getCluster,
  authorizeUpdate,
  getReadiness,
  updateStats,
};
