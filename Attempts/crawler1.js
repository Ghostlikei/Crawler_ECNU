let crawler = require('request');
let parser = require('cheerio');

let fs = require('fs');

let $url = "https://news.sciencenet.cn/htmlnews/2014/5/293624.shtm";
function request(url, callback){
    let op = {
        url: url,
        encoding: 'utf-8',
        headers: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
    }
    crawler(op, callback);
}

request($url, (err, res, body) =>{
    let html = body;
    let $ = parser.load(html);

        let title = $('table tbody tr:nth-child(3) td').text().replace(/(^\s*)|(\s*$)/g, "");
        
        let author = '';
        let info = $('tbody tr:nth-child(1) td[align="left"] div:nth-child(1)').text().replace(/(^\s*)|(\s*$)/g, "");
        if (info.slice(0,2) !== '作者'){
            author = null;
        } else {
            author += info.match(/：.*[\u6765][\u6e90]：/g)[0];
            author = author.replace(/\uff1a/g,"").replace(/\u6765\u6e90/g, "").replace(' ','');
        }

        let source = info.match(/\u6765\u6e90：.*\u53d1\u5e03\u65f6\u95f4：/g)[0].
            replace(' ', "")
            .replace(/\uff1a/g,"")
            .replace(/\u53d1\u5e03\u65f6\u95f4/g, "")
            .replace(/\u6765\u6e90/g, "");

        let time = info.match(/\d+[/]\d+[/]\d+\s\d+[:]\d+[:]\d+/g);
        if(!time){
            time = info.match(/\d+[-]\d+[-]\d+/g)[0];
        } else {
            time = info.match(/\d+[/]\d+[/]\d+\s\d+[:]\d+[:]\d+/g)[0];
        }

        let article = $('#content1 div').text();

    console.log(author);
    
})