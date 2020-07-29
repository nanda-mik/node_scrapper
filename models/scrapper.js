const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crawlSchema = new Schema({
    url:{
        type: String,
        required: true
    },
    lastmod:{
        type: String,
        required: true
    },
    total_words:{
        type: Number,
        required:true
    },
    title:{
        type: String
    },
    title_length:{
        type: Number,
        required:true
    },
    meta:{
        type: String,
        required: true
    },
    meta_length:{
        type: Number,
        required:true
    },
    int_link:{
        type: Array,
        required:true
    },
    int_text:{
        type: Array,
        required: true
    },
    no_int_link:{
        type:Number,
        required:true
    },
    dF_ext_link:{
        type: Array,
        required:true
    },
    no_doF_link:{
        type:Number,
        required:true
    },
    nf_ext_link:{
        type: Array,
        required:true
    },
    no_noF_link:{
        type:Number,
        required:true
    },
    ext_link:{
        type: Array,
        required: true
    },
    ext_text:{
        type: Array,
        required: true
    },
    other_linkArticle:{
        type: Array,
        required:true
    },
    no_other_link:{
        type:Number,
        required:true
    },
    tag_array: {
        type: Array,
        required:true
    },
    no_of_tags:{
        type:Number,
        required:true
    },
    keywordArr:{
        type: Array,
        required: true
    },
    keywordArr_length: {
        type: Number,
        required: true
    },
    keyword_density:{
        type: Number,
        required: true
    },
    isKeyPresent_meta:{
        type: String,
        required: true
    },
    isKeyPresent_title:{
        type: String,
        required: true
    },
    isKeyPresent_para:{
        type: String,
        required: true
    },
    img_array:{
        type: Array,
        required: true
    },
    no_of_img:{
        type:Number,
        required:true
    },
    isKeyPresent_img:{
        type: String,
        required: true
    },
    broken_link:{
        type: Array,
        required: true
    },
    no_of_brokelink:{
        type:Number,
        required:true
    },
    author:{
        type: String
    },
    fb_share:{
        type: Number,
        required: true
    },
    siteId:{
        type: Schema.Types.ObjectId,
        ref: 'websites',
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'users',
        required: true
    },
    htmlPageId:{
        type: Schema.Types.ObjectId,
        ref: 'htmlDump',
        required: true
    }
});

module.exports = mongoose.model('scrapData',crawlSchema);