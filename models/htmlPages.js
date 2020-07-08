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
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('html',htmlSchema);