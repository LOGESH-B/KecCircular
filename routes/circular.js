const express=require('express')
const {postCircular,renderCircular,getAllCircular,deleteCircular,createfolder} = require('../controllers/circular.js')
const router = express.Router();
const { storage, fileFilter } = require("../multter/upload")
const multer = require('multer');
const upload = multer({ limits: { fileSize: 2097152 }, fileFilter: fileFilter, storage: storage })
const {isLoggedIn}=require("../middleware/auth")

router.get('/',isLoggedIn,renderCircular)
router.post('/',isLoggedIn,upload.single('pdf'),postCircular)
router.get('/all/:platform/:dept/:batch',getAllCircular)
router.delete('/:id',deleteCircular)

router.get('/add/acadamic_year',isLoggedIn,createfolder)

module.exports=router;

