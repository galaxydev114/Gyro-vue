<template>
  <div @click="pointer && $emit('click')" class="user-avatar" :class="{'user-avatar--pointer': pointer}" :style="`width: ${size}px; height: ${size}px`">
    <span class="font-rift text-weight-bold" :style="`font-size: ${fontSize}`">
    {{ showName }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    emailAddress: {
      type: String,
      require: true
    },
    userName: {
      type: String,
      require: true
    },
    size: {
      type: Number,
      default: 100
    },
    pointer: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showName () {
      const emailAddress = this.emailAddress?.split('@')[0]
      const avatarNickname = this.userName || emailAddress
      return avatarNickname?.charAt(0) + avatarNickname?.charAt(avatarNickname?.length - 1)
    },
    fontSize () {
      if (this.size >= 140) {
        return '92px'
      }
      if (this.size >= 100) {
        return '72px'
      }
      if (this.size >= 70) {
        return '42px'
      }
      if (this.size >= 50) {
        return '32px'
      }
      return '18px'
    }
  }
}
</script>

<style lang="scss">
.user-avatar{
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 100%;
  color: #F4D8E9;
  background: url("./../../../assets/other/user-avatar-bg.webp") center no-repeat;
  background-size: cover;
  &--pointer {
    cursor: pointer;
  }
}
</style>
