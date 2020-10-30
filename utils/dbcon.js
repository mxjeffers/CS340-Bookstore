var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_jeffersm',
  password        : '6755',
  database        : 'cs340_jeffersm',
  dateStrings      :true,
});

module.exports.pool = pool;