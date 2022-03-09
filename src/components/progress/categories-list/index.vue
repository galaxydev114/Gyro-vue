<template>
  <div>
    <div class="row justify-between items-center q-mt-sm  q-mb-md">
      <div class="text-h5 text-weight-regular">
        Skills breakdown
      </div>
      <!-- <c-btn flat no-width dense textColor="dark-pink">
        view more
      </c-btn> -->
    </div>
    <div class="row q-gutter-sm items-stretch justify-between q-mb-lg no-wrap">
      <div v-for="cat in mainCategories" :key="cat.name" class="cat-item">
        <div class="q-py-md bordered column items-center justify-center">
          <routine-category :category="cat.name" size="24px" hideText />
          <span class="q-mt-sm text-h5">
                {{ cat.value }}
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
    }
  },
  components: {
    'routine-category': () => import('@/components/common/activity-category')
  },
  computed: {
    mainCategories () {
      // sort desc by value and select biggest 5
      return this.categories.slice(0).sort((a, b) => b.value - a.value).slice(0, 5)
    }
  }
}
</script>

<style lang="scss" scoped>
.cat-item{
  width: 65px;
}
.bordered {
  border: 1px solid $soft-tone;
  border-radius: 6px;
}
</style>
