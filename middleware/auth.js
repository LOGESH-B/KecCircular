const mongoose = require('mongoose')


module.exports.isLoggedIn=(req,res,next)=>{
    if(req.session._id){
        next()
    }
    else{
        res.redirect('/login')
    }
}