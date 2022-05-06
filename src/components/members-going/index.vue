<template>
  <div class="members-going">
    <div class="members-going__avatars" :style="`width: ${widthByMembersCount}`" v-if="members && members.length">
      <img v-for="member in members.slice(0, 4)" :src="member.avatar" :key="member.name" />
    </div>
    <div>
      {{ members.length }} members<br>Going
    </div>
  </div>
</template>

<script>
export default {
  props: {
    members: {
      type: Array,
      required: true
    }
  },
  computed: {
    widthByMembersCount () {
      const count = this.members.length ?? 0
      if (count >= 4) {
        return '70px'
      }
      if (count >= 3) {
        return '60px'
      }
      if (count >= 2) {
        return '45px'
      }
      return '40px'
    }
  }
}
</script>

<style lang="scss" scoped>
.members-going{
  line-height: 16px;
  display: flex;
  align-items: center;
  text-align: left;
  &__avatars{
    display: inline-block;
    position: relative;
    height: 36px;
    margin-right: 8px;
    img{
      border-radius: 100%;
      border: 3px solid $dark;
      width: 36px;
      height: 36px;
      object-fit: cover;
      position: absolute;
      top: 0;
      z-index: 4;
      left: 0;
      &:nth-child(2) {
        left: 10px;
        z-index: 3;
      }
      &:nth-child(3) {
        left: 20px;
        z-index: 2;
      }
      &:nth-child(4){
        left: 30px;
        z-index: 1;
      }
    }
  }
}
</style>
