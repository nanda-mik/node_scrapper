const express = require('express');
const router = express.Router();

const scrapController = require('../controller/scrapeController'); 
const dataController = require('../controller/dataController');
const siteController = require('../controller/sitesController');

router.post('/api/addScrapper', scrapController.postScrapper);

router.post('/api/editKey/:id',dataController.editKey);
router.get('/api/getData/:id', dataController.getData);

router.get('/api/getScrapper', siteController.getScrapper);

module.exports = router;