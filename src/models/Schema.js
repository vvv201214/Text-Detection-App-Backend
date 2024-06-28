const mongoose = require("mongoose");


const uploadSchema = new mongoose.Schema({
    image:{
        type: String,
        required: true
    },
    text:{
        type: String,
        // required : true
    },
})


const ImageSchema = mongoose.model("text-detect", uploadSchema);
module.exports = ImageSchema;