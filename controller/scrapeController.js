const request = require('request-promise');
const xml2js = require('xml2js');
const cheerio = require('cheerio');
const parser = new xml2js.Parser();
const parse_url = require('parse-url');
const urlPack = require('url');

const Crawler = require('../models/scrapper');

function getScrapper(url){
    return new Promise (async(resolve,reject)=>{
        const baseUrl = 'https://startuptalky.com';
        const html = await request(url);
        const $ = cheerio.load(html);
        const title = $('.post-head .title').text();
        const meta = $('title').text();
        var img_txt = $('.main-content-area img').attr('alt');
        if(typeof(img_txt) === "undefined"){
            img_txt="";
        }
        var urlset =[];
        var int = 0;
        var ext = 0;
        $('.main-content-area a').each((i,el) => {
            var x = $(el).attr('href');
            // console.log(x);
            var head = parse_url(x).resource;
            if(head == 'startuptalky.com'){
                if(!urlset.includes(x)){
                    int++;
                    urlset.push(x);
                }
            }else if(head == ''){
                var y = urlPack.resolve(baseUrl,x);
                if(!urlset.includes(y)){
                    int++;
                    urlset.push(y);
                }
            }else{
                urlset.push(x);
                ext++;
            }
        });
        const crawler = new Crawler({
            url: url,
            title: title,
            meta_title: meta,
            ext_link: ext,
            int_link: int,
            img_alt: img_txt,
            url_bunch: urlset
        });
        const result = crawler.save();
        resolve(result);
    })
}

async function getCrawler(url) {
        const res = await request(url);
        parser.parseString(res,(err,result)=> {
        if(result.urlset){
            const urls = result.urlset.url;
            var topUrl = urls.slice(0,5);
            topUrl.forEach(async (el) => {
                var singleUrl = el.loc[0];
                const data = await getScrapper(singleUrl);
                console.log(data);
            })
        }else{
            const xmls = result.sitemapindex.sitemap;
            xmls.forEach(async (el) => {
                var x = el.loc[0];
                getCrawler(x);
            })
        }
    });
}

exports.postScrapper = (req, res, next) => {
    const inputUrl = req.body.url;
    const sitemapXml = inputUrl + "sitemap.xml";
    getCrawler(sitemapXml);
    res.status(200).json({message: 'Site Scrapped.'});
};

exports.getScrapper = (req,res,next) => {
    Crawler.find()
        .then((data) => {
        //     res.status(200).json({
        //         data: data
        //    });
            res.send(data);
        })
        .catch(err => {
            console.log(err);
        });
};