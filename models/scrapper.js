const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crawlSchema = new Schema({
    url:{
        type: String,
        required: true
    },
    title:{
        type: String
    },
    meta_title:{
        type: String
    },
    ext_link:{
        type: Number
    },
    int_link:{
        type: Number
    },
    img_alt:{
        type: String
    },
    url_bunch:{
        type: Array
    }
});

module.exports = mongoose.model('collection',crawlSchema);