<template>
  <div class="days-list justify-center">
    <div class="current-day-mobile text-weight-bold" v-if="showBackBtn">
      {{ viewPortDate | date }}
    </div>

    <div class="days-list__loader" v-show="!pageLoaded">
      <q-circular-progress
        indeterminate
        size="80px"
        color="dark-pink"
        track-color="mid-tone"
      />
    </div>
    <div class="days-list__list" ref="list" v-show="pageLoaded">
      <component v-bind:is="$q.screen.gt.xs ? 'q-scroll-area' : 'div'"
                 ref="scrollArea"
                 v-if="days"
                 @scroll="scrollHandle"
                 style="height: 100%;padding-right: 10px;margin-right: -10px">
        <tournament-empty-list v-cloak v-show="(!prepared || !prepared.length) && !participating" />
        <tournament-add v-cloak v-show="(!prepared || !prepared.length) && participating" @click="$emit('all')"/>
        <tournament-day v-for="(day, i) in prepared"
                        :ref="day.anchor"
                        :date="day.label"
                        :key="`day-${i}`">
          <tournament-item v-for="(tournament, idx) in day.items"
                           class="q-mb-md"
                           @add="addTournament(tournament)"
                           @remove="removeTournament(tournament)"
                           v-bind="tournament"
                           :key="`day-${i}-tournament-${idx}`"/>
        </tournament-day>
      </component>
    </div>

    <back-to-top @click="scrollToTop" v-if="showBackBtn" />
  </div>
</template>

<script>
import dayJs from 'dayjs'

export default {
  props: {
    days: {
      type: Object,
      default: () => {}
    },
    selectedDate: {
      type: String,
      default: ''
    },
    participating: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'tournament-day': () => import('@/components/tournaments/days-list/day'),
    'tournament-item': () => import('@/components/tournaments/days-list/tournament'),
    'tournament-empty-list': () => import('@/components/tournaments/days-list/empty-list'),
    'tournament-add': () => import('@/components/tournaments/days-list/add'),
    'modal-comming-soon': () => import('@/components/dashboard/modal/modal-comming-soon'),
    'back-to-top': () => import('@/components/common/button/backToTop')
  },
  data () {
    return {
      showEmpty: false,
      showAdd: false,
      scrollHandleCheck: true,
      viewPortDate: null,
      showBackBtn: false,
      pageLoaded: false
    }
  },
  methods: {
    addTournament (tournament) {
      this.$emit('add', tournament)
    },
    removeTournament (tournament) {
      this.$emit('remove', tournament)
    },
    scrollTo () {
      this.$nextTick(() => {
        const key = `day-${this.viewPortDate}`
        const position = this.$refs[key] && this.$refs[key][0]?.$el.offsetTop
        if (this.$q.screen.gt.xs) {
          if (Number.isInteger(position)) {
            this.$refs.scrollArea.setScrollPosition(position, 300)
          }
        } else {
          const offsetParent = this.$refs.list.offsetParent.offsetTop
          window.scrollTo({
            top: position + offsetParent - 50,
            behavior: 'smooth'
          })
        }
      })
    },
    scrollHandle ({ verticalPosition }) {
      if (!this.scrollHandleCheck) return

      Object.keys(this.$refs).forEach((key) => {
        if (key.startsWith('day-')) {
          const el = this.$refs[key][0]?.$el
          if (!el) return
          const { offsetTop, clientHeight } = el
          const end = offsetTop + clientHeight
          const date = key.replace('day-', '').replace(/-/gi, '/')

          if (verticalPosition >= offsetTop && verticalPosition <= end) {
            this.viewPortDate = this.$date(date).format('MM-DD-YY')
            this.$emit('viewday', date)
          }
        }
      })
    },
    scrollToTop () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      this.trackAction('Tournaments: List: Click back to top')
    },
    mobileScrollHandle () {
      this.showBackBtn = this.$q.screen.lt.sm && (window.scrollY > 600)
      this.scrollHandle({ verticalPosition: window.scrollY })
    }
  },
  computed: {
    prepared () {
      const res = []
      Object.keys(this.days).forEach((key) => {
        const d = key.replace(/-/gi, '/')
        res.push({
          label: this.$date(d).format('DD MMM, YYYY'),
          anchor: `day-${key}`,
          date: key,
          items: [...this.days[key].sort((a, b) => new Date(b.date.replace(/-/gi, '/')) - new Date(a.date.replace(/-/gi, '/'))).reverse()]
        })
      })
      return res.sort((a, b) => new Date(b.date.replace(/-/gi, '/')) - new Date(a.date.replace(/-/gi, '/'))).reverse()
    }
  },
  created () {
    window.scrollTo({
      top: 0
    })
  },
  mounted () {
    this.viewPortDate = this.$date().format('MM-DD-YY')
    this.scrollTo()
    if (this.$q.screen.lt.sm) {
      window.addEventListener('scroll', this.mobileScrollHandle)
    }
    setTimeout(() => {
      this.$nextTick(() => {
        this.pageLoaded = true
      })
    }, 1000)
  },
  watch: {
    selectedDate (val) {
      const date = this.$date(val).format('MM-DD-YY')
      if (date !== this.viewPortDate) {
        this.scrollHandleCheck = false
        this.viewPortDate = date
        this.scrollTo()
      }
    }
  },
  filters: {
    date: v => `${dayJs(v.replace(/-/gi, '/')).format('DD MMM, YYYY')}`
  },
  beforeDestroy () {
    if (this.$q.screen.lt.sm) {
      window.removeEventListener('scroll', this.mobileScrollHandle)
    }
  }
}
</script>

<style lang="scss" scoped>
.days-list{
  height: 100%;
  overflow: hidden;
  position: relative;
  &__loader{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(var(--app-height) - 200px)!important;
  }
  .current-day-mobile{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: $dark-sec;
    color: #fff;
    z-index: 999;
  }
  &__list{
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    min-height: 350px;
    height: calc(100% - 80px);
    overflow-y: auto;
    padding-right: 10px;
    margin-right: -10px;
    @media (max-width: $breakpoint-xs-max) {
      height: auto;
    }
  }
}
</style>
