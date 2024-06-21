var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
    // res.send("Hello");
  res.render('admin/admin', {
    title: 'Cork Dashboard | Admin',
    active: 'Admin'
  })
})

module.exports = router;
