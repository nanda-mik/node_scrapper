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
const json2csv = require('json2csv').Parser;


(async () => {
    const html = await request('https://startuptalky.com');
    const $ = cheerio.load(html);
    
    console.log($.html());
});

const axios = require("axios");
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
    const html = await request('https://startuptalky.com/dog-walker-facts/');
    const $ = cheerio.load(html);
    var str = $('.post-content').text().replace(/\s\s+/g, ' ');
    str.replace(/[.]/g,'');
    console.log(str);
    var n = str.split(' ').length;
    // console.log(n);
    const freq = wordFreq(str);
    console.log(freq);
})();