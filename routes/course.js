const express = require("express");
const { default: mongoose, Model } = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
const courses = require("../models/courses");
const tn_courses = require("../models/tn_courses")
const Forms = require("../models/forms");

router.get("/byCluster",getCourseDb, async (req, res) => {
  try {
    const data = await res.tabl.find({ Cluster: req.query.Cluster }, {}).then();
    res.json(data);
  } catch (err) {
    res.send(500);
  }
});

router.get("/byCollegeId",getCourseDb ,async (req, res) => {
  try {
    const data = await res.tabl
      .find({ customId: req.query.collegeId }, {})
      .then();
    res.json(data);
  } catch (err) {
    res.send(500);
  }
});

router.post("/updateDate",getCourseDb, async (req, res) => {
  let data;
  try {
    let startDate = req.body.startDate;
    const key = req.body.key;
    let endDate = req.body.endDate;
    data = await res.tabl.find({ customId: req.query.collegeId }).then();
    if (endDate === undefined)
      endDate = data[0]._doc[key].endDate.toISOString();
    else endDate = new Date(endDate).toISOString();
    if (startDate === undefined)
      startDate = data[0]._doc[key].startDate.toISOString();
    else startDate = new Date(startDate).toISOString();
    const defDate = new Date("2000-01-01T00:00:00.000Z").toISOString();
    let changeStatus = 0;
    if (
      endDate.valueOf() === defDate.valueOf() &&
      startDate.valueOf() === defDate.valueOf()
    )
      changeStatus = 0;
    else changeStatus = 1;
    // console.log(typeof(defDate),endDate,startDate);
    const filter = { customId: req.query.collegeId };
    const options = { new: true };
    const update = {
      [`${key}.startDate`]: startDate,
      [`${key}.endDate`]: endDate,
      [`${key}.changeStatus`]: changeStatus,
    };
    const updatedDoc = await res.tabl
      .findOneAndUpdate(filter, update, options)
      .then();

    res.send({ updatedDoc });
    // res.json(endDate);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post("/resetDate", async (req, res) => {
  //
});

async function getCourseDb(req, res, next) {
  const form = await Forms.findOne(
    { formId: req.query.form_Id },
    { formName: 1, formAdmins: 1 }
  ).exec();
  const models = {
    courses:courses,
    tn_courses:tn_courses,
  };
  res.formName = form["formName"];
  const tabl = models[form["formName"]];
  res.admins = form["formAdmins"];
  res.tabl = tabl;
  next();
}

module.exports = router;
