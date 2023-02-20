require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

mongoose.set("strictQuery", false);

// const cors = require("cors");
// app.use(cors());

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  // useFindAndModify: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
});
const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

app.listen(4000, () => console.log("Auth Server Started"));
