require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require('mongoose')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const Admin = require("./models/admins");
mongoose.set('strictQuery',false);

mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser: true})
const db = mongoose.connection
db.on('error',(error)=> console.error(error))
db.once('open',()=>console.log('Connected to Database'))
app.use(express.json());

// app.post("/login", (req, res) => {
//   // Authentication
//   const username = req.body.username;
//   const user = { name: username };
//   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
//   res.json({ accesstToken: accessToken });
// });
const authRouter=require('./routes/auth')
app.use('/auth',authRouter)



app.listen(4000);
