<template>
  <div class="full-width">

    <div class="text-h2">
      Top quality videos curated by NOVOS team for you
    </div>
    <div class="row q-mt-md">
      <div class="col">
        <div class="opacity-5">
          Pick something you would like to learn.
        </div>
      </div>
      <div class="col text-right">
        <div class="opacity-5 text-weight-bold">
          {{ filteredList.length }} knowledge videos found
        </div>
      </div>
    </div>
    <div class="q-mt-xl knowledge__content">
      <div class="sidebar">
        <q-input placeholder="Search video" v-model="filters.input" outlined class="search-input"/>
        <div class="lt-sm">
          <img src="@/assets/icons/preferences.svg"
               style="cursor: pointer"
               class="float-right"
               @click="filter = !filter"
               id="filterIcon"
               alt="preferences icon"/>
        </div>
        <div class="filters"
             :class="{'filters--active': filter || $q.screen.gt.xs}">
          <div class="filters__container">
            <n-categories-list :categories="categories"
                               :totalCount="videos.length"
                               @select="selectCategory"
                               class="q-mb-lg q-mb-sm-none q-mt-sm-xl"/>
<!--            <div class="q-mt-sm-xl q-mb-sm flex items-center justify-between">-->
<!--              <div class="text-h4 q-py-sm">-->
<!--                Difficulty-->
<!--              </div>-->
<!--              <c-btn flat-->
<!--                     dense-->
<!--                     v-if="filters.difficulty"-->
<!--                     noHover-->
<!--                     textColor="dark-pink"-->
<!--                     size="xs"-->
<!--                     @click="filters.difficulty = null"-->
<!--              >-->
<!--                Clear-->
<!--              </c-btn>-->
<!--            </div>-->
<!--            <div class="flex justify-between">-->
<!--              <q-radio class="like-button-select q-my-sm"-->
<!--                       v-for="diff in ['Easy', 'Intermediate', 'Advanced', 'Expert']"-->
<!--                       :key="diff"-->
<!--                       v-model="filters.difficulty"-->
<!--                       :val="diff.toLowerCase()"-->
<!--                       :label="diff" />-->
<!--            </div>-->
          </div>
        </div>
      </div>
      <q-circular-progress v-if="loading"
        class="q-mx-auto q-mt-lg"
        indeterminate
        size="100px"
        color="dark-pink"
        track-color="mid-tone">
      </q-circular-progress>
      <n-list v-else-if="filteredList && filteredList.length"
        :items="filteredList"
        @click="clickVideoItem"
        @watched="watched" />
      <div class="text-h3 opacity-5 full-width" v-else>
        No videos found =(
      </div>
    </div>

    <n-first-open-modal :visible="firstTime" @close="setFirstTime" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getLocalstorage, setLocalstorage } from '@/services/localstorageservice'

export default {
  props: {
    videos: {
      type: Array,
      default: () => []
    }
  },
  components: {
    'n-categories-list': () => import('@/components/knowledge/categories'),
    'n-list': () => import('@/components/knowledge/list'),
    'n-first-open-modal': () => import('@/components/knowledge/first-open-modal')
  },
  data () {
    return {
      loading: false,
      filter: false,
      categories: [],
      filters: {
        difficulty: null,
        category: null,
        input: null
      },
      first: getLocalstorage('seen-knowledge-time-helper') !== 'y'
    }
  },
  mounted () {
    this.loading = true
    this.getUserKnowledgeTimeVideos().then(() => {
      this.getAvailableCategories()
      this.loading = false
    })
  },

  computed: {
    filteredList () {
      let result = [...this.videos]
      const { difficulty, category, input } = this.filters
      if (difficulty) {
        result = result.filter(el => el.difficulty.toLowerCase() === difficulty.toLowerCase())
      }
      if (category) {
        result = result.filter(el => {
          if (category === '*') {
            return true
          } else {
            return el.category.toLowerCase() === category.toLowerCase()
          }
        })
      }
      if (input && input.length) {
        result = result.filter(el => el.title.toLowerCase().includes(input.toLowerCase()))
      }
      // sort by watched at the bottom and created at
      return result.sort((a, b) => {
        let condition = Number(a.isDone) - Number(b.isDone)
        if (condition === 0) {
          condition = new Date(b.knowledgeTimeCreatedAt) - new Date(a.knowledgeTimeCreatedAt)
        }
        return condition
      })
    },
    firstTime () {
      return this.first
    }
  },
  methods: {
    ...mapActions({
      getUserKnowledgeTimeVideos: 'knowledgeTime/fetchUserKnowledgeTimeData',
      markKnowledgeWatched: 'knowledgeTime/markKnowledgeWatched'
    }),
    setFirstTime () {
      this.first = false
      this.trackAction('Knowledge time: close first-time helper modal')
      setLocalstorage('seen-knowledge-time-helper', 'y')
    },
    clickVideoItem ({ item, position }) {
      this.trackAction('Knowledge time: click knowledge item', {
        props: item,
        position: position + 1
      })
      this.$emit('click', item)
    },
    watched (data) {
      const label = this.data?.isDone ? 'mark as unwatched' : 'mark as watched'
      this.trackAction(`Knowledge time: click "${label}" from dropdown`, data)
      return this.markKnowledgeWatched(data)
    },
    getAvailableCategories () {
      this.videos.forEach(item => {
        if (!this.categories.some(el => el.name === item.category.toLowerCase())) {
          this.categories.push({
            name: item.category.toLowerCase(),
            count: this.videos.filter(el => el.category === item.category).length
          })
        }
      })
    },
    selectCategory (val) {
      this.filters.category = val
      this.trackAction('Knowledge time: select category filter', { value: val })
      this.filter = false
    }
  }
}
</script>

<style lang="scss" scoped>
.knowledge{
  &__content{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .sidebar{
      flex: 0 0 310px;
      padding-right: 40px;
      @media (max-width: $breakpoint-md-max) {
        flex: 0 0 240px;
        padding-right: 20px;
      }
    }
    @media (max-width: $breakpoint-xs-max) {
      flex-direction: column;
      .sidebar{
        flex: 0 0 100%;
        padding-right: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        .search-input{
          width: 85%;
        }
        .filters{
          max-height: 0;
          overflow: hidden;
          margin: 20px 0;
          width: 100%;
          padding: 0 20px;
          background: $mid-tone;
          transition: all .2s ease-in-out;
          &--active{
            max-height: 600px;
          }
          &__container{
            padding: 25px 0;
          }
        }
      }
    }
  }
  .like-button-select{
    width: 47%;
    text-align: center;
    justify-content: center;
    align-items: center;
    height: 60px;
    font-size: 16px;
  }
}
</style>
