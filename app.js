const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const { urlencoded } = require('body-parser')

const app = express()

app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride('_method'))

// express-session
app.use(session({
  secret: 'thisismysecondtimemaketodolist',
  resave: false,
  saveUninitialized: true
}))



// Connect flash
app.use(flash())
app.use((req, res, next) => {
  res.locals.msg = req.flash('msg')
  res.locals.error = req.flash('error')
  next()
})