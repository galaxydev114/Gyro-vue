<template>
  <div :style="`bottom: ${data.bottom}%; left: ${data.left}%`"
       @click="select"
       class="level-position absolute"
       :class="{
         'active': isSelected
       }">
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="13.5" fill="#292044" stroke="#DD2678" stroke-width="3"/>
      <path v-if="isSelected"
            transform="translate(9,9)"
            d="M5.66912 0.21546C5.73125 0.0835248 5.85943 5.84604e-09 5.99981 5.84604e-09C6.14019 -2.55135e-05 6.2684 0.0834993 6.33053 0.215434L7.76898 3.27002C7.90424 3.55724 8.16567 3.75637 8.4681 3.80241L11.6842 4.29245C11.8231 4.31364 11.9385 4.41561 11.982 4.55556C12.0253 4.69548 11.9892 4.84911 11.8886 4.95182L9.56161 7.32974C9.34278 7.55337 9.24294 7.8755 9.29455 8.19117L9.84363 11.5482C9.86735 11.6932 9.81047 11.8397 9.6969 11.9262C9.58335 12.0127 9.43279 12.024 9.30855 11.9556L6.43191 10.3707C6.16142 10.2216 5.83828 10.2216 5.56774 10.3707L2.69137 11.9556C2.5671 12.024 2.41655 12.0126 2.303 11.9261C2.18942 11.8396 2.13257 11.693 2.15629 11.5481L2.70561 8.19133C2.75729 7.87555 2.65743 7.55337 2.43856 7.32969L0.111379 4.95185C0.0108778 4.84913 -0.0253249 4.69551 0.0180599 4.55558C0.0614448 4.41566 0.176846 4.31369 0.315765 4.29248L3.53179 3.80246C3.83422 3.75637 4.09568 3.55727 4.23094 3.27L5.66912 0.21546Z" fill="#E7A957"/>
      <path v-else d="M19.8 13.8H16.2V10.2C16.2 9.5376 15.6624 9 15 9C14.3376 9 13.8 9.5376 13.8 10.2V13.8H10.2C9.5376 13.8 9 14.3376 9 15C9 15.6624 9.5376 16.2 10.2 16.2H13.8V19.8C13.8 20.4624 14.3376 21 15 21C15.6624 21 16.2 20.4624 16.2 19.8V16.2H19.8C20.4624 16.2 21 15.6624 21 15C21 14.3376 20.4624 13.8 19.8 13.8Z" fill="#DD2678"/>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    select () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.level-position{
  cursor: pointer;
  z-index: 1;
  &.active{
    svg{
      circle{
        stroke: $yellow
      }
    }
    &:after{
      content: "";
      width: 4px;
      background: $yellow;
      display: block;
      height: 1000px;
      position: absolute;
      top: 28px;
      left: 50%;
      margin-left: -1px;
    }
  }
  @media all and (max-width: $breakpoint-xs-max){
    transform: translateY(4px);
    &:last-child{
      transform: translateX(-10px) translateY(8px);
    }
    svg{
      width: 25px;
      height: 25px;
    }
  }
}
</style>
