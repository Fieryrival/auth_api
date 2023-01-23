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
  Dell_Workstations: {
    type: "Number",
  },
  Dell_Server: {
    type: "Number",
  },
  VSAT: {
    type: "Number",
  },
  VSAT_Studio: {
    type: "Number",
  },
  IOT_Kit_and_Sensors: {
    type: "Number",
  },
  IOTLab_Laptop: {
    type: "Number",
  },
  D3_Printer_EOS: {
    type: "Number",
  },
  D3_Printer_3DS: {
    type: "Number",
  },
  Laser_Cutter: {
    type: "Number",
  },
  Product_Design_DS: {
    type: "Number",
  },
  POD_CARVELCO: {
    type: "Number",
  },
  PVA_ANSYS: {
    type: "Number",
  },
  PVA_FEAST: {
    type: "Number",
  },
  MASTERCAM: {
    type: "Number",
  },
  IGETIT: {
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

module.exports = mongoose.model('in_tlab',in_tlabSchema);
