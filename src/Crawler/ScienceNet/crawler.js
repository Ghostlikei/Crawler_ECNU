/* 此爬虫为科学网新闻爬虫，新闻版权归原网站所有，不用于盈利和商业目的，是为了期末大作业编写 */
const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');


const host = "https://news.sciencenet.cn";
const config = {
    timeout: 30000,
    headers:{
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
    } 
};

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pwd',
    port: '3306',
    database: 'science_news'
})

connection.connect();

async function getNewsHtml(listUrl){
    try{
        const resp = await axios.get(listUrl,config);
        return resp.data;
    }
    catch(err){
        fs.writeFileSync("./error_log.txt",`${err}, ${listUrl}\n`,{flag:"a+"});
    }
}

async function getNewsLinks(listUrl){
    try{
        const html = await getNewsHtml(listUrl);
        const $ = cheerio.load(html);
        const anchor = $("tbody tr td table tbody tr td a");
        
        const links = anchor.map((i, ele) => {
            const href = ele.attribs["href"];
            return href;
        })
        return links;
    }
    catch(err){
        fs.writeFileSync("./error_log.txt",`${err}, ${listUrl}\n`,{flag:"a+"});
    }
    
}

async function getData(newsUrl){
    try{
        const resp = await axios.get(newsUrl, config);
        const $ = cheerio.load(resp.data);
        let title = $('table tbody tr:nth-child(3) td').text().replace(/(^\s*)|(\s*$)/g, "");
        let source = $('tbody tr:nth-child(1) td div a').text();
        let author = '';
        let info = $('tbody tr:nth-child(1) td[align="left"] div:nth-child(1)').text().replace(/(^\s*)|(\s*$)/g, "");
        if (info.slice(0,2) !== '作者'){
            author = null;
        } else {
            author += info.match(/：.*[\u6765][\u6e90]：/g)[0];
            author = author.replace(/\uff1a/g,"").replace(/\u6765\u6e90/g, "").replace(' ','');
        }

        let time = info.match(/\d+[/-]\d+[/-]\d+\s\d+[:]\d+[:]\d+/g);
        if(!time){
            time = info.match(/\d+[/-]\d+[/-]\d+/g)[0];
        } else {
            time = info.match(/\d+[/]\d+[/]\d+\s\d+[:]\d+[:]\d+/g)[0];
        }

        let article = $('p').text().replace("\t", "");
        let url = newsUrl;

        fs.writeFileSync("./crawl_log.txt",`Getting data successfully:\n{url: ${url},\ntitle: ${title}}\n`,{flag:"a+"});
        
        let sql = `INSERT INTO sciencenews VALUES("${title}", "${author}", "${source}", "${time}", "${article}", "${url}", "null");`;
        connection.query(sql, (err, result) =>{
            if(err){
                console.log(err);
                return;
            }
        })

        return {
            title: title,
            author: author,
            source: source,
            upload_time: time,
            article: article,
            html: url,
            essay: null
        };

    }
    catch(err){
        fs.writeFileSync("./error_log.txt",`${err}, ${newsUrl}\n`,{flag:"a+"});
    }
    
}

async function getOldData(newsUrl){
    try{
        const resp = await axios.get(newsUrl, config);
        const $ = cheerio.load(resp.data);
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
        let url = newsUrl;

        fs.writeFileSync("./crawl_log.txt",`Getting data successfully:\n{url: ${url},\ntitle: ${title}}\n`,{flag:"a+"});
        
        let sql = `INSERT INTO sciencenews VALUES("${title}", "${author}", "${source}", "${time}", "${article}", "${url}", "null");`;
        connection.query(sql, (err, result) =>{
            if(err){
                console.log(err);
                return;
            }
        })

        return {
            title: title,
            author: author,
            source: source,
            upload_time: time,
            article: article,
            html: url,
            essay: null
        };

    }
    catch(err){
        fs.writeFileSync("./error_log.txt",`${err}, ${newsUrl}\n`,{flag:"a+"});
    }
    
}

// async function saveToDB(json){
//     try{
//         let sql = `INSERT INTO sciencenews VALUES(${json[title]}, ${json[author]}, ${json[source]}, ${json[upload_time]}, ${json[article]}, ${json[html]}, ${json[essay]});`;
//         connection.query(sql, (err, result) =>{
//             if(err){
//                 console.log(err);
//                 return;
//             }
//         })
//     }
//     catch(err){
//         fs.writeFileSync("./error_log.txt",`${err}, ${json[html]}\n`,{flag:"a+"});
//     }
    
    
// }

async function fetchAll(listUrl){
    await sleep(5000);
    const links = await getNewsLinks(listUrl);
    try{
        const proms = links.map((link) => {
            if(links[link].slice(-4,-1) !== 'sht'){
                fs.writeFileSync("./error_log.txt",`Crawler not supported, ${links[link]}\n`,{flag:"a+"});
                return null;
            }
            return getOldData(host + links[link]
                .replace('https://news.sciencenet.cn',"")
                .replace('http://news.sciencenet.cn',""));
        });
    
        return Promise.all(proms);
    }
    catch(err){
        fs.writeFileSync("./error_log.txt",`${err}\n`,{flag:"a+"});
    }
    
}

const sleep = (timeout) => {
    return new Promise((resolve)=>{
      setTimeout(()=>{
        resolve();
      }, timeout)
    })
}

let start_page = 1521;
let number = 20;
async function main(){
    for(let j = 1; j <= 1000; j++){
        for(let i = start_page; i < start_page+number; i++){
            fetchAll(`https://news.sciencenet.cn/indexyaowen-${i}.aspx`);
            
            console.log(`Fetching page: ${i}`);
        }
        await sleep(35000);
        if(start_page >= 2300){
            console.log("抓取成功！");
            connection.end();
            return;
        }
        start_page += 20;
    }  
    await sleep(40000);
    console.log("抓取成功！");
    connection.end();
}
main();




