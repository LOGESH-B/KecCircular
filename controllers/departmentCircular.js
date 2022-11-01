const Department = require('../models/department.js')
const User = require('../models/user.js');
const notify = require('../controllers/push_notification.controllers')
module.exports.postCircular = async(req,res)=>{
    try {
        const result = {
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
    
        const deptCircular = new Department(result)
        await deptCircular.save()
        req.flash('success','Posted Circular successfully')
        res.redirect('/dept/all/web')
    } catch (error) {
        
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
        var yesterdayCircular = await Department.find({ postedOn: { $gte: yesterday, $lt: today } })
        yesterdayCircular=yesterdayCircular.sort((a,b)=>b.number-a.number);

        var todayCircular = await Department.find({ postedOn: { $gt: today } })
        todayCircular = todayCircular.sort((a,b)=>b.number-a.number);

        var allCircular = await Department.find({ postedOn: { $lt: yesterday } })
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
            res.render('dept_circular/view_circular', { allCircular, yesterdayCircular, todayCircular, monthwise }) :
            res.status(200).json({ allCircular, yesterdayCircular, todayCircular, monthwise })
    } catch (err) {
        console.log(err)
        res.status(500).json('Something went worng...')
    }
}

module.exports.deleteCircular= async(req,res)=>{
    const {id}=req.params
    try {
       
        const circular=await Department.findByIdAndDelete(id)

        req.flash('success','Circular has been deleted successfully')
        res.redirect('/circular/all/web')
    } catch (error) {
        console.log(error)
    }
}