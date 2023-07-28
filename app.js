const express = require('express')
const handlebar = require('express-handlebars')
const path  = require('path')
const app = express()

app.engine('hbs',handlebar.engine({
    extname:'.hbs'
}))
app.set('view engine','hbs')
app.set('views',path.join(__dirname,'views'))
app.get('/',(req,res)=>{
    res.render('home',{title:"Home"})
})
app.get('/login',(req,res)=>{
    res.render('login',{title:"Login"})
})
app.listen(3000,()=>{
    console.log('localhost3000')
})