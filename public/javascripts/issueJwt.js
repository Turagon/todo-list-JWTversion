const jwt = require('jsonwebtoken')
const fs = require('fs')
const privateKey = fs.readFileSync(__dirname + '/../../rsaPrivateKey.pem', 'utf8')

module.exports = (user) => {
  const id = user.id
  const expiresIn = 12 * 60 * 60 * 1000
  const payload = {
    sub: id,
    iat: Date.now()
  }

  const signToken = jwt.sign(payload, privateKey, {expiresIn: expiresIn, algorithm: 'RS256'})

  return {
    token: signToken,
    expires: expiresIn
  }
}
