const fs = require('fs').promises;
const {DocumentProcessorServiceClient} = require('@google-cloud/documentai').v1;
const path = require('path');
const filePath = path.join(__dirname, '../pdfFiles', 'output.pdf');


let client;
exports.googleApiLogin = async()=>{
    const CONFIGX = {
        credentials: {
            private_key: process.env.PRIVATE_KEY,
            client_email: process.env.CLIENT_EMAIL,
        },
        apiEndpoint: process.env.API_ENDPOINT
    }
    client = new DocumentProcessorServiceClient(CONFIGX);
}

const arr = [];
async function quickstart() {
    const imageFile = await fs.readFile(filePath);
    const name = `projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION}/processors/${process.env.PROCESSOR_ID}`;
    const encodedImage = Buffer.from(imageFile).toString('base64');

    console.log('case1')
    const request = {
        name,
        rawDocument: {
            content: encodedImage,
            mimeType: 'application/pdf',
        },
        "processOptions": {
            "ocrConfig": {
                "premiumFeatures": {
                  "computeStyleInfo": true
                }
            }
          }
    };

    console.log('case2', request, client)
    // Recognizes text entities in the PDF document
    const [result] = await client.processDocument(request);
    const { document } = result;
    console.log('case3')
    // Get all of the document text as one big string
    const { text, pages } = document;

    // Extract shards from the text field
    const getText = textAnchor => {
        if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
            return '';
        }

        // First shard in document doesn't have startIndex property
        const startIndex = textAnchor.textSegments[0].startIndex || 0;
        const endIndex = textAnchor.textSegments[0].endIndex;

        return text.substring(startIndex, endIndex);
    };
    console.log('case4')
    // Read the text recognition output from the processor

    let string = '';
    
    for (const paragraph of pages?.[0]?.tokens) {
        const paragraphText = getText(paragraph.layout.textAnchor);
        arr.push({
            text : paragraphText,
            bold: paragraph.styleInfo.bold,
            italic: paragraph.styleInfo.italic,
            underlined: paragraph.styleInfo.underlined,
            strikeout: paragraph.styleInfo.strikeout,
            subscript: paragraph.styleInfo.subscript,
            superscript: paragraph.styleInfo.superscript,
            smallcaps: paragraph.styleInfo.smallcaps,
            fontFamily: paragraph.styleInfo.fontType,
            fontSize: paragraph.styleInfo.fontSize,
            fontWeight: paragraph.styleInfo.fontWeight
        })

        string += `${paragraphText}`
    }

    fs.unlink(filePath);
}

async function generateHTML() {
    await quickstart();
    return arr.map(item => {
        let newText = '';

        if (item.bold) {
            newText = `<b>${item.text}</b>`
        } else{
            newText = `${item.text}`  
        }    
        return `<span>${newText}</span>`;
    }).join('');
}

// async function ocrMain(){

exports.ocrMain = async() => {
    const data = await generateHTML(arr);
    const htmlParagraph = `<p>${data}</p>`;
    return htmlParagraph;
}

// ocrMain();