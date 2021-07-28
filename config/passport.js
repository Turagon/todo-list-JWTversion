const strategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const localStrategy = new strategy({usernameField: 'email'}, 
  async(email, password, done) => {
    try {
      const userInfo = await User.findOne({where: {email}})
      if (userInfo) {
        bcrypt.compare(password, userInfo.dataValues.password, (err, isMatch) => {
          if (isMatch) {
            return done(null, userInfo, {message: 'Welcome!'})
          } else {
            return done(null, flase, {message: 'incorrect password'})
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

// pack middleware
function passportSet(passport) {
  passport.use(localStrategy)

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