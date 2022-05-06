<template>
  <div class="full-width">
    <div class="members-list flex" :class="{'members-list--active': toggledMembersList}">
      <div class="user-item row items-center" v-for="member in members" :key="member.name">
        <div class="q-mr-md">
          <img :src="member.avatar" />
        </div>
        <div class="text-weight-bold text-gray text-subtitle">
          {{ member.name }}
        </div>
      </div>
    </div>
    <div class="text-dark-pink text-center font-rift full-width q-pt-sm text-h6 q-mt-md cursor-clickable text-weight-bold"
         v-if="members && members.length > 5"
         @click="toggledMembersList = !toggledMembersList">
      {{ toggledMembersList ? 'hide' : 'show' }} players
      <c-icon icon="rightChevron" width="8px" :class="`rotate-${toggledMembersList ? 270 : 90} q-ml-sm`" />
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
  data () {
    return {
      toggledMembersList: false
    }
  }
}
</script>

<style lang="scss">
.members-list {
  max-height: 250px;
  overflow: hidden;
  transition: all .2s ease;
  &--active{
    max-height: 1000px;
  }
}

.user-item{
  width: 100%;
  padding: 6px 0;
  img{
    width: 32px;
    height: 32px;
    border-radius: 100%;
    object-fit: cover;
  }
}
</style>
