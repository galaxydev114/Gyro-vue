<template>
  <div class="user-card q-pa-md text-center" @click="$emit('click')">
    <div class="creator-avatar q-mb-md">
      <img class="full-width" alt="Profile image of collaborator" :src="image"/>
    </div>
    <div class="text-h4">
      {{ name }}
    </div>
    <div class="opacity-5 q-mt-sm">
      {{ tagline }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    tagline: {
      type: String,
      required: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.user-card{
  width: calc(100% - 4px);
  border-radius: 6px;
  border: 2px solid $soft-tone;
  cursor: pointer;
  box-sizing: border-box;
  transition: all .3s ease;

  img {
    border-radius: 100%;
    max-width: 80%;
  }

  &:hover {
    background: $dark-one;
    border-color: $dark-one;
  }
}
</style>
