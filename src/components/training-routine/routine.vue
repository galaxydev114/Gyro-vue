<template>
  <div :class="['routine-inline', { 'routine-inline--active': isActive }]" @click="$emit('click')">
    <template v-if="id || title">
      <div class="full-width flex justify-between q-mb-md lt-md">
        <n-routine-category :category="category" size="20px"/>
      </div>
      <h3 class="routine-inline__title">{{title}}</h3>
      <div class="routine-inline__details">
        <div class="routine-inline__details-item gt-sm">
          <n-routine-category :category="category"/>
        </div>

        <div class="routine-inline__details-item q-pr-sm q-px-sm-md">
          <n-approved-by minimal :author="author"/>
        </div>
        <div class="routine-inline__details-item q-px-sm q-px-sm-md opacity-5" v-if="isTagsContainFNCS">
          FNCS Training
        </div>
        <div class="routine-inline__details-item q-px-sm q-px-sm-md opacity-5" v-else-if="isTagsContainCurrentSeason">
          {{seasonTitle}}
        </div>

        <div class="routine-inline__details-item">
          <n-difficulty :difficulty="difficulty"/>
        </div>
      </div>
      <div class="routine-inline__collapse" v-if="collapsed && isActive">
        <div class="routine-inline__collapse-close"
             @click.stop="$emit('hide')">
          <c-icon icon="closeCircle"/>
        </div>
        <slot />
      </div>
    </template>
    <template v-else>
      <div class="text-h4 opacity-5 q-py-lg text-center">
        No data
      </div>
    </template>
  </div>
</template>

<script>
import RoutineCategory from '@/components/common/activity-category'
import ApprovedBy from '@/components/training-routine/approved-by'
import Difficulty from '@/components/training-routine/difficulty'
import { mapState } from 'vuex'

export default {
  components: {
    'n-routine-category': RoutineCategory,
    'n-approved-by': ApprovedBy,
    'n-difficulty': Difficulty
  },

  props: {
    id: {
      type: [String, Number],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      default: 'undefined'
    },
    author: {
      type: String,
      default: 'N/A'
    },
    difficulty: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    collapsed: {
      type: Boolean,
      default: true
    },
    tags: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    isTagsContainFNCS () {
      return this.tags?.some(tag => tag.toLowerCase() === 'fncs training')
    },
    isTagsContainCurrentSeason () {
      return this.$store.getters['fortniteSeason/isTagsContainCurrentSeason'](this.tags)
    },
    ...mapState({
      seasonTitle: state => state.fortniteSeason.title
    })
  }
}
</script>

<style lang="scss" scoped>
.routine-inline {
  padding: 15px;
  box-sizing: border-box;
  border: 2px solid $soft-tone;
  border-radius: 6px;
  transition: all .3s ease-in-out;
  min-height: 100px;
  position: relative;

  &--active {
    background-color: $dark-one;
    border-color: $dark-pink;
  }

  &__title {
    margin: 0 0 10px 0;
    line-height: 120%;
    font-size: 1.25rem;
  }

  &__details {
    display: flex;
    align-items: center;
  }

  &__details-item {
    border-right: 1px solid $soft-tone;
  }
  &__details-item > * {
    margin: 0 20px;
    @media (max-width: $breakpoint-sm-max) {
      margin: 0;
    }
  }
  &__details-item:first-child > * {
    margin-left: 0;
  }
  &__details-item:last-child {
    border-right: none;
  }
  &:hover{
    transform: scale(1.02);
    cursor: pointer;
    @media (max-width: $breakpoint-sm-max) {
      transform: scale(1);
    }
  }
  &__collapse{
    margin: 10px 0 0;
    border-radius: 6px;
  }
  &__collapse-close{
    position: absolute;
    top: 10px;
    right: 10px;
  }
}

</style>
