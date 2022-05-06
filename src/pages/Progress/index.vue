<template>
  <article class="progress-page full-height">
    <div class="progress-page__mobile-headline text-center q-my-lg" v-if="$q.screen.lt.md">
      <div class="row items-center justify-center">
        <div class="btn-group">
          <c-btn
            class="btn-group__item"
            :flat="!showOn('activity')"
            noWidth
            size="sm"
            @click="setShowType('activity')"
          >
            Activity
          </c-btn>
          <c-btn
            class="btn-group__item"
            :flat="!showOn('in-game')"
            noWidth
            size="sm"
            @click="setShowType('in-game')"
          >
            In Game
          </c-btn>
        </div>
      </div>
    </div>
    <div class="progress-page__left q-pa-lg q-pb-none" v-if="showOn('activity')">
      <div class="text-h2 q-mb-lg" v-if="$q.screen.gt.sm" style="line-height: 48px">
        Training progress
      </div>
      <c-empty class="full-height" v-if="!isPageReady" :loading="!isPageReady" />
      <template v-else>
        <template v-if="userActivitiesCount > 0">
          <div class="flex items-center justify-between q-mb-md q-mb-sm-lg bordered">
            <div class="q-pa-sm q-pa-xs-md">
              <span class="text-h2 text-pink q-mr-sm">{{ currentStreak }} day{{ currentStreak === 1 ? '' : 's'}}</span>
              <span class="text-h4 text-weight-bold text-uppercase font-rift">(Best {{ bestStreak }})</span>
              <div class="block opacity-5 q-mt-sm">
                Without missing training
              </div>
            </div>
            <div class="q-pa-sm q-pa-xs-md bordered bordered--left">
              <div class="text-h2 text-pink q-mr-sm">{{ userActivitiesCount }}</div>
              <div class="block opacity-5 q-mt-sm">
                Activities done
              </div>
            </div>
          </div>

          <c-cat-list :categories="categories"/>

          <c-week :week="days" />

          <c-play-calendar :activities="activities" />
        </template>

        <c-empty-box class="full-height" v-else>
          <c-icon icon="progress" class="q-mb-md" />
          <div class="text-h2 text-soft-tone q-mb-sm">
            You haven't done any activities yet!
          </div>
          <div class="text-weight-medium text-soft-tone q-mb-lg">
            Go to your training board and start training
          </div>
          <c-btn
            noHover
            size="xs"
            style="margin-bottom: 66px; // align with right empty state"
            @click="$router.push({ name: 'TrainingPlan' })"
          >
            Go to training board
          </c-btn>
        </c-empty-box>
      </template>
    </div>
    <div class="progress-page__right full-height" ref="progressContent" v-if="showOn('in-game')">
      <template v-if="currentUser && computedCurrentUserEpicId && (!isPageReady || haveProgressCharts)">
        <div class="progress-page__right-container">
          <div class="flex justify-between position-sticky no-wrap">
            <div class="flex" :class="[$q.screen.lt.md ? 'column items-start' : 'row items-center']">
              <span class="text-h2 q-mr-md" style="order: 2; line-height: 48px">
                {{ $q.screen.gt.sm ? 'in-game progress' : 'my progress' }}
              </span>
              <c-branding class="progress-page__right-branding" :small="$q.screen.lt.lg" />
            </div>
            <div class="q-mt-md q-mt-sm-none items-center">
              <q-btn
                @click="reloadProgress"
                class="dropdown__button"
                padding="9px"
                flat
                :disable="isRefreshDisabled"
              >
                <q-icon v-if="!isRefreshDisabled" name="refresh"/>
                <span style="width: 24px; height: 24px;" v-else>{{refreshCountdown}}</span>
              </q-btn>
            </div>
          </div>

          <section>
            <header class="row items-center">
              <h3 class="font-roboto no-margin">Player Score</h3>
              <c-explainer>
                {{ "This is an estimated score out of 1000 of your current skill level, based on your arena games. We are currently working on a new method of calculating this, so watch out for v2 coming soon!" }}
              </c-explainer>
            </header>
            <div class="charts">
              <div class="win-ratio-chart overflow-hidden">
                <q-resize-observer @resize="keys.skillScoreChart++" />
                <div class="block">
                  <c-empty v-if="!isPageReady || !skillScoreChart"
                           :loading="!isPageReady"
                           class="full-width"
                  />
                  <template v-else>
                    <div class="row align-center full-height">
                      <div class="skill-score-left-new col-12 col-lg-4 q-mb-sm q-mb-sm-none">
                        <speedometer :showPro="false" :animated="false" v-bind="skillScoreWidgetData" class="q-mt-sm-lg" />
                      </div>
                      <div class="skill-score-right-new col-12 col-lg-8 q-py-md q-px-md-sm">
                        <div class="text-h4 q-mb-md">
                          Your score
                        </div>
                        <c-single-chart
                          title=""
                          description="Skill score calculated by Kinch Analytics"
                          :key="keys.skillScoreChart"
                          :data="skillScoreChart"
                          :dataMin="0"
                          :dataMax="1200"
                          chartTitle="Skill score"
                          :xMaxTicks="10"
                          :yLabelFormat="getSkillScoreRank"
                          yLabelInside
                          :timeView="timeView"
                          :isPageReady="isPageReady"
                          :showEmptyState="false"
                          :chartStyle="'height: 32vh; max-height: 250px;'"
                          :dashed="skillScoreWidgetData.isPredicted"/>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </section>

          <section>
            <header class="row justify-between items-center">
              <div class="row">
                <h3 class="font-roboto no-margin">Arena Performance</h3>
                <c-explainer ref="arenaExplainer">
                  <div v-if="timeView === '2wktrend'">
                    <div>Arena progress 2-week average.</div>
                    <div>Each day we take your games from the previous 2 weeks and average them out. This is the recommended way to track your progress as it smooths out the daily volatility.</div>
                  </div>
                  <div v-else>{{`Arena progress per ${timeView}`}}
                  </div>
                </c-explainer>
              </div>

              <div class="dropdown"
                   :class="{ 'q-ml-auto': $q.screen.lt.sm }"
                   v-outside-click="() => isFilterVisible = false"
              >
                <q-btn @click="isFilterVisible = !isFilterVisible; trackAction(`Progress: ${isFilterVisible ? 'open' : 'close'} filters modal`)" class="dropdown__button" padding="9px" flat >
                  <img :src="require('assets/icons/preferences.svg')"/>
                </q-btn>

                <div v-show="isFilterVisible" class="dropdown__content">
                  <div class="dropdown__content-header font-rift text-uppercase text-weight-bold text-h5 text-gray">
                    Filters
                  </div>

                  <div class="text-weight-bold text-h5 text-gray">Time view</div>
                  <div class="options-row q-mt-sm">
                    <q-btn-toggle
                      class="full-width shadow-0 justify-between toggle-row-wrap"
                      padding="6px 12px"
                      :rounded="false"
                      toggle-color="dark-pink"
                      text-color="dark-pink"
                      :value="timeView"
                      @input="switchTimeView"
                      :options="[
                      { label: 'Daily', value: 'day' },
                      { label: 'Weekly', value: 'week' },
                      { label: 'Monthly', value: 'month' },
                      { label: '2Wk Trend', value: '2wktrend' },
                    ]"
                    />
                  </div>

                  <div class="q-mt-lg text-weight-bold text-h5 text-gray">Mode</div>
                  <div class="options-row q-mt-sm">
                    <q-btn-toggle
                      class="full-width shadow-0 justify-between toggle-row-wrap"
                      padding="6px 12px"
                      :rounded="false"
                      toggle-color="dark-pink"
                      text-color="dark-pink"
                      :value="modeView"
                      @input="switchModeView"
                      :options="[
                      { label: 'trios', value: 'trios' },
                      { label: 'duos', value: 'duos' },
                      { label: 'solo', value: 'solo' },
                      { label: 'combined', value: 'all' },
                    ]"
                    />
                  </div>
                </div>
              </div>
            </header>
            <div class="charts">
              <div class="bottom-chart">
                <q-resize-observer @resize="keys.winRatioChart++" />
                <c-arena-placement-chart
                  :key="keys.winRatioChart"
                  :data="winRatioChart"
                  :timeView="timeView"
                  :isPageReady="isPageReady"
                  :chartStyle="'height: 25vh;'"
                  :dashed="winRatioChart.isUserDataPredicted"/>
              </div>

              <div class="bottom-chart">
                <q-resize-observer @resize="keys.killDeathChart++" />
                <c-single-chart
                  title="Kills"
                  description="Here you can see your kills per game in arena, showing whether you're increasing your fighting ability over time"
                  :key="keys.killDeathChart"
                  :data="killDeathChart"
                  :dataMin="0"
                  chartTitle="Elims/Game"
                  :timeView="timeView"
                  :isPageReady="isPageReady"
                  :chartStyle="'height: 25vh;'"
                  :dashed="killDeathChart.isUserDataPredicted"/>
              </div>

            </div>
          </section>
        </div>
      </template>

      <template v-else-if="isPageReady && !haveProgressCharts && currentUser && computedCurrentUserEpicId">
        <div class="progress-page__right-container">
          <h2 class="text-h2 q-mt-lg q-mb-none" v-if="$q.screen.gt.sm">
            in-game progress
          </h2>
          <c-empty-box class="full-height q-mt-lg">
            <div class="q-pa-lg">
              <c-icon icon="progress" class="q-mb-md" />
              <div class="text-h2 text-soft-tone q-mb-sm">
                Something went wrong when fetching your Arena game data
              </div>
              <div>
                <div class="text-h4 text-weight-medium text-soft-tone">
                  1. Make sure your Epic game data is set to Public.
                </div>
                <div class="text-h4 text-weight-medium text-soft-tone">
                  2. Make sure to play Arena.
                </div>
              </div>
            </div>
          </c-empty-box>
        </div>
      </template>

      <template v-else>
        <div class="progress-page__right-container">
          <h2 class="text-h2 q-mt-lg q-mb-none" v-if="$q.screen.gt.sm">
            in-game progress
          </h2>
          <c-empty-box class="full-height q-mt-lg">
            <div class="q-pa-lg text-center">
              <c-icon icon="progress" class="q-mb-md" />
              <div class="text-h2 text-soft-tone q-mb-md">
                For us to track your in-game progress, please link your Epic account.
              </div>
              <div class="inline-block">
                <c-btn
                  noWidth
                  noHover
                  size="xs"
                  @click="trackAction('Progress: link epic account'); $router.push({ name: 'LinkEpic' })"
                >
                  Link Epic Account
                </c-btn>
              </div>
              <div class="text-weight-medium text-soft-tone q-mt-lg">
                If you did link your account,<br/> please make sure your game data is set to Public
              </div>
            </div>
          </c-empty-box>
        </div>
      </template>

      <div ref="trackingSection" class="progress-page__right-container" v-if=computedCurrentUserEpicId>
        <div class="flex justify-between position-sticky no-wrap">
          <section style="width: 100%;">
            <div class="text-h2 q-mt-xl q-mb-lg">
              Tracking
            </div>

            <c-tracking-chart
              class="q-mb-lg"
              :title="trackingData && trackingData[0] && trackingData[0].label"
              subtitle="Average tracking process"
              key="test1"
              :data="trackingData && trackingData[0] && trackingData[0].chart"
              :timeView="timeView"
              :isPageReady="isPageReady"
              :chartStyle="'height: 25vh;'"
              :dashed="winRatioChart.isUserDataPredicted"
              :not-trackable-state="!trackingData[0] || !trackingData[0].isTrackable"
              @go="$router.push({ name: 'TrainingPlan' })"
            />

            <c-tracking-chart
              class="q-mb-lg"
              :title="trackingData && trackingData[1] && trackingData[1].label"
              subtitle="Average tracking process"
              key="test2"
              :data="trackingData && trackingData[1] && trackingData[1].chart"
              :timeView="timeView"
              :isPageReady="isPageReady"
              :chartStyle="'height: 25vh;'"
              :dashed="winRatioChart.isUserDataPredicted"
              :not-trackable-state="!trackingData[1] || !trackingData[1].isTrackable"
              @go="$router.push({ name: 'TrainingPlan' })"
            />
          </section>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { getLocalstorage, setLocalstorage } from '@/services/localstorageservice'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import dayJs from 'dayjs'

export default {
  components: {
    'c-branding': () => import('@/components/progress/branding.vue'),
    'c-empty-box': () => import('@/components/common/empty-state/box'),
    'c-cat-list': () => import('@/components/progress/categories-list'),
    'c-week': () => import('@/components/progress/week'),
    'c-play-calendar': () => import('@/components/progress/calendar'),
    // 'c-timeline-chart': () => import('components/common/timeline-chart-v2.vue'),
    // 'c-column-chart': () => import('./_column-chart.vue'),
    'c-arena-placement-chart': () => import('./_arena-placement-chart.vue'),
    'c-single-chart': () => import('./_single-chart.vue'),
    'c-empty': () => import('@/components/progress/_empty'),
    'c-explainer': () => import('@/components/progress/_explainer'),
    'c-tracking-chart': () => import('./_tracking-chart'),
    speedometer: () => import('@/components/speedometer')
  },
  data () {
    return {
      keys: {
        skillScoreChart: 0,
        winRatioChart: 0,
        killDeathChart: 0,
        timePlayedChart: 0
      },
      timeViewFilter: 'week',
      isFilterVisible: false,
      showType: 'activity',
      isPageReady: false,
      isRefreshDisabled: false,
      refreshCountdown: 59
    }
  },
  watch: {
    trackingData: {
      handler (value) {
        if (value) {
          this.trackAction('Tracking: Progress page: see tracking progress charts', { techniques: value.map(el => el.label) })
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      dailyActivityCompletion: 'trainingPlan/dailyActivityCompletion',
      currentUser: 'user/currentUser',
      userActivitiesCount: 'user/userActivitiesCount',
      haveProgressCharts: 'progress/haveProgress',
      skillScoreChart: 'progress/skillScoreChart',
      winRatioChart: 'progress/winRatioChart',
      killDeathChart: 'progress/killDeathChart',
      timePlayedChart: 'progress/timePlayedChart',
      userTrackedRoutinesProgress: 'progress/userTrackedRoutinesProgress'
    }),
    ...mapState({
      startDate: state => state.trainingPlan.startDate,
      activityPerDayCounts: state => state.user.activitiesStats?.activityPerDayCounts || {},
      categories: state => Object.entries(state.user.activitiesStats?.activityCategoryCounts || {})
        .map(([name, value]) => ({ name, value })),
      currentStreak: state => state.user.activitiesStats?.currentActivityDayStreak || 0,
      bestStreak: state => state.user.activitiesStats?.bestActivityDayStreak || 0,
      timeView: state => state.progress.view,
      modeView: state => state.progress.mode
    }),
    computedCurrentUserEpicId () {
      return this.currentUser?.epicId || null
    },
    skillScoreWidgetData () {
      let [prevScore, currScore] = this.skillScoreChart.userData.slice(-2)
      if (this.skillScoreChart.isUserDataPredicted) {
        currScore = this.skillScoreChart.userData[0]
        prevScore = currScore
      }
      return {
        score: Number(currScore.y) || undefined,
        scoreDate: this.$date(currScore.x, 'MM/DD/YYYY').toDate(),
        maxScore: 1200,
        oldScore: Number(prevScore.y) || undefined,
        oldScoreDate: this.$date(prevScore.x, 'MM/DD/YYYY').toDate(),
        isPredicted: this.skillScoreChart.isUserDataPredicted
      }
    },

    days () {
      return Object.entries(this.dailyActivityCompletion || {})
        .map(([dayNumber, progress]) => {
          return {
            short: this.$date(this.startDate).add(dayNumber - 1, 'day').format('dd'),
            value: Math.round((progress.count - progress.left) / progress.count * 100)
          }
        })
    },

    activities () {
      return Object.entries(this.activityPerDayCounts).map(([date, progress]) => {
        return {
          date,
          value: progress.completed / progress.total * 70 + 30 // min 30, max 100
        }
      })
    },

    trackingData () {
      if (!this.userTrackedRoutinesProgress.length) return []

      return this.userTrackedRoutinesProgress.map(({ category, technique, routineId, sessionsProgress }) => {
        const colors = ['#DD2678', '#594FE3', '#4FD1E3']

        let chart = []
        if (sessionsProgress) {
          let dates = Array.from(new Set(sessionsProgress
            .flatMap(progress => {
              if (!progress?.scores?.length) return
              return progress.scores.map(el => el.date)
            })
            .filter(Boolean)
          )).sort((a, b) => {
            if (new Date(a) > new Date(b)) return 1
            return -1
          })

          dates = [dayJs(dates[0]).subtract(1, 'day').format('MM/DD/YYYY'), ...dates]

          chart = sessionsProgress
            .map((progress, i) => {
              const initialScore = progress.isScoreInversed ? Math.max(...progress.scores.map(e => e.score)) : 0
              return {
                title: progress.sessionTitle,
                color: colors[i] ? colors[i] : colors[0],
                isScoreInversed: progress.isScoreInversed,
                isScoreTime: progress.isScoreTime,
                isPredicted: progress.isPredicted,
                yAxisID: `y${i}`,
                values: dates
                  .map(date => ({
                    x: date,
                    y: progress.scores?.find(el => el.date === date)?.score || initialScore
                  }))
              }
            })
        }
        return {
          label: `${category?.toUpperCase()} - ${technique?.toUpperCase()}`,
          isTrackable: Boolean(routineId),
          chart: chart
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (from.name === 'LinkEpic') {
        vm.getUserScore({ userId: vm.currentUser?.id, forceCalc: true }).finally(() => {
          vm.loadProgress()
        })
      } else {
        vm.loadProgress()
      }
    })
  },
  updated () {
    if (this.isPageReady) {
      if (this.timeView === '2wktrend' && !getLocalstorage('seenTrendChartExplainer')) {
        setLocalstorage('seenTrendChartExplainer', 1)
        setTimeout(() => {
          // eslint-disable-next-line no-unused-expressions
          this.$refs.arenaExplainer?.show()
        }, 1000)
      }
    }
  },
  methods: {
    ...mapActions({
      loadUserProgress: 'progress/getUserProgress',
      loadTrackedRoutinesProgress: 'progress/getTrackedRoutinesProgress',
      reloadUserProgress: 'progress/reloadUserProgress',
      toggleFilter: 'progress/toggleFilter',
      getUserCurrentTrainingPlan: 'trainingPlan/fetchUserCurrentTrainingPlan',
      getUserScore: 'user/getUserScore'
    }),

    ...mapMutations({
      setView: 'progress/setView',
      setMode: 'progress/setMode'
    }),
    scrollToTrackingSection (elementToScroll) {
      if (elementToScroll) {
        if (this.$q.platform.is.mobile) {
          elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        } else {
          const scrollablePage = this.$refs.progressContent
          const el = elementToScroll
          const elTop = el?.offsetTop

          scrollablePage.scrollTo({
            top: elTop - 50,
            behavior: 'smooth',
            time: 1000
          })
        }
      }
    },
    switchTimeView (view) {
      this.setView(view)
      this.loadUserProgress()
      this.trackAction('Progress: filter by time view', { view })

      this.show2wkExplainer(view)
    },

    show2wkExplainer (view) {
      const viewToCheck = view || this.timeView
      if (viewToCheck === '2wktrend' && !getLocalstorage('seenTrendChartExplainer')) {
        // eslint-disable-next-line no-unused-expressions
        this.$refs.arenaExplainer?.show()
        setLocalstorage('seenTrendChartExplainer', 1)
      }
    },

    switchModeView (mode) {
      this.setMode(mode)
      this.loadUserProgress()
      this.trackAction('Progress: filter by mode', { mode })
    },

    getSkillScoreRank (score) {
      // TODO - check if okay
      if (score === 0) {
        return 'Beginner'
      } else if (score === 400) {
        return 'Advanced'
      } else if (score === 1000) {
        return 'Pro'
      }
    },

    showOn (type) {
      return this.$q.screen.lt.md ? type === this.showType : true
    },

    setShowType (type) {
      this.trackAction('Progress: Change tab', { tab: type })
      this.showType = type
    },

    loadProgress () {
      Promise.all([
        this.loadUserProgress(),
        this.getUserCurrentTrainingPlan(),
        this.loadTrackedRoutinesProgress()
      ]).finally(() => {
        setTimeout(() => {
          this.isPageReady = true
          if (this.$route.query.tracking === 'true') {
            this.scrollToTrackingSection(this.$refs.trackingSection)
          }
        }, 1000)
      })
    },

    reloadProgress () {
      this.isPageReady = false
      this.trackAction('Progress: reload progress')
      this.startResreshButtonLimit()
      this.reloadUserProgress()
        .finally(() => {
          setTimeout(() => {
            this.isPageReady = true
          }, 500)
        })
    },

    startResreshButtonLimit () {
      this.isRefreshDisabled = true
      this.refreshCountdown = 59
      const intervalId = setInterval(() => {
        if (this.refreshCountdown !== 0) {
          this.refreshCountdown -= 1
        } else {
          this.isRefreshDisabled = false
          clearInterval(intervalId)
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-page {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  @media (max-width: $breakpoint-sm-max) {
    overflow-y: auto;
    display: block;
    .text-h2 {
      font-size: 2rem;
    }
  }

  &__left {
    width: 420px;
    flex: 0 0 420px;
    border-right: 2px solid $soft-tone;
    display: flex;
    flex-direction: column;
    padding: 40px;
    overflow-y: auto;
    max-width: 44%;
    padding: 24px;
    overflow: hidden;
    @media (max-width: $breakpoint-sm-max) {
      max-width: 100%;
      width: 100%;
      flex: 0 0 100%;
      padding: 0 20px 20px;
      border-right: none;
    }
  }

  &__right {
    padding: 0 40px 40px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: auto;
    width: 100%;
    .position-sticky{
      position: sticky;
      top: 0;
      left: 0;
      background-color: $dark;
      padding: 40px 4px 24px;
      margin: 0 -4px;
      z-index: 2;
    }
    @media (max-width: $breakpoint-lg-max) {
      padding: 0 24px 24px;
      .position-sticky{
        padding-top: 24px;
      }
    }
    @media (max-width: $breakpoint-tablet-max) {
      .filters-list {
        width: 100%;
      }
    }
    @media (max-width: $breakpoint-sm-max) {
      height: auto!important;
      padding: 0 20px 20px;
      .position-sticky{
        padding-top: 0;
      }
    }

    section {
      margin-bottom: 2.5rem;
      &:last-child{
        margin-bottom: 0;
      }
      header {
        margin-bottom: 0.8rem;
      }
    }
  }

  &__right-container {
    margin: 0;
    width: 100%;
    max-width: 1700px;
    display: inline-flex;
    flex-direction: column;
    flex: 1;
  }

  &__right-branding {
    height: 45px;
    order: 3;
    @media (max-width: $breakpoint-tablet-max) {
      height: 24px;
    }
    @media (max-width: $breakpoint-sm-max) {
      order: 1;
      width: 100%;
    }
  }

  .bordered {
    border: 1px solid $soft-tone;
    border-radius: 6px;
    &--left{
      border-width: 0 0 0 1px;
    }
  }
}

.charts {
  display: grid;
  grid-template-columns: 2fr 2fr;
  grid-auto-rows: auto;
  gap: 1rem;
}

.win-ratio-chart {
  grid-column: 1/3;
  border: 2px solid $soft-tone;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 10px;
}

.skill-score {
  @media (min-width: 1360px) {
    &-left-new {
      height: auto;
      width: 280px;
    }
    &-right-new {
      height: auto;
      width: calc(100% - 280px);
    }
  }
  @media (min-width: $breakpoint-tablet-min) and (max-width: $breakpoint-md-max) {
    &-left {
      height: auto;
      width: 42%;
    }
    &-right {
      height: auto;
      width: 58%;
    }
    &-left-new {
      height: auto;
      width: 280px;
    }
    &-right-new {
      height: auto;
      width: calc(100% - 280px);
    }
  }
  @media (min-width: $breakpoint-md-min) and (max-width: $breakpoint-tablet-max) {
    &-left {
      height: auto;
      width: 100%;
    }
    &-right {
      height: auto;
      width: 100%;
    }
  }
}

.bottom-chart {
  border: 2px solid $soft-tone;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 25px 30px;
  display: inline-block;
  @media all and (max-width: $breakpoint-xs-max) {
    grid-column: 1/3;
  }

  @media all and (max-width: $breakpoint-sm-max) {
    grid-column: 1/3;
    padding: 15px 12px;
  }

  @media all and (max-width: $breakpoint-md-max) {
    grid-column: 1/3;
  }
}

.time-played-chart {
  border: 2px solid $soft-tone;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 25px 30px;
  display: inline-block;

  @media all and (max-width: $breakpoint-xs-max) {
    grid-column: 1/3;
  }

  @media all and (max-width: $breakpoint-sm-max) {
    grid-column: 1/3;
  }

  @media all and (max-width: $breakpoint-md-max) {
    grid-column: 1/3;
  }
}

.dropdown {
  position: relative;

  &__button {
    border: 2px solid $soft-tone;
    border-radius: 6px;
    box-sizing: border-box;
  }

  &__content {
    position: absolute;
    top: 56px;
    right: 0;
    background-color: $mid-tone;
    border-radius: 6px;
    padding: 15px;
    z-index: 10;
    &-header{
      padding: 0 15px 15px;
      margin: 0 -15px 15px;
      border-bottom: 2px solid #433558;
    }
    @media (max-width: $breakpoint-410-max) {
      right: -20px;
    }
    .options-row{
      display: block;
      width: 100%;
      padding: 4px;
      border-radius: 8px;
      border: 2px solid #433558;
      /deep/ .q-btn-group > .q-btn-item{
        border-radius: 4px
      }
      @media (max-width: $breakpoint-410-max) {
        padding: 0px
      }
    }
  }
}

.btn-group {
  display: inline-flex;
  flex-direction: row;
  border: 1px solid $soft-tone;
  border-radius: 6px;
  padding: 4px 2px;
  width: auto;
  .btn-group__item{
    margin: 0 2px;
    height: 40px;
    /deep/ .q-btn{
      height: 100%;
      line-height: 14px;
      @media (max-width: $breakpoint-sm-max) {
        &__wrapper{
          padding: 12px 15px;
        }
      }
    }
  }
}

.toggle-row-wrap {
  white-space: nowrap;
  @media (max-width: $breakpoint-410-max) {
        white-space: pre-wrap;
  }
}
</style>
