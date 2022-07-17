var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'stl030926',
    port: '3306',
    database: 'SCIENCE_NEWS'
})

connection.connect();

let sql = 'INSERT INTO SCIENCENEWS VALUES(\
    "测试标题",\
    "test author",\
    "test source",\
    "2000-12-31 23:59:59",\
    "测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本",\
    "http://www.google.com",\
    "http://www.fooessay.com");';

connection.query(sql, (err, result) =>{
    if(err){
        console.log(err);
        return;
    }
    console.log(result);
})

connection.end();