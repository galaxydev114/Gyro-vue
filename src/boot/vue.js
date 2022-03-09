import VueDayjs from 'vue-dayjs-plugin'
import VueConfetti from 'vue-confetti'
import VueRollUp from 'vue-roll-up'

import roundMinsBlock from '@/util/roundMinsBlock.dayjsplugin'
import segmentAnalytics from '@/mixins/segmentAnalytics.mixin'

import detectScrollbar from '@/directives/detect-scrollbar'
import outsideClick from '@/directives/outside-click'
import blockNavIf from '@/directives/block-nav-if'
import videoSrc from '@/directives/video-src'
import LottieAnimation from 'lottie-vuejs'

async function initializeDayJs (Vue) {
  const dayJs = Vue.dayjs
  const isoWeek = await import('dayjs/plugin/isoWeek')

  dayJs.extend(require('dayjs/plugin/customParseFormat'))
  dayJs.extend(require('dayjs/plugin/duration'))
  dayJs.extend(require('dayjs/plugin/utc'))
  dayJs.extend(isoWeek.default)
  dayJs.extend((opt, c, d) => { d.timeOfDay = (time) => d('1970/01/01' + time) })
  dayJs.extend(roundMinsBlock)
}

export default ({ Vue }) => {
  // Components
  Vue.component('c-icon', () => import('@/components/common/icon'))
  Vue.component('c-btn', () => import('@/components/common/button'))
  Vue.component('c-text-divider', () => import('@/components/common/text-divider'))
  Vue.component(VueRollUp)

  // Plugins
  Vue.use(VueDayjs)
  Vue.use(VueConfetti)
  Vue.use(LottieAnimation)

  // Mixins
  Vue.mixin(segmentAnalytics)
  // Directives
  initializeDayJs(Vue)
  Vue.directive('detect-scrollbar', detectScrollbar)
  Vue.directive('outside-click', outsideClick)
  Vue.directive('block-nav-if', blockNavIf)
  Vue.directive('video-src', videoSrc)
  // Other
  window.addEventListener('load', () => {
    import('./sentry')
      .then(module => {
        module.default({ Vue })
      })
  })
  Vue.prototype.$asset_url = 'https://d2u76h3ivp32kq.cloudfront.net'
  Vue.prototype.$GOOGLE_OAUTH2_CLIENT_ID = '361191091697-4eiffqp6i0fqpvm7b7f2c3cogp77ai5n.apps.googleusercontent.com'
}
