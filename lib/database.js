r = require('rethinkdb');
let host="sam"
async function dbConnect(){
  await r.connect({ host: , port: 28015 });
}



, function (err, conn) {
  if (err) throw err;
  r.db('test')
    .tableCreate('tv_shows')
    .run(conn, function (err, res) {
      if (err) throw err;
      console.log(res);
      r.table('tv_shows')
        .insert({ name: 'Star Trek TNG' })
        .run(conn, function (err, res) {
          if (err) throw err;
          console.log(res);
        });
    });
});