var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/123', function(req, res, next){
  res.render('index', {
    title:123
  });
})
module.exports = router;
