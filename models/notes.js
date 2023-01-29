const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  username: String,
  userId:Number,
  noteId:Number,
  title: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
});

module.exports = mongoose.model("Notes", noteSchema);
