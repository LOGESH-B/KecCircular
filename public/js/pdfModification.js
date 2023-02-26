const { degrees, PDFDocument, StandardFonts } = require('pdf-lib')
const {readFile, writeFile}= require('fs/promises')
var QRCode = require('qrcode')
const {decode} = require('base64-arraybuffer')

const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');




 module.exports.modifyPdf = async(req,res,next,) => {
  console.log(req.file.path.substring(6))
  console.log("done")
    //QR code generation
    var buff
    var u
    var pdfurl=req.file.path.substring(6)
    const hashUrl = cryptr.encrypt(pdfurl);
    console.log(hashUrl);
// const decryptedString = cryptr.decrypt(encryptedString);
    // const hashUrl = await bcrypt.hash(pdfurl, 12);
    QRCode.toDataURL(`https://keccircular.onrender.com/${hashUrl}/secured`, function (err, url) {
         buff=decode(url) 
         u=url
    })
    
     // Fetch an existing PDF document
     var urlEncoded = encodeURI('');
     const url = `${__dirname}/../${req.file.path.substring(6)}`;
   //   const url = `${__dirname}/../circular_pdf/2022/pdf-lib_form_creation_example.pdf`;
   //   const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

     const buffer=await readFile(url)
     const arraybuf = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset+buffer.byteLength)
     // Load a PDFDocument from the existing PDF bytes
     const pdfDoc = await PDFDocument.load(arraybuf)

     // Embed the Helvetica font
     const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

     // Get the first page of the document
     let i
     const pages = pdfDoc.getPages()
     const no_of_pages=pdfDoc.getPageCount()
     for(i=0;i<no_of_pages;i++){
         const firstPage = pages[i]
         const jpgImage = await pdfDoc.embedPng(u)
        //  const jpgDims = jpgImage.rotate(0.25)
         // Get the width and height of the first page
         const { width, height } = firstPage.getSize()
         // Draw a string of text diagonally across the first page
         firstPage.drawImage(jpgImage, {
            //  x: pages[0].getWidth() / 2 ,
            //  y: pages[0].getHeight() / 2,
            x: pages[0].getWidth()-50,
                // x:500,
                y:10,
                width:40,
                height: 40,
               //  rotate: degrees(-90)
         })

         timestramp=new Date().toString()
         firstPage.drawText(timestramp, {
            x: 20,
            y: 20,
            size: 12,
            font: helveticaFont,
            // color: rgb(0.95, 0.1, 0.1),
            // rotate: degrees(-90),
          })

     }

     // Serialize the PDFDocument to bytes (a Uint8Array)
     const pdfBytes = await pdfDoc.save()

     await writeFile(url, pdfBytes)
     console.log("1")
     next();

   //   function base64ToArrayBuffer(base64) {
   //      var binaryString = window.atob(base64);
   //      var binaryLen = binaryString.length;
   //      var bytes = new Uint8Array(binaryLen);
   //      for (var i = 0; i < binaryLen; i++) {
   //         var ascii = binaryString.charCodeAt(i);
   //         bytes[i] = ascii;
   //      }
   //      return bytes;
   //   }
   //   function saveByteArray(reportName, byte) {
   //      var blob = new Blob([byte], {type: "application/pdf"});
   //      var link = document.createElement('a');
   //      link.href = window.URL.createObjectURL(blob);
   //      var fileName = reportName;
   //      link.download = fileName;
   //      console.log(fileName);
   //      link.click();
   //  };
    //var sampleArr = base64ToArrayBuffer(pdfBytes);
// saveByteArray("Sample Report", pdfBytes)

    // Trigger the browser to download the PDF document
    // download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");
 }