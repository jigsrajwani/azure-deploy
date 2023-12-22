const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
// console.log(JWT_SECRET);
const getUser = require("../middleware/getUser");

// Create a user using POST "/api/auth/createUser", doesn't require authentication
router.post('/createuser', [
  body('email', "Enter a valid Email").isEmail(),
  body('password', 'Password must have a minimum of 8 characters').isLength({ min: 8 }),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array()[0].msg });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, error: "A user with this email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass
    });
    //send a token to user
    const data = { user: user._id };
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// auth while login using POST "/api/auth/login"
router.post('/login', [
  body('email', "Enter a valid Email").isEmail(),
  body('password', "Password can't be blank").exists(),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false;
      return res.status(400).json({ success, error: "incorrect information" });
    }
    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) {
      return res.status(400).json({ error: "incorrect information" });
    }
    //send a token to user
    const data = { user: user._id };
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

//ROUTE 3
router.post('/getuser', getUser, async (req, res) => {

  try {
    // console.log(req);
    const userId = req.user;
    //  console.log(userId);
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;