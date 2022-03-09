<template>
  <div class="page-loader">
    <q-circular-progress
      class="q-mx-auto q-mt-lg q-mb-sm"
      show-value
      indeterminate
      size="130px"
      color="dark-pink"
      track-color="mid-tone">
      <vue-roll-up class="full-width"
                   v-if="info[0].value !== null && info[0].value !== undefined && username"
                   :roll-list="info"
                   use-slot
                   width="100%"
                   :height=105
                   :duration="3000"
                   :speed="1500"
                   :color="'white'" >
        <template v-slot="{ marquee }">
          <div class="info">
            <div>
              {{ marquee.value }}
            </div>
            <div>
              {{ marquee.label }}
            </div>
          </div>
        </template>
      </vue-roll-up>
      <img src="@/assets/trainingPlan/icons/calendar.svg" v-else>
    </q-circular-progress>
    <div class="text-weight-bold text-uppercase" v-if="info[0].value && username">
      {{ username }}
    </div>
    <div class="text-pink text-weight-bold text-h5">
      Building your training plan
    </div>
  </div>
</template>

<script>
export default {
  props: {
    username: {
      type: String,
      default: ''
    },
    info: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.page-loader{
  position: fixed;
  backdrop-filter: blur(2px);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  background: rgba(0, 0, 0, .6);
  z-index: 9999;
}

.info{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  div{
    font-weight: bold;
    text-transform: uppercase;
    &:nth-child(1){
      font-size: 18px;
      margin-bottom: 6px;
    }
    &:nth-child(2){
      font-size: 14px;
    }
  }
}
</style>
