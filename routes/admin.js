var express = require('express')
var router = express.Router()


const {connectToDatabase} = require('../database/db');


/* Administration Dashboard */
router.get('/', function (req, res, next) {
  res.render('admin/admin', {
    title: 'Cork Dashboard | Admin',
    active: 'Admin'
  })
})


/* ////////////////////// */

/* Edit Home page of the Dashboard */

const AboutCard = require('../models/HomeAboutCard');

// Render the editable homepage
/* GET home page. */
router.get('/home', async function (req, res, next) {
  try {
    // now here the description of the things which I will change and fetch from the database
    const content = await AboutCard.find({id: {$ne: "about-cork"}});
    const cork =  await AboutCard.findOne({id:"about-cork"});
    // console.log(content);
    res.render('home', { title: 'Cork Dashboard Home', aboutCards: content, cork:cork, isEditable : true });
  } catch (error) {
    console.error('Error rendering the home page', error);
    res.status(500).send('Internal Server Error');
  }
});



// I will put all the admin editable stuff here instead and all through the [post] requests
// let's see how this goes

/* [AJAX] [POST] updated data of home page from admin. */

async function updateaboutdata(updatedData) {
  try {
    const { id, ...updateFields } = updatedData;
    const result = await AboutCard.findOneAndUpdate({ id: id }, updateFields, { new: true });
    return result;
  } catch (error) {
    throw new Error('Error updating the about card: ' + error.message);
  }
}

router.post('/home/edit', async function (req, res, next) {
  try {
    const updatedData = req.body;

    const result = await updateaboutdata(updatedData);

    if (result) {
      res.status(200).send({ message: 'Update successful', data: result });
    } else {
      res.status(404).send({ message: 'Record not found' });
    }
  } catch (error) {
    console.error('Error updating the home page content', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
})

/* ////////////////////// */

module.exports = router;
