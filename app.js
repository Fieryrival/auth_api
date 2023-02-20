require("dotenv").config();
// const cors = require('cors');
const express = require("express");
const app = express();
const { authenticateToken } = require("./middlewares/middleware");
// const cors = require("cors");
// app.use(cors());
const mongoose = require("mongoose");
// const fileUpload = require("express-fileupload");
mongoose.set("strictQuery", false);

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  // useFindAndModify: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));
// app.use(
//   fileUpload({
//     useTempFiles: true,
//   })
// );

app.use(express.json());
app.use(authenticateToken);

const collegeRouter = require("./routes/coll");
// const authRouter = require('./routes/auth')
app.use("/api/", collegeRouter);
// app.use('/api/login',authRouter)
const noteRouter = require("./routes/note");
app.use("/note/", noteRouter);

const courseRouter = require("./routes/course");
app.use("/course/", courseRouter);

// localStorage
// const imgRouter = require("./routes/img_up");
// app.use("/img/", imgRouter);

// cloudinaryRouter
const cloudinaryRouter = require("./routes/imgUp");
app.use("cloudImg/", cloudinaryRouter);

// IMPORTANT : THIS BLOCK SHOULD BE REMOVED IN PRODUCTION AND ONLY BE USED BY BACKEND PURPOSES
// const updateAdminRouter = require("./routes/admn");
// const { authenticateToken } = require("./middlewares/middleware");
// app.use("/updateAdmin/", updateAdminRouter);

app.listen(3000, () => console.log("Server Started"));
