const express=require('express')
const {postCircular,getAllCircular,deleteCircular} = require('../controllers/departmentCircular.js')
const router = express.Router();
const { storage, fileFilter } = require("../multter/upload")
const multer = require('multer');
const upload = multer({ limits: { fileSize: 2097152 }, fileFilter: fileFilter, storage: storage })
const {isLoggedIn}=require("../middleware/auth")
const {modifyPdf} = require('../public/js/pdfModification')

// router.get('/',isLoggedIn,renderCircular)
router.post('/',isLoggedIn,upload.single('pdf'),modifyPdf,postCircular)
router.get('/all/:platform/:dept/:batch/:type',getAllCircular)
router.delete('/:id',isLoggedIn,deleteCircular)

// router.get('/add/acadamic_year',isLoggedIn,createfolder)

module.exports=router;

