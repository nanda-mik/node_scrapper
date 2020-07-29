const Site = require('../models/site');
const User = require('../models/user');


exports.getScrapper = async (req, res, next) => {
    const result = await Site.find();
    res.status(200).json({ message: "success", sites: result });
    // console.log(result[0]._id);
    // const id = result[0]._id;
    // await scrapEachPage(id);
    // res.status(200).json({message: "done"});
};

exports.getSites = async (req, res, next) => {
    var userId = req.body.userId;
    console.log(userId);
    var result = await User.findById(userId);
    console.log(result.sites);
    var array = [];
    if (result.sites) {
        var sitesArr = result.sites;
        console.log(sitesArr);
        if (sitesArr.length > 0) {
            for (let i = 0; i < sitesArr.length; i++) {
                var siteLink = await Site.findById(sitesArr[i]);
                array.push({
                    _id: sitesArr[i],
                    link: siteLink.link
                });
            }
        }
    }
    console.log(array);
    res.status(200).json({ message: "success", sites: array });
};
