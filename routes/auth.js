var express = require("express");
var router = express.Router();

// all the logic will go here :-)

const User = require("../models/User");

// render the login form
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      // Find user by username (assuming username is unique)
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).send('User not found');
      }
      if (user.password !== password) {
        return res.status(401).send('Incorrect password');
      }
  
      // Authentication successful
      // You can store user session or JWT token for subsequent requests
  
      res.send('Login successful');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

// render the registration form
router.get('/register', (req, res, next) => {
    res.render('auth/login');
  });
  

module.exports = router;