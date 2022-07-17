var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'stl030926',
    port: '3306',
    database: 'SCIENCE_NEWS'
})

connection.connect();

let sql = 'CREATE TABLE SCIENCENEWS(\
    title TEXT,\
    author TEXT,\
    source TEXT,\
    upload_time DATETIME,\
    article TEXT,\
    html TEXT,\
    essay TEXT DEFAULT NULL);';

connection.query(sql, (err, result) =>{
    if(err){
        console.log(err);
        return;
    }
    console.log(result);
})

connection.end();