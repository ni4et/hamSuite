var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('index.js:', req.url);
  res.render('./example', { title: 'Express' });
});

module.exports = router;
