import { Store } from 'vuex'

export default {
  title: 'Other'
}

export const TextDivider = () => ({
  title: 'TextDivider',
  components: {
    'c-text-divider': () => import('@/components/common/text-divider')
  },
  methods: {
    textClass (align) {
      return `col-12 q-my-md text-${align}`
    }
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div v-for="align in ['left', 'center', 'right']"
           :class="textClass(align)"
           :key="align">
        <c-text-divider>
          Simple text with {{ align }} text align
        </c-text-divider>
      </div>
    </div>
    </div>`
})

export const Season7 = () => ({
  title: 'Season7',
  components: {
    'c-season-7-ntf': () => import('@/components/notifications/season-7')
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div class="col-12">
        <c-season-7-ntf/>
      </div>
    </div>
    </div>`
})

export const NextTournament = () => ({
  title: 'NextTournament',
  components: {
    'n-next-tournament': () => import('@/components/dashboard/tournament/next-tournament')
  },
  computed: {
    tournament () {
      return {
        title: 'Tournament name',
        startAt: new Date()
      }
    }
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div class="col-4">
        <n-next-tournament />
      </div>
      <div class="col-4">
        <n-next-tournament :tournament="tournament"/>
      </div>
      <div class="col-4">
        <n-next-tournament :tournament="tournament" oneline/>
      </div>
    </div>
    </div>`
})

export const PageLoader = () => ({
  title: 'PageLoader',
  components: {
    'page-loader': () => import('@/components/common/page-loader')
  },
  computed: {
    tournament () {
      return {
        title: 'Tournament name',
        startAt: new Date()
      }
    }
  },
  template: `
    <div>
      <page-loader />
    </div>`
})

export const Difficulty = () => ({
  title: 'Difficulty',
  components: {
    'n-difficulty': () => import('@/components/training-routine/difficulty')
  },
  computed: {
    difficulties () {
      return ['EASY', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', 'DEFAULT']
    }
  },
  template: `
    <div>
      <div class="row">
        <div class="col-3 q-ma-lg" v-for="d in difficulties">
          <n-difficulty :difficulty="d" />
        </div>
      </div>
    </div>`
})

export const ApprovedBy = () => ({
  title: 'ApprovedBy',
  components: {
    'approved-by': () => import('@/components/training-routine/approved-by/_approved-by')
  },
  template: `
    <div>
      <div class="row">
        <div class="col-3 q-ma-lg">
          <approved-by name="Novos"></approved-by>
        </div>
      </div>
    </div>`
})

export const ActivityCounter = () => ({
  title: 'ActivityCounter',
  components: {
    'n-activity-counter': () => import('@/components/training-routine/activity-counter')
  },
  template: `
    <div>
      <div class="row">
        <div class="col-3 q-ma-lg">
          <n-activity-counter :counter="3"/>
        </div>
      </div>
    </div>`
})

export const ActivityCategory = () => ({
  title: 'ActivityCategory',
  components: {
    'routine-category': () => import('@/components/common/activity-category')
  },
  computed: {
    categories () {
      return [
        'AIMING',
        'EDITING',
        'BUILDING',
        'FIGHTING',
        'GAMESENSE',
        'WORKSHOP',
        'BR',
        'VOD Review',
        'REST',
        'KNOWLEDGE',
        'WARM UP'
      ]
    }
  },
  template: `
    <div>
      <div class="row">
        <div class="col-12">
          Full - default
        </div>
        <div class="col q-ma-lg" v-for="cat in categories">
          <routine-category :category="cat"/>
        </div>

        <div class="col-12 q-mt-xl">
          Full - xsmall
        </div>
        <div class="col q-ma-lg" v-for="cat in categories">
          <routine-category :category="cat" xsmall/>
        </div>

        <div class="col-12 q-mt-xl">
          Full - hideText
        </div>
        <div class="col q-ma-lg" v-for="cat in categories">
          <routine-category :category="cat" hideText/>
        </div>
      </div>
    </div>`
})

export const multimedia = () => ({
  title: 'multimedia',
  components: {
    'n-multimedia': () => import('@/components/common/multimedia')
  },
  template: `
    <div>
      <div class="row q-col-gutter-lg">
        <div class="col-6">
          <div class="q-mb-lg">
            Image
          </div>
          <n-multimedia src="https://cdn141.picsart.com/332446954067201.jpg" class="full-width"/>
        </div>
        <div class="col-6">
          <div class="q-mb-lg">
            YouTube video
          </div>
          <n-multimedia src="https://www.youtube.com/embed/bmVKaAV_7-A" class="full-width"/>
        </div>
      </div>
    </div>`
})

export const Timer = () => ({
  title: 'Timer',
  components: {
    'n-timer': () => import('@/components/common/timer/squareHorizontalTimer')
  },
  template: `
    <div>
      <div class="row q-col-gutter-lg">
        <div class="col-6">
          <n-timer />
        </div>
      </div>
    </div>`
})

export const TimerFull = () => ({
  title: 'TimerFull',
  components: {
    'n-timer': () => import('@/components/common/timer/squareHorizontalFullTimer')
  },
  template: `
    <div>
      <div class="row q-col-gutter-lg">
        <div class="col-6">
          <n-timer />
        </div>
      </div>
    </div>`
})

export const UserAvatar = () => ({
  title: 'UserAvatar',
  components: {
    'user-avatar': () => import('@/components/common/user-avatar')
  },
  template: `
    <div>
      <div class="row q-col-gutter-lg items-center">
        <div class="col">
          <user-avatar emailAddress="some@domai.com" userName="NickName" />
        </div>
        <div class="col">
          <user-avatar emailAddress="some@domai.com" userName="NickName" pointer />
        </div>
        <div class="col">
          <user-avatar emailAddress="some@domai.com" userName="NickName" size="50" />
        </div>
      </div>
    </div>`
})

export const UnknownUserAvatar = () => ({
  title: 'UnknownUserAvatar',
  components: {
    'c-uknown-user-icon': () => import('@/components/common/icons/uknown-user.vue')
  },
  template: `
    <div>
      <div class="row q-col-gutter-lg items-center">
        <div class="col">
          <c-uknown-user-icon />
        </div>
      </div>
    </div>`
})

export const BackToTop = () => ({
  title: 'BackToTop',
  components: {
    'back-to-top': () => import('@/components/common/button/backToTop')
  },
  template: `
    <div>
      <back-to-top />
    </div>`
})

export const feedback = () => ({
  title: 'feedback',
  components: {
    'n-feedback': () => import('@/components/common/feedback')
  },
  template: `
    <div>
      <div class="row">
        <n-feedback />
      </div>
    </div>`,
  store: new Store({
    modules: {
      user: {
        namespaced: true,
        getters: {
          currentUser: () => ({
            email: 'john_doe@novos.gg'
          }),
          currentUserComputedName: () => 'John Doe'
        }
      }
    }
  })
})
