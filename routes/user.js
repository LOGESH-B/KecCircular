const express=require('express')
const {signUp,login,webSignUp,webLogin,renderLogin,renderRegister} = require('../controllers/user')
const router = express.Router();

router.get('/login',renderLogin)
router.get('/register',renderRegister)

router.post('/signup',signUp)
router.post('/login',login)
router.post('/signup/web',webSignUp)
router.post('/login/web',webLogin)


module.exports=router;