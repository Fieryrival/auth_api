const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  formName: String,
  formId: Number,
  formAdmins: Array,
});

module.exports = mongoose.model("forms", formSchema);
