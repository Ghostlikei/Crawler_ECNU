var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'stl030926',
    port: '3306',
    database: 'science_news'
})

connection.connect();

let sql = `SELECT * FROM \`sciencenews\` where html="https://www.cas.cn/syky/202206/t20220617_4838678.shtml";`

connection.query(sql, (err, result) =>{
    if(err){
        console.log(err);
        return;
    }
    console.log(result.length);
})

connection.end();