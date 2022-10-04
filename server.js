
//Common Importing Statements
const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const path = require("path")
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

//multer imports
const { storage, fileFilter } = require("./multter/upload")

//models
const User = require("./models/user");
const Circular = require("./models/circular")

//controllers
const { signUp, login } = require("./controller/auth")

//middleware
const { isLoggedIn } = require("./middleware/auth")


//initilizing
const app = express()
app.use(express.static(path.join(__dirname, "/public")))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)

//session

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

//locals
app.use(async (req, res, next) => {
    res.locals.currentUser = req.session._id;
    console.log(req.session._id)
    next()
})

//multer
const multer = require('multer');
const upload = multer({ limits: { fileSize: 2097152 }, fileFilter: fileFilter, storage: storage })


app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


//db connection
mongoose.connect("mongodb://localhost:27017/Kec").then(() => {
    console.log('Db connection open')
}).catch(err => {
    console.log(err.message, 'oops err');
});

//port
const port = process.env.PORT || 3000

//session variable
var session; //to make variable available in all place


//home routes
app.get("/", (req, res) => {
    session = req.session;
    if (session._id) {
        res.render('home')
    }
    else {
        res.render('auth_page/login')
    }

})

//newcircular
app.get('/newcircular', isLoggedIn, (req, res) => {
    res.render('circular_page/add_circular')
})
app.post('/newcircular', upload.single('pdf'), async (req, res) => {

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

})

//view routes
app.get('/view/all_circular/:platform', async (req, res) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentDate = new Date().getDate();
    //today timestamp
    const timestamp = [currentYear, currentMonth <= 9 ? '0' + currentMonth : currentMonth, currentDate <= 9 ? '0' + currentDate : currentDate].join('-');
    const today = new Date(timestamp)
    console.log(today)
    //yesterday timestamp
    const previous = new Date(today.getTime());
    previous.setDate(previous.getDate() - 1);
    const yesterday = previous;
    console.log(yesterday)
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
            console.log(ele)
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

})


//auth routes
app.get('/createaccount',  (req, res) => {
    res.render('auth_page/signup')
})
app.get('/login', (req, res) => {
    res.render('auth_page/login')
})

app.post('/createaccount/:platform',  signUp),
    app.post('/login/:platform', login)


//listening port
app.listen(port, () => {
    console.log("Started")
}
)
