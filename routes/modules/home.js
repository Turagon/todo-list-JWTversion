const router = require('express').Router()

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/edit/:id', (req, res) => {
  console.log('i am in edit request')
})

router.put('/edit/:id', (req, res) => {
  console.log('i am in edit put')
})

router.get('/add', (req, res) => {
  console.log('i am in add request')
})

router.post('/add', (req, res) => {
  console.log('i am in add post')
})

router.delete('/delete/:id', (req, res) => {
  console.log('i am in delete')
})

module.exports = router