<template>
  <div class="training-plan__header text-gray text-bold d-flex items-center justify-between"
       :class="{'training-plan__header--active': isCurrentDay}"
       @mouseleave="showDropdown = false">
    <div class="training-plan__dot gt-xs"></div>
    <div class="d-flex items-center text-uppercase gt-xs">
      {{ isCurrentDay ? "TODAY - " : "" }}
      {{ dayLabel }}, {{ dayDateString }}
    </div>
    <div class="d-flex items-center text-gray text-h4 text-weight-medium lt-sm">
      {{ isCurrentDay ? "Today" : `${dayLabel} ${dayDateString}` }}
    </div>
    <div v-if="!isLastDay" class="flex items-center q-ml-sm-auto">
      <div class="training-plan__drop q-ml-md">
        <div class="training-plan__drop-btn"
             @click.stop="showOptions">
          <span></span>
          <span></span>
          <span></span>
          <q-tooltip
            v-if="$q.screen.gt.xs"
            anchor="top middle"
            self="bottom middle"
            max-width="240px"
            content-style="background-color: #382B4B; font-size: 14px"
            :offset="[10, 10]"
          >
            More options
          </q-tooltip>
        </div>
        <div class="training-plan__drop-content" v-if="showDropdown">
          <div @click="handleDropdownAction('ADD_TIME')">Add time section</div>
          <div @click="handleDropdownAction('MARK_AS_DONE')">Mark all as done</div>
        </div>
      </div>
    </div>
    <!-- <div // TODO: rethink paging (arrow-navigation)
      class="q-ml-auto lt-sm"
      style="height: 20px; cursor: pointer"
    >
      <span
        class="q-mr-sm"
        :class="{ 'disabled': isFirstDay }"
        @click="$emit('prevDay')">
        <c-icon icon="leftArrowRounded" />
      </span>
      <span
        :class="{ 'disabled': isLastDay }"
        @click="$emit('nextDay')">
        <c-icon icon="rightArrowRounded" />
      </span>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    dayLabel: {
      type: String,
      required: true
    },
    dayDateString: {
      type: String,
      required: true
    },
    isCurrentDay: {
      type: Boolean,
      default: false
    },
    isFirstDay: {
      type: Boolean,
      default: false
    },
    isLastDay: {
      type: Boolean,
      default: false
    },
    totalTime: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      showDropdown: false
    }
  },
  methods: {
    showOptions () {
      this.showDropdown = !this.showDropdown
    },

    handleDropdownAction (action) {
      this.showDropdown = false

      switch (action) {
        case 'ADD_TIME': {
          this.$emit('addTime')
          break
        }

        case 'MARK_AS_DONE': {
          this.$emit('mark-all-as-done')
          break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.training-plan {
  $root: &;
  &__header {
    padding: 10px 15px;
    background: $soft-tone;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;

    #{$root}__dot {
      width: 8px;
      height: 8px;
      display: block;
      margin-right: 10px;
      border-radius: 100%;
      background: $dark;
    }
    &--active{
      background: $pink;
      color: #fff;
      #{$root}__dot,
      #{$root}__drop-btn span{
        background: #fff;
      }
    }
  }
  @media (max-width: $breakpoint-xs-max) {
    &__header {
      padding: 10px 0 20px;
      background: initial;
      border-radius: 0;
      border-bottom: 1px solid $soft-tone;

      #{$root}__dot {
        display: none;
      }
      &--active{
        background: initial;
        #{$root}__dot,
        #{$root}__drop-btn span{
          background: $dark-pink;
        }
      }
    }
  }

  &__drop{
    z-index: 99;
    &-btn{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 24px;
      height: 24px;
      span{
        width: 5px;
        height: 5px;
        background: $dark-pink;
        border-radius: 2px;
      }
      &:hover{
        cursor: pointer;
        span{
          background: #fff;
        }
      }
    }
    &-content{
      @media (max-width: $breakpoint-xs-max) {
        right: initial;
        right: unset;
      }
      position: absolute;
      top: 35px;
      right: 10px;
      background: $mid-tone;
      border-radius: 6px;
      z-index: 10;
      width: 200px;
      overflow: hidden;
      border: 1px solid $soft-tone;
      div{
        padding: 6px 10px;
        font-size: 14px;
        overflow: hidden;
        cursor: pointer;
        color: #fff;
        font-weight: normal;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 46px;
        text-decoration: unset;
        &:hover{
          color: $dark-pink;
          background: $soft-tone;
        }
      }
    }
  }
}
</style>
