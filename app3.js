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


(async () => {
    const html = await request('https://startuptalky.com');
    const $ = cheerio.load(html);
    
    console.log($.html());
});

const isRelativeUrl = require("is-relative-url");

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

async function crawlPage(url) {
  let links = await getAllLinks(url);
  for (let link of links) {
    try {
      let resp = {};
      if (isRelativeUrl($(link).attr("href"))) {
        resp = await axios.get(url + $(link).attr("href"));
      } else {
        resp = await axios.get($(link).attr("href"));
      }
      console.log(
        "Valid Url: " +
          $(link).attr("href") +
          " returned status: " +
          resp.status
      );
    } catch (err) {
      console.log("Not a valid URL: " + $(link).attr("href"));
    }
  }
}

// crawlPage("https://startuptalky.com");


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
})();


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

