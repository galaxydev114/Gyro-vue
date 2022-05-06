<template>
  <article class="workshop-page">

    <div class="workshop-page__header">
      <div style="max-width: 800px" class="q-mx-auto">
        <div class="text-h1 full-width text-center">
          Workshops
        </div>
        <div class="row q-mt-lg">
          <div class="col-12 col-md-6 q-pb-md q-pb-md-none q-px-sm">
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

          <div class="col-12 col-md-3 q-pb-md q-pb-md-none q-px-sm">
            <q-select
              filled
              clearable
              color="dark-pink"
              :label-slot="!selectedCategory"
              :value="selectedCategory"
              :options="categoryLabels"
              :popup-content-style="{ height:'300px' }"
              @input="setSearchCategory">
              <span slot="label">
                All categories
              </span>
            </q-select>
          </div>

          <div class="col-12 col-md-3 q-px-sm">
            <q-select
              filled
              clearable
              color="dark-pink"
              :label-slot="!selectedDifficulty"
              :value="selectedDifficulty"
              :options="difficulties"
              :popup-content-style="{ 'max-height':'300px' }"
              @input="setSearchDifficulty">
              <span slot="label">
                All difficulties
              </span>
            </q-select>
          </div>
        </div>
      </div>
    </div>

    <transition-group tag="div" class="workshop-page__content" name="block">
      <div class="workshop-page__search-result full-width"
           v-if="isSearchNotEmpty"
           key="search-result">
        <search-result
          :workshops="paginatedSearchedWorkshops"
          :page="paginatedSearchState ? paginatedSearchState.page : null"
          :total="paginatedSearchState.total"
          :size="paginatedSearchState.size"
          :isSearchResultEmpty="isSearchResultEmpty"
          @switch-page="setSearchPage"
          @clear-search="clearSearch"
          @select="selectWorkshop"
        />
      </div>

      <div class="workshop-page__main full-width"
           v-if="!isSearchNotEmpty"
           key="main">
        <n-horizontal-list
          title="New and relevant"
          :records="newAndRelevant"
        >
          <template v-slot="{record}">
            <n-workshop-card class="workshop-card" v-bind="record"
                            @click="selectWorkshop" />
          </template>
        </n-horizontal-list>

        <n-horizontal-list
          v-if="categoryLabels.length > 1"
          title="Category"
          :records="categoryLabels"
        >
          <template v-slot="{record}">
            <div class="items-center fit-content">
            </div>
            <div class="categories-item"
                @click="setSearchCategory(record)">
              <div class="text-h5 text-uppercase text-center">
                {{ record }}
              </div>
            </div>
          </template>
        </n-horizontal-list>

        <h3>All Workshops</h3>
        <n-list
          :items="allWorkshops"
          :paginationOptions="{
            enabled: true,
            infinite: true,
            numPages: allWorkshopsNumPages,
            blockShowMore: true
          }"
          :page="page"
          @page="$emit('get-next-page')"
        >
          <template v-slot="{item}">
            <n-workshop-card class="workshop-card" v-bind="item"
                            @click="selectWorkshop" />
          </template>
        </n-list>
      </div>
    </transition-group>
  </article>
</template>

<script>
export default {
  props: {
    newAndRelevant: {
      type: Array,
      default: () => []
    },
    categories: {
      type: Array,
      default: () => []
    },
    allWorkshops: {
      type: Array,
      default: () => []
    },
    allWorkshopsNumPages: {
      type: Number,
      default: undefined
    },
    paginatedSearchedWorkshops: {
      type: Array,
      default: () => []
    },
    paginatedSearchState: {
      type: Object
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
    'n-workshop-card': () => import('@/components/gamesense-workshop/card.vue'),
    'search-result': () => import('@/components/gamesense-workshop/search-results.vue')
  },

  computed: {
    categoryLabels () {
      return this.categories.map(({ category }) => category)
    },

    difficulties () {
      return ['EASY', 'INTERMEDIATE', 'ADVANCED']
    },

    isSearchResultEmpty () {
      return Boolean(this.paginatedSearchedWorkshops.length === 0 &&
        (this.searchQuery || this.selectedCategory || this.selectedDifficulty))
    },

    isSearchNotEmpty () {
      return Boolean(this.searchQuery || this.selectedCategory || this.selectedDifficulty)
    }
  },

  methods: {
    selectWorkshop (id) {
      this.trackAction('Workshops: Click workshop', id)
      this.$emit('select', id)
    },

    setSearchQuery (event) {
      this.searchQuery = event
      this.searchPage = 1
      this.searchWorkshops()
      this.trackAction('Workshops: filter workshops by free search')
    },

    setSearchCategory (event) {
      this.selectedCategory = event
      this.searchPage = 1
      this.searchWorkshops()
      this.trackAction('Workshops: filter workshops by category', { category: event })
    },

    setSearchDifficulty (event) {
      this.selectedDifficulty = event
      this.searchPage = 1
      this.searchWorkshops()
      this.trackAction('Workshops: filter workshops by difficulty level', { difficulty: event })
    },

    setSearchPage (event) {
      this.searchPage = event
      this.searchWorkshops()
    },

    searchWorkshops () {
      this.trackAction('Workshops: Search')
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
      this.paginatedSearchedWorkshops = []
      this.paginatedSearchState = {}
      this.trackAction('Workshops: Clear search')
    }
  }
}
</script>

<style lang="scss" scoped>
.workshop-page {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  &__header{
    padding: 55px;
    background: $dark-sec url("./../../assets/other/discovery-bg.svg") center no-repeat;
    background-size: 90% auto;
    min-height: 270px;
    position: relative;
    @media (max-width: $breakpoint-sm-max) {
      padding: 20px;
    }
  }
  &__search-result,
  &__main{
    padding: 40px 55px;
    @media (max-width: $breakpoint-sm-max) {
      padding: 20px;
    }
  }
}

.workshop-card {
  height: 100%;
  width: 100%;
}

.categories-item{
  max-width: 150px;
  height: 67px;
  padding: 15px 20px;
  border: 2px solid $soft-tone;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  transition: all .2s ease-in-out;
  &--active{
    border-color: $dark-pink;
  }
  &:hover{
    cursor: pointer;
    background: rgba(255, 255, 255, .03);
  }
  @media (max-width: $breakpoint-sm-max) {
    height: 45px;
    max-width: 150px;
    padding: 5px 10px;
  }
}

.block-leave-active,
.block-enter-active {
  transition: 1s;
}
.block-enter {
  transform: translate(100%, 0);
  opacity: 0;
  position: absolute;
  top: 380px;
}
.block-leave-to {
  transform: translate(-100%, 0);
  opacity: 0;
  position: absolute;
  top: 380px;
}
</style>
