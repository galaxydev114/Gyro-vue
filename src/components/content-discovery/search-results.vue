<template>
  <div v-if="!isSearchResultEmpty">
    <div class="row items-start justify-between justify-sm-none items-sm-center">
      <div>
        <h3 class="q-my-none q-my-sm-sm">Search Results</h3>
      </div>
      <q-space v-if="$q.screen.gt.xs" />
      <div class="column row-sm items-sm-center">
        <c-btn
          :flat="$q.screen.gt.xs"
          dense
          noHover
          size="sm"
          :textColor="$q.screen.gt.xs ? 'dark-pink' : ''"
          class="q-mb-md q-mb-sm-none q-mx-sm-lg"
          @click="clearSearch"
        >
          Clear Filters
        </c-btn>
        <div>
          {{ total }} activities found
        </div>
      </div>
    </div>

    <n-list
      :items="activities"
      :paginationOptions="{
        enabled: true,
        numPages: totalPages
      }"
      :page="page"
      @page="trackAction('CD: click Show more',); $emit('switch-page', $event)"
      @select-item="selectActivity"
    />
  </div>

  <div v-else
    class="empty-result"
  >
    <div class="empty-result__background q-mt-md" />
    <div class="text-h1 text-soft-tone q-my-sm">
      No Activities Found
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
    activities: {
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
    'n-list': () => import('@/components/common/content-list/list')
  },

  computed: {
    totalResults () {
      return this.activities?.length || 0
    },

    totalPages () {
      return Math.ceil(this.total / this.size)
    }
  },

  methods: {
    clearSearch () {
      this.$emit('clear-search')
    },

    selectActivity (type, id) {
      this.trackAction('Discovery: Search: Select activity', { type, id })
      this.$emit('select-activity', { type, id })
    }
  }
}
</script>

<style lang="scss" scoped>
.discovery-page {
  height: 100%;
  overflow-y: auto;
  &__header{
    padding: 55px;
    background: $dark-sec url("./../../assets/other/discovery-bg.svg") center no-repeat;
    background-size: 90% auto;
    min-height: 280px;
  }
  &__content{
    padding: 55px;
  }
  .slider-wrapper{
    margin-top: -180px;
    max-width: 1200px;
  }

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
}

.routine {
  height: 100%;
  width: 350px;
}
</style>
