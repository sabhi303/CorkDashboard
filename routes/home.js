var express = require('express');
var router = express.Router({
  mergeParams: true
});

const AboutCard = require('../models/HomeAboutCard');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    // now here the description of the things which I will change and fetch from the database
    const content = await AboutCard.find({});
  
    res.render('home', { title: 'Cork Dashboard Home', aboutCards: content });
  } catch (error) {
    console.error('Error rendering the home page', error);
    res.status(500).send('Internal Server Error');
  }
});

// redirects for old page or some admin thing!!
// here, everything should be done from admin router I belive, 
// temporarily keeping the following!
router.get('/home', function (req, res, next) {
  res.render('home-admin', { title: 'Cork Dashboard Home | Admin'});
});

router.get('/admin', function (req, res, next) {
  res.redirect(302, '/');
});

router.get('/index', function (req, res, next) {
  res.redirect(302, '/');
});

router.get('/pages/index', function (req, res, next) {
  res.redirect(301, '/');
});

router.get('/.well-known/pki-validation/godaddy.html', function (req, res, next) {
  res.send('f67rjhd2jbo85ti5s6nt4j3hrj');
});

module.exports = router;
