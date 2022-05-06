<template>
  <article class="discovery-page">

    <div class="discovery-page__header">
      <div style="max-width: 800px" class="q-mx-auto">
        <div class="text-h1 full-width text-center">
          Discover Activities
        </div>
        <div class="text-h5 full-width text-center opacity-5 q-mt-md text-weight-regular">
          Choose the perfect routine for what you want to work on
        </div>
        <div class="row q-mt-lg">
          <div class="filter-item col-sm-6 q-mb-md q-mb-sm-none q-px-sm">
            <q-input
              outlined
              clearable
              class="full-width bg-soft-tone"
              placeholder="Search..."
              :value="searchQuery"
              @input="setSearchQuery"
            >
              <template v-slot:prepend>
                <img src="@/assets/icons/search.svg" alt="search icon"/>
              </template>
            </q-input>
          </div>
          <div class="filter-item col-sm-3 q-mb-md q-mb-sm-none q-px-sm">
            <q-select
              filled
              clearable
              color="dark-pink"
              :label-slot="!selectedCategory"
              :value="selectedCategory"
              :options="categories"
              :popup-content-style="{ height:'300px' }"
              :option-label="capitalizeLabel"
              @input="setSearchCategory">
              <span slot="label">
                All categories
              </span>
            </q-select>
          </div>
          <div class="filter-item col-sm-3 q-mb-md q-mb-sm-none q-px-sm">
            <q-select
              filled
              clearable
              color="dark-pink"
              :label-slot="!selectedDifficulty"
              :value="selectedDifficulty"
              :options="difficulties"
              :popup-content-style="{ 'max-height':'300px' }"
              :option-label="capitalizeLabel"
              @input="setSearchDifficulty">
              <span slot="label">
                All difficulties
              </span>
            </q-select>
          </div>
        </div>
      </div>
    </div>

    <transition-group tag="div" class="discovery-page__content" name="block">
      <div class="discovery-page__search-result full-width"
           v-if="isSearchNotEmpty"
           key="search-result">
        <search-result
          :activities="paginatedSearchedActivities"
          :page="computedPaginatedPage"
          :total="computedPaginatedTotal"
          :size="computedPaginatedSize"
          :isSearchResultEmpty="isSearchResultEmpty"
          @switch-page="setSearchPage"
          @clear-search="clearSearch"
          @select-activity="({ type, id }) => selectActivity(type, id)"
        />
      </div>

      <div class="discovery-page__main full-width"
           v-if="!isSearchNotEmpty"
           key="main">
        <div class="slider-wrapper q-mx-auto">
          <n-3d-slider :records="popularActivities">
            <template v-slot="{slide}">
              <n-slide
                :title="slide.title"
                :description="slide.subtitle"
                :image="slide.thumbnail"
                @click="selectActivity('routine', slide.id)"
              />
            </template>
          </n-3d-slider>
        </div>

        <n-horizontal-list
          title="Newest"
          :records="newestActivities"
        >
          <template v-slot="{record}">
            <n-routine-card class="routine-card" v-bind="record" shortApproved
                            @click="selectActivity('routine', $event)" />
          </template>
        </n-horizontal-list>

        <n-horizontal-list
          title="Exclusive"
          :records="exclusiveActivities"
        >
          <template v-slot="{record}">
            <n-routine-card class="routine-card" v-bind="record" shortApproved
                            @click="selectActivity('routine', $event)" />
          </template>
        </n-horizontal-list>

        <n-horizontal-list
          title="Browse by category"
          :records="skills"
        >
          <template v-slot="{record}">
            <n-category
              v-bind="record"
              @click="setSearchCategory"
            />
          </template>
        </n-horizontal-list>

        <h3>All Activities</h3>
        <n-list
          :items="allActivities"
          :paginationOptions="{
            enabled: true,
            infinite: true,
            numPages: allActivitiesNumPages,
            blockShowMore: true
          }"
          @page="trackAction('CD: Paginated search', {page: searchPage}); $emit('get-next-page')"
          @select-item="selectActivity"
        />
      </div>
    </transition-group>
  </article>
</template>

<script>
export default {
  props: {
    newestActivities: {
      type: Array,
      default: () => []
    },
    exclusiveActivities: {
      type: Array,
      default: () => []
    },
    popularActivities: {
      type: Array,
      default: () => []
    },
    skills: {
      type: Array,
      default: () => []
    },
    allActivities: {
      type: Array,
      default: () => []
    },
    paginatedSearchedActivities: {
      type: Array,
      default: () => []
    },
    paginatedSearchState: {
      type: Object
    },
    allActivitiesNumPages: {
      type: Number
    },
    page: {
      type: Number
    }
  },

  data () {
    return {
      searchQuery: '',
      selectedCategory: '',
      selectedDifficulty: '',
      searchPage: 1
    }
  },

  components: {
    'n-horizontal-list': () => import('@/components/common/content-list/horizontal-list.vue'),
    'n-list': () => import('@/components/common/content-list/list'),
    'n-routine-card': () => import('@/components/training-routine/card.vue'),
    'n-category': () => import('@/components/content-discovery/category.vue'),
    'n-3d-slider': () => import('@/components/3d-slider'),
    'n-slide': () => import('@/components/content-discovery/main-slider'),
    'search-result': () => import('@/components/content-discovery/search-results.vue')
  },

  computed: {
    computedPaginatedPage () {
      return this.paginatedSearchState?.page
    },
    computedPaginatedTotal () {
      return this.paginatedSearchState?.total
    },
    computedPaginatedSize () {
      return this.paginatedSearchState?.size
    },
    categories () {
      return this.skills.map(({ skill }) => skill)
    },

    difficulties () {
      return ['EASY', 'INTERMEDIATE', 'ADVANCED']
    },

    isSearchResultEmpty () {
      return Boolean(this.paginatedSearchedActivities.length === 0 &&
        (this.searchQuery || this.selectedCategory || this.selectedDifficulty))
    },

    isSearchNotEmpty () {
      return Boolean(this.searchQuery || this.selectedCategory || this.selectedDifficulty)
    }
  },

  methods: {
    selectActivity (type, id) {
      this.trackAction('CD: Click Training Routine', { type, id })
      this.$emit('select-activity', { type, id })
    },

    setSearchQuery (event) {
      this.searchQuery = event
      this.searchPage = 1
      this.searchActivities()
      this.trackAction('CD: filter routines by free search')
    },

    setSearchCategory (event) {
      this.selectedCategory = event
      this.searchPage = 1
      this.searchActivities()
      this.trackAction('CD: filter routines by category', { category: event })
    },

    setSearchDifficulty (event) {
      this.selectedDifficulty = event
      this.searchPage = 1
      this.searchActivities()
      this.trackAction('CD: filter routines by difiiculty level', { difficulty: event })
    },

    setSearchPage (event) {
      this.searchPage = event
      this.searchActivities()
    },

    searchActivities () {
      this.trackAction('CD: Search')
      this.$emit('search', {
        query: this.searchQuery,
        category: this.selectedCategory,
        difficulty: this.selectedDifficulty,
        page: this.searchPage
      })
    },

    clearSearch () {
      this.searchQuery = ''
      this.selectedCategory = ''
      this.selectedDifficulty = ''
      this.searchPage = 1
      this.$emit('clearSearch')
      this.trackAction('CD: Clear search')
    },

    capitalizeLabel (str) {
      return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.discovery-page {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  &__header{
    padding: 55px;
    background: $dark-sec url("./../../assets/other/discovery-bg.svg") center no-repeat;
    background-size: 90% auto;
    min-height: 380px;
    position: relative;
    @media (max-width: $breakpoint-md-max){
      padding: 30px;
    }
    @media (max-width: $breakpoint-sm-max){
      padding: 20px;
      .filter-item{
        margin-bottom: 20px;
        &:nth-child(1){
          width: 100%;
        }
        &:nth-child(2){
          width: calc(50% - 10px);
          margin-right: 10px;
        }
        &:nth-child(3){
          width: calc(50% - 10px);
          margin-left: 10px;
        }
      }
    }
    @media (max-width: $breakpoint-mobile-max){
      .filter-item{
        margin: 0 0 20px 0!important;
        &:nth-child(1){
          width: 100%;
        }
        &:nth-child(2){
          width: 100%;
        }
        &:nth-child(3){
          width: 100%;
        }
      }
    }
  }
  &__search-result,
  &__main{
    padding: 40px 55px;
    @media (max-width: $breakpoint-md-max){
      padding: 30px;
    }
    @media (max-width: $breakpoint-sm-max){
      padding: 20px;
    }
  }
  .slider-wrapper{
    margin-top: -170px;
    max-width: 1200px;
    @media (max-width: $breakpoint-sm-max){
      margin-top: -120px;
    }
    @media (max-width: $breakpoint-mobile-max){
      margin-top: 0;
    }
  }
}

.routine-card {
  height: 100%;
  width: 350px;
}

.block-leave-active{
  transition: 0.2s;
}
.block-enter-active {
  transition: 0.8s;
}
.block-enter {
  opacity: 0;
  position: absolute;
  top: 380px;
}
.block-leave-to {
  opacity: 0;
  position: absolute;
  top: 380px;
}
</style>
