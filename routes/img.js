const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new AWS.S3({
  accessKeyId: "your_access_key_id",
  secretAccessKey: "your_secret_access_key",
  region: "your_aws_region",
});

router.post(
  "/upload",
  authenticateToken,
  multer({
    storage: multerS3({
      s3: s3,
      bucket: "your_bucket_name",
      acl: "public-read",
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString() + "-" + file.originalname);
      },
    }),
  }).single("image"),
  async (req, res) => {
    try {
      const userId = req.userId;
      const userName = req.username;
      const siteName = req.body.siteName;
      const userState = req.authState;
      const caption = req.body.caption;
      let countDocs = await upload_datas.countDocuments();
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
        createdAt: Date.now(),
        stateName: userState,
        fileName: req.file.key,
        fileUrl: req.file.location,
      });
      await newUpload_datas.save();
      res.json(newUpload_datas);
    } catch (err) {
      console.log(err);
    }
  }
);

router.post("/delete", authenticateToken, masterAdmin, async (req, res) => {
  try {
    const imgData = await upload_datas
      .findOneAndDelete({ fileId: req.body.fileId })
      .then();
    const params = { Key: imgData.fileName, Bucket: "<YOUR_BUCKET_NAME>" };
    await s3.deleteObject(params).promise().then();
    res.status(200).json(imgData);
  } catch (err) {
    res.status(500).send({ message: "Error in deleting the required file" });
  }
});
