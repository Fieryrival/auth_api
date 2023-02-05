const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const upload_datas = require("../models/upload_data");
const { authenticateToken } = require("../middlewares/middleware");
const cloudinary = require("cloudinary").v2;

const parent_folder = "/home/noob/Documents/INTERN_FILES/API/images/";

const fs = require("fs");
function deleteImage(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Error deleting image file" });
    }
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, parent_folder);
  },
  filename: (req, file, cb) => {
    // console.log(file);
    // req.test = "hello";
    req.fileName = String(Date.now() + path.extname(file.originalname));
    cb(null, req.fileName);
  },
});
const upload = multer({ storage: storage });

router.get("/allImages", async (req, res) => {
  let imgData;
  try {
    imgData = await upload_datas.find({}, {}).then();
    res.status(200).send(imgData);
  } catch (err) {
    res.status(500).send({ err: "error getting imgData" });
  }
});

router.post(
  "/upload",
  authenticateToken,
  upload.single("image"),
  setImageData,
  async (req, res) => {
    const imgData = res.imgData;
    res.status(200).send({ message: "Image Uploaded Successfully", imgData });
  }
);

router.post("/delete", authenticateToken, getImageData, async (req, res) => {
  //
  //   deleteImage("/home/noob/Documents/INTERN_FILES/API/images/1675491706440.jpg");
  if (res.imgData[0] === null)
    res.send({ err: "no such file with given fileId" });
  const full_path = parent_folder + res.imgData[0]._doc["fileName"];
  //   console.log(full_path);
  deleteImage(full_path);
  let deletedImgData;
  try {
    deletedImgData = await upload_datas
      .findOneAndDelete({ fileId: req.body.fileId })
      .then();
    res.status(200).send(deletedImgData);
  } catch (err) {
    res.status(500).send({ err: "error getting imgData" });
  }
});

async function setImageData(req, res, next) {
  //
  const userId = req.userId;
  const userName = req.username;
  const siteName = req.body.siteName;
  const caption = req.body.caption;
  let countDocs = await upload_datas.countDocuments().then();
  //   const fileId = 10 + countDocs;
  let fileId = 0;
  if (countDocs !== 0) {
    let tmp;
    tmp = await upload_datas
      .aggregate([{ $group: { _id: null, maxfileId: { $max: "$fileId" } } }])
      .then();
    fileId = Number(tmp[0].maxfileId + 1);
  } else {
    fileId = Number(countDocs + 101);
  }
  const fileName = req.fileName;
  const newUpload_datas = new upload_datas({
    userId: userId,
    userName: userName,
    siteName: siteName,
    caption: caption,
    fileId: fileId,
    fileName: fileName,
  });
  await newUpload_datas.save().then();
  res.imgData = newUpload_datas;
  next();
}

async function getImageData(req, res, next) {
  //
  let imgData;
  try {
    imgData = await upload_datas
      .find(
        { fileId: req.body.fileId },
        { fileName: 1, siteName: 1, fileId: 1 }
      )
      .exec();
    res.imgData = imgData;
  } catch (err) {
    res.status(500).send({ err: "error getting imgData" });
  }
  next();
}
module.exports = router;
