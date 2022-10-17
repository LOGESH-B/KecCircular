const express=require('express')
const {signUp,login,webSignUp,webLogin,renderLogin,renderRegister,getsignup,logout} = require('../controllers/user')
const {sendEmail} = require('../controllers/mail')
const router = express.Router();

router.get('/login',renderLogin)
router.get('/register',renderRegister)

router.get('/getsignup',getsignup)

router.post('/signup',signUp)
router.post('/login',login)
router.post('/signup/web',webSignUp)
router.post('/login/web',webLogin)

router.post('/otp',sendEmail)

router.get('/logout',logout)
module.exports=router;



