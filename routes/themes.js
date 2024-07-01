// routes/themes.js
const express = require("express");
const router = express.Router();
const Theme = require("../models/Theme");

router.get("/", async (req, res) => {
  try {
    const themes = await Theme.find({});
    console.log(themes);
    // res.render('themes/themes', { themes });
    res.render("themes/themes_updated", { themes });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/old", async (req, res) => {
  try {
    res.render("themes/themes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
