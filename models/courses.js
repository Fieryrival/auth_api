const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
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
  fillStatus: {
    type: "Number",
  },
  Innovation_Design_Thinking: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Jr_Product_Designer: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Jr_Prod_Designer_Developer: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Auto_Electrical_Design_Technician: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Product_Verifier_Analyst: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Auto_Teardown_Benchmarking: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Advanced_Automobile: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Auto_Repair_Maintainance: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Auto_Electrical_Maintainance: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Battery_EV_Technician: {
    startDate: {
      type: Date,
      default: "01/01/2000",
    },
    endDate: {
      type: Date,
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  IOT_Application_Technician: {
    startDate: {
      type: Date,
      default: "01/01/2000",
    },
    endDate: {
      type: Date,
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  CAM_Prog_CNC_Lathe: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  CAM_Programmer_CNC_Milling: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  CNC_Milling_Machine_Technician: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  CNC_Lathe_Machine: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Advance_CNC_Machining: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Additive_Manufacturing_Process: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: Date,
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Welding_Technician: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Advanced_Painting_Technician: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Process_Control_Automation: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Robot_Operator_Programmer_Material: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Robot_Operator_Programmer_Arc: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
  Advanced_Plumbing_Technician: {
    startDate: {
      type: "Date",
      default: "01/01/2000",
    },
    endDate: {
      type: "Date",
      default: "01/01/2000",
    },
    changeStatus: {
      type: "Number",
      default: 0,
    },
  },
});

module.exports = mongoose.model("Courses", courseSchema);
