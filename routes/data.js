'use strict';
// Database access:
// all requests and responses are json

var express = require('express');
var router = express.Router();
var path = require('path');
var parseADIF = require('../lib/parseADIF.js');

// Load station settings json
var stationSettingsPath = path.join(
  __dirname,
  '../public/assets',
  'stationSettings.json'
);
var stationSettings = require(stationSettingsPath);

// https://expressjs.com/en/resources/middleware/multer.html
const multer = require('multer');
const { error } = require('console');
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
  let recordCount = 777;
  // req.body will hold the text fields, if there were any
  uploadHandler(req, res)
    .then((count) => {
      console.log('count= ', count);
      recordCount = count;
      console.log('uploadHandler.then: ');
    })
    .then(() => {
      res.json({
        res: `Thanks! ${recordCount} qsos from  ${req.file.originalname} imported.`,
      });
    });
});

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

module.exports = router;

//=============================================================\\
// Database access routines:
//=============================================================\\
// no async/await above here:

// Rethinkdb initialization
const r = require('rethinkdb');
var connection = null;
r.connect({ host: 'localhost', port: 28015 }, function (err, conn) {
  if (err) throw err;
  connection = conn;
});

let databases = null; // Gets filled in when the rethinldb is contactedq
let conn = null;
// IFFE pattern
(async () => {
  try {
    conn = await r.connect({
      host: 'localhost',
      port: 28015,
    });
    databases = await r.dbList().run(conn);
    //console.log(databases);
  } catch {
    console.log('in data.js: failed to open database, is it running?');
  }
})(); // () gets it called here.

async function dbCheckAndCreate(database) {
  console.log('dbCheckAndCreate ', database);
  try {
    if (databases.indexOf(database) < 0) {
      // The database does not exist
      // Silently create the database called for and populate it with
      // our canonical tables:
      await r.dbCreate(database).run(conn);

      const result = await Promise.all([
        r.db(database).tableCreate('qso').run(conn),
        r.db(database).tableCreate('meta').run(conn),
        r.db(database).tableCreate('qrz').run(conn),
      ]);
      //console.log(result);
      databases.push(database);
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// - upload support:
async function uploadHandler(req, res) {
  console.log('uploadHandler()');
  const database = req.cookies.stationSettings_database;
  const go = await dbCheckAndCreate(database);

  let recordCount = await parseADIF.parseADIF(
    req.file.buffer,
    // pass the request body and the index to the metadata
    {
      ...req.body,
      //metaId: meta.metaInsertResult.generated_keys[0],
      database: database,
    },
    headerCallback,
    qsoCallback
  );
  return Promise.resolve(recordCount);
}

async function headerCallback(hdr, options) {
  console.log('headerCallback() ', hdr);
  if (options.metaId) {
    const updateResult = await r
      .db(options.database)
      .table('meta')
      .get(options.metaId)
      .update(hdr)
      .run(conn);
    console.log('headerCallback() result= ', updateResult);
  } else {
    const result = await r
      .db(options.database)
      .table('meta')
      .insert(hdr)
      .run(conn);
    options.metaId = result.generated_keys[0];
  }
}
async function qsoCallback(qso, options) {
  console.log('qsoCallback() ', qso);
  return Promise.resolve('qsoCallback');
}
