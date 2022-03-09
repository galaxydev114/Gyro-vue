<template>
  <div class="col scores-container"
       :class="{'scores-container--show': readyToShow}">
    <div class="sm full-width text-center flex items-center justify-center q-mt-md q-mb-xl colors-legend">
      <div class="colors-legend__item q-px-md text-uppercase text-caption">
        <q-avatar size="28px" color="green" class="q-mr-sm">
          {{userNick}}
        </q-avatar>
        <span class="text-green">
          Your score
        </span>
      </div>
      <div class="colors-legend__item q-px-md text-uppercase text-caption">
        <q-avatar size="28px" color="pink" class="q-mr-sm">
          N
        </q-avatar>
        <span class="text-pink">
        1 month projected score
        </span>
      </div>
      <div class="colors-legend__item q-px-md text-uppercase text-caption">
        <q-avatar size="28px" color="blue" class="q-mr-sm">
          M
        </q-avatar>
        <span class="text-blue">
          pro player {{topPlayerNick}}
        </span>
      </div>
    </div>
    <q-card :bordered="$q.screen.gt.xs"  flat class="scores-info-card q-my-md q-my-md-lg">
      <q-card-section class="q-py-lg-xl q-px-sm-lg" :class="{'q-mx-none': $q.screen.lt.sm}">
        <div class="col q-mb-lg">
          <div class="row justify-between">
            <div class="col-12 col-sm-4 col-md q-mb-md q-mb-md-none">
              <div class="text-h4 text-gray">
                NOVOS Skill score
              </div>
              <div class="text-gray">
                 It is calculated based on your ingame performance
              </div>
            </div>
            <div class="col-12 col-sm-8 col-md">
              <div class="graph-score-info">
                <div class="graph-score-info__item graph-score-info__item--green">
                  <div class="score-value text-h3">
                    {{currentUserScore}}
                  </div>
                  <div class="score-label q-ml-sm text-subtitle2 text-weight-regular">
                    Your<br> score
                  </div>
                </div>
                <div class="graph-score-info__item graph-score-info__item--pink">
                  <div class="score-value text-h3">
                    {{userNextMonthScore}}
                  </div>
                  <div class="score-label q-ml-sm text-subtitle2 text-weight-regular" style="min-width: 107px;">
                    1 month<br> projected score
                  </div>
                </div>
                <div class="graph-score-info__item graph-score-info__item--blue">
                  <div class="score-value text-h3">
                    {{topPlayerScore}}
                  </div>
                  <div class="score-label q-ml-sm text-subtitle2 text-weight-regular">
                    {{topPlayerNick}}<br> score
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="row q-col-gutter-lg items-stretch">
            <div class="col-12 col-md-9">
              <score-chart style="height: 100%" class="full-width"
                :userNick="this.userNick"
                :userScore="this.currentUserScore"
                :nextScore="this.userNextMonthScore"
                :topPlayer="{nick: this.topPlayerNick, score: this.topPlayerScore}"
              />
            </div>
            <div class="col-12 col-md-3">
              <div class="column q-col-gutter-lg">
                <div class="col">
                  <score-card
                    :title="`${this.statsSource} K/D`"
                    :delay="baseScoreCardDelay"
                    :description="'Your eliminations per game feeds into the calculation, as your chance of winning each fight is a very important indicator of skill.'"
                    :score="this.playerKD"
                    :potentialScore="this.playerPredictedKD"
                    :targetScore="this.maxKD"
                    :maxScore="this.maxKD"
                    @tooltip-hover="trackAction('Skill Score: Hover Metric Info', { metric: 'Arena K/D' })"
                  ></score-card>
                  <score-card
                    :title="`${this.statsSource} Placement`"
                    :delay="baseScoreCardDelay * 2"
                    :description="'Consistently getting a higher rate of wins and good placements in arena will improve your skill score over time, while early deaths will lower it.'"
                    :score="this.playerPlacement"
                    :potentialScore="this.playerPredictedPlacement"
                    :targetScore="1"
                    :maxScore="100"
                    @tooltip-hover="trackAction('Skill Score: Hover Metric Info', { metric: 'Arena Placement' })"
                  ></score-card>
                  <score-card
                    title="Power Rank"
                    :delay="baseScoreCardDelay * 3"
                    :description="'If you have good performances in tournaments then this will also help to improve your score. We are currently using an adapted version of Fortnite Tracker\'s PR for this.'"
                    :score="this.powerRank"
                    :potentialScore="parseFloat((this.powerRank + 5).toFixed(2))"
                    :targetScore="this.maxPR"
                    :maxScore="this.maxPR"
                    @tooltip-hover="trackAction('Skill Score: Hover Metric Info', { metric: 'Power Rank' })"
                  ></score-card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div class="full-width q-mt-lg-xl q-px-md q-px-sm-none q-pb-md q-pb-md-none text-center justify-center">
      <q-btn unelevated
             class="q-btn-main"
             :class="{'full-width': $q.screen.lt.sm}"
             color="dark-pink"
             @click="$emit('next')">
        Next
      </q-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { sendSegmentEvent } from '@/services/segment'
export default {
  data () {
    return {
      baseScoreCardDelay: 300,
      readyToShow: false,
      topPlayerScore: 1177,
      topPlayerNick: 'Tayson'
    }
  },
  components: {
    'score-card': () => import('./_score-card'),
    'score-chart': () => import('./_chart')
  },

  computed: {
    ...mapState({
      maxKD: state => state.user.maxScores.maxKD,
      maxPR: state => state.user.maxScores.maxPR
    }),
    ...mapGetters({
      userScore: 'user/userScore',
      isScoreArenaBased: 'user/isScoreArenaBased',
      arenaKD: 'user/arenaKD',
      publicKD: 'user/publicKD',
      arenaPlacement: 'user/arenaPlacement',
      publicPlacement: 'user/publicPlacement',
      powerRank: 'user/powerRank',
      currentUser: 'user/currentUser',
      currentUserScore: 'user/currentUserScore',
      userNextMonthScore: 'user/nextMonthUserScore'
    }),
    statsSource () {
      return this.isScoreArenaBased ? 'Arena' : 'Pubs'
    },
    playerKD () {
      return this.isScoreArenaBased ? this.arenaKD : this.publicKD
    },
    playerPredictedKD () {
      return parseFloat((Math.max(this.playerKD * 1.2, this.playerKD + 0.5)).toFixed(2))
    },
    playerPlacement () {
      return this.isScoreArenaBased ? this.arenaPlacement : this.publicPlacement
    },
    playerPredictedPlacement () {
      return parseFloat((Math.max(this.playerPlacement * 0.95, 1)).toFixed(2))
    },
    userNick () {
      return (this.currentUser?.fortniteNickname?.match(/[a-zA-Z]/) || []).pop()
    }
  },

  methods: {
    trackAction (eventName, opts = {}) {
      sendSegmentEvent(eventName, opts)
    }
  },
  mounted () {
    setTimeout(() => {
      this.readyToShow = true
    })
  }
}
</script>

<style lang="scss">
.scores-container{
  opacity: 0;
  transition: all .6s ease-in-out;
  &--show{
    opacity: 1;
  }
}
.graph-score-info{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  &__item{
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    margin-left: 10px;
    border: 2px solid transparent;
    padding: 10px;
    border-radius: 8px;
    text-transform: uppercase;
    &--green{
      border-color: $green;
      background: #264348;
    }
    &--pink{
      border-color: $pink;
      background: #5B1A4B;
    }
    &--blue{
      border-color: $blue;
      background: #33266B;
    }
  }
  @media all and (max-width: $breakpoint-xs-max) {
    flex-direction: column;
    &__item{
      width: 100%;
      margin: 0 0 15px;
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      font-size: 12px;
      padding: 10px;
      .score-label{
        margin: 0;
      }
      br{
        display: none;
      }
      .text-h3{
        font-size: 12px;
      }
    }
  }
}
.colors-legend{
  &__item{
    position: relative;
    &:after{
      content: "";
      width: 2px;
      height: 14px;
      position: absolute;
      right: 0;
      top: 7px;
      display: block;
      background: $soft-tone;
    }
    &:last-child{
      &:after{
        display: none;
      }
    }
  }
}
@media all and (max-width: $breakpoint-xs-max) {
  .chart__categories-text{
    transform: rotate(0) translateY(15px);
    font-size: 12px!important;
    &:nth-child(2){
      transform: translateX(80px) translateY(40px);
    }
  }
}
</style>
