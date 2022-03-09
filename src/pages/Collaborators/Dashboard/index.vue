<template>
  <article style="min-height: 100vh">
     <n-modal :visible="affiliationModal" @close="closeAffiliationModal">
      <!--      confirm-->
      <div class="q-pa-lg text-center">
        <div class="text-h3 text-pink">
          Your personal sharable link
        </div>
        <div class="q-mt-md q-mb-lg text-gray">
          <q-card-section class="bg-soft-tone flex items-center justify-between" @click="copy(copiedAffiliationLink)">
            <span class="text-h5 text-weight-regular">{{copiedAffiliationLink}}</span>
            <q-icon name="content_copy"
                    color="dark-pink"
                    size="20px"
                    class="cursor-clickable">
              <q-tooltip anchor="top left"
                        self="bottom middle"
                        max-width="240px"
                        content-style="background-color: #382B4B; font-size: 14px"
                        @hide="copied = false"
                        :offset="[10, 10]">
                {{ label }}
              </q-tooltip>
            </q-icon>
          </q-card-section>
        </div>
        <div class="row justify-center">
          <c-btn class="q-ml-xs q-ml-sm-md" @click="closeAffiliationModal">
            Close
          </c-btn>
        </div>
      </div>
    </n-modal>
    <div class="text-h1 q-mb-lg">YOUR EARNINGS</div>
    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-3">
        <div class="full-width bordered q-pa-lg bg-pink">
          <div class="row items-center">
            <div class="font-rift text-weight-bold text-h6">
              This month earnings
            </div>
            <div class="q-ml-auto text-white">
              <c-icon icon="graph"/>
            </div>
          </div>
          <div class="font-rift text-weight-bold text-h2 q-mt-lg">
            $ {{ currentMonthEarnings }}
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="full-width bordered q-pa-lg">
          <div class="font-rift text-weight-bold opacity-5 text-h6">
            Past month earnings
          </div>
          <div class="font-rift text-weight-bold text-h2 q-mt-lg text-pink">
            $ {{ previousMonthEarnings }}
          </div>
        </div>

      </div>
      <div class="col-auto q-ml-auto">
        <c-btn @click="openAffiliationModal">
          + Invite Affiliation
        </c-btn>
      </div>
    </div>
    <div class="block q-mt-lg q-mb-xl">
      <div class="bordered q-pa-lg">
        <div class="text-h4 q-mb-lg">Daily earnings</div>
        <c-timeline-chart
          key="dailyEarnings"
          data-series1-name="Your earnings"
          :data-series1="dailyEarningsChart"
          :view="timeView"
        />
      </div>
    </div>
    <div class="row q-col-gutter-lg justify-between">
      <div class="col-12">
        <div class="bordered q-pa-lg">
          <div class="text-h4 q-mb-sm">User signup</div>
          <c-timeline-chart
            key="userSignUps"
            data-series1-name="Total sign-ups"
            :data-series1="userSignUpsChart"
            :view="timeView"
          />
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { copyToClipboard } from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import { getPartnerEarnings } from '@/services/api'
export default {
  components: {
    'c-timeline-chart': () => import('components/common/timeline-chart.vue'),
    'n-modal': () => import('@/components/dashboard/modal')
  },
  data () {
    return {
      copied: false,
      affiliationModal: false,
      currentMonthEarnings: 0,
      previousMonthEarnings: 0,
      dailyEarnings: [],
      userSignUps: []
    }
  },
  computed: {
    ...mapGetters({
      userCollaborator: 'user/userCollaborator',
      currentUser: 'user/currentUser'
    }),
    label () {
      return this.copied ? 'Copied!' : 'Copy to clipboard'
    },
    copiedAffiliationLink () {
      return `app.novos.gg/partner/${this.userCollaborator?.slug}`
    },
    dailyEarningsChart () {
      return this.dailyEarnings.map(({ date, earnings }) => ({
        x: `${date} GMT`,
        y: earnings
      }))
    },
    userSignUpsChart () {
      return this.userSignUps.map(({ date, users }) => ({
        x: `${date} GMT`,
        y: users
      }))
    },

    timeView () {
      return 'day'
    }
  },
  methods: {
    ...mapActions({
      getCollaborators: 'collaborators/getCollaborators'
    }),
    openAffiliationModal () {
      this.affiliationModal = true
    },
    closeAffiliationModal () {
      this.affiliationModal = false
    },
    copy (code) {
      copyToClipboard(code).then(() => {
        this.$q.notify({
          type: 'positive',
          message: 'Copied!'
        })
        this.copied = true
      })
    },
    loadCollaboratorEarnings () {
      if (!this.userCollaborator) return
      return getPartnerEarnings(this.userCollaborator.id)
        .then(response => {
          const { currentMonth, previousMonth, dailyEarnings, userSignUps } = response.data.earnings
          this.currentMonthEarnings = currentMonth
          this.previousMonthEarnings = previousMonth
          this.dailyEarnings = dailyEarnings
          this.userSignUps = userSignUps
        })
    }
  },
  watch: {
    userCollaborator: {
      immediate: true,
      handler: function () {
        this.loadCollaboratorEarnings()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bordered {
  border: 1px solid $soft-tone;
  border-radius: 8px;
}
</style>
