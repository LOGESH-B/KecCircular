const express=require('express')
const {postCircular,renderCircular} = require('../controllers/circular.js')
const router = express.Router();
const { storage, fileFilter } = require("../multter/upload")
const multer = require('multer');
const upload = multer({ limits: { fileSize: 2097152 }, fileFilter: fileFilter, storage: storage })

router.get('/',renderCircular)
router.post('/',upload.single('pdf'),postCircular)


module.exports=router;