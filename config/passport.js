const strategy = require('passport-local').Strategy
const jwtStrategy = require('passport-jwt').Strategy
// const ExtractJwt = require('passport-jwt').ExtractJwt
const bcrypt = require('bcryptjs')
const db = require('../models')
const fs = require('fs')
const User = db.User
const PUB_KEY = fs.readFileSync(__dirname + '/../rsaPublicKey.pem', 'utf8')

const localStrategy = new strategy({usernameField: 'email'}, 
  async(email, password, done) => {
    try {
      const userInfo = await User.findOne({where: {email}})
      if (userInfo) {
        bcrypt.compare(password, userInfo.dataValues.password, (err, isMatch) => {
          if (isMatch) {
            return done(null, userInfo, {message: 'Welcome!'})
          } else {
            return done(null, false, {message: 'incorrect password'})
          }
        })
      } else {
        return done(null, false, {message: 'email is not registered'})
      }
    }
    catch (error) {
      console.log(error)
    }
  }
)

const cookieExtractor = (req) => {
  let token = null
  if (req && req.cookies['jwt']) {
    token = req.cookies['jwt']['token']
  } else {
    return
  }
  return token
}

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
}

const jwt = new jwtStrategy(options, async(payload, done) => {
  try {
    const user = await User.findOne({where: {id: payload.sub}})
    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  }
  catch (error) {
    console.log(error)
  }
})

// pack middleware
function passportSet(passport) {
  passport.use(localStrategy)
  passport.use(jwt)

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findByPk(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => done(null, err))
  });
}

module.exports = passportSet