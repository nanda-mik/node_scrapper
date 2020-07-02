const request = require('request-promise');
const xml2js = require('xml2js');
const cheerio = require('cheerio');
const parser = new xml2js.Parser();

const Crawler = require('../models/scrapper');

async function getCrawler(xml){
    var res = await request(xml);
    parser.parseString(res,(err, result) => {
        var urls = result.urlset.url;
        var topUrl = urls.slice(0,5);
        topUrl.forEach(async (el) => {
            var url = el.loc[0];
            var date = el.lastmod[0];
            var urlDate = new Date(date);
            const crawler = new Crawler({
                url: url,
                lastmod: urlDate
            });
            var res = await crawler.save();
            console.log(res);
        });
    });
}

exports.getMainpage = (req, res, next) =>{
    res.render('main');
};

exports.getData = async (req,res,next) => {
    const st = req.body.stdate;
    const en = req.body.endate;

    var start = new Date(st);
    var end = new Date(en);

    const urls = await Crawler.find();
    urls.forEach(async (el) => {
        var date = el.lastmod;
        // console.log(date);
        if(date<end && date>start){
            var url = el.url;
            const html = await request(url);
            const $ = cheerio.load(html);
            $("h2").each((i,element) => {
                console.log(el.url,'\n',el.lastmod);
                console.log("H2: "+$(element).text());
            });
        }
    });

};

exports.getScrapper =async (req, res, next) => {
    const inputUrl = req.body.url;
    const sitemapXml = inputUrl + "sitemap.xml";
    var resu = await request(sitemapXml);
    res.render('date');
    parser.parseString(resu, (err, result) => {
        const xmls = result.sitemapindex.sitemap;
        xmls.forEach(el => {
            var url = el.loc[0];
            getCrawler(url); 
        });
    })
};