const mongoose = require("mongoose");

const cl_wshopSchema = mongoose.Schema({
  Cluster: String,
  District: String,
  ITI_Name: String,
  customId: Number,
  Basic_Infra: Number,
  Flooring: Number,
  Internal_Painting: Number,
  Windows: Number,
  Shutter: Number,
  Aluminium_Partition: Number,
  AC: Number,
  MCB: Number,
  Networking: Number,
  LT_Pannel: Number,
  Electric_Supply: Number,
  UPS: Number,
  DG_Set: Number,
  External_Painting: Number,
  Cleaning: Number,
  Floor_Painting: Number,
});

module.exports = mongoose.model("cl_wshop", cl_wshopSchema);
