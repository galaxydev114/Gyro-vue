<template>
  <n-timer
    :id="id"
    :seconds="seconds"
    :stopTime="stopTime"
    v-on="$listeners"
  >
    <div
      class="timer"
      :class="{'timer--minimal': minimal}"
      data-intercom-target="Timer"
      slot-scope="{
        isStart,
        showTime,
        startTimer,
        pauseTimer,
        stopTimer,
        toggleSound,
        hasSound
      }"
    >
      <div class="timer__controlls">
        <c-btn
          flat
          noHover
          dense
          :disabled="isStart"
          :class="{'opacity-5': isStart, 'q-mr-xs': minimal}"
          @click="startTimer"
        >
          <c-icon icon="play" color="dark-pink" :width="minimal ? '16px' : '14px'" />
        </c-btn>
        <c-btn
          flat
          noHover
          dense
          :class="{'opacity-5': !isStart}"
          @click="pauseTimer"
        >
          <c-icon icon="pause" color="dark-pink" :width="minimal ? '16px' : '14px'" />
        </c-btn>
      </div>

      <div class="timer__time">
        <span class="time">{{showTime}}</span>
      </div>

      <div class="timer__controlls">
        <c-btn flat
               noHover
               dense
               :class="{'q-mr-xs': minimal}"
               @click="stopTimer">
          <c-icon icon="repeat"
                  color="dark-pink"
                  :width="minimal ? '18px' : '16px'" />
        </c-btn>
        <c-btn
          flat
          noHover
          dense
          @click="toggleSound"
          :class="{ 'opacity-5': !hasSound }"
        >
          <c-icon
            :icon="!hasSound ? 'volume_mute' : 'volume_up'"
            color="dark-pink"
            :width="minimal ? '20px' : '16px'"
          />
        </c-btn>
      </div>
    </div>
  </n-timer>
</template>

<script>
import Timer from './timer'

export default {
  props: {
    seconds: {
      props: Number,
      default: 120
    },
    stopTime: {
      props: Number,
      default: 0
    },
    id: {
      type: String,
      require: true
    },
    minimal: {
      type: Boolean,
      default: false
    }
  },

  components: {
    'n-timer': Timer
  }
}
</script>

<style lang="scss" scoped>
.timer {
  $root: &;
  max-width: 20.625rem; /* 330px */
  width: 100%;
  height: 5.9375rem; /* 95px */
  box-sizing: border-box;
  border: 1px solid $dark;
  border-radius: 6px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: $breakpoint-xs-max) {
    max-width: 100%;
  }

  &__time {
    display: flex;
    margin: auto;
    font-size: 3.25rem;
    font-family: 'rift', 'sans-serif';
    font-weight: bold;
  }
  &__controlls {
    background-color: $dark;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &--minimal{
    height: unset;
    #{$root}__controlls {
    }
    #{$root}__time{
      font-size: 30px;
    }
  }
}
</style>
