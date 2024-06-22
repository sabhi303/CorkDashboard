var express = require('express');
var router = express.Router({
  mergeParams: true
});

const {connectToDatabase} = require('../database/db');

const getaboutdata = async () => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('home');
    const content = await collection.findOne({});
    // console.log(content);
    return content.data;
  } catch (error) {
    console.error('Error reading the about data from the database', error);
  }
}

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    // now here the description of the things which I will change and fetch from the database
    const content = await getaboutdata(); // Await the promise here
    // console.log(content);
    res.render('home', { title: 'Cork Dashboard Home', aboutCardsContent: content });
  } catch (error) {
    console.error('Error rendering the home page', error);
    res.status(500).send('Internal Server Error');
  }
});

// redirects for old page
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
