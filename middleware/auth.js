const mongoose = require('mongoose')


module.exports.isLoggedIn=(req,res,next)=>{
    if(req.session._id){
        next()
    }
    else{
        console.log('on auth    ')
        req.flash("error","You don't have access to this action")
        res.redirect('/user/login')
    }
}