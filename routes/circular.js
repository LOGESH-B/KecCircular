const express=require('express')
const {postCircular,renderCircular,getAllCircular,deleteCircular,createfolder,getAllCircularApp,getSpecificCircular} = require('../controllers/circular.js')
const router = express.Router();
const { storage, fileFilter } = require("../multter/upload")
const multer = require('multer');
const upload = multer({ limits: { fileSize: 2097152 }, fileFilter: fileFilter, storage: storage })
const {isLoggedIn}=require("../middleware/auth")
const {modifyPdf} = require('../public/js/pdfModification')

router.get('/',isLoggedIn,renderCircular)
router.post('/',isLoggedIn,upload.single('pdf'),modifyPdf,postCircular)
router.get('/all/:platform/:dept/:batch/:type',getAllCircular)
router.get('/hash/:id',getSpecificCircular)
router.delete('/:id',deleteCircular)

router.get('/add/acadamic_year',isLoggedIn,createfolder)

module.exports=router;

