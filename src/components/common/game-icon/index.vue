<template>
  <div class="c-game-icon"
       :class="{ 'c-game-icon--with-bg': withBg}"
       :style="`width: ${size}px; height: ${size}px; background-color: ${bgColor}`">
    <q-img :src="icons[icon]" />
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    withBg: {
      type: Boolean,
      required: false
    },
    bgColor: {
      type: String,
      default: 'transparent'
    },
    size: {
      type: String,
      default: () => '40'
    }
  },
  data () {
    return {
      icons: {
        aiming: require('assets/category-icons/aiming.svg'),
        editing: require('assets/category-icons/editing.svg'),
        building: require('assets/category-icons/building.svg'),
        mixed: require('assets/category-icons/mixed.svg'),
        fighting: require('assets/category-icons/fighting.svg'),
        gamesense: require('assets/category-icons/gamesense.svg'),
        br: require('assets/category-icons/br.svg'),
        vod_review: require('assets/category-icons/vod_review.svg'),
        rest: require('assets/category-icons/rest.svg'),
        knowledge: require('assets/category-icons/knowledge.svg'),
        stretches: require('assets/category-icons/stretches.svg'),
        arena: require('assets/category-icons/arena.svg'),
        box_fighting: require('assets/category-icons/box_fighting.svg')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.c-game-icon{
  display: inline-flex;
  border-radius: 100%;
  align-items: center;
  justify-content: center;
  .q-img{
    width: 100%;
    height: 100%;
  }

  &--with-bg{
    .q-img{
      width: 50%;
      height: 50%;
      filter: brightness(0) invert(1);
    }
  }
}
</style>
