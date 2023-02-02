const mongoose = require("mongoose");

const logUpdate = new mongoose.Schema({
  userId: Number,
  userName: String,
  changeId: Number,
  collegeName: String,
  spec: String,
  formName: String,
  status: String,
  formId: Number,
  changes: { type: Object },
  description: String,
  dateUpdate: { type: Date, default: new Date() },
  timeUpdate: {
    type: String,
    default: () => {
      const date_ob = new Date();
      let hours = date_ob.getHours();
      let minutes = date_ob.getMinutes();
      let seconds = date_ob.getSeconds();
      return `${hours}:${minutes}:${seconds}`;
    },
  },
});

module.exports = mongoose.model("logChange", logUpdate);
