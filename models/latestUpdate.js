const mongoose = require("mongoose");

const logUpdate = new mongoose.Schema({
  userId:Number,
  userName:String,
  changeId: Number,
  collegeName: String,
  spec: String,
  formName:String,
  status: String,
  formId: Number,
  changes: { type: Object },
  description: String,
  dateUpdate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("logChange", logUpdate);
