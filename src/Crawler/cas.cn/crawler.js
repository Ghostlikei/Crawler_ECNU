/* 此爬虫为中国科学院官网新闻爬虫，新闻版权归原网站所有，不用于盈利和商业目的，是为了期末大作业编写 */
const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');

var OLD_PAGE = true;
//for pages over 200(i>199), please set this OLD_PAGE to true
const host = "https://www.cas.cn/kj";
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
        let anchor = null;
        if(!OLD_PAGE){
            anchor = $("#content li a");
        } else {
            anchor = $("#D_mainR div div.ztlb_ld_mainR_box01_list ul li span:nth-child(2) a");
        }
        
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
        let EXISTS = false;
        let querysql = `SELECT * FROM \`sciencenews\` where html="${newsUrl}";`
        connection.query(querysql, (err, result) =>{
            if(err){
                console.log(err);
                return;
            }
            if(result.length === 1) EXISTS = true;
        })

        if(EXISTS) return;

        let SUCCESS = true;
        const resp = await axios.get(newsUrl, config);
        const $ = cheerio.load(resp.data);
        $('style').remove();
        let title = $('body div div.xl h2.xl_title').text();
        let time = $('body div div.xl div.xl_title2 div.fl_all span:nth-child(1)').text();
        let source = $('body div div.xl div.xl_title2 div.fl_all span:nth-child(2)').text().match(/'.+';/g);
        if(source){
            source = source[0].slice(1,-2);
        }
        let article = $('div.xl_content div').text();
        let url = newsUrl;

        let essay = $('body div div.xl div.xl_content div div p a')
        if(essay){
            essay = essay.attr('href');
        }

        console.log(`Getting Data: ${newsUrl}`);

        
        
        let sql = `INSERT INTO sciencenews VALUES("${title}", "null", "${source}", "${time}", "${article}", "${url}", "${essay}");`;
        connection.query(sql, (err, result) =>{
            if(err){
                SUCCESS = false;
                fs.writeFileSync("./error_log.txt",`${err}, ${newsUrl}\n`,{flag:"a+"});
                return;
            }
        })

        if(SUCCESS) fs.writeFileSync("./crawl_log.txt",`Getting data successfully:\n{url: ${url},\ntitle: ${title}}\n`,{flag:"a+"});

        return {
            title: title,
            author: null,
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
            return getData(host + links[link].slice(1,));
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

let start_page = 201;
let number = 20;
async function main(){
    for(let j = 1; j <= 1000; j++){
        for(let i = start_page; i < start_page+number; i++){
            fetchAll(`https://www.cas.cn/kj/index_${i}.shtml`);   
        }
        await sleep(30000);
        if(start_page >= 300){
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