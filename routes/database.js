const mysql = require('mysql2');
const connection = mysql.createPool("https://railway.app/"); 

connection.connect();
module.exports = connection;