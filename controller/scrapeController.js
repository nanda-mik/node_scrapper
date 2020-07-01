const request = require('request-promise');
const xml2js = require('xml2js');
const cheerio = require('cheerio');
const parser = new xml2js.Parser();

function getCrawler(xml,st,en){
    request(xml)
    .then(result => {
        parser.parseString(result, (err, res) => {
        //    console.log(res);
            var urls = res.urlset.url;
            // console.log(urls);
            urls.forEach(async (el)=> {
                var url = el.loc[0];
                var date = el.lastmod[0];
                var start = new Date(st);
                var end = new Date(en);
                var urlDate = new Date(date);
                if(urlDate<end && urlDate>start){
                    const html = await request.get(url);
                    const $ = cheerio.load(html);
                    $("h2").each((i,element) => {
                        console.log("Url: "+url)
                        console.log("H2: "+$(element).text());
                    });
                    // console.log(url);
                }
            });
        })
    })
    .catch(err => console.log(err));
}

exports.getMainpage = (req, res, next) =>{
    res.render('main');
};

exports.getData = async (req,res,next) => {
    const weburl = req.body.url;
    const start = req.body.stdate;
    const end = req.body.endate;

    const sitemapXml = weburl + "sitemap.xml";
    var result = await request(sitemapXml);
    parser.parseString(result, (err,xmls)=> {
        var xmlUrls = xmls.sitemapindex.sitemap;
        xmlUrls.forEach(el => {
            var xml = el.loc[0];
            var date = el.lastmod[0];
            var st= new Date(start);
            var en = new Date(end);
            var xmlDate = new Date(date);
            //now only we are logging the h2 from the url and not using database.
            if(xmlDate>st && xmlDate<en){
                getCrawler(xml,start,end);
            }
        });
    });
};