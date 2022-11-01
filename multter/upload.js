
const multer = require('multer');
const Path = require("path")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/circular_pdf/2022')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    },
    
  })
  const fileFilter =
    (req, file, cb) => {
        const acceptableExtensions = ['.pdf'];
        if (!(acceptableExtensions.includes(Path.extname(file.originalname)))) {
          return cb(new Error('Upload Only pdf files'));
        }
        cb(null,true)
    }
    // To reject this file pass `false`, like so:

  module.exports= {storage,fileFilter};