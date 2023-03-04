const mongoose = require("mongoose");

const in_tlabSchema = new mongoose.Schema({
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
  Furniture: {
    type: "Number",
  },
  Server_Rack: {
    type: "Number",
  },
  Workstations_and_Monitors: {
    type: "Number",
  },
  Server: {
    type: "Number",
  },
  Distance_Learning_Classroom: {
    type: "Number",
  },
  IOT_Kit: {
    type: "Number",
  },
  IOT_Desktops: {
    type: "Number",
  },
  D3_Printer_Tech1: {
    type: "Number",
  },
  D3_Printer_Tech2: {
    type: "Number",
  },
  Tech_Tools_Product_Design1: {
    type: "Number",
  },
  Tech_Tools_Product_Design2: {
    type: "Number",
  },
  Tech_Tools_Product_Verification1: {
    type: "Number",
  },
  Tech_Tools_Product_Verification2: {
    type: "Number",
  },
  Tech_Tools_Advance_Manufacturing1: {
    type: "Number",
  },
  E_Learning_Platform: {
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

module.exports = mongoose.model("tn_in_tlab", in_tlabSchema);
