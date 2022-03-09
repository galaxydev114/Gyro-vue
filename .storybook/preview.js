// Setup context for Storybook here
import 'quasar/dist/quasar.min.css'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'

import 'quasar/dist/quasar.css'
import '../src/css/quasar.variables.scss' // if you have an app.scss|sass|styl main file
import '../src/css/app.scss' // if you have an app.scss|sass|styl main file
import videoSrc from '@/directives/video-src'
import segmentAnalytics from '@/mixins/segmentAnalytics.mixin'

import Vue from 'vue';
import Quasar from 'quasar';
import VueDayjs from "vue-dayjs-plugin";
// Import Vue plugins
import Vuex from 'vuex';
import Segment from "@dansmaculotte/vue-segment";
import outsideClick from "@/directives/outside-click";

Vue.component('c-icon', () => import('@/components/common/icon'))
Vue.component('c-btn', () => import('@/components/common/button'))


// Plugins
Vue.use(VueDayjs)
Vue.use(Vuex);
Vue.use(Segment, {
  writeKey: process.env.SEGMENT_API,
  disabled: false
})

// directive
Vue.directive('video-src', videoSrc)
Vue.directive('outside-click', outsideClick)

// mixin
Vue.mixin(segmentAnalytics)

Vue.use(Quasar, {
  config: { dark: true },
})

Vue.prototype.$segment = {
  track: () => {}
}

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}
