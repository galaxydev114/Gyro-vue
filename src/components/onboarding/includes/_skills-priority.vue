<template>
  <div class="col text-center q-my-md" :class="{'q-my-md-lg' : small, 'q-my-md-xl': !small}">
    <div class="full-width-limited">
      <div class="text-caption text-left q-mb-md text-weight-bold text-uppercase text-soft-tone">
        What to work on the most
      </div>
      <div class="full-width relative-position">
        <div class="draggable-list-fake-bg">
          <div class="draggable-list-fake-bg__item"
               v-for="i in skills.length"
               :key="`fake-${i}`">
            <div class="draggable-list-fake-bg__item-index" :class="{'draggable-list-fake-bg__item-index-small' : small}">
              {{ i }}
            </div>
            <div class="draggable-list-fake-bg__item-label" :class="{'draggable-list-fake-bg__item-label-small' : small}">
            </div>
          </div>
        </div>
        <draggable v-model="skills"
                  @end="$emit('draggedEvent')"
                   class="draggable-list relative-position">
          <div class="draggable-list__item justify-end"
               v-for="(skill, i) in skills"
               :key="`label-${i}`">
            <div class="draggable-list__item-name" :class="{'draggable-list__item-name-small' : small}">
              <div class="draggable-list__item-icon">
                <img :class="{'draggable-list__item-icon-img-small' : small}" src="@/assets/4directions-arrow.svg"/>
              </div>
              {{ skill.name }}
            </div>
          </div>
        </draggable>
      </div>
      <div class="text-caption text-left q-mt-sm text-weight-bold text-uppercase text-soft-tone">
        What to work on the least
      </div>
    </div>
    <div class="full-width-limited q-mt-md q-mt-md-xl text-center justify-center"
         v-if="showAction">
      <div class="opacity-5 q-mb-md text-left"
          :class="{
            'full-width': $q.screen.lt.sm,
            'left-of-cta': !$q.screen.lt.sm
          }">
        Don't worry, you can change this later.
      </div>
      <q-btn unelevated
             class="q-btn-main"
             :class="{'full-width': $q.screen.lt.sm}"
             color="dark-pink"
             @click="nextClicked">
        Next
      </q-btn>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import shuffle from 'lodash/shuffle'

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    showAction: {
      type: Boolean,
      default: true
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  components: {
    draggable
  },
  data () {
    return {
      skills: [
        {
          id: '1',
          name: 'Aiming'
        },
        {
          id: '2',
          name: 'Mechanics'
        },
        {
          id: '3',
          name: 'Gamesense'
        }
      ]
    }
  },
  methods: {
    nextClicked () {
      this.$emit('input', this.skills)
      this.$emit('next')
    }
  },
  mounted () {
    if (this.value && this.value.length) {
      this.skills = this.value
    } else {
      this.skills = shuffle(this.skills)
    }
  },
  watch: {
    skills () {
      if (!this.showAction) {
        this.nextClicked()
      }
    }
  }
}
</script>

<style lang="scss">
.draggable-list,
.draggable-list-fake-bg{
  display: flex;
  flex-direction: column;
  z-index: 10;
  &__item{
    $root: &;
    border: 1px solid $soft-tone;
    padding: 6px!important;
    border-radius: 4px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 16px;
    cursor: move;
    &-index{
      height: 60px;
      width: 60px;
      border-radius: 4px;
      background: $dark-one;
      display: flex;
      justify-content: center;
      text-align: center;
      line-height: 60px;
      font-weight: bold;
      color: #fff;
      &-small{
        height: 40px;
        line-height: 40px;
      }
    }
    &-name{
      height: 60px;
      width: calc( 100% - 66px);
      margin-left: 6px;
      border-radius: 4px;
      background: $soft-tone;
      display: flex;
      justify-content: center;
      text-align: center;
      line-height: 60px;
      font-weight: bold;
      color: #fff;
      padding: 0 15px;
      position: relative;
      &-small{
        height: 40px;
        line-height: 40px;
      }
    }
    &-label{
      height: 60px;
      width: calc( 100% - 66px);
      margin-left: 6px;
      border-radius: 4px;
      border: 2px dashed $soft-tone;
      &-small{
        height: 40px;
      }
    }
    &-icon{
      position: absolute;
      left: 20px;
      margin-top: 6px;
      &-img-small{
        width: 20px;
      }
    }
    &.sortable-chosen{
      .draggable-list__item-icon{
        svg{
          path{
            fill: $dark-pink;
          }
        }
      }
    }
    &.sortable-ghost{
      opacity: .1;
    }
  }
}

.draggable-list-fake-bg{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 8;
}
.draggable-list__item{
  border-color: transparent;
}
</style>

<style lang="scss" scoped>
.full-width-limited {
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

div.left-of-cta {
  position: absolute;
  max-width: 175px;
}
</style>
