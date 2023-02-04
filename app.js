require("dotenv").config();
// const cors = require('cors');
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

const collegeRouter = require("./routes/coll");
// const authRouter = require('./routes/auth')
app.use("/api/", collegeRouter);
// app.use('/api/login',authRouter)
const noteRouter = require("./routes/note");
app.use("/note/", noteRouter);
const imgRouter = require("./routes/img_up");
app.use("/img/", imgRouter);

// IMPORTANT : THIS BLOCK SHOULD BE REMOVED IN PRODUCTION AND ONLY BE USED BY BACKEND PURPOSES
const updateAdminRouter = require("./routes/admn");
app.use("/updateAdmin/", updateAdminRouter);

app.listen(3000, () => console.log("Server Started"));
