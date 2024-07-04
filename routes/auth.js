var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");

// all the logic will go here :-)

const User = require("../models/User");

// render the login form
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by username (assuming username is unique)
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }
    if (user.password !== password) {
      return res.status(401).send("Incorrect password");
    }

    // Authentication successful
    // You can store user session or JWT token for subsequent requests

    res.send("Login successful");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// render the registration form
router.get("/register", (req, res, next) => {
  res.render("auth/register");
});

router.post("/register", async (req, res, next) => {
  const { name, email, password, confirmPassword, updates } = req.body;

  // Validate required fields
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).send("All fields are required");
  }

  // Validate password match
  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match");
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("User already exists");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      updates: updates === "on",
    });
    await newUser.save();

    // Registration successful
    res.send("Registration successful");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
