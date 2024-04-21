const mysql = require('mysql2');
require('dotenv').config();

//==============================================================
const connection = mysql.createConnection({
  host: "127.0.0.1",
  database: "emr",
  user: "root",
  password: "Ahmed9112",
});
//==============================================================
module.exports = connection;

