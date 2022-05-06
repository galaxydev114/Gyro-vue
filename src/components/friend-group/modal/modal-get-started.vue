<template>
  <n-modal :visible="visible"
    showClose
    size="custom"
    @close="$emit('close')">
    <div class="modal-fg-getstarted-details relative-position">
      <div class="mask-bg">
      </div>
      <div class="q-py-lg q-px-lg-lg q-px-sm-md q-px-md-lg">
        <div class="text-center q-py-md">
          <div class="text-white q-px-lg-lg q-px-sm-sm" :class="{'text-h1': $q.screen.gt.md, 'text-h2': $q.screen.lt.sm}">
            We will find <span class="text-pink">the best group</span> for you with many options
          </div>
        </div>
        <div class="q-pt-md q-px-lg-lg q-px-md-sm q-px-sm-none">
          <div class="black-item q-py-lg row">
            <div class="col q-px-sm column items-center right-border">
              <img
                :src="levelIcon"
                :width="32"
                :height="32"/>
              <span class="q-mt-sm">
                Level
              </span>
            </div>
            <div class="col q-px-sm column items-center right-border">
              <img
                :src="platformIcon"
                :width="32"
                :height="32"/>
              <span class="q-mt-sm">
                Platform
              </span>
            </div>
            <div class="col q-px-sm column items-center right-border">
              <img
                :src="timeIcon"
                :width="32"
                :height="32"/>
              <span class="q-mt-sm">
                Time
              </span>
            </div>
            <div class="col q-px-sm column items-center right-border">
              <img
                :src="locationIcon"
                :width="32"
                :height="32"/>
              <span class="q-mt-sm">
                Location
              </span>
            </div>
            <div class="col q-px-sm column items-center">
              <img
                :src="languageIcon"
                :width="32"
                :height="32"/>
              <span class="q-mt-sm">
                Language
              </span>
            </div>
          </div>
        </div>
        <div class="q-mt-lg q-py-md-md q-py-sm-sm row justify-center">
          <q-btn unelevated
            class="btn-join-fg q-px-lg"
            :class="{'full-width': $q.screen.lt.sm}"
            color="dark-pink"
            @click="getStarted()">
            Let's Start
          </q-btn>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script>
import timeIcon from '@/assets/friend-group/time.svg'
import levelIcon from '@/assets/friend-group/level.svg'
import platformIcon from '@/assets/friend-group/platform.svg'
import locationIcon from '@/assets/friend-group/location.svg'
import languageIcon from '@/assets/friend-group/language.svg'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      timeIcon,
      levelIcon,
      platformIcon,
      locationIcon,
      languageIcon
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  methods: {
    getStarted () {
      this.$router.push('/friend-group')
    }
  }
}
</script>

<style lang="scss">
  .modal-fg-getstarted-details {
    width: 85vw;
    max-width: 764px;
    .black-item {
      background: $dark-sec;
      border: 1.5px solid rgba(223, 218, 231, 0.15);
      box-sizing: border-box;
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.07);
      border-radius: 15px;
      .right-border {
        border-right: 1.5px solid #DFDAE722;
      }
      span {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 140%;
        color: $gray-violet;
      }
    }
    .mask-bg {
      background-image: url('../../../assets/friend-group/mask-bg.png');
      min-height: 111px;
      position: absolute;
      width: 100%;
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      width: 100%;
    }
  }
</style>
