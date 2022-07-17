const axios = require('axios').default;
const cheerio = require('cheerio');

let url = "https://news.sciencenet.cn/indexyaowen-2.aspx";
const config = {
    headers:{
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
    } 
};

async function getNewsHtml(){
    const resp = await axios.post(url,config);
    return resp.data;
}

async function getNewsLinks(){
    const html = await getNewsHtml();
    const $ = cheerio.load(html);
    const anchor = $("tbody tr td table tbody tr td a");
    
    console.log(anchor);
    const links = anchor.map((i, ele) => {
        const href = ele.attribs["href"];
        return href;
    })
    console.log(links);
    return links;
}

let html = getNewsLinks();