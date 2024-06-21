// var express = require('express')
// var router = express.Router({
//   mergeParams: true
// })

// router.get('/', function (req, res, next) {
//   res.render('themes', {
//     title: 'Cork Dashboard | Themes',
//     active: 'themes'
//   })
// })

// router.get('/transport', function (req, res, next) {
//   res.render('transport', {
//     title: 'Cork Dashboard | Themes',
//     active: 'themes'
//   })
// })

// router.get('/housing', function (req, res, next) {
//   res.render('housing', {
//     title: 'Cork Dashboard | Themes',
//     active: 'themes'
//   })
// })

// module.exports = router

// ABHI, NEW CONTENT HERE
// routes/themes.js
const express = require('express');
const router = express.Router();
const Theme = require('../models/Theme');

router.get('/', async (req, res) => {
    try {
        const themes = await Theme.find({});
        console.log(themes)
        // res.render('themes/themes', { themes });
        res.render('themes/themes_updated', { themes });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/old', async (req, res) => {
    try {
        res.render('themes/themes');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
