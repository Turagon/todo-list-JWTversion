const router = require('express').Router()
const { equals, isEmail} = require('validator')
const bcrypt = require('bcryptjs')
const db = require('../../models')
const issueJwt = require('../../public/javascripts/issueJwt')
const User = db.User

router.get('/', (req, res) => {
    res.render('auth', {layout: 'loginPage'})
})

router.get('/register', (req, res) => {
  res.render('register', { layout: 'loginPage'})
})

router.post('/jwt', async(req, res) => {
  const email = req.body.email
  const password = req.body.password
  const user = await User.findOne({ where: { email } })
  if (user) {
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (isMatch) {
        const tokenInfo = issueJwt(user)
        const allInfo = {
          token: tokenInfo.token,
          userId: user.id,
        }
        res.cookie('jwt', allInfo, { httpOnly: true, maxAge: tokenInfo.expires })
        res.redirect('/')
      } else {
        res.render('auth', { error: `Passowrd incorrect`, email, layout: 'loginPage' })
      }
    })
  } else {
    req.flash('error', `Please register first`)
    res.redirect('/auth/register')
  }
})

router.post('/register', (req, res) => {
  const {name, email, password, password2} = req.body
  const errors = []
  if (!equals(password, password2)) {
    errors.push({ msg: 'the passwords do not match each other' })
  }

  if (errors.length) {
    return res.render('register', { 
      errors,
      name,
      email,
      password,
      password2,
      layout: 'loginPage'
    })
  } else {
    User.create({
      name,
      email,
      password
    })
    .then(user => {
      req.flash('msg', `Welcome, ${user.name}`)
      req.flash('email', `${user.email}`)
      res.redirect('/auth')
    })
    .catch(err => {
      let error = err.errors[0].message
      if (error !== 'Invalid email format') {
        error = 'this email is registered already'
      } 
      res.render('register', {
        error,
        name,
        email,
        password,
        password2,
        layout: 'loginPage'
      })
    })
  }
})

module.exports = router