const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user.js')
var session;
module.exports.signUp = async (req, res) => {

    const { name, rollno, email, department, password, batch, type, joinedOn,isAdmin=false,isDeptAdmin=false } = await req.body
    try {
        const existinguser = await User.findOne({ email })

        if (existinguser) {
            return res.status(400).json({ message: 'User already found..' })
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, rollno, email, department, batch, type, joinedOn,isAdmin,isDeptAdmin, password: hashPassword })
        await newUser.save();
        const token = jwt.sign({ email: newUser.email, uid: newUser._id }, 'token', { expiresIn: '1h' })
        req.session._id = newUser._id;
        res.locals.currentUser = newUser._id
        req.params.platform == 'web' ?
            res.redirect('/') :
            res.status(200).json({ result: newUser, token })
    } catch (err) {
        console.log(err)
        res.status(500).json('Something went worng...')
    }
}

module.exports.login = async (req, res) => {
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
        const token = jwt.sign({ email: existinguser.email, uid: existinguser._id }, 'token', { expiresIn: '48h' })
        if(existinguser.isAdmin || existinguser.isDeptAdmin ){ ///only admin login in the admin portal
        session = req.session;//only admin session are stored
        req.session._id = existinguser._id
        }
        req.params.platform == 'web' ?
            res.redirect('/') :
            res.status(200).json({ result: existinguser, token })
        
        

    } catch (err) {
        res.status(500).json(err.message)
    }
}
