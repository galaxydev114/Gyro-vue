<template>
  <div class="q-mx-auto  q-pt-lg q-pt-sm-xl" style="max-width: 1200px">
    <div class="q-pa-lg bordered border-radius full-width" v-if="!coachBlock">
      <div class="block q-pb-md">
        <div class="text-h4">
          Select your goal
        </div>
        <div>
          Each tier increases the amount of training hours required to achieve your goal.
        </div>
      </div>

      <div class="block q-mt-sm-lg">
        <div class="row q-col-gutter-md items-stretch">
          <div class="col-12 col-md-9">
            <div class="full-width relative-position">
              <div class="goal-names font-roboto text-center absolute full-width row justify-between no-wrap">
                <div class="col col-shrink">Champs Division</div>
                <div class="col col-shrink">Earning Power<br/>Rank</div>
                <div class="col col-shrink">Making Earnings<br/>In Cash Cups</div>
                <div class="col col-shrink">FNCS Winner</div>
              </div>
              <img :src="require('@/assets/onboarding/goal-bg.svg')">
              <div class="absolute level-container overflow-hidden">
                <goal-point v-for="dot in dots"
                            :key="`dot-${dot.level}`"
                            :data="dot"
                            @click="selectLevel(dot)"
                            :isSelected="isSelected(dot)"/>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="q-pa-sm-lg border-radius description full-width full-height">
              <template v-if="selectedLevel">
                <div class="text-h5 text-weight-bold">
                  Challenge Level
                </div>
                <div :class="`text-h2 q-my-md ${levelTitleColor}`">
                  {{ selectedLevel.title }}
                </div>
                <div class="opacity-5">
                  {{ selectedLevel.description }}
                </div>
              </template>
              <div v-else class="text-yellow text-h1">
                Click
                <span>
                  <img :src="require('@/assets/onboarding/select-goal.svg')">
                </span>
                to choose your goal
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <coach-block v-else @click="nextClicked"/>

    <div class="block q-mt-md q-mt-sm-xl full-width text-center">
      <q-btn unelevated
             :class="{'full-width': $q.screen.lt.sm}"
             color="dark-pink"
             :disable="!selectedLevel && !coachBlock"
             @click="nextClicked">
        Next
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    'goal-point': () => import('@/components/onboarding/includes/_goal-point'),
    'coach-block': () => import('@/components/onboarding/includes/_goal-coach')
  },
  data () {
    return {
      selectedLevel: null,
      coachBlock: false
    }
  },
  methods: {
    selectLevel (level) {
      this.selectedLevel = level
      this.trackAction('Manage expectations: Choose goal: Click level', { level: this.selectedLevel.level })
      if (this.$q.screen.lt.sm) {
        window.scrollTo({
          top: 250,
          behavior: 'smooth'
        })
      }
    },
    isSelected ({ level }) {
      return this.selectedLevel && this.selectedLevel.level === level
    },
    nextClicked () {
      if (this.coachBlock) {
        this.trackAction('Manage expectations: How we will do it: Click next')
        this.$emit('next', this.selectedLevel)
      } else {
        if (this.selectedLevel) {
          this.trackAction('Manage expectations: Choose goal: Confirm', { level: this.selectedLevel.level })
        } else {
          this.trackAction('Manage expectations: Choose goal: Skip')
        }
        this.$emit('toggle', {
          title: 'Here is how we will do it',
          description: 'Being that good won\'t be easy, but you can do it!'
        })
        this.coachBlock = true
      }
    }
  },
  computed: {
    dots () {
      return [
        {
          bottom: '8',
          left: '1',
          level: 1,
          title: 'Reach Champs',
          description: 'Alongside directing you in how to efficiently train all aspects of your game, we can help you ' +
            'with the optimal strategies to gain hype and move through the divisions faster.'
        },
        {
          bottom: '9',
          left: '14',
          level: 2,
          title: 'First PR',
          description: 'Consistent training of your fighting skills and learning new moves through mechanical drills ' +
            'will help you to hold your own in a tournament and to place high enough for that PR'
        },
        {
          bottom: '13',
          left: '28',
          level: 3,
          title: 'Regular PR',
          description: 'To be consistent in every tournament we will focus on your weaknesses and learn how to ' +
            'improve your mentality no matter what comes your way'
        },
        {
          bottom: '21',
          left: '44',
          level: 4,
          title: 'Top 500',
          description: 'You need to be able to get regular wins in the easier lobbies and survive well the most ' +
            'difficult lobbies, which means that you must have excellent all-round ability and no big weaknesses'
        },
        {
          bottom: '30',
          left: '57',
          level: 5,
          title: 'First Earnings',
          description: 'To reach the stage where you can win games and have that big tournament performance, you ' +
            'must be dedicated to your regular training and put in many hours every week'
        },
        {
          bottom: '45',
          left: '72',
          level: 6,
          title: 'Regular Earnings',
          description: 'Every aspect of your mechanical skills must be excellent, so consistent and focused ' +
            'training is key and a lot of hours will have to be put towards this.'
        },
        {
          bottom: '63',
          left: '84',
          level: 7,
          title: 'Reach FNCS Grands',
          description: 'To reach Grands, you would need to have a lot of time and dedication. It takes many months or ' +
            'even years to reach the top and once you\'re there you\'ll be competing against ' +
            'players who are playing comp Fortnite full-time.'
        },
        {
          bottom: '87',
          left: '95',
          level: 8,
          title: 'Win FNCS Grands',
          description: 'Winning FNCS Grands is one of the biggest achievements in Fortnite, and most winners have been ' +
            'training for several years to get there, usually full-time.'
        }
      ]
    },
    levelTitleColor () {
      switch (this.selectedLevel.level) {
        case 4:
        case 5:
        case 6:
          return 'text-yellow'
        case 7:
        case 8:
          return 'text-orange'
        default:
          return 'text-green'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bordered {
  border: 1.5px solid $soft-tone;

  &-radius {
    border-radius: 6px;
  }
}

.description {
  background: $dark-one;
  @media all and (max-width: $breakpoint-sm-max) {
    background: transparent;
  }
}

.level-container {
  top: 10%;
  bottom: 8%;
  left: 0;
  right: 0;
}

.goal-names {
  position: absolute;
  top: 18px;
  opacity: 0.5;
  font-size: 14px;
  font-weight: 500;
  line-height: 14.4px;
  @media all and (max-width: $breakpoint-xs-max) {
    top: 2px;
    font-size: 12px;
    font-weight: 400;
  }

  & > div {
    padding: 0 4px
  }
}
</style>
