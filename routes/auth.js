require("dotenv").config();
const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");

router.post("/login", (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;

  // Find user with matching username
  Users.findOne({ username }, (err, user) => {
    if (err) {
      res.status(500).json({ error: "Error finding user in database" });
    } else if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
    } else {
      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          res.status(500).json({ error: "Error checking password" });
        } else if (!match) {
          res.status(401).json({ error: "Invalid username or password" });
        } else {
          const payload = {
            userId: user.userId,
            username,
            userState: user.state,
          };
          const state = user.state;
          // console.log(payload);
          const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: 60 * 60 * 24,
          });
          // console.log(process.env.ACCESS_TOKEN_SECRET)
          // console.log(user.userId)
          res.json({ message: "Login successful", token, state });
        }
      });
    }
  });
});

module.exports = router;
