<template>
  <div>
    <div class="row items-stretch justify-between q-mb-lg">
      <div v-for="(cat, index) in this.categories" :key="cat.label" class="col-md col-12">
        <div class="q-py-lg bordered column items-center justify-center q-ma-lg-lg q-ma-md-sm q-my-sm cat-score-item"
          :class="[`cat-score-item--${cat.class}`, {'active': activeIndex-1 === index}]" >
          <c-skill-icons v-slot="{ getIcon }">
            <img
                :src="getIcon(cat.icon)"
                :width="64"
                :height="64"/>
          </c-skill-icons>
          <span class="q-mt-sm text-h2 text-uppercase">
            {{ cat.label }}
          </span>
          <span class="q-mt-sm text-h5">
            {{ cat.description }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 2
    }
  },
  components: {
    'c-skill-icons': () => import('@/components/common/friend-group-icons-manager')
  }
}
</script>

<style lang="scss" scoped>
.text-h5 {
  font-family: Rift;
}
.cat-score-item {
  border-radius: 6px;
  opacity: 0.3;
  &--beginner{
    border: 1.5px solid $orange;
    background: rgba(227, 79, 79, 0.3);
  }
  &--intermediate{
    border: 1.5px solid $lightBlue;
    background: rgba(62, 133, 200, 0.3);
  }
  &--advanced{
    border: 1.5px solid $green;
    background: rgba(44, 173, 109, 0.3);
  }
  &--pros{
    border: 1.5px solid $yellow;
    background: rgba(231, 169, 87, 0.3);
  }
  &.active {
    opacity: 1;
  }
}
</style>
