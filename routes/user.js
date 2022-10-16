const express=require('express')
const {signUp,login,webSignUp,webLogin,renderLogin,renderRegister,getsignup} = require('../controllers/user')
const {sendEmail} = require('../controllers/mail')
const router = express.Router();

router.post('/login',renderLogin)
router.post('/register',renderRegister)

router.get('/getsignup',getsignup)

router.post('/signup',signUp)
router.post('/login',login)
router.post('/signup/web',webSignUp)
router.post('/login/web',webLogin)

router.post('/otp',sendEmail)
module.exports=router;