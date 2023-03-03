const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  formName: String,
  formId: Number,
  formAdmins: [Number],
  stateName: String,
});

module.exports = mongoose.model("forms", formSchema);
