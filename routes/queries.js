var express = require("express");
var router = express.Router({
  mergeParams: true,
});

const QueriesModel = require("../models/Query");
const GeoDemosModel = require("../models/GeoDemos");

/* Queries Home Page */
router.get("/", async function (req, res, next) {
  try {
    const Queries = await QueriesModel.find({});
    res.render("queries/queries", {
      title: "Cork Dashboard | Queries",
      queries: Queries,
    });
  } catch (error) {
    console.error("Error rendering the Queries page", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/geodemos", async function (req, res, next) {
  const GeoDemos = await GeoDemosModel.find({});
  res.render("queries/geodemos", {
    title: "Query: Geodemographics",
    page: "",
    geodemos: GeoDemos,
    isEditable: true,
  });
});

router.get("/live-travel", function (req, res, next) {
  res.render("queries/query_live_travel", {
    title: "Query: Live Travel",
    page: "",
  });
});

router.get("/live-environment", function (req, res, next) {
  res.render("queries/query_live_environment", {
    title: "Query: Live Environment",
    page: "",
  });
});

module.exports = router;
