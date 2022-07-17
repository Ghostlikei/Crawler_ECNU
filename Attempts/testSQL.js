var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'stl030926',
    port: '3306',
    database: 'testdb'
})

connection.connect();

let sql = 'CREATE TABLE NEWS(\
    title TEXT,\
    author TEXT,\
    upload_date DATE,\
    article TEXT,\
    keyword TEXT);'

connection.query(sql, (err, result) =>{
    if(err){
        console.log(err);
        return;
    }
    console.log(result);
})

connection.end();