const Circular = require('../models/circular.js')



module.exports.postCircular = async(req,res) =>{
     const result = {
        postedOn:  Date.now(),
        title:req.body.title,
        batch: req.body.batch,
        dept: req.body.dept,
        filePath: req.file.path.substring(6),
        postedBy: req.session._id
    }

    const circular = await new Circular(result);
    await circular.save()

    res.redirect('/');
}

module.exports.renderCircular = async(req,res)=>{
    res.render("circular_page/add_circular.ejs")
}