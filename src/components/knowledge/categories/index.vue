<template>
  <div class="categories-list">
    <div class="text-h4 q-mb-md">
      Categories
    </div>
    <div class="categories-list__list">
      <div class="categories-item"
           :class="{'categories-item--active': !selected}"
           @click="selectCat('*')">
        <div class="flex items-center text-h5 text-gray">
          <c-icon icon="allCategories" class="q-mr-sm" />
          All
        </div>
        <div class="text-subtitle2 opacity-5">
          {{ totalCount }} videos
        </div>
      </div>
      <n-item v-for="cat in list"
              :is-active="selected === cat.name"
              @click="selectCat(cat)"
              :key="`filter-cat-${cat.name}`"
              :name="cat.name"
              :count="cat.count"/>
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
    totalCount: {
      type: Number,
      default: () => 0
    }
  },
  components: {
    'n-item': () => import('./item')
  },
  data () {
    return {
      selected: '*'
    }
  },
  methods: {
    selectCat (cat) {
      this.$emit('select', cat.name)
      this.selected = cat.name
    }
  },
  computed: {
    list () {
      return this.categories.map((el) => {
        return {
          name: el.name.toLowerCase(),
          count: el.count
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: $breakpoint-xs-max){
  .categories-list{
    margin-bottom: 0;
    &__list{
      max-height: 450px;
      overflow: auto;
      .categories-item:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
