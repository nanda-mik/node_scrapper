const cheerio = require('cheerio');
const ScrapData = require('../models/scrapper');
const htmlDump = require('../models/htmlPages');


exports.getData = async (req, res, next) => {
    const id = req.params.id;
    const data = await ScrapData.find({ siteId: id }).lean();
    res.send(data);
};

exports.editKey = async (req, res, next) => {
    const id = req.params.id;
    const keyword = req.body.keyword;
    const data = await ScrapData.findById(id);
    const htmlPageId = data.htmlPageId;
    const page = await htmlDump.findById(htmlPageId).lean();
    const $ = cheerio.load(page.html);
    console.log(keyword);
    var bool;
    var content;
    if ($('.container').text() !== "") {
        content = $('.container').text().replace(/\s\s+/g, ' ');
        if (typeof content !== "undefined") {
            bool = content.includes(keyword);
        }
    } else if ($('#content').text() !== "") {
        content = $('#content').text().replace(/\s\s+/g, ' ');
        if (typeof content !== "undefined") {
            bool = content.includes(keyword);
        }
    } else {
        content = $('body').text().replace(/\s\s+/g, ' ');
        if (typeof content !== "undefined") {
            bool = content.toLowerCase().includes(keyword.toLowerCase());
        }
    }


     //meta and post title
     const meta = $('head title').text().toLowerCase();

     //title
     var title = "";
     if($('.post-head .title').text() !== ""){
         title = $('.post-head .title').text();
     }else if($('.heading_title').text() !== ""){
         title = $('.heading_title').text();
     }else{
         title = $('h1').text().toLowerCase(); 
     }

    //isKeywordPresent
    var isKeyPresent_meta = false,
        isKeyPresent_para = false,
        isKeyPresent_title = false;

    var para;
    if ($('.container').text() !== "") {
        para = $('.container p');
        if (typeof para !== "undefined") {
            var first_para = $(para[0]).text().trim();
            isKeyPresent_para = first_para.includes(keyword);
        }
    } else if ($('#content').text() !== "") {
        para = $('#content p');
        if (typeof para !== "undefined") {
            var first_para = $(para[0]).text().trim();
            isKeyPresent_para = first_para.includes(keyword);
        }
    } else {
        para = $('body p');
        if (typeof para !== "undefined") {
            var first_para = $(para[0]).text().trim();
            isKeyPresent_para = first_para.includes(keyword);
        }
    }


    if (typeof keyword !== "undefined" || keyword !== "") {
        isKeyPresent_meta = meta.includes(keyword);
        isKeyPresent_title = title.includes(keyword);
    }

    if (bool) {
        data.keyword = keyword;
        data.isKeyPresent_meta = (isKeyPresent_meta)?"yes":"no";
        data.isKeyPresent_para = (isKeyPresent_para)?"yes":"no";
        data.isKeyPresent_title = (isKeyPresent_title)?"yes":"no";
        await data.save();
        res.send("seuccess editing");
    } else {
        res.send("denied");
    }
}