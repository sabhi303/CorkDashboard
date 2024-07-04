var express = require("express");
var router = express.Router();

// all the logic will go here :-)

// render the login form
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

module.exports = router;