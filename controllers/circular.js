const Circular = require('../models/circular.js');
const user = require('../models/user.js');
const notify = require('../controllers/push_notification.controllers')



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
            userlist = await user.find({});
            console.log(userlist+"alll")
        }
        else if (req.body.dept == 'all' || req.body.batch == 'all') {
            userlist = await user.find({ $or: [{ department: { $in: req.body.dept } }, { batch: { $in: req.body.batch } }] });
            console.log(userlist+"any one")
        }
        else {
            userlist = await user.find({ $and: [{ department: { $in: req.body.dept } }, { batch: { $in: req.body.batch } }] });
            console.log(userlist+"none")
        }
        //need to work for push notification

        console.log(userlist);
        devices = []
        userlist.forEach((ele) => {
            if (ele.deviceId != '-')
                devices.push(ele.deviceId)
        })

        notify.pushnotify(devices);

        const circular = await new Circular(result);
         await circular.save()

        res.redirect('/');
    } catch (err) {
        console.log(err.message)
    }
}

module.exports.renderCircular = async (req, res) => {
    res.render("circular_page/add_circular.ejs")
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
        const yesterdayCircular = await Circular.find({ postedOn: { $gte: yesterday, $lt: today } })
        const todayCircular = await Circular.find({ postedOn: { $gt: today } })
        const allCircular = await Circular.find({ postedOn: { $lt: yesterday } })
        //seperating according to months for all circular
        monthwise = [{ "mon": "January", "value": [] },
        { "mon": "February", "value": [] },
        { "mon": "March", "value": [] },
        { "mon": "April", "value": [] },
        { "mon": "May", "value": [] },
        { "mon": "June", "value": [] },
        { "mon": "July", "value": [] },
        { "mon": "August", "value": [] },
        { "mon": "September", "value": [] },
        { "mon": "October", "value": [] },
        { "mon": "November", "value": [] },
        { "mon": "December", "value": [] }]
        allCircular.map((ele) => {
            index = ele.postedOn.getMonth()
            monthwise[index].value.push(ele)
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

