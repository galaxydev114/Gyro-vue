<template>
  <div v-if="!isSearchResultEmpty">
    <div class="row items-center">
      <div>
        <h3>Search Results</h3>
      </div>
      <q-space />
      <div class="row items-center">
        <c-btn
          flat
          dense
          noHover
          size="sm"
          textColor="dark-pink"
          class="q-mx-lg"
          @click="clearSearch"
        >
          Clear Filters
        </c-btn>
        <div>
          {{ total }} workshops found
        </div>
      </div>
    </div>

    <n-list
      :items="workshops"
      :paginationOptions="{
        enabled: true,
        numPages: totalPages
      }"
      :page="page"
      @page="$emit('switch-page', $event)"
    >
      <template v-slot="{item}">
        <n-workshop-card class="workshop-card" v-bind="item"
                        @click="selectWorkshop" />
      </template>
    </n-list>
  </div>

  <div v-else
    class="empty-result"
  >
    <div class="empty-result__background q-mt-md" />
    <div class="text-h1 text-soft-tone q-my-sm">
      No Workshops Found
    </div>
    <c-btn
      flat
      dense
      noHover
      size="sm"
      textColor="dark-pink"
      class="q-mb-xl"
      @click="clearSearch"
    >
      Clear Search Filters
    </c-btn>
  </div>
</template>

<script>
export default {
  props: {
    workshops: {
      type: Array
    },
    page: {
      type: Number
    },
    total: {
      type: Number
    },
    size: {
      type: Number
    },
    isSearchResultEmpty: {
      type: Boolean,
      default: false
    }
  },

  components: {
    'n-list': () => import('@/components/common/content-list/list'),
    'n-workshop-card': () => import('@/components/gamesense-workshop/card.vue')
  },

  computed: {
    totalResults () {
      return this.workshops?.length || 0
    },

    totalPages () {
      return Math.ceil(this.total / this.size)
    }
  },

  methods: {
    clearSearch () {
      this.$emit('clear-search')
    },

    selectWorkshop (id) {
      this.trackAction('Workshops: Search: Select workshop', id)
      this.$emit('select', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-result{
  border: 2px dashed $soft-tone;
  display: flex;
  align-items: center;
  text-align: center;
  padding: 16px 16px 8px;
  min-height: 128px;
  height: 100%;
  border-radius: 6px;
  flex-direction: column;
  &__background {
    width: 100%;
    height: 140px;
    background: linear-gradient(180deg, rgba(35, 21, 56, 0) 0%, #231538 67.19%),
      url("./../../assets/trainingRoutine/activities.svg") center no-repeat;
    background-position: center top;
    background-size: auto 180px;
  }
}
</style>
