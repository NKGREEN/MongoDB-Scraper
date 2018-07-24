var axios = require("axios");
var cheerio = require("cheerio");
var logger = require("morgan");
var mongoose = require("mongoose");
var db = require("../models");
var express = require("express");
var router = express.Router();
var user = process.env.USER;
var password = process.env.PASSWORD;
var mlab = 'mongodb://' + user + ':' + password + '@ds137687.mlab.com:37687/mongoscraperkg';
var databaseUrl = mlab;
// Connect to the Mongo DB
mongoose.connect(databaseUrl);

router.get("/api/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.charlotteobserver.com/news/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        var results = [];

        $(".teaser").each(function (i, element) {
            // Save the text and href of each link enclosed in the current element


            var result = {
                title: $(this)
                    .children(".title")
                    .children('a')
                    .text(),
                link: $(this)
                    .children('.title')
                    .children("a")
                    .attr("href"),
                summary: $(this)
                    .children('.summary')
                    .text()
            };
            if (result.title != "" && result.link != "" && result.summary != "") {
                db.Article.create(result)
                    .then(function (dbArticle) {

                        // console.log(dbArticle);

                    })
                    .catch(function (err) {
                        // If an error occurred, send it to the client
                        return res.json(err);

                    });
            }
            if (result.title != "" && result.link != "" && result.summary != "") {


                results.push(result)
            }
        });

        res.json(results.length)
    })




});


// Route for getting all Articles from the db
router.get("/api/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({}).then(function (dbArticle) {
        var hbsObject = {
            articles: dbArticle
        };
        res.json(hbsObject);
    })
        .catch(function (err) {
            console.log(err)
        })
});

router.put("/articles/:id", function (req, res) {
    var info = req.body.saved
    console.log(req.params.id)
    console.log(info)
    db.Article.findOne({ _id: req.params.id })
        .update({ saved: info })
        .populate("notes")
        .then(function (dbArticle) {

            res.json(dbArticle);

        })
        .catch(function (err) {
            res.json(err);
        });
});

router.post("/api/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id }).
        update({ saved: false })
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err);
        });
});
router.delete('/articles', function (req, res) {
    db.Article.remove({ saved: false })
        .then(function (dbArticle) {
            if(dbArticle){
            console.log(dbArticle.n)
            }
        })

})

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function (req, res) {
    console.log(req.body)
    db.Note.create(req.body)
        .then(function (dbNote) {
            console.log(dbNote._id)
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
            console.log(dbArticle)
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);

        });
})
router.get('/note/:id', function (req, res) {
    var note = [];
    db.Article.findOne({ _id: req.params.id })
        .then(function (dbArticle) {
            if (dbArticle.notes.length === 0){
                res.json('none')
            }
            for (var i = 0; i < dbArticle.notes.length; i++) {
                db.Note.findOne({ _id: dbArticle.notes[i] })
                    .then(function (dbNote) {
                        note.push(dbNote)
                        if (note.length === dbArticle.notes.length) {
                            var hbsObject = {
                                notes: note
                            }
                            res.json(hbsObject)
                            console.log(hbsObject)
                        }

                    })

                    .catch(function (err) {
                        res.json(err)
                    })
            }
        })
})
router.delete('/note/:id', function (req, res) {
    db.Article.findOneAndUpdate({notes: req.params.id}, {$pull:{notes:req.params.id}})
    .then(function(){
    db.Note.deleteOne({ _id: req.params.id })
        .then(function (dbNote) {
            console.log(dbNote)
        })
        .catch(function (err) {
            res.json(err)
        })
    })
})
module.exports = router;