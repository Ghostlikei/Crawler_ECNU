const axios = require('axios').default;
const cheerio = require('cheerio');


let url = "https://www.sciencenews.org/topic/chemistry/page/2";
const config = {
    headers:{
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
    } 
};

async function getNewsHtml(){
    const resp = await axios.get(url,config);
    return resp.data;
}

async function getNewsLinks(){
    const html = await getNewsHtml();
    const $ = cheerio.load(html);
    let anchor = $("div ol li div h3 a");

    
    const links = anchor.map((i, ele) => {
        const href = ele.attribs["href"];
        return href;
    })
    console.log(links);
    return links;
}

let html = getNewsLinks();