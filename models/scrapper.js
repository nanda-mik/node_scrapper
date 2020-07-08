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
    },
    pageSpeed:{
        type: String,
        required: true
    },
    total_words:{
        type: Number,
        required:true
    },
    title_length:{
        type: Number,
        required:true
    },
    meta_length:{
        type: Number,
        required:true
    }
});

module.exports = mongoose.model('collection',crawlSchema);