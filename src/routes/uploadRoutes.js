const express = require('express');
const {uploadMulter, uploadImage} = require('../controllers/uploadController');

const router = express.Router();


router
  .route("/")
  .post(uploadMulter, uploadImage);

module.exports = router;