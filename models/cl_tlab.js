const mongoose = require("mongoose");

const collegeSchema = mongoose.Schema({
  Cluster: String,
  District: String,
  ITI_Name: String,
  customId: Number,
  Basic_Infra: Number,
  Flooring: Number,
  False_Ceiling: Number,
  Internal_Painting: Number,
  Windows: Number,
  Doors: Number,
  Aluminium_Partition: Number,
  AC: Number,
  MCB: Number,
  Networking: Number,
  LT_Pannel: Number,
  Electric_Supply: Number,
  UPS: Number,
  External_Painting: Number,
  Cleaning: Number,
});

module.exports = mongoose.model("cl_tlab", collegeSchema);
