const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Constant=require("../models/constant")
var session;

module.exports.getsignup=async (req,res)=>{
    const department=await Constant.findOne({});
    res.status(200).json({ department })

}

module.exports.signUp = async (req, res) => {
    const { name, rollno, email, department, password, batch, type,deviceId} =  req.body
    try {
        const existinguser = await User.findOne({ email })

        if (existinguser) {
            return res.status(400).json({ message: 'User already found..' })
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, rollno, email, department, batch, type,deviceId, password: hashPassword })
        await newUser.save();
        const token = jwt.sign({ email: newUser.email, id: newUser._id }, 'token', { expiresIn: '1h' })
            res.status(200).json({ result: newUser, token })
    } catch (err) {
        console.log(err.message)
        res.status(500).json('Something went worng...')
    }
}


module.exports.webSignUp = async(req,res) =>{
        const { name,department,password,email,type} =  req.body
        try{
         let femail_pattern=/^([a-z]+)\.([a-z]{2,5})\@([a-z]+)\.([a-z]{2,5})$/;
         let result1=femail_pattern.test(email)
        if(!result1 &&!email.endsWith('kongu.edu') ){
            req.flash('error','Invalid email')
          return res.redirect('/user/register')
        }
        var isAdmin=false,isDeptAdmin=false
        var rollno=''
        const existinguser = await User.findOne({ email })
        if (existinguser) {
            req.flash('error','User found already')
            return res.redirect('/user/register')
        }
        if(type=='admin'){
            isAdmin=true
            rollno='admin'
        }else if (type=='department-admin'){
            isDeptAdmin=true
            rollno=`${department}admin`
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name,  email, rollno,type, department,isAdmin,isDeptAdmin, password: hashPassword })
        await newUser.save();
        req.session._id = newUser._id;
        res.locals.currentUser = newUser._id
        req.flash('success','Account created')
        res.redirect('/')    
    }catch(err){

    }   
}


module.exports.webLogin = async(req,res) =>{
    const { email, password } = req.body;
        const existinguser = await User.findOne({ email })
        if (!existinguser) {
            req.flash('error','User not found')
            return res.redirect('/user/login')
        }
        const isPasswordCrt = await bcrypt.compare(password, existinguser.password)
        if (!isPasswordCrt) {
            req.flash('error','Invalid Credentials')
            return res.redirect('/user/login')
        }
        if(!existinguser.isAdmin && !existinguser.isDeptAdmin){
            req.flash('error',"Unauthorised access")
            return res.redirect('/user/login')
        }
        session = req.session;
        req.session._id = existinguser._id
        req.flash('success','Login Successfull')
        res.redirect('/') 
}


module.exports.login = async (req, res) => {
    const { email, password,deviceId } = req.body;
    try {
        const existinguser = await User.findOne({ email })
        if (!existinguser) {
            console.log("User not found...");
            return res.status(404).json({ message: "User not found..." })
        }
        const isPasswordCrt =await  bcrypt.compare(password, existinguser.password)
        if (!isPasswordCrt) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        existinguser.deviceId=deviceId
        await existinguser.save()
        const token = jwt.sign({ email: existinguser.email, id: existinguser._id }, 'token', { expiresIn: '48h' })
       
         res.status(200).json({ result: existinguser, token })
    
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}


module.exports.renderLogin = async(req,res) =>{
    res.render('auth_page/login.ejs')
}

module.exports.renderRegister = async(req,res) =>{
    const department=await Constant.findOne({});
    res.render('auth_page/signup.ejs',{department})
}


module.exports.logout=async(req,res)=>{
    if (req.session) {
        req.session.destroy();
      }
      res.redirect("/user/login")
}

module.exports.deleteDeviceId = async(req,res)=>{
    const {id}=req.body
    try {
        const user=await User.findById(id)
        user.deviceId ='-'
        await user.save()
        res.status(200).send('Logout successfull')
    } catch (error) {
        res.status(500).send(error)
    }
}