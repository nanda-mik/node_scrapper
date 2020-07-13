const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const htmlSchema = new Schema({
    url:{
        type:String,
        required:true
    },
    html:{
        type: String,
        required: true
    },
    lastmod:{
        type: String,
        required: true
    },
    siteId:{
        type:Schema.Types.ObjectId,
        ref: 'Sites',
        required: true
    }
});

module.exports = mongoose.model('html',htmlSchema);