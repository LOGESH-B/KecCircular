
//Common Importing Statements
const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const path = require("path")
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const dotenv=require('dotenv')

//multer imports


//models
const User = require("./models/user");
const Circular = require("./models/circular")


//middleware
const { isLoggedIn } = require("./middleware/auth")

//routes
const userRoutes =  require('./routes/user')
const circularRoutes = require('./routes/circular')

//initilizing
const app = express()
app.use(express.static(path.join(__dirname, "/public")))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)
dotenv.config()
app.use(express.json({extended:true}))
app.use(express.urlencoded({ extended: true }));
//session

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "webpirates",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

//locals
app.use(async (req, res, next) => {
    res.locals.currentUser = req.session._id;
    next()
})

app.use('/user',userRoutes)
app.use('/circular',circularRoutes)
//multer



app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


//db connection
mongoose.connect(process.env.DB).then(() => {
    console.log('Db connection open')
}).catch(err => {
    console.log(err.message, 'oops err');
});

//port


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


//view routes



//listening port

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running at Port ${PORT}`)
}
)