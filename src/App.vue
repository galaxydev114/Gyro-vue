<template>
  <div id="q-app">
    <router-view />

    <modal-system-upgrade/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ModalSystemUpgrade from './components/common/modal/modal-system-upgrade.vue'
import userGeo from '@/services/geo'

export default {
  components: {
    ModalSystemUpgrade
  },
  name: 'App',

  data: () => ({
    refSetScreenWidthCb: null
  }),

  created () {
    this.loadAllCoaches()
    userGeo.init()
  },

  mounted () {
    window.addEventListener('resize', this.updateScreenWidth)
    window.addEventListener('resize', this.appHeight)
    this.appHeight()
    this.appBg()
    this.trackAppRunningMode()
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.updateScreenWidth)
    window.removeEventListener('resize', this.appHeight)
  },

  methods: {
    ...mapActions({
      loadAllCoaches: 'coaches/getCoaches'
    }),
    appHeight () {
      const doc = document.documentElement
      doc.style.setProperty('--app-height', `${window.innerHeight - 1}px`)
    },
    async appBg () {
      let appBG
      const doc = document.documentElement

      try {
        appBG = `url('${this.$asset_url}/gyro/ui-assets/bg-image.webp') center no-repeat`
        doc.style.setProperty('--app-bg', appBG)
        return
      } catch (e) {}

      const img = require('@/assets/onboarding/bg-image.webp')
      appBG = `url(${img}) center no-repeat`
      doc.style.setProperty('--app-bg', appBG)
    },
    trackAppRunningMode () {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        this.trackAction('PWA: open application via separate icon as a standalone application')
      } else {
        this.trackAction('PWA: open application as browser tab')
        window.addEventListener('appinstalled', () => {
          this.trackAction('PWA: install as separate application')
        })
      }
    }
  }
}
</script>

<style>
:root {
  --app-height: 100%;
}
img, svg{
  user-select:none;
  -webkit-user-select:none;
  -webkit-touch-callout:none;
}
</style>
