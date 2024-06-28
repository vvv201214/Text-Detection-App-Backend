const fs = require('fs');
const axios = require('axios');
const { PDFDocument } = require('pdf-lib');
const path = require('path');


exports.createPdfFromUrl = async(imageUrl) => {
  try {
    // Download the image
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBytes = response.data;

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Embed the image into the document
    const image = await pdfDoc.embedPng(imageBytes);

    // Get the dimensions of the image
    const { width, height } = image.scale(1);

    // Add a page to the document
    const page = pdfDoc.addPage([width, height]);

    // Draw the image on the page
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: width,
      height: height,
    });

    const pdfBytes = await pdfDoc.save();

    const outputPath = path.join(__dirname, '../pdfFiles', 'output.pdf');
    fs.writeFileSync(outputPath, pdfBytes);
  } catch (error) {
    console.error('Error creating PDF:', error);
  }
}
// const imageUrl = 'https://stagingdmt.blob.core.windows.net/dmt-trade/5677687213105405-Screenshot%202024-06-26%20075753.png';
