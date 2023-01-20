const mongoose = require("mongoose");

const dy_wshopSchema = mongoose.Schema({
  Cluster: {
    type: String,
  },
  District: {
    type: String,
  },
  ITI_Name: {
    type: String,
  },
  customId: {
    type: Number,
  },
  Ind_Paint_Booth: {
    type: Number,
  },
  Car_Lift: {
    type: Number,
  },
  IPC_AVEVA: {
    type: Number,
  },
  VR_welding_Painting: {
    type: Number,
  },
  Auto_MRO_Cut_Sections: {
    type: Number,
  },
  TIGOR_EV: {
    type: Number,
  },
  TATA_Ace: {
    type: Number,
  },
  EV_Kit: {
    type: Number,
  },
  Industrial_Robotics: {
    type: Number,
  },
  VFD: {
    type: Number,
  },
  Plumbing_Kit: {
    type: Number,
  },
  CNC_Tsugami: {
    type: Number,
  },
  VMC_HAAS: {
    type: Number,
  },
  HAAS_Tools_Meters: {
    type: Number,
  },
  HAAS_Simulators: {
    type: Number,
  },
});

module.exports = mongoose.model("in_wshop", dy_wshopSchema);
