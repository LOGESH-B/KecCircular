const Circular = require('../models/circular.js');
const User = require('../models/user.js');
const Constant = require('../models/constant.js')
const notify = require('../controllers/push_notification.controllers')
const fs = require('fs');



module.exports.postCircular = async(req,res) =>{
    try{
        const result = {
            postedOn: Date.now(),
            title: req.body.title,
            batch: req.body.batch,
            dept: req.body.dept,
            number: req.body.number,
            filePath: req.file.path.substring(6),
            postedBy: req.session._id
        }
        var userlist;
        if (req.body.dept == 'all' && req.body.batch == 'all') {
            userlist = await User.find({});
            console.log(userlist+"alll")
        }
        else if (req.body.dept == 'all' || req.body.batch == 'all') {
            userlist = await User.find({ $or: [{ department: { $in: req.body.dept } }, { batch: { $in: req.body.batch } }] });
            console.log(userlist+"any one")
        }
        else {
            userlist = await User.find({ $and: [{ department: { $in: req.body.dept } }, { batch: { $in: req.body.batch } }] });
            console.log(userlist+"none")
        }
        console.log(userlist);
        devices = []
        userlist.forEach((ele) => {
            if (ele.deviceId != '-')
                devices.push(ele.deviceId)
        })

        notify.pushnotify(devices);

        const circular = await new Circular(result);
        await circular.save()
        req.flash('success','Circular Posted successfully')
        res.redirect('/');
    } catch (err) {
        console.log(err.message)
    }
}

module.exports.renderCircular = async (req, res) => {
    var increment;
    var year=new Date().getFullYear()
    const batchYear=[]
    const department=await Constant.findOne({});
    const user=await User.findOne({_id:req.session._id})
    console.log(user);
    for(increment=-4;increment<=4;increment++){
        batchYear.push(year-increment);
    }
   // res.render("circular_page/add_circular.ejs",{batchYear,department,user})
    res.render("circular_page/add_circular_dept.ejs",{batchYear,department,user})
}

module.exports.deleteCircular= async(req,res)=>{
    const {id}=req.params
    try {
        const circular=await Circular.findByIdAndDelete(id)
        req.flash('success','Circular has been deleted successfully')
        res.redirect('/circular/all/web')
    } catch (error) {
        console.log(error)
    }
}

module.exports.getAllCircular = async (req, res) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentDate = new Date().getDate();
    //today timestamp
    const timestamp = [currentYear, currentMonth <= 9 ? '0' + currentMonth : currentMonth, currentDate <= 9 ? '0' + currentDate : currentDate].join('-');
    const today = new Date(timestamp)
    //yesterday timestamp
    const previous = new Date(today.getTime());
    previous.setDate(previous.getDate() - 1);
    const yesterday = previous;
    try {
        //querry
        var yesterdayCircular = await Circular.find({ postedOn: { $gte: yesterday, $lt: today } })
        yesterdayCircular=yesterdayCircular.sort((a,b)=>b.number-a.number);

        var todayCircular = await Circular.find({ postedOn: { $gt: today } })
        todayCircular = todayCircular.sort((a,b)=>b.number-a.number);

        var allCircular = await Circular.find({ postedOn: { $lt: yesterday } })
        allCircular = allCircular.sort((a,b)=>b.number-a.number)
        
        //seperating according to months for all circular
        monthwise = [{ "title": "January", "data": [] },
        { "title": "February", "data": [] },
        { "title": "March", "data": [] },
        { "title": "April", "data": [] },
        { "title": "May", "data": [] },
        { "title": "June", "data": [] },
        { "title": "July", "data": [] },
        { "title": "August", "data": [] },
        { "title": "September", "data": [] },
        { "title": "October", "data": [] },
        { "title": "November", "data": [] },
        { "title": "December", "data": [] }]
        allCircular.map((ele) => {
            index = ele.postedOn.getMonth()
            monthwise[index].data.push(ele)
        })
        //response api seperation
        req.params.platform == 'web' ?
            res.render('circular_page/view_allcircular', { allCircular, yesterdayCircular, todayCircular, monthwise }) :
            res.status(200).json({ allCircular, yesterdayCircular, todayCircular, monthwise })
    } catch (err) {
        console.log(err)
        res.status(500).json('Something went worng...')
    }
}

module.exports.createfolder=async (req,res)=>{
const folderName = './public/circular_pdf/2024';

try {
  if (!fs.existsSync(folderName)) {
  //  const newacadamic=await Circular.deleteMany({});
    console.log("Folder Created",newacadamic)
    fs.mkdirSync(folderName);
    req.flash('success',"New Acadamic Year Created Successfully,All Data in the Previous Year are Deleted")
    res.redirect('/')
  }
  else{
    req.flash('error',"Folder already Exists")
    res.redirect('/')
  }
} catch (err) {
  console.error(err);
  req.flash('error',err.message)
  res.redirect('/')
}
}