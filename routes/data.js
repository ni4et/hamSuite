// Database access:
// all requests and responses are json

var express = require('express');
var router = express.Router();
var path = require('path');
var parseADIF = require('../lib/parseADIF.js');

// Load station settings json
var stationSettingspath = path.join(
  __dirname,
  '../public/assets',
  'stationSettings.json'
);
var stationSettings = require(stationSettingspath);

// Rethinkdb initialization
r = require('rethinkdb');

// https://expressjs.com/en/resources/middleware/multer.html
const multer = require('multer');
const upload = multer({}); // Returns the Multer object set for memory storage by default.

//-----------------

//router.use(express.json());
//router.use(express.urlencoded({ extended: false }));

// routes:
// throw-away test and example function
// Place holder for now
router.post('/profile', upload.none(), function (req, res, next) {
  // req.body contains the text fields
  console.log(req);
});

router.post('/upload', upload.single('files'), function (req, res, next) {
  // req.body will hold the text fields, if there were any
  console.log('before');
  parseADIF.parseADIF(req.file.buffer, req.body, headerCallback, qsoCallback);
  console.log('after');

  res.json({
    res: 'Thanks! The file: ' + req.file.originalname + ' has been uploaded.',
  });
});

function headerCallback(header, options) {
  console.log(header);
}
function qsoCallback(qso, options) {
  console.log(qso);
}

//router.post('/upload', function (req, res, next) {
// res.send('dummy');});

//https://restfulapi.net/http-methods/#:~:text=HTTP%20Methods%201%201.%20HTTP%20GET%20Use%20GET,Summary%20of%20HTTP%20Methods%20...%207%207.%20Glossary

/*  Reqiired methods
HTTP GET
HTTP POST
HTTP PUT
HTTP DELETE
HTTP PATCH
*/
/* Paths to be implemented: log, logMetaData, callBook
  - log - this is the qsos logged
  - logMetadata - Record of uploads qsos uploaded will have the adif header, upload data, and found ADIF types specified in the upload.
  - callbook - Mostly qrz.com data and manual notes. Displayed during log entry if available.

  */

var connection = null;
r.connect({ host: 'localhost', port: 28015 }, function (err, conn) {
  if (err) throw err;
  connection = conn;
});

module.exports = router;
