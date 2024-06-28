const mongoose = require("mongoose");
const dotenv = require('dotenv');
const path = require("path");
const {googleApiLogin} = require('./services/ocr')

dotenv.config({path: path.resolve(__dirname, '../config.env')});

const app = require('./app');


const dB = process.env.DEV_DB
const PORT = process.env.PORT || 8080;

mongoose.connect(dB).then(()=>{
    console.log('Database Connected!');
});

googleApiLogin().then(()=>{});

const server = app.listen(PORT, ()=>{
    console.log(`Server running at ${PORT}`)
});