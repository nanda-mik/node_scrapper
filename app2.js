const request = require('request-promise');
const cheerio = require('cheerio');
const urlPack = require('url');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const parse_url = require('parse-url');
const { parse } = require('querystring');
const { url } = require('inspector');
const { set } = require('mongoose');
const { resolve } = require('path');

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
        const result = {
            url: url,
            title: title,
            meta_title: meta,
            ext_link:ext,
            int_link:int,
            alt_txt: img_txt
        };
        resolve(result);
    })
}

async function getCrawler(url) {
    return new Promise(async (resolve, reject)=>{
        const res = await request(url);
        parser.parseString(res,(err,result)=> {
        if(result.urlset){
            const urls = result.urlset.url;
            var topUrl = urls.slice(0,5);
            topUrl.forEach(async (el) => {
                var singleUrl = el.loc[0];
                const data = await getScrapper(singleUrl);
                resolve(data);
            })
        }else{
            const xmls = result.sitemapindex.sitemap;
            xmls.forEach(async (el) => {
                var x = el.loc[0];
                const res = await getCrawler(x);
                resolve(res);
            })
        }
    });
    }) 
}

(async () => {
    const res = await getCrawler('https://startuptalky.com/sitemap.xml');
    console.log(res);
})();
// (async () => {

//     // const res = await request('https://internshala.com/sitemap-main.xml');
//     // console.log(res);

//     const baseUrl = 'https://startuptalky.com';
//     const html = await request('https://startuptalky.com/author/yash/');
//     const $ = cheerio.load(html);

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
//         // urlset.forEach(el => {
//         //     if(parse_url(el).resource == 'startuptalky.com'){   
//         //         int++;
//         //     }else{
//         //         ext++;
//         //     }
//         // });

//         console.log(urlset,'\n',int,'\n',ext);

//     // meta title
//     console.log($("title").text());

//     //post title
//     console.log("--------------------------------",'\n');
//     const title = $('.post-head .title').text();
//     console.log(title);

//     // //h2 in the pages
//     // console.log("---------------------------------",'\n',"Headings",'\n');
//     // $("h2").each((i,el) => {
//     //     console.log($(el).text(),'\n');
//     // });

//     // console.log("-_------------_",'\n');
//     // const img_text = $('article img').attr('alt');
//     // console.log(img_text);

//     // urls inside the posts
//     // console.log("-----------------------------------",'\n',"links in the pages",'\n');
//     // $('.post-content a').each((i,el) => {
//     //     console.log($(el).attr('href'),'\n');
//     // });

//     // //tags in the post
//     // console.log("------------------------------------",'\n',"Tag links in the post",'\n');
//     // $('.post-tags a').each((i,el)=>{
//     //     const url = resolve(baseUrl, $(el).attr('href'));
//     //     console.log($(el).text() +" : "+ url,'\n');
//     // })

// })();

/* to scrap.......
    title,
    keyword in title,
    meta desc,
    keyword in meta,
    external url,
    internal url,
    image al text
*/