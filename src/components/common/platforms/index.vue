<template>
  <div class="available-platforms">
    <template v-for="platform in platforms">
      <img
        :src="images[platform]"
        v-if="isEnable(platform)"
        :key="platform"
        :alt="platform"
      />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    desktop: {
      type: Boolean,
      default: false
    },
    mobile: {
      type: Boolean,
      default: false
    },
    ps: {
      type: Boolean,
      default: false
    },
    xbox: {
      type: Boolean,
      default: false
    },
    nintendo: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      images: {
        desktop: require('@/assets/platforms/desktop.svg'),
        mobile: require('@/assets/platforms/mobile.svg'),
        ps: require('@/assets/platforms/ps.svg'),
        xbox: require('@/assets/platforms/xbox.svg'),
        nintendo: require('@/assets/platforms/nintendo.svg')
      }
    }
  },
  computed: {
    platforms () {
      return [
        'desktop',
        'mobile',
        'ps',
        'xbox',
        'nintendo'
      ]
    }
  },
  methods: {
    isEnable (type) {
      return this[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.available-platforms{
  display: flex;
  align-items: center;
  img{
    width: auto;
    height: 18px;
    margin-right: 15px;
    opacity: .7;
    &:last-child{
      margin: 0;
    }
  }
}
</style>
