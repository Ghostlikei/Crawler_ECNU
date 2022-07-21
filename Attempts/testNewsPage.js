const axios = require('axios').default;
const cheerio = require('cheerio');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'stl030926',
    port: '3306',
    database: 'science_news'
})

let newsUrl = "https://www.sciencenews.org/article/would-you-wheat-burger";
const config = {
    headers:{
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
    } 
};

async function getNewsHtml(){
    const resp = await axios.get(newsUrl,config);
    return resp.data;
}

async function getNewsLinks(){
    const html = await getNewsHtml();
    const $ = cheerio.load(html);

    let EXISTS = false;
        let querysql = `SELECT * FROM \`sciencenews\` where html="${newsUrl}";`
        connection.query(querysql, (err, result) =>{
            if(err){
                console.log(err);
                return;
            }
            if(result.length === 1) EXISTS = true;
        })

    if(EXISTS) {
        console.log(`${newsUrl} has been crawled!`);
        return;
    }

    let title = $('header div div h1').text();
    let author = $('div div div div p span a').text();
    let time = $('div div div div p time').attr('datetime').slice(0,19).replace("T"," ");
    let source = "sciencenews.org";
    let article = $('main div div div[class~="rich-text"] p').text();
    // // let url = newsUrl;

    let essay = $('div div footer div p').text();
    // if(essay){
    //     essay = essay.attr('href');
    // }

    console.log(time);
}

let html = getNewsLinks();