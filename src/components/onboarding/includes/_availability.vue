<template>
  <div :class="`col ${minimized ? 'q-mt-xl' : 'q-my-xl'} text-center`">
    <div class="column q-my-lg">
      <div :class="`col q-mb-md q-mb-sm-lg ${ minimized ? 'text-left' : 'text-center' }`">
        <div :class="`${ minimized ? 'text-h5' : 'text-h6' } text-weight-bold q-mb-md`">
          {{ 'On which days of the week do you want to train?' }}
        </div>
        <div>
          <div class="q-gutter-md q-gutter-md-lg">
            <q-checkbox class="like-button-select" label="Mon" v-model="dayPlay" val="1" />
            <q-checkbox class="like-button-select" label="Tue" v-model="dayPlay" val="2" />
            <q-checkbox class="like-button-select" label="Wed" v-model="dayPlay" val="3" />
            <q-checkbox class="like-button-select" label="Thu" v-model="dayPlay" val="4" />
            <q-checkbox class="like-button-select" label="Fri" v-model="dayPlay" val="5" />
            <q-checkbox class="like-button-select" label="Sat" v-model="dayPlay" val="6" />
            <q-checkbox class="like-button-select" label="Sun" v-model="dayPlay" val="7" />
          </div>
        </div>
      </div>
      <div :class="`col q-mb-md q-mb-sm-lg ${ minimized ? 'text-left' : 'text-center' }`">
        <div :class="`${ minimized ? 'text-h5' : 'text-h6' } text-weight-bold q-mb-md`">
          {{ 'When do you prefer to train?' }}
        </div>
        <div>
          <div class="q-gutter-md q-gutter-md-lg">
            <q-checkbox class="like-button-select" label="Morning" v-model="dayTime" val="1" />
            <q-checkbox class="like-button-select" label="Afternoon" v-model="dayTime" val="2" />
            <q-checkbox class="like-button-select" label="Evening" v-model="dayTime" val="3" />
            <q-checkbox class="like-button-select" label="Night" v-model="dayTime" val="4" />
          </div>
        </div>
      </div>
      <div :class="`col q-mb-md q-mb-sm-lg ${ minimized ? 'text-left' : 'text-center' }`">
        <div :class="`${ minimized ? 'text-h5' : 'text-h6' } text-weight-bold q-mb-md`">
          How many hours available for training do you have each day?
        </div>
        <div>
          <div class="q-gutter-md q-gutter-md-lg">
            <q-radio class="like-button-select" v-model="playTime" val="1" label="1 Hour" />
            <q-radio class="like-button-select" v-model="playTime" val="3" label="2-3 Hours" />
            <q-radio class="like-button-select" v-model="playTime" val="5" label="3-5 Hours" />
            <q-radio class="like-button-select" v-model="playTime" val="7" label="More than 5" />
          </div>
        </div>
      </div>
    </div>
    <div class="full-width q-mt-lg q-mt-md-xl text-center justify-center" v-if="!minimized">
      <q-btn unelevated
             class="q-btn-main"
             :class="{'full-width': $q.screen.lt.sm}"
             color="dark-pink"
             :disable="!canGoNext"
             @click="nextClicked">
        Next
      </q-btn>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    minimized: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      sleepTime: 0,
      playTime: 0,
      dayPlay: [],
      dayTime: []
    }
  },
  methods: {
    nextClicked () {
      const availability = { sleepTime: this.sleepTime, playTime: this.playTime, dayPlay: this.dayPlay, dayTime: this.dayTime }
      this.$emit('input', availability)
      this.$emit('next')
    }
  },
  computed: {
    canGoNext () {
      return this.dayPlay?.length !== 0 && this.dayTime?.length !== 0 && this.playTime !== 0
    }
  },
  mounted () {
    if (this.value && Object.keys(this.value).length) {
      const obj = this.value
      for (const [key, value] of Object.entries(obj)) {
        if (value) {
          this[key] = value
        }
      }
    }
  }
}
</script>

<style lang="scss">
.like-button-select{
  position: relative;
  padding: 10px 15px;
  font-weight: bold;
  color: #F4D8E9;
  .q-checkbox__inner,
  .q-radio__inner{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border: 2px solid rgba(255, 255, 255, .1);
    border-radius: 4px;
    &--truthy{
      border-color: $dark-pink;
      color: $dark-pink;
    }
    &:before,
    .q-checkbox__bg,
    svg{
      display: none!important;
    }
  }
  &[aria-checked="true"]{
    color: $dark-pink;
  }
  @media all and (max-width: $breakpoint-sm-max) {
    padding: 15px 25px;
  }
}
</style>
