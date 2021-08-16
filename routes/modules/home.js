const router = require('express').Router()

const db = require('../../models')
const passport = require('passport')
const Todo = db.Todo
router.use(passport.authenticate('jwt', { session: false, failureRedirect: '/auth' }))

router.get('/', (req, res) => {
  const userId = req.user.id
  Promise.all([Todo.findAll({ where: { userId, isDone: false }, raw: true, nest: true }), Todo.findAll({ where: { userId, isDone: true }, raw: true, nest: true })])
  .then(results => {
    const [todos, done] = results
    res.render('index', { todos, done })
  })
  .catch(error => console.log(error))
})

router.get('/edit/:id', (req, res) => {
  const id = Number(req.params.id)
  Todo.findByPk(id)
  .then(todo => res.render('edit', { todo: todo.get() }))
  .catch(error => console.log(error))
})

router.get('/add', (req, res) => {
  res.render('add')
})

router.get('/done/:id', (req, res) => {
  Todo.findByPk(Number(req.params.id))
    .then(todo => {
      if (todo) {
        todo.update({
          isDone: true
        })
        .then(() => res.redirect('/'))
      }
    })
    .catch(error => console.log(error))
})
  
router.get('/revert/:id', (req, res) => {
  const id = Number(req.params.id)
  const userId = req.user.id
  Todo.findOne({ where: { id, userId } })
    .then(todo => {
      todo.update({
        isDone: false
      })
      .then(() => res.redirect('/'))
    })
    .catch(error => console.log(error))
})
  
router.get('/logout', (req, res) => {
  req.flash('msg', `You have successfully logout`)
  res.clearCookie('jwt')
  res.redirect('/auth')
})
  
router.put('/:id', (req, res) => {
  const { name, dueDate } = req.body
  Todo.findByPk(Number(req.params.id))
  .then(todo => {
    if (todo) {
      todo.update({
        name,
        dueDate
      })
      .then(() => res.redirect('/'))
    }
  })
  .catch(error => console.log(error))
})

router.post('/', (req, res) => {
  const userId = Number(req.user.id)
  const {name, dueDate} = req.body
  Todo.create({name, dueDate, userId})
  .then(() => res.redirect('/'))
  .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  const userId = req.user.id
  Todo.findOne({ where: { id, userId } })
  .then(todo => todo.destroy())
  .then(() => res.redirect('/'))
  .catch(error => console.log(error))
})

module.exports = router