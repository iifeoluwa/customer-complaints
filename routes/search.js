var express = require('express');
var router = express.Router();
var Twitter = require('twitter-node-client').Twitter;

/* GET home page. */
router.get('/:hashtag', function(req, res, next) {
    var twitter = new Twitter({
       "consumerKey": "JFIIqp4iWRViAonopq4Syq9L0",
       "consumerSecret": "tNJ0Ln8LQLA63C0hSpbArUyyXW0RMY5ppqBuPoZ7mBIgqxpORb",
       "accessToken": "845653889810661376-ppN8YdqJpDbKli6DxT4m8JVwQoCuC72",
       "accessTokenSecret": "nLBvHDurH98kP2aNloptMpq4y8FYKCj0hJDHnW1nATtYN",
       "callBackUrl": "https://customer-complaint.herokuapp.com/oauth/twitter"
});
    var errorHandler = function (err) {
        console.log(err);
        res.render('search', { title: 'Sorry, an error occurred', results: err });
    }

    var successHandler = function (response) {
        var tweets = JSON.parse(response).statuses;
        res.render('search', { title: 'Search Results', results: JSON.stringify(tweets.map(tweet => tweet.text)) });
    }

    twitter.getSearch({'q':req.params.hashtag, 'count': 10}, errorHandler, successHandler);
    
});

module.exports = router;
