const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Token=require('../models/token')
const Joi = require("joi");
const crypto = require("crypto");
const {resetpassword_sendEmail} = require('../controllers/mail')


//this route is for testing (this page is in app only)
exports.forgotten_password=(req,res)=>{
  res.render('auth_page/reset');
}


exports.change_password_request= async (req,res)=>{
    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send({message:error.details[0].message});
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send({message:"User With Given Email Doesn't Exist"});
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }
        const link = `https://kec-circular.herokuapp.com/user/forgotten-password/${user._id}/${token.token}`;
        await resetpassword_sendEmail(user.email, "Oru Password Niyabagam vechika mudiyala ni lam yethu valthukittu....savula sethapayale", link);
        res.status(200).json({message:"Password Reset Link Sent To Your Email Account"});
       
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
    }
   
}


exports.link_from_mail=(req,res)=>{
    const {userId,token}=req.params;
    res.render("auth_page/forgottenpassword",{userId,token})
}


exports.change_password=async (req,res)=>{
    if(req.body.password===req.body.confirm_password)
    {
    try {
      const user = await User.findOne({ _id: req.params.userId });
      if (!user) return res.status(400).send({message:"Invalid Link"})
      const token = await Token.findOne({
        userId: user._id,
        token: req.params.token,
      });
      if (!token) return res.status(400).send( {message:"Invalid Link"});
      if (!user.verified) user.verified = true;
  
      const hashPassword = await bcrypt.hash(req.body.password, 12);
      user.password=hashPassword;
      await user.save();
      await token.remove();
      res.status(200).send({ message: "Password Reset successfully"});
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
  else{    
    res.status(500).send({ message: "Password and confirm Password Not Match!" });
  }
  
}



  