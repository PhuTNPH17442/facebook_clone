const express = require('express')
const handlebar = require('express-handlebars')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const session = require('express-session')
const methodOverride = require('method-override')
const auth = require('./routes/auth')
const path = require('path')
const { error } = require('console')
const app = express()
require('dotenv').config()
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({
    extended: true
}))
//mongoose
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb+srv://phu1203:12032001@cluster0.7krtu.mongodb.net/facebook', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    const db = mongoose.connection;
    db.on('error',(err)=>{
      console.log(err)
    })
    db.once('open', () => {
      console.log('MongoDB database connection established successfully');
    });
//view engine
app.engine('hbs', handlebar.engine({
    extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
//midle
app.use(methodOverride('_method'))
app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
//get routes
app.get('/', (req, res) => {
    res.render('home', { title: "Home" })
})
app.get('/login', (req, res) => {
    res.render('login', { title: "Login" })
})
app.get('/register', (req, res) => {
    res.render('register', { title: "Register" })
})
app.use('/',auth)
app.listen(3000, () => {
    console.log('localhost3000')
})