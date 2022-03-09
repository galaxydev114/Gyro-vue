<template>
  <article class="full-width full-height q-pa-lg tournament-container">
    <div class="row q-mb-lg tournament-container__header">
      <div class="col-12 flex items-center justify-center justify-sm-start">
        <img class="cursor-pointer q-mr-md"
              v-if="$q.screen.lt.sm"
              :src="require('@/assets/icons/go-back.svg')"
              @click="goBack"/>
        <div class="text-h2 text-weight-bold">
          MY TOURNAMENTS
        </div>
      </div>
    </div>
    <div class="tournament-container__wrapper">
      <div class="tournament-container__left">
        <q-date
          class="no-shadow tournament-date-picker full-width"
          color="dark-pink"
          view="Months"
          first-day-of-week="1"
          v-model="date"
          :options="availableDays"
          :events="participatingEvents"
          minimal
          @input="trackAction('Tournaments: Tab: Click date on calendar', { date: $event })"
          @navigation="trackAction('Tournaments: Tab: Change month on calendar', $event)"
        />
      </div>
      <div class="tournament-container__right">
        <tournament-filter ref="filter"
                            :options="regions"/>
        <tournaments-days-list v-cloak
                                :days="tournaments"
                                :participating="participating"
                                :selected-date="date"
                                @add="addTournament"
                                @remove="removeTournament"
                                @all="resetParticipating"
                                @viewday="updateViewDate"/>
      </div>
    </div>

    <tournament-confirm-modal
      :visible="isTournamentConfirmModalVisible"
      :loading="isTournamentConfirmModalLoading"
      @confirm="acceptTournamentParticipation"
      @cancel="cancelTournamentParticipation"
      @close="cancelTournamentParticipation"
    />

    <tournament-remove-modal
      :visible="isTournamentRemoveModalVisible"
      :inProgress="isTournamentRemoveModalProgress"
      @confirm="removeTournamentParticipation"
      @cancel="cancelTournamentRemoving"
      @close="cancelTournamentRemoving"
    />

    <tournament-remove-modal-success
      :visible="isTournamentRemoveModalSuccessVisible"
      @close="isTournamentRemoveModalSuccessVisible = false"
    />
  </article>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    'tournament-filter': () => import('@/components/tournaments/days-list/filter'),
    'tournaments-days-list': () => import('@/components/tournaments/days-list'),
    'tournament-confirm-modal': () => import('@/components/tournaments/modal/modal-confirm-update'),
    'tournament-remove-modal': () => import('@/components/tournaments/modal/modal-tournament-delete'),
    'tournament-remove-modal-success': () => import('@/components/tournaments/modal/modal-tournament-delete-success')
  },
  data () {
    return {
      date: null,
      participating: false,
      sorted: null,
      isTournamentConfirmModalVisible: false,
      isTournamentRemoveModalVisible: false,
      isTournamentRemoveModalSuccessVisible: false,
      tournament: null,
      isTournamentConfirmModalLoading: false,
      isTournamentRemoveModalProgress: false
    }
  },
  mounted () {
    if (this.$route.query.filter) {
      this.setFilterInput(this.$route.query.filter)
    }
  },
  computed: {
    ...mapState({
      regions: state => state.tournaments.regions
    }),

    ...mapGetters({
      tournaments: 'tournaments/sortedTournaments'
    }),

    availableDays () {
      const res = []
      if (this.tournaments) {
        Object.keys(this.tournaments).forEach((key) => {
          res.push(this.$date(key).format('YYYY/MM/DD'))
        })
      }
      return res
    },

    participatingEvents () {
      return Object.entries(this.tournaments)
        .filter(([date, tournaments]) => tournaments.find(({ type }) => type === 'PARTICIPATING'))
        .map(([date, tournaments]) => {
          return this.$date(date).format('YYYY/MM/DD')
        })
    }

  },
  methods: {
    ...mapActions({
      participateInTournament: 'tournaments/participateInTournament',
      updateTrainingPlan: 'trainingPlan/regenerateTrainingPlan',
      removeParticipation: 'tournaments/removeParticipation'
    }),
    ...mapMutations({
      setFilterInput: 'tournaments/setFilterInput',
      setFilterTypeSelected: 'tournaments/setFilterTypeSelected',
      setFilterSelect: 'tournaments/setFilterSelect'
    }),
    addTournament (tournament) {
      this.trackAction('Tournaments: List: Click add tournament prep', tournament)
      this.tournament = tournament
      this.isTournamentConfirmModalVisible = true
    },
    async acceptTournamentParticipation () {
      this.isTournamentConfirmModalLoading = true
      await this.participateInTournament(this.tournament)
      await this.updateTrainingPlan()
      this.trackAction('Tournaments: player added tournament to his schedule')
      this.$router.push({
        path: '/training-plan',
        query: {
          tournamentEventId: this.tournament.eventId,
          tournamentEventWindowId: this.tournament.eventWindowId
        }
      })
      this.isTournamentConfirmModalVisible = false
      this.isTournamentConfirmModalLoading = false
      this.tournament = null
    },
    cancelTournamentParticipation () {
      this.isTournamentConfirmModalVisible = false
      this.tournament = null
      this.trackAction('Tournaments: add tournament modal: close modal without upgrading')
    },
    async removeTournamentParticipation () {
      this.isTournamentRemoveModalProgress = true
      await this.removeParticipation(this.tournament)
      await this.updateTrainingPlan()
      this.isTournamentRemoveModalVisible = false
      this.tournament = null
      this.isTournamentRemoveModalSuccessVisible = true
      this.isTournamentRemoveModalProgress = false
    },
    cancelTournamentRemoving () {
      this.isTournamentRemoveModalVisible = false
      this.tournament = null
    },
    removeTournament (tournament) {
      this.trackAction('Tournaments: List: Click remove tournament prep', tournament)
      this.tournament = tournament
      this.isTournamentRemoveModalVisible = true
    },
    updateViewDate (val) {
      const newDate = this.$date(val).format('YYYY/MM/DD')
      if (this.date !== newDate) {
        this.trackAction('Tournaments: Tab: Scroll in tournaments list', { date: val })
      }
      this.date = newDate
    },

    goBack () {
      this.trackAction('Tournaments: Tab: Click Go back')
      return this.$router.back()
    },

    resetParticipating () {
      this.$refs.filter.setFilterTypeSelected('all')
    }
  }
}
</script>

<style lang="scss">
.tournament-container{
  &__wrapper{
    display: flex;
    width: 100%;
    height: calc( 100% - 60px );
    flex-wrap: nowrap;
    @media (max-width: $breakpoint-sm-max) {
      flex-wrap: wrap;
      overflow-y: auto;
      height: calc( 100% - 80px );
      overflow-x: hidden;
      padding-right: 10px;
      margin-right: -10px;
      width: unset;
    }
    @media (max-width: $breakpoint-xs-max) {
      overflow-y: hidden;
      height: auto;
      padding-right: 0;
      margin-right: 0;
    }
  }
  &__header{
    @media (max-width: $breakpoint-mobile-max ) {
      padding: 20px;
      background: $dark-sec;
      text-align: center;
      margin: -20px -20px 0;
    }
  }

  &__left {
    width: 330px;
    height: 100%;
    flex: 0 0 330px;
    @media (max-width: $breakpoint-tablet-max) {
      width: 300px;
      flex: 0 0 300px;
      height: auto;
    }
    @media (max-width: $breakpoint-sm-max) {
      width: 100%;
      flex: 0 0 100%;
    }
  }

  &__right {
    width: 100%;
    height: 100%;
    padding-left: 60px;
    position: relative;

    &:before{
      content: "";
      width: 1px;
      max-height: 400px;
      height: 100%;
      display: block;
      background: $soft-tone;
      position: absolute;
      left: 29px;
      top: 70px;
    }
    @media (max-width: $breakpoint-sm-max) {
      padding-left: 0;
      padding-top: 30px;
      margin-top: 30px;
      height: auto;
      &:before{
        width: 100%;
        height: 1px;
        left: 0;
        top: 0;
        right: 0;
      }
    }
  }

  .tournament-date-picker{
    @media (max-width: $breakpoint-sm-max) {
      position: sticky;
    }
    .q-date{
      &__view{
        padding: 0;
      }
      &__today:not(.bg-dark-pink){
        background: $soft-tone;

      }
      &__navigation{
        height: 50px;
        div:nth-child(4),
        div:nth-child(5),
        div:nth-child(6){
          display: none;
        }
        .q-date__arrow{
          border: 1px solid $dark-pink;
          border-radius: 100%;
          color: $dark-pink;
          width: 24px;
          height: 24px;
        }
        .relative-position {
          padding: 0 8px;
          .q-btn{
            font-weight: bold;
            font-size: 20px;
            color: $gray;
          }
        }
      }
      &__calendar-weekdays{
        background: $dark-one;
        border-radius: 6px 6px 0 0;
        margin-top: 10px;
        text-transform: uppercase;
        padding: 10px 10px 0;
        > div {
          font-size: 14px;
          color: $gray;
          opacity: .6!important;
        }
      }
      &__calendar-days-container{
        background: $dark-one;
        border-radius: 0 0 6px 6px;
        padding: 0 10px 10px;
      }
      &__calendar-days .q-date__calendar-item--in > div{
        width: 44px!important;
        height: 44px!important;
        .block{
          font-size: 16px;
          margin-top: -1px;
        }
        @media (max-width: $breakpoint-sm-max) {
          width: calc( 100%/7 )!important;
        }
      }
    }
  }
}
</style>
