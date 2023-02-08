const router = require("express").Router();
const path = require("path");
const { authenticateToken, masterAdmin } = require("../middlewares/middleware");
const upload_datas = require("../models/upload_data");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

router.post(
  "/upload",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path).then();
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
          .aggregate([
            { $group: { _id: null, maxfileId: { $max: "$fileId" } } },
          ])
          .then();
        fileId = Number(tmp[0].maxfileId + 1);
      } else {
        fileId = Number(countDocs + 11);
      }
      const fileName = req.fileName;
      const newUpload_datas = new upload_datas({
        userId: userId,
        userName: userName,
        siteName: siteName,
        caption: caption,
        fileId: fileId,
        fileName: result.public_id,
        fileUrl: result.secure_url,
      });
      await newUpload_datas.save().then();
      res.json(newUpload_datas);
    } catch (err) {
      console.log(err);
    }
  }
);

router.get("/allImages", authenticateToken, async (req, res) => {
  let imgData;
  try {
    imgData = await upload_datas.find({}, {}).sort({ fileId: -1 }).then();
    res.status(200).send(imgData);
  } catch (err) {
    res.status(500).send({ err: "error getting imgData" });
  }
});

router.post("/delete", authenticateToken, masterAdmin, async (req, res) => {
  try {
    const imgData = await upload_datas
      .findOneAndDelete({ fileId: req.body.fileId })
      .then();
    await cloudinary.uploader.destroy(imgData._doc["fileName"]).then();
    res.status(200).json(imgData);
  } catch (err) {
    res.status(500).send({ message: "Error in deleting the required file" });
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
    //   fileUrl:
  });
  await newUpload_datas.save().then();
  res.imgData = newUpload_datas;
  next();
}

module.exports = router;
