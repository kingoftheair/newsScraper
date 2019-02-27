const express = require("express");
const router = express.Router();

// scraper modules
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
var db = require("../models");

// GET route for index and scraping MixMag website
router.get("/scrape", (req, res) => {
  // grab the html body via axios
  axios.get("https://mixmag.net/news").then(function(response) {
    // load the response into cheerio and save it to $
    const $ = cheerio.load(response.data);
    $("article").each(function(i, element) {
      let result = {};
      result.title = $(element)
        .find("h3")
        .text();
      result.summary = $(element)
        .find("p")
        .text();
      result.link = `https://mixmag.net${$(element)
        .find("a")
        .attr("href")}`;

      //mongoose - create new Article using our scrape above
      db.Article.create(result)
        .then(function(dbArticle) {
          //view added result in console
          console.log(dbArticle);
        })
        .catch(function(err) {
          //log an error if occured
          console.log(err);
        });
    });
    res.redirect("/");
  });
});

// render index page via our db which also populates comments
router.get("/", function(req, res) {
  db.Article.find()
    .sort({ time: -1 })
    .populate("comments.comment")
    .then(function(dbArticle) {
      res.render("index", { result: dbArticle });
    })
    .catch(function(err) {
      res.json(err);
    });
});

// sends back json of all articles
router.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// this POST route will take user comment and add it to the matching article in the db
router.post("/articles/:id", function(req, res) {
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comments: { comment: dbComment._id } } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// this route will delete a user comment as per their request
router.get("/comments/:id/:articleid", function(req, res) {
  console.log(req.body);
  db.Article.findOneAndUpdate(
    { _id: req.params.articleid },
    { $pull: { comments: { comment: req.params.id } } }
  )

    .then(function(data) {
      console.log(data);
      res.json(data);
    })
    .catch(function(err) {
      res.json(err);
    });
});

module.exports = router;