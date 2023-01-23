const mongoose = require("mongoose");

const cl_wshopSchema = new mongoose.Schema({
  Cluster: {
    type: "String",
  },
  District: {
    type: "String",
  },
  ITI_Name: {
    type: "String",
  },
  customId: {
    type: "Number",
  },
  Basic_Infra: {
    type: "Number",
  },
  Flooring: {
    type: "Number",
  },
  Internal_Painting: {
    type: "Number",
  },
  Windows: {
    type: "Number",
  },
  Shutter: {
    type: "Number",
  },
  Aluminium_Partition: {
    type: "Number",
  },
  AC: {
    type: "Number",
  },
  MCB: {
    type: "Number",
  },
  Networking: {
    type: "Number",
  },
  LT_Pannel: {
    type: "Number",
  },
  Electric_Supply: {
    type: "Number",
  },
  UPS: {
    type: "Number",
  },
  DG_Set: {
    type: "Number",
  },
  External_Painting: {
    type: "Number",
  },
  Cleaning: {
    type: "Number",
  },
  Floor_Painting: {
    type: "Number",
  },
  deliverable: {
    type: "Number",
  },
  yts: {
    type: "Number",
  },
  wip: {
    type: "Number",
  },
  completed: {
    type: "Number",
  },
  completed_percentage: {
    type: "Number",
  },
});

module.exports = mongoose.model('cl_wshop',cl_wshopSchema)
