const deleteBtn = document.querySelector('#delete-btn')
const container = document.querySelector('.container')
const head = document.querySelector('.todo-head')
const myModal = new bootstrap.Modal(document.querySelector('.modalBox'))
const form = document.querySelector('#delete-submit')

if (deleteBtn) {
  deleteBtn.addEventListener('click', event => {
    const id = event.target.dataset.id
    form.action = `/${id}?_method=DELETE`
    myModal.show()
    form.addEventListener('click', event => {
      if (event.target.classList.contains('delete-confirm')) {
        myModal.hide()
        myModal.dispose()
      }
    })
  })
}