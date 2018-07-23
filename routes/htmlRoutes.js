var logger = require("morgan");
var mongoose = require("mongoose");
var db = require("../models");
// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scraper");
module.exports = function (app) {
    app.get("/", function (req, res) {
        db.Article.find({saved: false}).then(function (dbArticle) {
            var hbsObject = {
                articles: dbArticle
            };
            console.log(hbsObject)
            res.render('index', hbsObject);
        })
            .catch(function (err) {
                console.log(err)
            })
        

    });
    app.get('/saved', function (req, res) {
        db.Article.find({saved: true }).then(function (dbArticle) {
            var hbsObject = {
                articles: dbArticle
            };
            res.render('saved', hbsObject);
        })
            .catch(function (err) {
                console.log(err)
            })
    })
}