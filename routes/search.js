var express = require('express');
var router = express.Router();
var Twitter = require('twitter-node-client').Twitter;
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var getTwitterInstance = function () {
    return new Twitter({
       "consumerKey": "JFIIqp4iWRViAonopq4Syq9L0",
       "consumerSecret": "tNJ0Ln8LQLA63C0hSpbArUyyXW0RMY5ppqBuPoZ7mBIgqxpORb",
       "accessToken": "845653889810661376-ppN8YdqJpDbKli6DxT4m8JVwQoCuC72",
       "accessTokenSecret": "nLBvHDurH98kP2aNloptMpq4y8FYKCj0hJDHnW1nATtYN",
       "callBackUrl": "https://customer-complaint.herokuapp.com/oauth/twitter"
    });
}

var getToneAnalyzerInstance = function () {
    return new ToneAnalyzerV3({
        username: 'f8221297-aded-481c-a5c5-07bb4da81f09',
        password: 'zEkP6V0iyBpI',
        version_date: '2016-05-19'
    });
}

/* GET home page. */
router.get('/:hashtag', function(req, res, next) {
    var twitter = getTwitterInstance();
    var tone_analyzer = getToneAnalyzerInstance();
    
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
