var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/oauth/twitter', function(req, res, next) {
  res.render('index', { title: 'OAuth Twitter' });
});

module.exports = router;
