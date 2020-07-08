const express = require('express');
const router = express.Router();

const scrapController = require('../controller/scrapeController'); 


router.post('/addScrapper', scrapController.postScrapper);

router.get('/getScrapper', scrapController.getScrapper);

// router.post('/postdumpPage',scrapController.postdumpPage);

// router.get('/getdump',scrapController.getfromDump);
module.exports = router;