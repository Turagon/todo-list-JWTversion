const router = require('express').Router()
const { equals, isEmail} = require('validator')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const db = require('../../models')
const issueJwt = require('../../public/javascripts/issueJwt')
const User = db.User

router.get('/', (req, res) => {
  if (req.headers.cookie.split('=')[0] === 'userInfo') {
    const email = req.headers.cookie.split('=')[1].split(';')[0]
    res.render('auth', {layout: 'loginPage', email})
  } else {
    res.render('auth', {layout: 'loginPage'})
  }
})

router.get('/register', (req, res) => {
  res.render('register', { layout: 'loginPage'})
})

router.get('/logout', (req, res) => {
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
          userEmail: user.email
        }
        res.cookie('jwt', allInfo, { httpOnly: true, maxAge: tokenInfo.expires })
        res.redirect('/')
      } else {
        req.flash('error', `Passowrd incorrect`)
        res.redirect('/auth')
      }
    })
  }
})

router.post('/register', (req, res) => {
  const {name, email, password, password2} = req.body
  const errors = []
  if (!isEmail(email)) {
    errors.push({ msg: 'the email format is invalid' })
  }

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
    User.findOne({where: {email}})
    .then(user => {
      if (user) {
        errors.push({ msg: 'email has been registered already' })
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
          res.redirect('/auth')
        })
      }
    })
  }
})

module.exports = router