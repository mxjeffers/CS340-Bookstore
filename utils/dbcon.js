var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit :    10,
  host            :   'klbcedmmqp7w17ik.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user            :   'v0497qsdglv31o3l',
  password        :   'casjau1bq1c1019u',
  database        :   'ngrvtz55fudf45bt',
  dateStrings     :   true
  /*connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_jeffersm',
  password        : '6755',
  database        : 'cs340_jeffersm',
  dateStrings      :true,*/
});

module.exports.pool = pool;
/*
//Settings for heroku database
var pool = mysql.createPool({
  connectionLimit :    10,
  host            :   'klbcedmmqp7w17ik.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user            :   'v0497qsdglv31o3l',
  password        :   'casjau1bq1c1019u',
  database        :   'ngrvtz55fudf45bt',
  dateStrings     :   true
}) */