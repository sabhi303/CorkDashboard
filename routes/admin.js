var express = require("express");
var router = express.Router();

/* Administration Dashboard */
router.get("/", function (req, res, next) {
  res.render("admin/admin", { 
    title: "Cork Dashboard | Admin",
    active: "Admin",
  });
});

/* ////////////////////// */

/* Edit Home page of the Dashboard */

const AboutCard = require("../models/HomeAboutCard");
const RegionsInfo = require("../models/HomeRegionsInfo");

// Render the editable homepage
/* GET home page. */
router.get("/home", async function (req, res, next) {
  try {
    // now here the description of the things which I will change and fetch from the database
    const content = await AboutCard.find({ id: { $ne: "about-cork" } });
    const cork = await AboutCard.findOne({ id: "about-cork" });
    const regionsData = await RegionsInfo.find({});
    // console.log(content);
    res.render("home", {
      title: "Cork Dashboard Home",
      aboutCards: content,
      cork: cork,
      regionsData: regionsData,
      isEditable: true,
    });
  } catch (error) {
    console.error("Error rendering the home page", error);
    res.status(500).send("Internal Server Error");
  }
});

// I will put all the admin editable stuff here instead and all through the [post] requests
// let's see how this goes

/* [AJAX] [POST] updated data of home page from admin. */

async function updateaboutdata(updatedData) {
  try {
    const { id, ...updateFields } = updatedData;
    const result = await AboutCard.findOneAndUpdate({ id: id }, updateFields, {
      new: true,
    });
    return result;
  } catch (error) {
    throw new Error("Error updating the about card: " + error.message);
  }
}

router.post("/home/edit", async function (req, res, next) {
  try {
    const updatedData = req.body;

    const result = await updateaboutdata(updatedData);

    if (result) {
      res.status(200).send({ message: "Update successful", data: result });
    } else {
      res.status(404).send({ message: "Record not found" });
    }
  } catch (error) {
    console.error("Error updating the home page content", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

/* Regions */
async function updateRegionsData(updatedData) {
  try {
    const { id, ...updateFields } = updatedData;
    const result = await RegionsInfo.findOneAndUpdate(
      { id: id },
      updateFields,
      {
        new: true,
      }
    );
    return result;
  } catch (error) {
    throw new Error("Error updating the about card: " + error.message);
  }
}

router.post("/home/regions/edit", async function (req, res, next) {
  try {
    const updatedData = req.body;

    const result = await updateRegionsData(updatedData);

    if (result) {
      res.status(200).send({ message: "Update successful", data: result });
    } else {
      res.status(404).send({ message: "Record not found" });
    }
  } catch (error) {
    console.error("Error updating the home page content", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

/* ////////////////////// */

// ---:-)

/* Edit Themes page of the Dashboard */

const Themes = require("../models/Theme");

// Render the editable homepage
/* GET themes page. */

const Theme = require("../models/Theme");

router.get("/themes", async function (req, res, next) {
  try {
    const themes = await Theme.find({});
    console.log(themes);
    res.render("themes/themes_updated", { themes, isEditable: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Themes Header
async function updateThemesHeader(updatedData) {
  try {
    const { id, ...updateFields } = updatedData;
    const result = await Themes.findOneAndUpdate({ id: id }, updateFields, {
      new: true,
    });
    return result;
  } catch (error) {
    throw new Error("Error updating the Themes header: " + error.message);
  }
}

router.post("/themes/header/edit", async function (req, res, next) {
  try {
    const updatedData = req.body;

    const result = await updateThemesHeader(updatedData);

    if (result) {
      res.status(200).send({ message: "Update successful", data: result });
    } else {
      res.status(404).send({ message: "Record not found" });
    }
  } catch (error) {
    console.error("Error updating the home page content", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

async function updateThemesChartInfo(updatedData) {
  try {
    const { id, parent_id, title, description } = updatedData;

    const result = await Themes.findOneAndUpdate(
      { id: parent_id, "charts.id": id },
      {
        $set: { "charts.$.description": description, "charts.$.title": title },
      },
      {
        new: true,
      }
    );
    return result;
  } catch (error) {
    throw new Error("Error updating the Chart Info: " + error.message);
  }
}

router.post("/themes/chartinfo/edit", async function (req, res, next) {
  try {
    const updatedData = req.body;

    const result = await updateThemesChartInfo(updatedData);

    if (result) {
      res.status(200).send({ message: "Update successful", data: result });
    } else {
      res.status(404).send({ message: "Record not found" });
    }
  } catch (error) {
    console.error("Error updating the home page content", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

/* ////////////////////// */

// ---:-)

/* Edit Themes page of the Dashboard */

const QueriesModel = require("../models/Query");
const GeoDemosModel = require("../models/GeoDemos");

// Render the editable homepage
/* GET themes page. */

/* Queries Home Page */
router.get("/queries", async function (req, res, next) {
  try {
    const Queries = await QueriesModel.find({});
    res.render("queries/queries", {
      title: "Cork Dashboard | Queries | Admin",
      queries: Queries,
      isEditable: true,
    });
  } catch (error) {
    console.error("Error rendering the Admin Queries page", error);
    res.status(500).send("Internal Server Error");
  }
});

// Queries Header
async function updateQueries(updatedData) {
  try {
    const { id, ...updateFields } = updatedData;
    const result = await QueriesModel.findOneAndUpdate(
      { id: id },
      updateFields,
      {
        new: true,
      }
    );
    return result;
  } catch (error) {
    throw new Error("Error updating the Themes header: " + error.message);
  }
}

router.post("/queries/edit", async function (req, res, next) {
  try {
    const updatedData = req.body;

    const result = await updateQueries(updatedData);

    if (result) {
      res.status(200).send({ message: "Update successful", data: result });
    } else {
      res.status(404).send({ message: "Record not found" });
    }
  } catch (error) {
    console.error("Error updating theQueries page content", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Queries GeoDemos
async function updateGeoDemos(updatedData) {
  try {
    const { id, ...updateFields } = updatedData;
    const result = await GeoDemosModel.findOneAndUpdate(
      { id: id },
      updateFields,
      {
        new: true,
      }
    );
    return result;
  } catch (error) {
    throw new Error("Error updating the Themes header: " + error.message);
  }
}

router.get("/queries/geodemos", async function (req, res, next) {
  const GeoDemos = await GeoDemosModel.find({});
  res.render("queries/geodemos", {
    title: "Query: Geodemographics",
    page: "",
    geodemos: GeoDemos,
    isEditable: true,
  });
});

router.post("/queries/geodemos/edit", async function (req, res, next) {
  try {
    const updatedData = req.body;
    const result = await updateGeoDemos(updatedData);

    if (result) {
      res.status(200).send({ message: "Update successful", data: result });
    } else {
      res.status(404).send({ message: "Record not found" });
    }
  } catch (error) {
    console.error("Error updating the GeoDemos page content", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

/* ////////////////////// */

module.exports = router;
