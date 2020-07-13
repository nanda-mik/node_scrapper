const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const siteSchema = new Schema({
    link:{
        type: String,
        required: true
    }
},{timestamps: true});

module.exports = mongoose.model('Sites',siteSchema);