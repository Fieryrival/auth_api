const mongoose = require("mongoose");

const dy_wshopSchema = mongoose.Schema({
  Cluster:String,
  District:String,
  ITI_Name: String,
  customId: Number,
  Ind_Paint_Booth: Number,
  Car_Lift:Number,
  IPC_AVEVA:Number,
  VR_welding_Painting: Number,
  Auto_MRO_Cut_Sections:Number,
  TIGOR_EV: Number,
  TATA_Ace:Number,
  EV_Kit: Number,
  Industrial_Robotics: Number,
  VFD: Number,
  Plumbing_Kit:Number,
  CNC_Tsugami:Number,
  VMC_HAAS:Number,
  HAAS_Tools_Meters:Number,
  HAAS_Simulators:Number
});

module.exports = mongoose.model("dy_wshop", dy_wshopSchema);
