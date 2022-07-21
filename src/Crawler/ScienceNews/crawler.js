/* 此爬虫为ScienceNews新闻爬虫，新闻版权归原网站所有，不用于盈利和商业目的，是为了期末大作业编写 */
const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');

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
    password: 'stl030926',
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
        let anchor = $("div ol li div h3 a");
        
        const links = anchor.map((i, ele) => {
            const href = ele.attribs["href"];
            return href;
        })
        console.log(`Fetching page: ${listUrl}`);
        return links;
    }
    catch(err){
        fs.writeFileSync("./error_log.txt",`${err}, ${listUrl}\n`,{flag:"a+"});
    }
    
}

async function getData(newsUrl){
    try{
        let SUCCESS = true;
        const resp = await axios.get(newsUrl, config);
        const $ = cheerio.load(resp.data);
        let title = $('header div div h1').text();
        let author = $('div div div div p span a').text();
        let time = $('div div div div p time').attr('datetime').slice(0,19).replace("T"," ");
        let source = "sciencenews.org";
        let article = $('main div div div[class~="rich-text"] p').text();
        let url = newsUrl;

        let essay = $('div div footer div p').text();

        console.log(`Getting Data: ${newsUrl}`);

        
        
        let sql = `INSERT INTO sciencenews VALUES("${title}", "${author}", "${source}", "${time}", "${article}", "${url}", "${essay}");`;
        connection.query(sql, (err, result) =>{
            if(err){
                SUCCESS = false;
                fs.writeFileSync("./error_log.txt",`${err}, ${newsUrl}\n`,{flag:"a+"});
                return;
            }
        })

        if(SUCCESS) fs.writeFileSync("./crawl_log.txt",`Getting data successfully:\nurl: ${url}\n`,{flag:"a+"});

        return {
            title: title,
            author: author,
            source: source,
            upload_time: time,
            article: article,
            html: url,
            essay: essay
        };

    }
    catch(err){
        fs.writeFileSync("./error_log.txt",`${err}, ${newsUrl}\n`,{flag:"a+"});
    }
    
}

async function fetchAll(listUrl){
    const links = await getNewsLinks(listUrl);
    try{
        const proms = links.map((link) => {
            return getData(links[link]);
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

let start_page = 1;
let number = 10;
async function main(){
    for(let j = 1; j <= 1000; j++){
        for(let i = start_page; i < start_page+number; i++){
            fetchAll(`https://www.sciencenews.org/topic/tech/page/${i}`);   
        }
        await sleep(25000);
        if(start_page >= 100){
            console.log("抓取结束！");
            connection.end();
            return;
        }
        start_page += number;
    } 
    console.log("抓取结束！");
    connection.end();
}
main();