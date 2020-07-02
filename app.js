const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const scrapRoutes = require('./routes/scrapperRoutes');
const { model } = require('mongoose');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(scrapRoutes);

mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser: true
    })
    .then(res => {
        console.log("connected");
        app.listen(3000);
    })
    .catch(err => console.log(err));