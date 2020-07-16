const express = require('express');
const router = express.Router();

const scrapController = require('../controller/scrapeController'); 


router.post('/api/addScrapper', scrapController.postScrapper);

router.get('/api/getScrapper', scrapController.getScrapper);

router.get('/api/getData/:id', scrapController.getData);

// router.post('/postdumpPage',scrapController.postdumpPage);

// router.get('/getdump',scrapController.getfromDump);
module.exports = router;
