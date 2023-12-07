const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'varchandise_mcc',
});

connection.connect();
module.exports = connection;