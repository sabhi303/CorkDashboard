var express = require('express')
var router = express.Router()


const {connectToDatabase} = require('../database/db');


/* Administration Dashboard */
router.get('/', function (req, res, next) {
    // res.send("Hello");
  res.render('admin/admin', {
    title: 'Cork Dashboard | Admin',
    active: 'Admin'
  })
})


/* ////////////////////// */



/* Edit Home page of the Dashboard */


// Render the editable homepage
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
router.get('/home', async function (req, res, next) {
  try {
    // now here the description of the things which I will change and fetch from the database
    const content = await getaboutdata(); // Await the promise here
    // console.log(content);
    res.render('home', { title: 'Cork Dashboard Home', aboutCardsContent: content, isEditable : true });
  } catch (error) {
    console.error('Error rendering the home page', error);
    res.status(500).send('Internal Server Error');
  }
});



// I will put all the admin editable stuff here instead and all through the [post] requests
// let's see how this goes

/* [AJAX] [POST] updated data of home page from admin. */
router.post('/home/edit', async function (req, res, next) {
  try {
    const updatedData = req.body.content;

    console.log(updatedData);

    // temporarily commenting the below line so that I can implement the function accordingly
    // await updateaboutdata(updatedData);
    res.redirect('/admin-edit');
  } catch (error) {
    console.error('Error updating the home page content', error);
    res.status(500).send('Internal Server Error');
  }
});


/* ////////////////////// */

module.exports = router;
