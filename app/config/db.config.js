require('dotenv').config();
const mysql = require("mysql2");

exports.backupConnection = () => {
  var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "backup"
  });
  return connection;
}

exports.memoryConnection = () => {
  var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "memory"
  });
  return connection;
}

exports.buylistConnection = () => {
  var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "buylist"
  });
  return connection;
}
