const request = require('request-promise');
const cheerio = require('cheerio');
const urlPack = require('url');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const puppeteer = require('puppeteer');
const parse_url = require('parse-url');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const json2csv = require('json2csv').Parser;
const isImage = require('is-image');
const ke = require('keyword-extractor');

(async () => {
    const html = await request('https://startuptalky.com');
    const $ = cheerio.load(html);
    
    console.log($.html());
});

const isRelativeUrl = require("is-relative-url");
const e = require('express');
const { cookie } = require('request-promise');

let brokenLinks = [];

async function getAllLinks(url) {
  try {
    let result = await axios.get(url);
    $ = cheerio.load(result.data);
    links = [];
    $("article a").each((i, link) => {
      links.push(link);
    });
    return links;
  } catch (err) {
    console.log(err);
  }
}

// async function crawlPage(url) {
//   let links = await getAllLinks(url);
//   console.log("entered");
//   var broke_arr =[];
//   for (let link of links) {
//     try {
//       if (isRelativeUrl($(link).attr("href"))) {
//         resp = await axios.get(url + $(link).attr("href"));
//       } else {
//         resp = await axios.get($(link).attr("href"));
//       }
//     } catch (err) {
//       broke_arr.push(link);
//     }
//   }
//   console.log(broke_arr);
// }

async function crawlPage(url) {
  var broke_arr =[];
    try {
      if (isRelativeUrl(url)) {
        resp = await axios.get("https://startuptalky.com/"+url);
      } else {
        resp = await axios.get(url);
      }
    } catch (err) {
      broke_arr.push(url);
    }
  console.log(broke_arr);
}


// crawlPage("https://startuptalky.com/attainu-sutory/");


function wordFreq(str){
    var words = str.split(' ');
    var freqMap = {};
    words.forEach(el => {
        if(!freqMap[el]){
            freqMap[el]=0;
        }
        freqMap[el]+=1;
    });
    return freqMap;
}

(async () => {
    const html = await request('https://startuptalky.com/privacy-policy/');
    const $ = cheerio.load(html);
    var str = $('.main-content-area').text().replace(/\s\s+/g, ' ');
    console.log(str);
    var n = str.split(' ').length;
    console.log(n);
    // const freq = wordFreq(str);
    // console.log(freq);
});


//link related functions..
(async () => {
  const html = await request('https://startuptalky.com/facebook-ads-dropshipping-business/');
  const $ = cheerio.load(html);
  const baseUrl = 'https://startuptalky.com';
  var links = $('.main-content-area a');
  var doFext_link = [];
  var noFext_link = [];
  var int_link = [];
  var int= 0,d_ext=0,n_ext=0;
  for(let i=0;i<links.length;i++){
      var x = $(links[i]).attr('href');
      var rel = $(links[i]).attr('rel');
      console.log(rel);
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
        if(typeof(z) === 'nofollow'){
          n_ext++;
          noFext_link.push(x);
        }else{
          d_ext++;
          doFext_link.push(x);
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


  var tag_articles = $('.post-tags a');
  var tag_array =[];
  var no_of_tagArt = tag_articles.length;
  for(let i=0;i<tag_articles.length;i++){
    var tagLink = $(tag_articles[i]).attr('href');
    var abc = urlPack.resolve(baseUrl,tagLink);
    tag_array.push(abc);
  }

  // console.log(no_of_tagArt,":  ",tag_array);

  // console.log(int,":  ",int_link);
  // console.log(d_ext,":  ",doFext_link);
  // console.log(n_ext,":  ",noFext_link);
  // console.log(otA,":  ",othlink_Art);
});

const fun = async (el) => {
  const res = await axios.get('https://www.wikipedia.org/');
  //   console.log(res);
  console.log(Date.now(), ' fun', el);
};
// console.log(Date.now(), ' 1');
// fun();
// console.log(Date.now(), ' 2');

const fun2 = async () => {
  //   await fun();
  const arr = [1, 2, 3];
  for (let i = 0; i < 3; i++) {
    await fun(i);
    console.log(Date.now(), arr[i]);
  }
  console.log(Date.now(), 'before');
  //   arr.forEach((el) => {
  //     fun();
  //     console.log(Date.now(), el);
  //   });
  //   console.log(Date.now(), 'after');
  //   fun().then((res) => {
  //     // console.log()
  //     console.log(Date.now(), ' fun2');
  //   });
};

// fun2();



(async () =>{
  var path = parse_url('https://startuptalky.com/author/krishna/').pathname;
  console.log(path);
});


(async () => {
  const arr= [
    'https://startuptalky.com/',
    'https://startuptalky.com/elzabot-success-story/',
    'https://startuptalky.com/author/jeenal/',
    'https://startuptalky.com/tag/refurbished-goods-platform/'
  ];
  const html = await request('https://startuptalky.com/facebook-ads-dropshipping-business/');
  const $ = cheerio.load(html);
  const post = $('.post-content');
  const para = $('.post-content p');
  var first_para = $(para[0]).text().trim();

  var keyword;
  if(post === ''){
    keyword='';
  }else{
    var str = post.text().trim();
    // console.log(str);
    var words = str.split(' ');
    var arr2 =[];
    for(let i=0;i<words.length;i++){
      arr2[i] = words[i]+" "+words[i+1];
    }
    var freqMap = {};
    for(let i=0;i<arr2.length;i++){
        if(!freqMap[arr2[i]]){
          freqMap[arr2[i]]=0;
        }
        freqMap[arr2[i]]+=1;
    }
    // console.log(freqMap);
    const sortedMap = Object.keys(freqMap).sort((a,b) => {return freqMap[b]-freqMap[a]});
    const filterMap = sortedMap.filter(el => {
      return !(el.includes('the') || el.includes('you') || el.includes('of') || el.includes('to')
      || el.includes('in') || el.includes('for') || el.includes('is') || el.includes('are')||el.includes('-')||el.length < 5)
    });
    const sliceMap = filterMap.slice(0,20);
    keyword = sliceMap[0];
    // console.log(sliceMap);
  }
  const meta = $('title').text();
  const title = $('.post-head .title').text();
  var isKeyPresent_meta = meta.includes(keyword);
  var isKeyPresent_title = title.includes(keyword);
  var isKeyPresent_para = first_para.includes(keyword);
  console.log(keyword);
  console.log(meta,'\n',isKeyPresent_meta);
  console.log(title,'\n',isKeyPresent_title);
  console.log(first_para,'\n',isKeyPresent_para);
});

(async () => {
  const html = await request('https://startuptalky.com/tag/');
  const $ = cheerio.load(html);
  // const images = $('.post-content img');
  // // var first_para = $(post[0]).text();
  // // console.log(first_para);
  // images.each((i,el)=>{
  //   var rel= $(el).attr('alt');
  //   var src = $(el).attr('src')
  //   // if(!(typeof(rel) === "undefined")){}
  //   if(isImage("abcd.jpg")){
  //     console.log(src+ ":   "+ rel);
  //   }
  // })
  const post = $('.post-content').text();
  console.log(typeof(post));
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

  console.log(keyword);

})();


