var mysql = require('mysql')
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'klbcedmmqp7w17ik.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'v0497qsdglv31o3l',
    password: 'casjau1bq1c1019u',
    database: 'ngrvtz55fudf45bt',
    dateStrings: true
})

module.exports.pool = pool
