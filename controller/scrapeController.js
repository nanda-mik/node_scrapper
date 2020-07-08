const request = require('request-promise');
const xml2js = require('xml2js');
const cheerio = require('cheerio');
const parser = new xml2js.Parser();
const parse_url = require('parse-url');
const urlPack = require('url');
const psi = require('psi');

const Crawler = require('../models/scrapper');
const htmlDump = require('../models/htmlPages');
const requestPromise = require('request-promise');

// function getScrapper(url,lastmod){
//     return new Promise (async(resolve,reject)=>{
//         const baseUrl = 'https://startuptalky.com';
//         const html = await request(url);
//         const $ = cheerio.load(html);

//         //calculating pagespeed 
//         const { time } = await psi(url);
//         const pageSpeed =  time.lighthouseResult.audits['speed-index'].displayValue;

//         //calculating total words
//         var str = $('.main-content-area').text().replace(/\s\s+/g, ' ');
//         var totalWords = str.split(' ').length;

//         const title = $('.post-head .title').text();
//         const meta = $('title').text();
//         var img_txt = $('.main-content-area img').attr('alt');
//         if(typeof(img_txt) === "undefined"){
//             img_txt="";
//         }
//         var urlset =[];
//         var int = 0;
//         var ext = 0;
//         $('.main-content-area a').each((i,el) => {
//             var x = $(el).attr('href');
//             // console.log(x);
//             var head = parse_url(x).resource;
//             if(head == 'startuptalky.com'){
//                 if(!urlset.includes(x)){
//                     int++;
//                     urlset.push(x);
//                 }
//             }else if(head == ''){
//                 var y = urlPack.resolve(baseUrl,x);
//                 if(!urlset.includes(y)){
//                     int++;
//                     urlset.push(y);
//                 }
//             }else{
//                 urlset.push(x);
//                 ext++;
//             }
//         });

//         console.log(url,'\n',
//                     lastmod,'\n',
//                     pageSpeed,'\n',
//                     totalWords,'\n',
//                     );

//         // const crawler = new Crawler({
//         //     url: url,
//         //     lastmod: lastmod,
//         //     title: title,
//         //     meta_title: meta,
//         //     ext_link: ext,
//         //     int_link: int,
//         //     img_alt: img_txt,
//         //     url_bunch: urlset
//         // });
//         // const result = crawler.save();
//         resolve(result);
//     })
// }

const scrapEachPage = async () => {
    const htmlpages = await htmlDump.find();
    for(let i=0;i<htmlpages.length;i++){
        const $ = cheerio.load(htmlpages[i].html);
        const lastmod = htmlpages[i].lastmod;
        
        const url = htmlpages[i].url;

        //meta and post title
        const meta = $('title').text();
        const title = $('.post-head .title').text();

        //pagespeed
        // const {data} = await psi(url,{
        //     strategy: 'desktop'
        // });
        // const pageSpeed = data.lighthouseResult.audits['speed-index'].displayValue;
        
        //total words
        const str = $('.main-content-area').text().replace(/\s\s+/g, ' ');
        const n_words = str.split(' ').length;

        //internal link, external link and other article linking
        const baseUrl = 'https://startuptalky.com';
        var links = $('.main-content-area a');
        var doFext_link = [];
        var noFext_link = [];
        var int_link = [];
        var int= 0,d_ext=0,n_ext=0;
        for(let i=0;i<links.length;i++){
            var x = $(links[i]).attr('href');
            var head = parse_url(x).resource;
            if(head == 'startuptalky.com'){
                if(!int_link.includes(x)){
                int++;
                int_link.push(x);
                }
            }else if(head == ''){
                var y = urlPack.resolve(baseUrl,x);
                if(!int_link.includes(y)){
                int++;
                int_link.push(y);
                }
            }else{
                var z = $(links[i]).attr('rel');
                if(typeof(z) === 'undefined'){
                d_ext++;
                doFext_link.push(x);
                }else{
                n_ext++;
                noFext_link.push(x);
                }
            }
        }
        var othlink_Art = [];
        var otA = 0;
        for(let i=0;i<int_link.length;i++){
            let path = parse_url(int_link[i]).pathname;
            var bool = (path.includes("/tag") || path.includes("/author"));
            if(!bool){
            otA++;
            othlink_Art.push(int_link[i]);
            }
        }

        //no of tags
        var tag_articles = $('.post-tags a');
        var tag_array =[];
        var no_of_tagArt = tag_articles.length;
        for(let i=0;i<tag_articles.length;i++){
            var tagLink = $(tag_articles[i]).attr('href');
            var abc = urlPack.resolve(baseUrl,tagLink);
            tag_array.push(abc);
        }

        const result = ({
            url: url,
            lastmod: new Date(lastmod),
            total_words: n_words,
            title_length: title.length,
            meta_length: meta.length,
            no_of_int: int,
            int_link: int_link,
            no_of_dFext: d_ext,
            dF_ext_link: doFext_link,
            no_of_nFext: n_ext,
            nf_ext_link: noFext_link,
            no_of_otherArticle: otA,
            other_linkArticle: othlink_Art,
            no_of_tagArt: no_of_tagArt,
            tag_array: tag_array
        });
        // const crawler = new Crawler({
        //     url: url,
        //     lastmod: new Date(lastmod),
        //     pageSpeed: pageSpeed,
        //     total_words: n_words,
        //     title_length: title.length,
        //     meta_length: meta.length
        // });
        // const result = await crawler.save();
        console.log(result);
    }
}

const htmlDumpfunction =async (url, lastmod)=>{
        const html = await request(url);
        const htmldump = new htmlDump({
            url: url,
            html: html,
            lastmod: new Date(lastmod)
        });
        await htmldump.save(); 
}

 async function getCrawler(url) {
    const res = await request(url);
    const result = await parser.parseStringPromise(res);
    if(result.urlset){
        const urls = result.urlset.url;
        var topUrl = urls.slice(0,10);
        for(let i=0;i<topUrl.length;i++){
            var singleUrl = topUrl[i].loc[0];
            var lastmod = topUrl[i].lastmod[0];
            await htmlDumpfunction(singleUrl,lastmod);
        }
    }else{
        const xmls = result.sitemapindex.sitemap;
        for(let i=0;i<xmls.length;i++){
            var x = xmls[i].loc[0];
            console.log("xml: "+x);
            await getCrawler(x);
        }
    }
}

exports.postScrapper = async (req, res, next) => {
    const inputUrl = req.body.url;
    const sitemapXml = inputUrl + "sitemap.xml";
    await getCrawler(sitemapXml);
    console.log("html dumped crawl start.");
    await scrapEachPage();
    res.status(200).json({message: "website crawled"});
};

exports.getScrapper = async (req,res,next) => {
    await scrapEachPage();
    res.status(200).json({message: "success"});
};

// exports.postdumpPage =async (req,res,next) =>{
//     const url = req.body.pageurl;
//     const html = await request(url);
//     const htmldump = new htmlDump({
//         html: html
//     });
//     const result = await htmldump.save();
//     console.log(result);
//     res.status(200).json({message: 'page dumped'});
// };

// exports.getfromDump = async (req,res,next) => {
//     const htmlRes = await htmlDump.find();
//     htmlRes.forEach(el => {
//         const $ = cheerio.load(el.html);
//         const title = $('.post-head .title').text();
//         console.log(title);
//     });
//     res.status(200).json({message: 'found'});
// };

