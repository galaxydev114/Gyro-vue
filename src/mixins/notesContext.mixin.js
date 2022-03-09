import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations({
      setNotesContext: 'notes/setContext'
    })
  },
  beforeRouteLeave (to, from, next) {
    this.setNotesContext()
    next()
  }
}
