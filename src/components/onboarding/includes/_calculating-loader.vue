<template>
  <div>
    <div class="text-h1 text-weight-bold">
      Hey {{ userName }}
    </div>
    <div class="text-h3 text-weight-regular q-mt-sm q-mb-xl">
      Calculating your skill score
    </div>
    <q-circular-progress
      show-value
      class="q-mx-auto q-mt-lg"
      indeterminate
      size="160px"
      color="dark-pink"
      track-color="mid-tone">
      <span class="text-h2">
      {{ percent }}%
      </span>
    </q-circular-progress>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    userName: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      percent: 0,
      retryAgain: true
    }
  },

  mounted () {
    this.getUserScoreForUserId(this.currentUser.id)
    this.increment()
  },

  computed: {
    ...mapGetters('user', ['currentUser'])
  },
  methods: {
    ...mapActions({
      getUserScoreAPI: 'user/getUserScore'
    }),

    showErrorMessage (errorMessage) {
      this.$q.notify({
        color: 'dark-pink',
        textColor: 'white',
        icon: 'error',
        message: errorMessage,
        badgeClass: 'hidden'
      })
    },

    async getUserScoreForUserId (userId) {
      if (userId) {
        this.getUserScoreAPI({ userId, forceCalc: true }).then((res) => {
          this.isDataLoaded = true
        })
      } else {
        throw new Error('NO userId provided for getUserScore', userId)
      }
    },

    increment () {
      const recursiveLoad = () => {
        if (this.percent === 99) {
          if (this.isDataLoaded) {
            this.percent += 1
            this.$emit('end')
            this.$emit('next', this.userName)
          } else {
            this.percent = 0
            this.$emit('end')
            this.showErrorMessage('No stats for Fortnite nickname, please try again later')
          }
        } else if (this.percent === 69) {
          if (!this.isDataLoaded && this.retryAgain) {
            this.retryAgain = false
            this.getUserScoreForUserId(this.currentUser?.id)
            this.percent = 24
            setTimeout(() => (recursiveLoad()), 75)
          } else {
            this.percent += 1
            setTimeout(() => (recursiveLoad()), 75)
          }
        } else {
          this.percent += 1
          setTimeout(() => (recursiveLoad()), 75)
        }
      }

      recursiveLoad()
    }
  }
}
</script>
