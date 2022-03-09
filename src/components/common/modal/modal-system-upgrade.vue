<template>
  <fade-transition>
    <div v-if="isUpgradeModalVisible" class="upgrade-modal row">
      <div
        class="upgrade-modal__close"
        @click="hideModal"
      >
        <q-icon name="close"/>
      </div>

      <div class="column justify-between align-top q-mr-sm">
        <div class="upgrade-modal__icon">
          <img :src="require('@/assets/icons/notification.svg')"/>
        </div>
      </div>

      <div class="column">
        <p>Updates available, please <br/> refresh the platform to get them</p>
        <c-btn
          color="light-pink"
          text-color="pink"
          size="xs"
          @click="refreshPage"
        >
          Refresh now
        </c-btn>
      </div>
    </div>
  </fade-transition>
</template>

<script>
import { events, systemEventBus } from '@/events/system'
import FadeTransition from '@/animations/fade-transition.vue'

export default {
  components: {
    FadeTransition
  },

  data () {
    return {
      isUpgradeModalVisible: false
    }
  },

  mounted () {
    systemEventBus.addEventListener(events.REQUEST_REFRESH, this.showModal)
  },

  beforeDestroy () {
    systemEventBus.removeEventListener(events.REQUEST_REFRESH, this.showModal)
  },

  methods: {
    showModal () {
      this.isUpgradeModalVisible = true
    },
    hideModal () {
      this.isUpgradeModalVisible = false
    },
    refreshPage () {
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.upgrade-modal {
  position: fixed;
  background-color: #383196;
  padding: 0.7rem;
  border: 2px solid #594FE3;
  border-radius: 10px;
  right: 1rem;
  bottom: calc(env(safe-area-inset-bottom) + 1rem);
  z-index: 10000;
  min-width: 300px;

  @media (max-width: $breakpoint-sm-max) {
    right: unset;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__close {
    cursor: pointer;
    position: absolute;
    top: 5px;
    right: 5px;
  }

  p {
    font-family: 'Roboto';
    font-weight: 600;
    margin-bottom: 8px;
  }

  &__icon {
    width: 40px;
    height: 40px;
    background-color: #594FE3;
    border-radius: 50%;
    text-align: center;
    line-height: 48px;
  }
}
</style>
