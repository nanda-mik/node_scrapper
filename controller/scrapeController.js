const request = require('request-promise');
const xml2js = require('xml2js');
const cheerio = require('cheerio');
const parser = new xml2js.Parser();
const parse_url = require('parse-url');
const urlPack = require('url');
const ke = require('keyword-extractor');
const psi = require('psi');
const isImage = require('is-image');
const isRelativeUrl = require("is-relative-url");
const axios = require('axios');

const Crawler = require('../models/scrapper');
const htmlDump = require('../models/htmlPages');
const requestPromise = require('request-promise');

const scrapEachPage = async () => {
    const htmlpages = await htmlDump.find();
    for(let i=0;i<htmlpages.length;i++){
        const $ = cheerio.load(htmlpages[i].html);
        const lastmod = htmlpages[i].lastmod;
        
        const url = htmlpages[i].url;

        //meta and post title
        const meta = $('title').text();
        const title = $('.post-head .title').text();
        const author_anime = $('.post-meta .author').text().trim();
        //pagespeed
        // const {data} = await psi(url,{
        //     strategy: 'desktop'
        // });
        // const pageSpeed = data.lighthouseResult.audits['speed-index'].displayValue;
        
        //total words
        const content = $('.main-content-area').text().replace(/\s\s+/g, ' ');
        const n_words = content.split(' ').length;

        //internal link, external link and other article linking
        const baseUrl = 'https://startuptalky.com';
        var links = $('.main-content-area a');
        var doFext_link = [];
        var noFext_link = [];
        var int_link = [];
        for(let i=0;i<links.length;i++){
            var x = $(links[i]).attr('href');
            var head = parse_url(x).resource;
            if(head == 'startuptalky.com'){
                if(!int_link.includes(x)){
                int_link.push(x);
                }
            }else if(head == ''){
                var y = urlPack.resolve(baseUrl,x);
                if(!int_link.includes(y)){
                int_link.push(y);
                }
            }else{
                var z = $(links[i]).attr('rel');
                if(typeof(z) === 'nofollow'){
                    noFext_link.push(x);
                }else{
                    doFext_link.push(x);
                }
            }
        }
        var othlink_Art = [];
        for(let i=0;i<int_link.length;i++){
            let path = parse_url(int_link[i]).pathname;
            var bool = (path.includes("/tag") || path.includes("/author"));
            if(!bool){
            othlink_Art.push(int_link[i]);
            }
        }


        //404 ext_link
        var ext_link = doFext_link.concat(noFext_link);
        var broke404_arr =[];
        for(let i=0;i<ext_link.length;i++){
            try {
                  resp = await axios.get(ext_link[i]);
            } catch (err) {
                broke404_arr.push(ext_link[i]);
            }  
        }


        //no of tags
        var tag_articles = $('.post-tags a');
        var tag_array =[];
        for(let i=0;i<tag_articles.length;i++){
            var tagLink = $(tag_articles[i]).attr('href');
            var abc = urlPack.resolve(baseUrl,tagLink);
            tag_array.push(abc);
        }


        //keyword and its related..
        const post = $('.post-content').text();
        var keyword;
        if(post === ''){
            keyword='';
        }else{
            var str = post.replace(/\s\s+/g,' ');
            var res = ke.extract(str,{
                language: "english",
                remove_digits: true,
                remove_duplicates: false
            });
            var arr2 = [];
            for(let i=0;i<res.length;i++){
                arr2[i] = res[i]+" "+res[i+1];
            }
            var freqMap = {};
            for(let i=0;i<arr2.length;i++){
                if(!freqMap[arr2[i]]){
                freqMap[arr2[i]]=0;
                }
                freqMap[arr2[i]]+=1;
            }
            const sortedMap = Object.keys(freqMap).sort((a,b) => {return freqMap[b]-freqMap[a]});
            keyword = sortedMap[0];
        }
        var isKeyPresent_meta = meta.includes(keyword);
        var isKeyPresent_title = title.includes(keyword);
        var density = (((keyword.length)/(n_words))*100);
        var keyword_density = density.toFixed(2);
        const para = $('.post-content p');
        var first_para = $(para[0]).text().trim();
        var isKeyPresent_para = first_para.includes(keyword);


        //images alt name
        const images = $('.post-content img');
        var img_arr =[];
        var brokeimg_arr =[];
        var isKeyPresent_img = true;
        images.each((i,el)=>{
            var rel = $(el).attr('alt');
            var src = $(el).attr('src');
            if(!isImage(src)){
                brokeimg_arr.push(src);
            }
            if(!(typeof(rel) === "undefined")){
                img_arr.push(src);
                if(!rel.includes(keyword)){
                    isKeyPresent_img = false;
                }
            }
        })

        if(keyword === ''){
            isKeyPresent_img=isKeyPresent_meta=isKeyPresent_para=isKeyPresent_title=false;
        }

    
        //result to save in db
        const crawler = new Crawler({
            url: url,
            lastmod: new Date(lastmod),
            total_words: n_words,
            title_length: title.length,
            meta_length: meta.length,
            int_link: int_link,
            no_int_link: int_link.length,
            dF_ext_link: doFext_link,
            no_doF_link: doFext_link.length,
            nf_ext_link: noFext_link,
            no_noF_link: noFext_link.length,
            other_linkArticle: othlink_Art,
            no_other_link: othlink_Art.length,
            tag_array: tag_array,
            no_of_tags: tag_array.length,
            keyword: keyword,
            keyword_density: keyword_density,
            isKeyPresent_meta: (isKeyPresent_meta ? "yes":"no"),
            isKeyPresent_title: (isKeyPresent_title ? "yes":"no"),
            isKeyPresent_para: (isKeyPresent_para ? "yes":"no"),
            img_array: img_arr,
            no_of_img: img_arr.length,
            isKeyPresent_img: (isKeyPresent_img ? "yes":"no"),
            brokeimg_arr: brokeimg_arr,
            no_of_brokeimg: brokeimg_arr.length,
            broke404_arr: broke404_arr,
            no_of_404: broke404_arr.length,
            author: author_anime
        });
        const result = await crawler.save();
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
        // console.log(topUrl);
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
    const inputUrl = req.body.pageUrl;
    console.log(inputUrl);
    var head = parse_url(inputUrl).resource;
    const sitemapXml = inputUrl + "/sitemap.xml";
    await getCrawler(sitemapXml);
    console.log("html dumped crawl start.");
    await scrapEachPage();
    res.status(200).json({message: "website crawled", name:head});
};

exports.getScrapper = async (req,res,next) => {
    await scrapEachPage();
    res.status(200).json({message: "success"});
};


exports.getData = async (req,res,next) => {
    const data = await Crawler.find();
    res.send(data);
};
