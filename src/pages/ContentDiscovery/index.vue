<template>
  <n-content-discovery
    :newestActivities="newestActivities"
    :exclusiveActivities="exclusiveActivities"
    :popularActivities="popularActivities"
    :skills="skills"
    :allActivities="allActivitiesList"
    :paginatedSearchedActivities="paginatedSearchedActivities"
    :paginatedSearchState="paginatedSearchState"
    :allActivitiesNumPages="allActivitiesNumPages"
    :page="page"
    @get-next-page="getNextActivityPage"
    @select-activity="goToActivity"
    @search="searchActivities"
    @clear-search="clearSearch"
  />
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import ContentDiscovery from './ContentDiscovery'
import * as api from '@/services/api'

export default {
  components: {
    'n-content-discovery': ContentDiscovery
  },

  async created () {
    try {
      this.togglePageLoaded(false)
      await this.discoverActivities(this.currentUser.id)
      await this.fetchAllSkills()
    } finally {
      this.togglePageLoaded(true)
    }
  },

  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapState({
      newestActivities: state => state.discovery.newestActivities,
      exclusiveActivities: state => state.discovery.exclusiveActivities,
      skills: state => state.discovery.skills,
      allActivities: state => state.discovery.allActivities,
      popularActivities: state => state.discovery.popularActivities
    })
  },
  data () {
    return {
      page: 1,
      allActivitiesNumPages: 0,
      allActivitiesList: [],
      paginatedSearchedActivities: [],
      paginatedSearchState: null
    }
  },

  methods: {
    ...mapActions({
      discoverActivities: 'discovery/discoverActivities',
      fetchAllSkills: 'discovery/fetchAllSkillTypes'
    }),

    ...mapMutations({
      togglePageLoaded: 'common/togglePageLoaded'
    }),

    clearSearch () {
      this.paginatedSearchedActivities = []
      this.paginatedSearchState = {}
    },

    async getNextActivityPage () {
      if (this.page < this.allActivitiesNumPages) {
        this.page++
        const response = await api.getPaginatedRoutines({ page: this.page, userId: this.currentUser.id })
        if (response.status === 200) {
          this.allActivitiesList = this.allActivitiesList.concat(response.data.trainingRoutines)
        }
      }
    },

    goToActivity ({ type, id }) {
      if (type === 'routine') {
        this.$router.push({ name: 'DiscoveryRoutineDetails', params: { id } })
      }
    },

    async searchActivities ({ page = 1, query, category, difficulty }) {
      const response = await api.getPaginatedRoutines({ page, title: query, category, difficulty, userId: this.currentUser.id })
      if (response.status === 200) {
        this.paginatedSearchedActivities = response.data.trainingRoutines
        this.paginatedSearchState = response.data.pagination
      }
    }
  },
  watch: {
    allActivities (val) {
      if (val) {
        this.allActivitiesList = val.activities
        this.allActivitiesNumPages = val.numPages
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
