const Department = require('../models/department.js')
const User = require('../models/user.js');
const notify = require('../controllers/push_notification.controllers')

module.exports.postCircular = async (req, res) => {
    try {
        const result = {
            title: req.body.title,
            batch: req.body.batch,
            dept: req.body.dept,
            number: req.body.number,
            to: req.body.to,
            filePath: req.file.path.substring(6),
            postedBy: req.session._id
        }
        console.log(result)
        var userlist;
        if (req.body.dept == 'all' && req.body.batch == 'all') {
            userlist = await User.find({});
            console.log(userlist + "alll")
        }
        else if (req.body.dept == 'all' || req.body.batch == 'all') {
            userlist = await User.find({ $or: [{ department: { $in: req.body.dept } }, { batch: { $in: req.body.batch } }] });
            console.log(userlist + "any one")
        }
        else {
            userlist = await User.find({ $and: [{ department: { $in: req.body.dept } }, { batch: { $in: req.body.batch } }] });
            console.log(userlist, "none")
        }
        // console.log(userlist);
        devices = []
        userlist.forEach((ele) => {
            if (ele.deviceId != '-' && (ele.type == req.body.to || req.body.to == 'all')) { devices.push(ele.deviceId) }
        })
        console.log(devices)
        notify.pushnotify(devices);

        const deptCircular = new Department(result)
        await deptCircular.save()
        req.flash('success', 'Posted Circular successfully')
        res.redirect('/')
    } catch (error) {

    }
}

module.exports.getAllCircular = async (req, res) => {
    console.log(req.body.dept)
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
        console.log(req.params.dept)
        //yesterday
        if (req.params.platform != 'web') {
            var yesterdayCircular = await Department.find({ $and: [{ dept: { $in: [req.params.dept, 'all'] } }, { batch: { $in: [req.params.batch, 'all'] } }, { type: { $in: [req.params.type, 'all'] } }, { postedOn: { $gte: yesterday, $lt: today } }] })
        } else {
            var yesterdayCircular = await Department.find({ $and: [{ dept: { $in: [req.params.dept, 'all'] } }, { postedOn: { $gte: yesterday, $lt: today } }] })
        }
        yesterdayCircular = yesterdayCircular.sort((a, b) => b.number - a.number);

        //today
        if (req.params.platform != 'web') {
            var todayCircular = await Department.find({ $and: [{ dept: { $in: [req.params.dept, 'all'] } }, { batch: { $in: [req.params.batch, 'all'] } }, { type: { $in: [req.params.type, 'all'] } }, { postedOn: { $gt: today } }] })
        } else {
            var todayCircular = await Department.find({ $and: [{ dept: { $in: [req.params.dept, 'all'] } }, { postedOn: { $gt: today } }] })
        }
        todayCircular = todayCircular.sort((a, b) => b.number - a.number);

        //all
        if (req.params.platform != 'web') {
            var allCircular = await Department.find({ $and: [{ dept: { $in: [req.params.dept, 'all'] } }, { batch: { $in: [req.params.batch, 'all'] } }, { type: { $in: [req.params.type, 'all'] } }, { postedOn: { $lt: yesterday } }] })
        }else{
            var allCircular = await Department.find({ $and: [{ dept: { $in: [req.params.dept, 'all'] } }, { postedOn: { $lt: yesterday } }] })

        }
        allCircular = allCircular.sort((a, b) => b.number - a.number)
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
        console.log(allCircular)
        //response api seperation
        req.params.platform == 'web' ?
            res.render('dept_circular/view_circular', { allCircular, yesterdayCircular, todayCircular, monthwise }) :
            res.status(200).json({ allCircular, yesterdayCircular, todayCircular, monthwise })
    } catch (err) {
        console.log(err)
        res.status(500).json('Something went worng...')
    }
}

module.exports.deleteCircular = async (req, res) => {
    const { id } = req.params
    try {
        const circular = await Department.findByIdAndDelete(id)
        const path = `${__dirname}/../public/`
        path = path + circular.filePath
        fs.unlinkSync(path)
        req.flash('success', 'Circular has been deleted successfully')
        res.redirect('/dept/all/web/none/none/deptAdmin')
    } catch (error) {
        console.log(error)
    }
}