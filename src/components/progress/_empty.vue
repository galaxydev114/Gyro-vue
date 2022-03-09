<template>
  <div class="progress-empty flex column items-center justify-center"
       :class="{ 'progress-empty--no-border': noBorder}">
    <template v-if="loading">
      <div>
        <q-circular-progress
          class="q-mx-auto q-mt-lg"
          show-value
          indeterminate
          size="100px"
          color="dark-pink"
          track-color="mid-tone">
          <img src="@/assets/trainingPlan/icons/progress.svg">
        </q-circular-progress>
      </div>
      <div class="text-center q-mt-md opacity-5">
        Preparing your data
      </div>
    </template>
    <template v-else>
      <div v-if="defaultIcon">
        <q-circular-progress
          show-value
          :min="0"
          :max="1"
          :value="1"
          class="q-mx-auto q-mt-lg"
          size="100px"
          color="dark-pink"
          track-color="mid-tone">
          <img src="@/assets/trainingPlan/icons/progress.svg">
        </q-circular-progress>
      </div>
      <slot>
        <div class="text-center q-mt-md opacity-5">
          It seems like you haven't<br>
          played any Arena matches yet
        </div>
      </slot>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    noBorder: {
      type: Boolean,
      default: false
    },
    defaultIcon: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-empty{
  border: 2px dashed $soft-tone;
  border-radius: 10px;
  min-height: 250px;
  height: auto;
  max-height: 100%;
  font-size: 20px;
  font-weight: bold;
  color: #DFDAE7;
  padding: 0 30px;
  flex-wrap: wrap;
  &--no-border{
    border: none
  }
  @media (max-width: $breakpoint-mobile-max) {
    padding: 0 15px;
  }
}
</style>
