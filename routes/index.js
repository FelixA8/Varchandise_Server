var express = require('express');
require('dotenv').config();
var router = express.Router();
const app = express();
const mysql = require('mysql2');

const PORT = process.env.APPLICATION_PORT;``

app.listen(PORT, () => {
  console.log("Server is running at " + PORT);
})

module.exports = router;
