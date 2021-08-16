const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const { urlencoded } = require('body-parser')
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 3000

const app = express()

app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride('_method'))

// register helper
const handlebars = require('handlebars')
handlebars.registerHelper('dateConvert', function (value) {
  const date = new Date(value + 'UTC')
  return date.toJSON().slice(0, 10)
})

// express-session
app.use(session({
  secret: 'thisismysecondtimemaketodolist',
  resave: false,
  saveUninitialized: true
}))

// Passport middleware
require('./config/passport')(passport)
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash())
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.msg = req.flash('msg')
  res.locals.email = req.flash('email')
  res.locals.error = req.flash('error')
  next()
})

const routes = require('./routes')
app.use(cookieParser())
app.use(routes)


app.listen(port, () => {
  console.log('server on')
})