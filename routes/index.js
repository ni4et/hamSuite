const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  //console.log('index.js:', req.url);
  res.render('index', { title: 'HamSuite!', view: 'index' });
});

module.exports = router;
