const cheerio = require('cheerio');
const ScrapData = require('../models/scrapper');
const htmlDump = require('../models/htmlPages');
const fs = require('fs');

exports.getData = async (req, res, next) => {
    const id = req.params.id;
    const userId = req.body.userId;
    const data = await ScrapData.find({ siteId: id, userId: userId }).lean();
    res.send(data);
};

const getMainArea = async (html) => {
    const $ = cheerio.load(html);
    var str;
    if($("main").text().length !== 0){
        if($("main article").text().length !== 0)
            str = "main article"; 
        else
            str = "main";
    }else if($("article").text().length !== 0){
        str = "article";
    }else if($("#content").text().length !== 0){
        str = "#content";
    }else if($(".card-content").text().length !== 0){
        str = ".card-content";
    }else if($(".main-article").text().length !== 0){
        str = ".main-article";
    }else{
        str = "body";
    }
    return str;
}

exports.editKey = async (req, res, next) => {
    const id = req.params.id;
    const keyword = req.body.keyword;
    const data = await ScrapData.findById(id);
    const htmlPageId = data.htmlPageId;
    var dataP = fs.readFileSync('htmlDump/' + htmlPageId + '.txt');
    const html = dataP.toString();
    const $ = cheerio.load(html);
    console.log(keyword);
    var area = await getMainArea(html);
    var bool;
    var content;
    content = $(area).text().replace(/\s\s+/g, ' ');
    if (typeof content !== "undefined") {
        bool = content.toLowerCase().includes(keyword.toLowerCase());
    }


    //meta and post title
    const meta = $('head title').text().toLowerCase();

    //title
    var title_area = $(area+" h1");
    var title ="";
    if($(title_area).text().length >1)
        title = $(title[0]).text();
    else
        title = $(title).text();


    //isKeywordPresent
    var isKeyPresent_meta = false,
        isKeyPresent_para = false,
        isKeyPresent_title = false;

    var para;
    para = $(area+' p');
    if (typeof para !== "undefined") {
        var first_para = $(para[0]).text().trim();
        isKeyPresent_para = first_para.toLowerCase().includes(keyword);
    }


    if (typeof keyword !== "undefined" || keyword !== "") {
        isKeyPresent_meta = meta.toLowerCase().includes(keyword);
        isKeyPresent_title = title.toLowerCase().includes(keyword);
    }

    if (bool) {
        data.keywordArr.push(keyword);
        data.isKeyPresent_meta = (isKeyPresent_meta) ? "yes" : "no";
        data.isKeyPresent_para = (isKeyPresent_para) ? "yes" : "no";
        data.isKeyPresent_title = (isKeyPresent_title) ? "yes" : "no";
        await data.save();
        res.send("success editing");
    } else {
        res.send("denied");
    }
}