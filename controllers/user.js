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
    const { name, rollno, email, department, password, batch, type,device_id} =  req.body
    try {
        const existinguser = await User.find({ email })

        if (existinguser) {
            return res.status(400).json({ message: 'User already found..' })
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, rollno, email, department, batch, type,device_id, password: hashPassword })
        await newUser.save();
        const token = jwt.sign({ email: newUser.email, id: newUser._id }, 'token', { expiresIn: '1h' })
            res.status(200).json({ result: newUser, token })
    } catch (err) {
        console.log(err)
        res.status(500).json('Something went worng...')
    }
}


module.exports.webSignUp = async(req,res) =>{
        const { name,department,password,email,type} =  req.body
        let isAdmin=false,isDeptAdmin=false
        try {
        const existinguser = await User.findOne({ email })
        if (existinguser) {
            return res.status(400).json({ message: 'User already found..' })
        }
        if(type=='admin'){
            isAdmin=true
        }else if (type=='department-admin'){
            isDeptAdmin=true
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name,  email, type, department,isAdmin,isDeptAdmin, password: hashPassword })
        await newUser.save();
        req.session._id = newUser._id;
        res.locals.currentUser = newUser._id
        res.redirect('/')       
    } catch (err) {
        console.log(err)
        res.status(500).json('Something went worng...')
    }
}


module.exports.webLogin = async(req,res) =>{
    const { email, password } = req.body;
    console.log(req.body)
    try {
        const existinguser = await User.findOne({ email })
     
        if (!existinguser) {
            console.log("User not found...");
            return res.status(404).json({ message: "User not found..." })
        }
        const isPasswordCrt = await bcrypt.compare(password, existinguser.password)
        if (!isPasswordCrt) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        session = req.session;
        req.session._id = existinguser._id
        res.redirect('/') 
    } catch (err) {
        res.status(500).json(err.message)
    }
}


module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existinguser = await User.findOne({ email })
        if (!existinguser) {
            console.log("User not found...");
            return res.status(404).json({ message: "User not found..." })
        }
        const isPasswordCrt = bcrypt.compare(password, existinguser.password)
        if (!isPasswordCrt) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
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