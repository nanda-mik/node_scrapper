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
    title_length:{
        type: Number,
        required:true
    },
    meta_length:{
        type: Number,
        required:true
    },
    int_link:{
        type: Array,
        required:true
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
    keyword:{
        type: String
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
    brokeimg_arr:{
        type: Array,
        required: true
    },
    no_of_brokeimg:{
        type:Number,
        required:true
    },
    author:{
        type: String
    },
    siteId:{
        type:Schema.Types.ObjectId,
        ref: 'Sites',
        required: true
    },
    htmlPageId:{
        type: Schema.Types.ObjectId,
        ref: 'html',
        required: true
    }
});

module.exports = mongoose.model('collection',crawlSchema);