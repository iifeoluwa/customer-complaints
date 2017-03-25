var express = require('express');
var router = express.Router();
var Twitter = require('twitter-node-client').Twitter;
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

String.isNullOrEmpty = function (str) {
    return str == null || str == '';
}

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

var getToneInfo = function (text) {
    var tone_analyzer = getToneAnalyzerInstance();
    return new Promise(function (resolve, reject) {
        tone_analyzer.tone({ text: text }, function (err, tone) {
            if (err) {
                console.log(err);
                reject('error', ex);
            }
            else {
                resolve({ text: text, tone: tone })
            }
        })
    });
}

var handleSearchRequestFn = function (req, res, next) {
    var twitter = getTwitterInstance();
    var tone_analyzer = getToneAnalyzerInstance();

    var errorHandler = function (err) {
        console.log(err);
        res.render('search', { title: 'Sorry, an error occurred', results: err });
    }

    var successHandler = function (response) {
        var tweets = JSON.parse(response).statuses;
        if (!String.isNullOrEmpty(req.query.handle)) tweets = tweets.filter(tweet => ((tweet.user || {}).user.screen_name || '').toLowerCase() != req.query.handle.toLowerCase().replace(/\@/g, ''));
        Promise.all(tweets.map(tweet => getToneInfo(tweet.text))).then(function (responses) {
            return res.render('search', {
                title: 'Search Results', results: JSON.stringify(responses.map((tone, i) => {
                    var tweetTone = { tweet: tweets[i], tone: tone }
                    return tweetTone;
                }))
            });
        });
    }


    twitter.getSearch({ 'q': req.params.hashtag || req.query.searchQuery, 'count': 10 }, errorHandler, successHandler);
}

/* GET home page. */
router.get('/:hashtag', handleSearchRequestFn);
router.get('/', handleSearchRequestFn);

module.exports = router;
