require('dotenv').config()
// const cors = require('cors');
const express = require("express");
const app = express();
const mongoose = require('mongoose')
mongoose.set('strictQuery',false);

mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser: true})
const db = mongoose.connection
db.on('error',(error)=> console.error(error))
db.once('open',()=>console.log('Connected to Database'))

app.use(express.json())

const collegeRouter = require('./routes/id')
// const authRouter = require('./routes/auth')
app.use('/api/',collegeRouter)
// app.use('/api/login',authRouter)

app.listen(3000, () => console.log("Server Started"));
