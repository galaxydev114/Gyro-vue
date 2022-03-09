<template>
  <div class="full-height">
    <n-workshop
      v-if="workshop"
      :title="workshop.title"
      :sub-title="workshop.subTitle"
      :author="workshop.approvedBy"
      :difficulty="workshop.difficulty"
      :timestamps="workshop.timestamps"
      :duration="workshop.duration"
      :videoUrl="workshop.videoUrl"
      :credit="workshop.credits"
      :thumbnail="workshop.thumbnail"
      :hasStarted="startedWorkshop"
      @submit-replay="submitReplay"
      @start-workshop="startWorkshop"
      @mark-complete="markComplete"
      @back="$router.back()"
    />
  </div>
</template>

<script>
import * as api from '@/services/api'
import Workshop from '@/components/gamesense-workshop/workshop-content'
import { mapGetters, mapMutations } from 'vuex'
import notesContextMixin from '@/mixins/notesContext.mixin'
import { routeNames } from '@/router/routeNames'

export default {
  components: {
    'n-workshop': Workshop
  },
  mixins: [notesContextMixin],

  props: {
    workshopId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      workshop: null,
      startedWorkshop: false
    }
  },

  created () {
    this.getWorkshop().then(() => {
      this.setNotesContext(this.workshop.title)
      this.$emit('loaded', 'WorkshopDetails')
    })
  },

  computed: {
    ...mapGetters({
      currentUser: 'user/currentUser'
    })
  },

  methods: {
    ...mapMutations({
      toggleSignWallModal: 'common/toggleSignWallModal'
    }),

    openSignWall (trigger = '') {
      this.toggleSignWallModal(true)
      this.trackAction('Workshops: Open Sign UP CTA Modal', { trigger })
    },

    submitReplay () {
      this.trackAction('Workshops: Click submit replay')
      if (this.currentUser) {
        window.open(`https://novos.typeform.com/to/zT9zWbDk#email=${this.currentUser.email}`, '_blank')
      } else {
        this.openSignWall()
      }
    },

    startWorkshop () {
      if (this.startedWorkshop) {
        return
      }
      this.trackAction('Workshops: Start', { id: this.workshopId, title: this.workshop.title })
      this.startedWorkshop = true
    },
    markComplete () {
      if (this.currentUser) {
        const res = api.markWorkshopDone(this.currentUser.id, this.workshop.id)
        this.trackAction('Workshops: Mark complete', { id: this.workshopId })
        this.navigateOut()
        return res
      } else {
        this.openSignWall()
      }
    },
    navigateOut () {
      const routeRecord = this.$route.matched[0]
      if (routeRecord.name === routeNames.TRAINING_PLAN_ROOT) {
        this.$router.push({ name: routeNames.TRAINING_PLAN_INDEX })
      } else if (routeRecord.name === routeNames.WORKSHOP_ROOT) {
        this.$router.back()
      } else {
        this.$router.back()
      }
    },

    async getWorkshop () {
      const workshopId = this.workshopId

      const response = await api.getWorkshopById(workshopId)
      if (response.status === 200) {
        this.workshop = response.data.gamesenseWorkshop
      }
    }
  }
}
</script>
