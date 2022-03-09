<template>
  <n-workshop
    :newAndRelevant="newAndRelevant"
    :categories="categories"
    :allWorkshops="allWorkshops"
    :paginatedSearchedWorkshops="paginatedSearchedWorkshops"
    :paginatedSearchState="paginatedSearchState"
    @get-next-page="getNextPage"
    @select="goToWorkshop"
    @search="searchWorkshops"
  />
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import Workshops from './Workshops'
import * as api from '@/services/api'

export default {
  components: {
    'n-workshop': Workshops
  },

  created () {
    this.discoverWorkshops(this.currentUser.id)
    this.fetchAllCategories()
  },

  computed: {
    ...mapGetters({
      currentUser: 'user/currentUser'
    }),
    ...mapState({
      newAndRelevant: state => state.workshops.newAndRelevant,
      categories: state => state.workshops.categories,
      allWorkshops: state => state.workshops.allWorkshops,
      allWorkshopsNumPages: state => state.workshops.allWorkshopsNumPages
    })
  },
  data () {
    return {
      allWorkshopsList: [],
      page: 1,
      paginatedSearchedWorkshops: [],
      paginatedSearchState: null
    }
  },

  methods: {
    ...mapActions({
      discoverWorkshops: 'workshops/discoverWorkshops',
      fetchAllCategories: 'workshops/fetchAllCategories'
    }),

    async getNextPage () {
      if (this.page < this.allWorkshopsNumPages) {
        this.page++
        const response = await api.getPaginatedWorkshops({ page: this.page, userId: this.currentUser.id })
        if (response.status === 200) {
          this.allWorkshopsList = this.allWorkshopsList.concat(response.data.workshops)
        }
      }
    },

    goToWorkshop (id) {
      const routerName = this.$route.name === 'WorkshopAll' ? 'WorkshopDetails' : 'TrainingPlanWorkshopDetails'
      this.$router.push({
        name: routerName,
        params: { workshopId: id },
        query: { ...this.$route.query }
      })
    },

    async searchWorkshops ({ page = 1, query, category, difficulty }) {
      const response = await api.getPaginatedWorkshops({ page, title: query, category, difficulty, userId: this.currentUser.id })
      if (response.status === 200) {
        this.paginatedSearchedWorkshops = response.data.workshops
        this.paginatedSearchState = response.data.pagination
      }
    }
  },
  watch: {
    allWorkshops (val) {
      if (val) {
        this.allWorkshopsList = val
      }
    }
  }
}
</script>
