<template>
  <n-timer
    :id="id"
    :seconds="seconds"
    :stopTime="stopTime"
    v-on="$listeners"
  >
    <div
      class="timer"
      data-intercom-target="Timer"
      slot-scope="{
        isStart,
        showTime,
        startTimer,
        pauseTimer,
      }"
    >
      <div class="timer__time">
        <span class="time">{{showTime}}</span>
      </div>

      <div class="timer__controlls">
        <c-btn
          flat
          noHover
          dense
          :disabled="isStart"
          :class="{'opacity-5': isStart}"
          @click="startTimer"
        >
          <c-icon icon="play" color="dark-pink" width="14px" />
        </c-btn>
        <c-btn
          flat
          noHover
          dense
          :class="{'opacity-5': !isStart}"
          @click="pauseTimer"
        >
          <c-icon icon="pause" color="dark-pink" width="14px" />
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
    }
  },

  components: {
    'n-timer': Timer
  }
}
</script>

<style lang="scss" scoped>
.timer {
  max-width: 20.625rem; /* 330px */
  width: 100%;
  height: 5.9375rem; /* 95px */
  box-sizing: border-box;
  border: 1px solid $dark;
  border-radius: 6px;

  display: grid;
  grid-template-columns: auto 5.9375rem;
  @media (max-width: $breakpoint-xs-max) {
    max-width: 100%;
  }

  &__time {
    grid-column: 1;
    display: flex;
    margin: auto;
    font-size: 3.25rem;
    font-family: 'Rift', 'sans-serif';
    font-weight: bold;
  }
  &__controlls {
    background-color: $dark;
    grid-column: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
