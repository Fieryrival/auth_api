require("dotenv").config();
const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

router.post("/login", (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;

  // Find user with matching username
  User.findOne({ username }, (err, user) => {
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
          const payload = { userId: user.userId, username };
          // console.log(payload);
          const token = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET,{algorithm: "HS256", expiresIn: 60*60 }
          );
          // console.log(process.env.ACCESS_TOKEN_SECRET)
          // console.log(user.userId)
          res.json({ message: "Login successful", token });
        }
      });
    }
  });
});

router.post('/register', async (req, res) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Find the number of users in the table
    const count = await User.countDocuments();
    // Assign the userId
    const userId = 100 + count + 1;
    // Create the new user
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      userId: userId
    });
    // Save the user to the database
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
});

module.exports = router;
