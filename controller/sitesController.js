const Site = require('../models/site');


exports.getScrapper = async (req,res,next) => {
    const result = await Site.find();
    res.status(200).json({message: "success", sites: result});
    // console.log(result[0]._id);
    // const id = result[0]._id;
    // await scrapEachPage(id);
    // res.status(200).json({message: "done"});
};
