const router = require('express').Router()
const home = require('./modules/home')
const auth = require('./modules/auth')

router.use('/', home)
router.use('/auth', auth)

module.exports = router