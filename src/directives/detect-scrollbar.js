export default {
  bind: (el) => {
    if (el.scrollHeight > el.clientHeight) {
      el.classList.add('n-has-scroll')
    } else {
      el.classList.remove('n-has-scroll')
    }
  },

  update: (el) => {
    if (el.scrollHeight > el.clientHeight) {
      el.classList.add('n-has-scroll')
    } else {
      el.classList.remove('n-has-scroll')
    }
  }
}
