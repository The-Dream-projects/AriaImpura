var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.useragent.isMobile) {
    return res.render('mobile/index');
  }
  res.render('desktop/index');
});
router.get('/admin', function(req, res, next) {
  res.render('admin');
});

module.exports = router;
