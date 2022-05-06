<template>
  <div class="full-width q-pr-md shared-block" :class="{'row justify-between items-center': !$q.screen.lt.sm, 'column q-mt-md': $q.screen.lt.sm}">
    <q-resize-observer @resize="resizeSharedBlock"/>
    <n-members-going :members="members" class="q-mr-md" />
    <div @click.stop="$emit('trigger')" :class="{'d-flex q-mt-md': $q.screen.lt.sm}">
      <c-btn size="xxs" noWidth v-if="!isGoing" :disabled="isDisabled">
        <c-icon icon="bell" />
        <span class="q-mx-xs" >Going</span>
      </c-btn>
      <c-btn size="xxs" noWidth outline v-else :disabled="isDisabled">
        <c-icon icon="check" width="14px" class="q-px-xs" />
        <span class="q-mx-xs" >Going</span>
      </c-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    members: {
      type: Array,
      default: () => []
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isGoing: {
      type: Boolean,
      default: true
    }
  },
  components: {
    'n-members-going': () => import('@/components/members-going')
  },
  data () {
    return {
      showOnlyBell: false,
      isMobile: false
    }
  },
  methods: {
    resizeSharedBlock (event) {
      const { width } = event
      this.showOnlyBell = width < 260
      this.isMobile = width < 350
    }
  }
}
</script>
