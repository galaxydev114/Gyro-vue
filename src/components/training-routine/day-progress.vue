<template>
  <div class="day-progress">
    <svg v-if="!isDone" fill="none" height="76" viewBox="0 0 72 76" width="72" xmlns="http://www.w3.org/2000/svg"><path d="m42.75 4.16506c-4.1769-2.41154-9.3231-2.41154-13.5 0l-19.1769 11.07184c-4.17693 2.4115-6.75001 6.8682-6.75001 11.6913v22.1436c0 4.8231 2.57308 9.2798 6.75001 11.6913l19.1769 11.0718c4.1769 2.4116 9.3231 2.4116 13.5 0l19.1769-11.0718c4.1769-2.4115 6.75-6.8682 6.75-11.6913v-22.1436c0-4.8231-2.5731-9.2798-6.75-11.6913z" fill="#433558" stroke="#231538" stroke-width="3"/><path d="m30 14.4641c3.7128-2.1436 8.2872-2.1436 12 0l11.3827 6.5718c3.7128 2.1436 6 6.1051 6 10.3923v13.1436c0 4.2872-2.2872 8.2487-6 10.3923l-11.3827 6.5718c-3.7128 2.1436-8.2872 2.1436-12 0l-11.3827-6.5718c-3.7128-2.1436-6-6.1051-6-10.3923v-13.1436c0-4.2872 2.2872-8.2487 6-10.3923z" fill="#231538"/></svg>
    <svg v-else width="72" height="76" viewBox="0 0 72 76" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M42.75 4.16506C38.5731 1.75352 33.4269 1.75352 29.25 4.16506L10.0731 15.2369C5.89617 17.6484 3.32309 22.1051 3.32309 26.9282L3.32309 49.0718C3.32309 53.8949 5.89617 58.3516 10.0731 60.7631L29.25 71.8349C33.4269 74.2465 38.5731 74.2465 42.75 71.8349L61.9269 60.7631C66.1038 58.3516 68.6769 53.8949 68.6769 49.0718V26.9282C68.6769 22.1051 66.1038 17.6484 61.9269 15.2369L42.75 4.16506Z" fill="url(#paint0_linear)" stroke="#231538" stroke-width="3"/>
      <path d="M30 14.4641C33.7128 12.3205 38.2872 12.3205 42 14.4641L53.3827 21.0359C57.0955 23.1795 59.3827 27.141 59.3827 31.4282L59.3827 44.5718C59.3827 48.859 57.0955 52.8205 53.3827 54.9641L42 61.5359C38.2872 63.6795 33.7128 63.6795 30 61.5359L18.6173 54.9641C14.9045 52.8205 12.6173 48.859 12.6173 44.5718V31.4282C12.6173 27.141 14.9045 23.1795 18.6173 21.0359L30 14.4641Z" fill="#231538"/>
      <defs>
        <linearGradient id="paint0_linear" x1="6.54683" y1="18.1087" x2="38.7641" y2="77.015" gradientUnits="userSpaceOnUse">
          <stop stop-color="#D92779"/>
          <stop offset="1" stop-color="#7C277E"/>
        </linearGradient>
      </defs>
    </svg>
    <span class="day-progress__title font-rift text-h4 text-weight-bold"
          :class="{'opacity-5': !isDone}"
    >
      DAY {{day}}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    day: {
      type: Number,
      required: true
    },
    isDone: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.day-progress {
  width: 80px;
  height: 80px;
  position: relative;
  display: inline-block;
  &__title {
    top: 50%;
    left: 50%;
    transform: translateY(-45%) translateX(-50%);
    position: absolute;
    font-family: 'Rift', 'serif';
  }
  svg{
    width: 100%;
    height: 100%;
  }
  @media (max-width: $breakpoint-xs-max) {
    width: 65px;
    height: 65px;
    &__title{
      font-size: 16px;
    }
  }
}
</style>
