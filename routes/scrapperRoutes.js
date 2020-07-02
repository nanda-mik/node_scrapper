const express = require('express');
const router = express.Router();

const scrapController = require('../controller/scrapeController'); 

router.get('/', scrapController.getMainpage);

router.post('/getScrapper', scrapController.getScrapper);
router.post('/getData',scrapController.getData);

module.exports = router;