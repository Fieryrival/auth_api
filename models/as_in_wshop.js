const mongoose = require("mongoose");

const in_wshopSchema = new mongoose.Schema({
  Institute_Type: {
    type: "String",
  },
  Institute_Name: {
    type: "String",
  },
  Cluster: {
    type: "String",
  },
  customId: {
    type: "Number",
  },
  Laser_Cutter: {
    type: "Number",
  },
  PaintBooth: {
    type: "Number",
  },
  Car_Lift: {
    type: "Number",
  },
  Industrial_Process_Control_Unit: {
    type: "Number",
  },
  VR_Welding_and_Painting: {
    type: "Number",
  },
  Auto_MRO_Cut_Sections: {
    type: "Number",
  },
  Battery_Electrical_Vehicle: {
    type: "Number",
  },
  IC_Engine_Vehicle: {
    type: "Number",
  },
  EV_Kit: {
    type: "Number",
  },
  Industrial_Robotics_Setup: {
    type: "Number",
  },
  VFD_Machine: {
    type: "Number",
  },
  Plumbing_Kit: {
    type: "Number",
  },
  CNC_Machine: {
    type: "Number",
  },
  VMC_Machine: {
    type: "Number",
  },
  Tools_and_Meters: {
    type: "Number",
  },
  Advance_Machining_Simulators: {
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

module.exports = mongoose.model("as_in_wshop", in_wshopSchema);
