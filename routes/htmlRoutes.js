var logger = require("morgan");
var mongoose = require("mongoose");
var db = require("../models");
require('dotenv').config()
var user = process.env.USER;
var password = process.env.PASSWORD;
var mlab = 'mongodb://' + user + ':' + password + '@ds137687.mlab.com:37687/mongoscraperkg';
var databaseUrl = mlab;
mongoose.connect(databaseUrl);
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