var mysql = require('mysql');
const db = mysql.createPool({
    host : '192.168.9.87',
    user : 'root',
    password : '0000',
    database : 'jh-tms'
    
});

module.exports = db;
