
const UploadedSchema = require('../models/Schema');
const { BlockBlobClient } = require("@azure/storage-blob");
const {createPdfFromUrl} = require('./uploadHelper');
const {ocrMain} = require('../services/ocr');
const multer = require("multer");

let getStream;
(async () => {
  getStream = (await import("into-stream")).default;
})();


const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single("file");

const getBlobName = (originalName) => {
  const identifier = Math.random().toString().replace(/0\./, ""); // remove "0." from start of string
  return `${identifier}-${originalName}`;
};

const uploadFileToAzure = async (file) => {
  try{
    const blobName = getBlobName(file.originalname);
  
    const blobService = new BlockBlobClient(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
      process.env.CONTAINER_NAME,
      blobName
    );
  
    const stream = getStream(file.buffer);
    const streamLength = file.buffer.length;
  
    await blobService.uploadStream(stream, streamLength);
  
    const fileUrl = `${blobService.url}`;
  
    return { fileUrl, blobName };
  
  } catch(err){
    console.log(err)
  }
};

exports.uploadMulter = uploadStrategy;

exports.uploadImage = (async (req, res, next) => {
  try {
    const data = await uploadFileToAzure(req.file);

    // create pdf from image
    await createPdfFromUrl(data?.fileUrl);

    //extract text from document
    const text = await ocrMain();

    //save in the database
    const save = await UploadedSchema.create({
      image: data?.fileUrl,
      text: text?.htmlParagraph,
      boldWords: text?.boldParagraph
    })
    res.status(200).json({data: save, message: 'success'});
  } catch (error) {
    console.log(error)
    res.status(500).json({data: 'Error uploading image', error});
  }
});

exports.getData = (async(req, res) => {
  const data = await UploadedSchema.find().sort({_id: -1});
  res.status(200).json({status:'Success', results: data.length, data: data});
});
