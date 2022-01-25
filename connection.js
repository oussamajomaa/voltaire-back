const mysql = require('mysql2')
// const pool = mysql.createPool({
//     host            : 'pp-obtic.sorbonne-universite.fr',
//     user            : 'osm',
//     password        : 'osm',
//     database        : 'voltaire',
// })

const pool = mysql.createPool({
    host            : 'localhost',
    user            : 'osm',
    password        : 'osm',
    database        : 'voltaire',
})


// const pool = mysql.createPool({
//     host            : 'eu-cdbr-west-01.cleardb.com',
//     user            : 'bb79d58f37e79c',
//     password        : 'a597eec946d5583',
//     database        : 'heroku_548d0b6d47fde48',
// })

pool.getConnection(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
  });
module.exports = pool
