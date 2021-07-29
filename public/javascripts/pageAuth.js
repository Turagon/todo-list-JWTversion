function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  // req.flash('error', 'Please login to view this page')
  res.redirect('/auth')
}

function forwardAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  console.log('or am i here?')
  res.redirect('/')
}

module.exports = { ensureAuth, forwardAuth }