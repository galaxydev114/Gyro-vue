<template>
  <div class="techniques-select" :class="{'techniques-select--minimized': minimized}">
    <div class="q-py-lg"
         v-for="([key, technique], index) in sortedTechniques"
         :key="index">
      <div :class="`text-${minimized ? 'h4 text-left' : 'h3 text-center'} font-roboto q-mb-md`" style="text-transform: none">
        You can select <span class="text-pink">{{ canSelectItemsCount(technique) }} {{ technique.label }}</span>
        techniques
      </div>
      <div :class="`techniques-select__row ${minimized ? 'justify-start' : 'justify-center'}`">
        <div class="techniques-select__item"
             :class="{
                'techniques-select__item--active': skill.value,
                'techniques-select__item--disable': canSelectItemsCount(technique) <= 0 && !skill.value
              }"
             :style="{
                'background-size': 'contain',
                'background-image': `url(${skill.image})`
             }"
             v-for="(skill, i) in technique.skills"
             :key="`skill-${i}-${index}`"
             @click="itemClick(technique, skill)">
          <div class="techniques-select__item-content">
            <div class="text-h4 relative-position" style="z-index: 9">
              {{ skill.label }}
            </div>
            <div class="techniques-select__item-description">
              <div class="techniques-select__item-text">
                {{ skill.description }}
              </div>
              <div class="techniques-select__item-btn text-dark-pink text-uppercase font-rift text-weight-bold q-mt-sm">
                Click to {{ skill.value ? 'unselect' : 'select' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row q-mt-lg q-mt-md-xl" v-if="showAction">
      <div class="col-12 col-sm-3 text-left text-gray opacity-5 q-mb-md q-mb-md-none">
        Don't worry, you can change<br/>
        this later.
      </div>
      <div class="col-12 col-sm-6 col- text-center">
        <q-btn unelevated
               class="q-btn-main"
               :class="{'full-width': $q.screen.lt.sm}"
               color="dark-pink"
               @click="next"
        >
          Next
        </q-btn>
      </div>
      <div class="col-12 col-sm-3"></div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    skillsPriority: {
      type: Array,
      default: () => []
    },
    minimized: {
      type: Boolean,
      default: false
    },
    showAction: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      techniques: {
        mechanics: {
          label: 'Mechanics',
          key: 'mechanics',
          iconColor: '#6533D1',
          icon: 'building',
          skills: [
            {
              label: 'Building',
              value: false,
              description: 'Master tunneling, high ground retakes, protected side jumps and all other building techniques',
              image: require('assets/techniques/building.webp')
            },
            {
              label: 'Editing',
              value: false,
              description: 'Edit with more speed, consistency, and effectiveness',
              image: require('assets/techniques/editing.webp')
            },
            {
              label: 'Piece Control',
              value: false,
              description: 'End Fights faster and get more kills by mastering Piece Control',
              image: require('assets/techniques/piece-control.webp')
            },
            {
              label: 'Movement',
              value: false,
              description: 'Learn to take perfect angles, peaks, and master movement inside a box',
              image: require('assets/techniques/movement.webp')
            }
          ]
        },
        aiming: {
          label: 'Aiming',
          key: 'aiming',
          iconColor: '#E7A957',
          icon: 'aiming',
          skills: [
            {
              label: 'Shotgun Aim',
              value: false,
              description: 'Improve accuracy, and damage by practicing your shotgun aim',
              image: require('assets/techniques/shotgun-aim.webp')
            },
            {
              label: 'Tracking',
              value: false,
              description: 'Work on both long range AR aim, and close range SMG aim',
              image: require('assets/techniques/tracking.webp')
            },
            {
              label: 'Flicking',
              value: false,
              description: 'Master quick reactions and accurate shots in an instant',
              image: require('assets/techniques/flicking.webp')
            }
          ]
        },
        gamesense: {
          label: 'Gamesense',
          key: 'gamesense',
          iconColor: '#4FD1E3',
          icon: 'gamesense',
          skills: [
            {
              label: 'Early Game',
              value: false,
              description: 'Learn how to plan your drop, win your spawn fight, and start with great loot',
              image: require('assets/techniques/early-game.webp')
            },
            {
              label: 'Midgame',
              value: false,
              description: 'Learn how to deadside rotate, pick fights, and choose a position in zone',
              image: require('assets/techniques/midgame.webp')
            },
            {
              label: 'End Game',
              value: false,
              description: 'Learn to play, low ground, high ground, rotate, and win end-games',
              image: require('assets/techniques/end-game.webp')
            },
            {
              label: 'IGL',
              value: false,
              description: 'Learn the skills to lead your team to victory in trios and duos',
              image: require('assets/techniques/igl.webp')
            },
            {
              label: 'Fragger',
              value: false,
              description: 'Learn how to get refreshes, win mid game fights, and stay alive in the endgame',
              image: require('assets/techniques/fragger.webp')
            }
          ]
        }
      }
    }
  },
  computed: {
    sortedTechniques () {
      const techniquesList = Object.entries(this.techniques)
      const sortedPriorityList = this.skillsPriority
        .slice(0, 2)
        .map(skill => techniquesList.find(technique => technique[1].label === skill.name)) // match by name
        .filter(Boolean)
      return [...sortedPriorityList]
    }
  },
  methods: {
    itemClick (technique, skill) {
      if (this.canSelectItemsCount(technique) > 0) {
        skill.value = !skill.value
      } else {
        skill.value = false
      }
      if (!this.showAction) {
        this.next()
      }
    },
    disabledTechniques (techniqueList, index) {
      return techniqueList.filter((item) => item.value).length >= 2 && techniqueList[index].value === false
    },
    next () {
      const mappedUserTechniquesArray = Object.keys(this.techniques).map((techniquesSkillsKey) => {
        const techniques = this.techniques[techniquesSkillsKey].skills.map((technique) => {
          return { label: technique.label, value: technique.value }
        })
        return {
          skill: techniquesSkillsKey,
          techniques
        }
      })
      this.$emit('input', mappedUserTechniquesArray)
      this.$emit('next')
    },
    mergeIncomeTechniques () {
      Object.keys(this.techniques).forEach((techniquesSkillsKey) => {
        const currentSkill = cloneDeep(this.value.filter((item) => item.skill === techniquesSkillsKey)[0])
        this.techniques[techniquesSkillsKey].skills.forEach(el => {
          const _tmp = currentSkill.techniques.find(skill => skill.label === el.label)
          if (_tmp && this.canSelectItemsCount(this.techniques[techniquesSkillsKey]) > 0) {
            el.value = _tmp.value
          }
        })
      })
      return this.techniques
    },
    canSelectItemsCount (technique) {
      const { skills } = technique
      const count = 2 - skills.filter(el => el.value).length
      return count < 0 ? 0 : count
    }
  },
  mounted () {
    if (this.value && Object.keys(this.value).length) {
      this.techniques = this.mergeIncomeTechniques()
    }
  }
}
</script>

<style lang="scss" scoped>
.techniques-select {
  $parent: &;
  width: auto;
  margin: 20px auto 0;

  &__row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    @media all and (max-width: $breakpoint-sm-max) {
      justify-content: flex-start;
    }
  }

  &__item {
    $root: &;
    border: 1px solid $soft-tone;
    background-size: cover;
    background-position: center;
    border-radius: 6px;
    overflow: hidden;
    color: $gray;
    flex: 0 0 160px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    cursor: pointer;
    transition: all .5s ease;
    @media all and (max-width: $breakpoint-sm-max) {
      flex: 0 0 46%;
      margin: 2%;
      background-size: cover!important;
    }
    &-content{
      position: absolute;
      top: 0;
      right: 0;
      bottom:  0;
      left: 0;
      padding: 16px;
    }
    &-text{
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &:active {
      transform: scale(.95);
      transition: transfrom 2s ease-in-out;
    }

    &:before {
      content: "";
      z-index: 5;
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      background: $dark;
      opacity: .6;
      width: 100%;
      height: 100%;
    }
    &:after {
      content: "";
      display: block;
      padding-bottom: 100%;
    }

    &-description {
      font-size: 14px;
      z-index: 10;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 10px;
      background: $dark;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transform: translateY(100%);
      transition: all .3s ease;
    }

    &-btn {
      cursor: pointer;
    }

    &--active {
      border-color: $dark-pink;

      &:before {
        background: $dark-pink;
      }

      #{$root}-description {
        background: $dark-pink;
      }

      #{$root}-btn {
        color: $dark !important;
      }
    }

    &--disable {
      opacity: .4;
      cursor: default;

      #{$root}-btn {
        opacity: .8;
        pointer-events: none;
      }
    }

    &:hover {
      border-color: $dark-pink;
      opacity: 1;

      #{$root}-description {
        transform: translateY(0);
      }

      &:after {
        opacity: 1;
      }
    }
  }

  &--minimized {
    #{$parent}__item {
      flex: 0 0 95px;
      height: 95px;
      margin: 5px;
      padding: 8px;

      .text-h4 {
        font-size: 16px;
      }

      &-description {
        padding: 8px;
      }

      &-text {
        display: none;
      }
    }
  }
}
</style>
