<template>
  <div class="training-plan-tags">
    <div class="training-plan-tags__item">
      <div class="text-h4 text-uppercase font-rift opacity-25">
        Weekly focus:
      </div>
      <div v-for="tag in list"
           :key="tag.category"
           @click="$emit('click', tag)"
           :class="`training-plan-tags__tag training-plan-tags__tag--${ tag.category.toLowerCase() }`">
        <routine-category :category="tag.category.toLowerCase()" size="14px" hideText class="q-mr-sm" />
        <span>{{ tag.label }}</span>
      </div>
    </div>
    <div class="training-plan-tags__item">
      <div class="text-h4 text-uppercase font-rift opacity-25">
        NEXT TOURNAMENT:
      </div>
      <div class="text-white">
        <n-next-tournament
          oneline
          :tournament="nextTournament"
          @click="trackAction('Tournaments: Training board: Click here in top of training board empty state'); $router.push({ name: 'Tournaments' })"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nextTournament: {
      props: Object
    },
    list: {
      type: Array
    }
  },
  components: {
    'routine-category': () => import('@/components/common/activity-category'),
    'n-next-tournament': () => import('@/components/dashboard/tournament/next-tournament')
  }
}
</script>

<style lang="scss" scoped>
$categories: (
  "aiming": #E7A957,
  "mechanics": #6533D1,
  "gamesense": #4FD1E3,
  "mentality": #91C426,
  );

.training-plan-tags{
  $root: &;
  padding: 10px 0;
  margin: 15px 0 0;
  display: flex;
  position: relative;
  z-index: 999;
  white-space: nowrap;
  &__item{
    padding-right: 20px;
    margin-right: 20px;
    border-right: 1px solid #433558;
    display: flex;
    align-items: center;
    color: #DFDAE7;
    max-width: calc(100% - 400px);
    overflow: hidden;
    .text-h4{
      margin-right: 10px;
    }
    &:last-child{
      margin: 0;
      padding: 0;
      border: none;
    }
  }
  &__tag{
    padding: 4px 12px 4px 8px;
    border-radius: 6px;
    display: flex;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    margin-left: 10px;
    @each $name, $color in $categories {
      &--#{$name} {
        border: 2px solid $color;
        background: rgba($color, .3);
      }
    }
  }
  @media (max-width: $breakpoint-tablet-min) {
    flex-direction: column;
    margin: 5px 0 0;
    border-bottom: none;
    padding: 5px 15px 0;
    border-top: none;
    border-bottom: 2px solid #433558;
    #{$root}__item{
      padding: 20px 0 4px 0;
      margin: 0 0 10px 0;
      border-right: none;
    }
  }
  @media (max-width: $breakpoint-tablet-max) {
    #{$root}__item{
      max-width: 100%;
      position: relative;
      padding-top: 20px;
      .text-h4{
        font-size: 12px;
        position: absolute;
        top: 0;
        left: 0;
        font-family: "Roboto", sans-serif;
      }
    }
    #{$root}__tag{
      margin: 0 6px 0 0;
      max-width: calc( 50% - 7px );
      span{
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
