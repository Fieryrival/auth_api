const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  userId: Number,
  userName:String,
  siteName:String,
  caption: String,
  fileId: Number,
  fileName: String,
  fileUrl:String,
  createdAt: { type: Date, default: Date.now() },
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

module.exports = mongoose.model("upload_datas", uploadSchema);
