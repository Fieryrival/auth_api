const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  userId: { type: Number, required: true },
  state: { type: String },
});

module.exports = mongoose.model("Users", userSchema);
