const mysql = require('mysql2');
const connection = mysql.createPool(process.env.MYSQL_URL); 

connection.connect();
module.exports = connection;