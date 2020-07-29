const express = require('express');
const router = express.Router();

const scrapController = require('../controller/scrapeController'); 
const dataController = require('../controller/dataController');
const siteController = require('../controller/sitesController');

router.post('/api/addScrapper', scrapController.postScrapper);

router.post('/api/editKey/:id',dataController.editKey);
router.post('/api/getData/:id', dataController.getData);

router.post('/api/getSites', siteController.getSites);

module.exports = router;