// 因程式改寫 此檔案暫時不用

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