const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  username: String,
  userId: Number,
  designation: String,
  noteId: Number,
  title: String,
  content: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  wasChanged: { type: String, default: "NO" },
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

module.exports = mongoose.model("Notes", noteSchema);
