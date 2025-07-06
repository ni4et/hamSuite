// npm debug package deployment pattern
globalThis.process = require('process');
// Debugging utility - does nothing if DEBUG is not set
let log = () => {};
if (process.env.DEBUG) {
  const path = require('path');
  log = require('debug')(path.basename(__filename));
}
// End of debug utility

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  log('index.js:', req.url);
  res.render('index', { title: 'HamSuite!', view: 'index' });
});

module.exports = router;
