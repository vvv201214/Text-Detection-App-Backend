const mongoose = require("mongoose");
const dotenv = require('dotenv');
const path = require("path");
const {googleApiLogin} = require('./src/services/ocr')

dotenv.config({path: path.resolve(__dirname, './config.env')});

const app = require('./src/app');


const dB = process.env.DEV_DB
const PORT = process.env.PORT || 8080;

mongoose.connect(dB).then(()=>{
    console.log('Database Connected!');
});

googleApiLogin().then(()=>{});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });