const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crawlSchema = new Schema({
    url:{
        type: String,
        required: true
    },
    lastmod:{
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('crawl',crawlSchema);