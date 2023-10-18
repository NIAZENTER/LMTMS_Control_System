var mysql = require('mysql');
const db = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '0000',
    database : 'jh-tms'
    
});

module.exports = db;
