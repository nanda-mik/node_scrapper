const xml2js = require('xml2js');
const cheerio = require('cheerio');
const parser = new xml2js.Parser();
const parse_url = require('parse-url');
const urlPack = require('url');
const ke = require('keyword-extractor');
const fse = require('fs-extra');
const isImage = require('is-image');
const isRelativeUrl = require("is-relative-url");
const axios = require('axios');
const fs = require('fs');
const Site = require('../models/site');
const htmlDump = require('../models/htmlPages');
const ScrapData = require('../models/scrapper');
const User = require('../models/user');
var retext = require('retext');
var pos = require('retext-pos');
var keywords = require('retext-keywords');
var toString = require('nlcst-to-string');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const { json } = require('body-parser');
dotenv.config();

const getKeyphrase = async (content) => {
    var arr = [];
    retext()
        .use(pos)
        .use(keywords)
        .process(content, (err, file) => {
            if (err)
                throw err;
            // console.log('Keywords:')
            // file.data.keywords.forEach(function (keyword) {
            //     console.log(toString(keyword.matches[0].node))
            // })
            file.data.keyphrases.forEach((phrase) => {
                arr.push(phrase.matches[0].nodes.map(stringify).join(''))
                function stringify(value) {
                    return toString(value)
                }
            })
        });
    var max = 0;
    var keyword = arr[0];
    for (let i = 0; i < arr.length; i++) {
        let no_wrd = arr[i].split(" ").length;
        if (no_wrd > max && no_wrd < 5) {
            max = no_wrd;
            keyword = arr[i];
        }
    }

    return keyword;
}

const getMainArea = async (html) => {
    const $ = cheerio.load(html);
    var str;
    if ($("main").text().length !== 0) {
        if ($("main article").text().length !== 0)
            str = "main article";
        else
            str = "main";
    } else if ($("article").text().length !== 0) {
        str = "article";
    } else if ($("#content").text().length !== 0) {
        str = "#content";
    } else if ($(".card-content").text().length !== 0) {
        str = ".card-content";
    } else if ($(".main-article").text().length !== 0) {
        str = ".main-article";
    } else {
        str = "body";
    }
    return str;
}

const checkBroken = async (arr) => {
    var broken_link = [];
    for (let i = 0; i < arr.length; i++) {
        try {
            await fetch(arr[i]);
            console.log("hip hip");
        } catch (err) {
            console.log("error" + arr[i]);
            broken_link.push(arr[i]);
        }
    }
    return broken_link;
}

const scrapEachPage = async (id, userId) => {
    try {
        const htmlpages = await htmlDump.find({ siteId: id }).lean();
        console.log(htmlpages.length);
        for (let i = 0; i < htmlpages.length; i++) {
            const lastmod = htmlpages[i].lastmod;
            const htmlPageId = htmlpages[i]._id;
            const url = htmlpages[i].url;
            console.log(url);
            const baseUrl = parse_url(url).resource;
            var data = fs.readFileSync('htmlDump/' + htmlPageId + '.txt');
            const html = data.toString();
            const $ = cheerio.load(html);
            var area = await getMainArea(html);
            //meta and post title
            var meta = $('head title').text();
            if (typeof meta === "undefined" || meta.length === 0)
                meta = " ";

            //fb share count
            var fb_access_token = process.env.fb_access_token;
            const api = `https://graph.facebook.com/?id=${url}&fields=engagement&access_token=${fb_access_token}`;
            var share_no = 0;
            var resu = await fetch(api);
            var json_result = await resu.json();
            share_no = json_result.engagement.share_count;

            //title
            var title_area = $(area + " h1");
            var title = " ";
            if ($(title_area).text().length > 1)
                title = $(title_area[0]).text();
            else
                title = $(title_area).text();


            //author
            var author_anime = "";
            if ($('.post-meta .author').text().length !== 0) {
                author_anime = $('.post-meta .author').text().trim();
            } else if ($('.post-meta .author-name').text().length !== 0) {
                author_anime = $('.post-meta .author-name').text().trim();
            } else if ($('.author-box-title').text().length !== 0) {
                author_anime = $('.author-box-title').text().trim();
            }

            //total words and keyword
            var content = " ";
            var keyword = " ";
            var n_words = 0;
            var keywordArr = [];
            var keyword_density = 0;
            content = $(area).text().replace(/\s\s+/g, ' ');
            if (typeof content !== "undefined") {
                n_words = content.split(' ').length;
                keyword = await getKeyphrase(content);
            }

            keywordArr[0] = keyword;

            //keyword density
            if (typeof keyword === "undefined" || n_words === 0)
                keyword_density = 0;
            else {
                var density = (((keyword.length) / (n_words)) * 100);
                keyword_density = density.toFixed(2);
            }

            //isKeywordPresent
            var isKeyPresent_meta = false,
                isKeyPresent_para = false,
                isKeyPresent_title = false;

            var para;
            para = $(area + ' p');
            if (typeof para !== "undefined") {
                var first_para = $(para[0]).text().trim();
                if (first_para.length !== 0)
                    isKeyPresent_para = first_para.toLowerCase().includes(keyword.toLowerCase());
            }

            if (typeof keyword !== "undefined" && keyword.length !== 0) {
                if (meta.length !== 0 && title.length !== 0) {
                    isKeyPresent_meta = meta.toLowerCase().includes(keyword.toLowerCase());
                    isKeyPresent_title = title.toLowerCase().includes(keyword.toLowerCase());
                }
            }

            //internal link, external link
            var doFext_link = [];
            var noFext_link = [];
            var broken_link = [];
            var int_link = [];
            var int_text = [];
            var ext_text = [];
            if ($(area).text().length !== 0) {
                const links = $(area + ' a');
                console.log(baseUrl);
                if (typeof links !== "undefined") {
                    for (let i = 0; i < links.length; i++) {
                        var x = $(links[i]).attr('href');
                        // console.log(x);
                        var y = $(links[i]).text().trim();
                        if (typeof x !== "undefined") {
                            if (x.length !== 0) {
                                var resource = parse_url(x).resource;
                                if (resource.length === 0) {
                                    x = "https://" + baseUrl + x;
                                }
                                if (parse_url(x).resource.includes(baseUrl)) {
                                    if (!int_link.includes(x)) {
                                        int_link.push(x);
                                        int_text.push(y);
                                    }
                                } else {
                                    if (!parse_url(x).resource.includes("facebook.com") && !parse_url(x).resource.includes("twitter.com") && !parse_url(x).resource.includes("pinterest.com") && !parse_url(x).resource.includes("linkedin.com")) {
                                        var z = $(links[i]).attr('rel');
                                        if (typeof z !== "undefined") {
                                            if (z.includes('nofollow')) {
                                                if (!noFext_link.includes(x)) {
                                                    noFext_link.push(x);
                                                }
                                            } else {
                                                if (!doFext_link.includes(x)) {
                                                    doFext_link.push(x);
                                                }
                                            }
                                        } else {
                                            if (!doFext_link.includes(x)) {
                                                doFext_link.push(x);
                                            }
                                        }
                                        ext_text.push(y);
                                    }

                                }
                            }
                        }
                    }
                }
            }

            //check broken links
            var ext_link = doFext_link.concat(noFext_link);
            if (ext_link.length < 30)
                broken_link = await checkBroken(ext_link);

            //other linking articles
            var othlink_Art = [];
            for (let i = 0; i < int_link.length; i++) {
                let path = parse_url(int_link[i]).pathname;
                var bool = (path.includes("/tag") || path.includes("/author"));
                if (!bool) {
                    othlink_Art.push(int_link[i]);
                }
            }

            //no of tags
            var tag_array = [];
            if ($('.post-tags').text() !== "") {
                var tag_articles = $('.post-tags a');
                for (let i = 0; i < tag_articles.length; i++) {
                    var tagLink = $(tag_articles[i]).attr('href');
                    var abc = "https://" + baseUrl + tagLink;
                    tag_array.push(abc);
                }
            }

            //images alt name
            var img_arr = [];
            var isKeyPresent_img = false;
            if ($(area).text() !== "") {
                const images = $(area + ' img');
                images.each((i, el) => {
                    var rel = $(el).attr('alt');
                    var src = $(el).attr('src');
                    if (typeof src !== "undefined") {
                        img_arr.push(src);
                        if (typeof rel !== "undefined") {
                            if (!rel.includes(keyword))
                                isKeyPresent_img = false;
                            else
                                isKeyPresent_img = true;
                        }
                    }
                })
            }

            //result to save in db
            const scrapData = new ScrapData({
                url: url,
                lastmod: lastmod,
                total_words: n_words,
                title: title,
                title_length: title.length,
                meta: meta,
                meta_length: meta.length,
                int_link: int_link,
                int_text: int_text,
                no_int_link: int_link.length,
                dF_ext_link: doFext_link,
                no_doF_link: doFext_link.length,
                nf_ext_link: noFext_link,
                no_noF_link: noFext_link.length,
                ext_link: ext_link,
                ext_text: ext_text,
                other_linkArticle: othlink_Art,
                no_other_link: othlink_Art.length,
                tag_array: tag_array,
                no_of_tags: tag_array.length,
                keywordArr: keywordArr,
                keywordArr_length: keywordArr.length,
                keyword_density: keyword_density,
                isKeyPresent_meta: (isKeyPresent_meta ? "yes" : "no"),
                isKeyPresent_title: (isKeyPresent_title ? "yes" : "no"),
                isKeyPresent_para: (isKeyPresent_para ? "yes" : "no"),
                img_array: img_arr,
                no_of_img: img_arr.length,
                isKeyPresent_img: (isKeyPresent_img ? "yes" : "no"),
                broken_link: broken_link,
                no_of_brokelink: broken_link.length,
                author: author_anime,
                fb_share: share_no,
                siteId: id,
                userId: userId,
                htmlPageId: htmlPageId
            });
            // console.log(crawler);
            const result = await scrapData.save();
            console.log(result._id);
        } 
    }catch (err) {
        console.log(err);
    }
}

const htmlDumpfunction = async (url, lastmod, id) => {
    try {
        const res = await fetch(url);
        const html = await res.text();
        if (html.length !== 0) {
            const htmldump = new htmlDump({
                url: url,
                lastmod: lastmod,
                siteId: id
            });
            await htmldump.save();
            const htmlData = await htmlDump.find().sort({ _id: -1 }).limit(1);
            console.log(htmlData[0]._id);
            var str = htmlData[0]._id;
            await fse.outputFile('htmlDump/' + str + '.txt', html);
            console.log("saved");
        }
    } catch (err) {
        console.log(err);
    }
}

async function getCrawler(url, id) {
    try {
        const resu = await fetch(url);
        const res = await resu.text();
        const result = await parser.parseStringPromise(res);
        const siteId = id;
        if (result.urlset) {
            const urls = result.urlset.url;
            if (urls) {
                const topUrl = urls.slice(0, 15);
                for (let i = 0; i < topUrl.length; i++) {
                    var singleUrl = topUrl[i].loc[0];
                    if (topUrl[i].lastmod) {
                        var lastmod = topUrl[i].lastmod[0];
                        var path = parse_url(singleUrl).pathname;
                        console.log(path);
                        if (!path.includes("/tag")) {
                            await htmlDumpfunction(singleUrl, lastmod, siteId);
                        } else {
                            console.log("not to be dumped");
                        }
                    } else if (topUrl[i].changefreq) {
                        var changefreq = urls[i].changefreq[0];
                        var path = parse_url(singleUrl).pathname;
                        console.log(path);
                        await htmlDumpfunction(singleUrl, changefreq, siteId);
                    } else {
                        var path = parse_url(singleUrl).pathname;
                        console.log(path);
                        await htmlDumpfunction(singleUrl, "not found", siteId);
                    }
                }
            }
        } else {
            const xmls = result.sitemapindex.sitemap;
            var topXmls = xmls.slice(0, 4);
            for (let i = 0; i < topXmls.length; i++) {
                var x = topXmls[i].loc[0];
                console.log("xml: " + x);
                await getCrawler(x, siteId);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

exports.postScrapper = async (req, res, next) => {
    const inputUrl = req.body.pageUrl;
    const userId = req.body.userId;
    console.log(inputUrl);
    var head = parse_url(inputUrl).resource;
    const sitePresent = await Site.findOne({ link: inputUrl });
    console.log(sitePresent);
    if (sitePresent) {
        var id = sitePresent._id;
        res.status(200).json({ message: "website under crawl visit after some time", name: head });
        await scrapEachPage(id, userId);
        console.log("scraped and stored");
        const user = await User.findById(userId);
        user.sites.push(id);
        await user.save();
        console.log("sites added to the user");
    } else {
        const sitemapXml = inputUrl + "sitemap.xml";
        console.log(sitemapXml);
        fetch(sitemapXml)
            .then(async resu => {
                // console.log(resu);
                const site = new Site({
                    link: inputUrl
                });
                var result = await site.save();
                var siteId = result._id;
                console.log("site saved");
                res.status(200).json({ message: "website under crawl visit after some time", name: head });
                await getCrawler(sitemapXml, siteId);
                console.log("html dumped");
                await scrapEachPage(siteId, userId);
                console.log("scraped and stored");
                const user = await User.findById(userId);
                user.sites.push(siteId);
                await user.save();
                console.log("sites added to the user");
            })
            .catch(err => {
                if (!err.statusCode)
                    err.statusCode = 422;
                err.message = "sitemap.xml not found for the given url!"
                next(err);
            });
    }
};
