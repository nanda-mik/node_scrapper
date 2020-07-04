const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const scrapRoutes = require('./routes/scrapperRoutes');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    next();
})

app.use(scrapRoutes);

mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser: true
    })
    .then(res => {
        console.log("connected");
        app.listen(8080);
    })
    .catch(err => console.log(err));