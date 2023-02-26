const express=require('express')
const {signUp,login,webSignUp,webLogin,renderLogin,renderRegister,getsignup,logout,deleteDeviceId} = require('../controllers/user')
const {change_password,change_password_request,link_from_mail,forgotten_password}=require('../controllers/forgotten_password.controller')
const {otp_sendEmail,resetpassword_sendEmail} = require('../controllers/mail')
const router = express.Router();

router.get('/login',renderLogin)
router.get('/register',renderRegister)

router.get('/getsignup',getsignup)

router.post('/signup',signUp)
router.post('/login',login)
router.post('/signup/web',webSignUp)
router.post('/login/web',webLogin)

router.post('/otp',otp_sendEmail)
router.post('/delete',deleteDeviceId)
router.get('/logout',logout)

//forgotten_password
router.get("/forgotten-password",forgotten_password)

router.get('/forgotten-password/:userId/:token',link_from_mail)

router.post('/forgotten-password',change_password_request)

router.post('/forgotten-password/:userId/:token',change_password)

module.exports=router;



