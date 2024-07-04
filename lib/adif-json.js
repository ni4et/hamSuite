const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');

function parseADIF(buf) {
  rv = [];
  for (i = 0; i < buf.length; i++) {
    console.log(buf[i]);
  }
}

// Testing code
async function uploadFile(file) {
  try {
    const filePath = resolve(file);
    const contents = await readFile(filePath, { encoding: 'utf8' });
    return parseADIF(contents);
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

uploadFile('./wsjtx_log.adi');
