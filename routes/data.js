// Database access:
// all requests and responses are json

var express = require('express');
var router = express.Router();
var path = require('path');
r = require('rethinkdb');

var stationSettingspath = path.join(
  __dirname,
  '../public/assets',
  'stationSettings.json'
);
// throw-away test and example function
router.get('/', function (req, res, next) {
  res.json({ a: 1 });
});

var stationSettings = require(stationSettingspath);

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
  - Not decided where to do json-adif and adif-json conversions yet. First going to try client side.
  */

var connection = null;
r.connect({ host: 'localhost', port: 28015 }, function (err, conn) {
  if (err) throw err;
  connection = conn;
});

module.exports = router;
