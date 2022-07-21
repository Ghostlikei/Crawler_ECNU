var express = require('express');
var router = express.Router();
var mysql = require('../mysql.js'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/process_get', (req, resp) =>{
    let ori = req.query.keyword.split(",");
    let arg = ori[0];
    let item = ori[1];
    let sql = `SELECT DISTINCT title, author, source, upload_time, html\
    from sciencenews where ${item} like '%${arg}%' ORDER BY upload_time DESC`;
    mysql.query(sql, (err, result, fields) =>{
      resp.writeHead(200, {"Content-Type": "application/json"});

      resp.write(JSON.stringify(result));
      resp.end();
    });
});

router.get('/chart', (req, resp) =>{
  let ori = req.query.keyword.split(",");
  let arg = ori[0];
  let item = ori[1];
  let sql = `SELECT DATE_FORMAT(upload_time, '%Y-%m') AS date, COUNT(*) AS num\
  from sciencenews where ${item} like '%${arg}%' GROUP BY date  ORDER BY upload_time DESC`;
  mysql.query(sql, (err, result, fields) =>{
    resp.writeHead(200, {"Content-Type": "application/json"});
    resp.write(JSON.stringify(result));
    resp.end();
  });
});

module.exports = router;
