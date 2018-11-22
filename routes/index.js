var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    artist: '프라푸치노 맛있다'
  });
});

module.exports = router;
