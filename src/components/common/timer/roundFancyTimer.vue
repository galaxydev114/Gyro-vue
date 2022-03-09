<template>
  <n-timer
    :id="id"
    :seconds="seconds"
    :stopTime="stopTime"
    v-on="$listeners"
  >
    <q-card
      data-intercom-target="Timer"
      slot-scope="{
        isStart,
        isPass,
        hasSound,
        showTime,
        startTimer,
        stopTimer,
        pauseTimer,
        restartTimer,
        toggleSound,
      }"
      bordered
      class="q-mt-md"
    >
      <q-card-section>
        <div class="timer">
          <div class="timer__text">
            {{ showTime }}
          </div>
          <span
            class="timer__divider"
            :class="{ 'timer__divider--active': isPass(i) }"
            :style="rotationDeg(i)"
            v-for="i in 60"
            :key="i"
          ></span>
        </div>
      </q-card-section>
      <q-card-section
        class="bg-soft-tone flex items-center justify-between q-py-sm"
      >
        <c-btn flat noHover dense @click="restartTimer">
          <c-icon icon="repeat" color="dark-pink" width="16px" />
        </c-btn>
        <div class="flex no-wrap">
          <c-btn flat noHover dense v-if="!isStart" @click="startTimer">
            <c-icon icon="play" color="dark-pink" width="14px" />
          </c-btn>
          <c-btn flat noHover dense v-else @click="stopTimer">
            <c-icon icon="stop" color="dark-pink" width="16px" />
          </c-btn>
          <c-btn
            flat
            noHover
            dense
            @click="pauseTimer"
            :class="{ 'opacity-5': !isStart }"
          >
            <c-icon icon="pause" color="dark-pink" width="14px" />
          </c-btn>
        </div>
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
            width="18px"
          />
        </c-btn>
      </q-card-section>
    </q-card>
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
  },

  methods: {
    rotationDeg (i) {
      const rotation = (360 / 60) * (i - 1)
      return `transform:rotate(${rotation}deg) translate(0px, -80px)`
    }
  }
}
</script>

<style lang="scss" scoped>
.timer {
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "rift", sans-serif;
  font-size: 52px;
  font-weight: bold;
  margin: auto;
  position: relative;
  margin-bottom: 20px;
  &__text {
    margin-bottom: -10px;
  }
  &__divider {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px;
    height: 15px;
    background: $mid-tone;
    &--active {
      background: $dark-pink;
    }
  }
}
</style>
