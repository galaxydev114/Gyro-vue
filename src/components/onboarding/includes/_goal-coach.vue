<template>
  <div class="text-center q-py-lg q-px-none q-px-sm-lg q-mx-auto block" style="max-width: 700px; width: 100%">
    <div class="text-h6 text-weight-bold">
      Listen to what our <span class="text-pink">coach has to say</span>
    </div>
    <div class="block q-mt-md q-mb-xl">
      <n-multimedia v-if="videoUrl" :src="videoUrl"
        autoplay
        @play="trackAction('Manage expectations: How we will do it: Video: click play')"
        @pause="trackAction('Manage expectations: How we will do it: Video: click pause')"
        @ended="trackAction('Manage expectations: How we will do it: Video: finished')"
        @unmuted="trackAction('Manage expectations:How we will do it: Video: click unmute')" />
    </div>
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm text-left">
        <div class="text-h2 q-mb-lg">
          What <span class="text-pink">we</span> bring
        </div>
        <div class="flex no-wrap q-mb-md">
          <div class="q-mr-sm">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8.75198" cy="9.09963" r="8.75198" fill="#DD2678"/>
              <path d="M11.8313 7.11448C11.5619 6.84465 11.1238 6.84465 10.8543 7.11448L7.88801 10.0804L6.64911 8.84188C6.37964 8.57206 5.94157 8.57206 5.67209 8.84188C5.40227 9.11171 5.40227 9.54908 5.67209 9.81891L7.3995 11.5463C7.53424 11.6814 7.71113 11.7488 7.88801 11.7488C8.0649 11.7488 8.24179 11.6814 8.37652 11.5463L11.8313 8.0915C12.1012 7.82168 12.1012 7.3843 11.8313 7.11448Z" fill="#F4D8E9"/>
            </svg>
          </div>
          <div class="text-subtitle1 text-weight-regular">
            A professional training plan personalized  for you, built with top tier coaches and players
          </div>
        </div>
        <div class="flex no-wrap">
          <div class="q-mr-sm">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8.75198" cy="9.09963" r="8.75198" fill="#DD2678"/>
              <path d="M11.8313 7.11448C11.5619 6.84465 11.1238 6.84465 10.8543 7.11448L7.88801 10.0804L6.64911 8.84188C6.37964 8.57206 5.94157 8.57206 5.67209 8.84188C5.40227 9.11171 5.40227 9.54908 5.67209 9.81891L7.3995 11.5463C7.53424 11.6814 7.71113 11.7488 7.88801 11.7488C8.0649 11.7488 8.24179 11.6814 8.37652 11.5463L11.8313 8.0915C12.1012 7.82168 12.1012 7.3843 11.8313 7.11448Z" fill="#F4D8E9"/>
            </svg>
          </div>
          <div class="text-subtitle1 text-weight-regular">
            A schedule that lets you know exactly what you need to do and when
          </div>
        </div>
      </div>
      <div class="col-12 col-sm q-mt-lg q-mt-sm-none text-left">
        <div class="text-h2 q-mb-lg">
          What <span class="text-pink">you</span> bring
        </div>
        <div class="flex no-wrap q-mb-md">
          <div class="q-mr-sm">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8.75198" cy="9.09963" r="8.75198" fill="#DD2678"/>
              <path d="M11.8313 7.11448C11.5619 6.84465 11.1238 6.84465 10.8543 7.11448L7.88801 10.0804L6.64911 8.84188C6.37964 8.57206 5.94157 8.57206 5.67209 8.84188C5.40227 9.11171 5.40227 9.54908 5.67209 9.81891L7.3995 11.5463C7.53424 11.6814 7.71113 11.7488 7.88801 11.7488C8.0649 11.7488 8.24179 11.6814 8.37652 11.5463L11.8313 8.0915C12.1012 7.82168 12.1012 7.3843 11.8313 7.11448Z" fill="#F4D8E9"/>
            </svg>
          </div>
          <div class="text-subtitle1 text-weight-regular">
            Consistency - It won’t be easy, but only being consistent will help you see progress
          </div>
        </div>
        <div class="flex no-wrap">
          <div class="q-mr-sm">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8.75198" cy="9.09963" r="8.75198" fill="#DD2678"/>
              <path d="M11.8313 7.11448C11.5619 6.84465 11.1238 6.84465 10.8543 7.11448L7.88801 10.0804L6.64911 8.84188C6.37964 8.57206 5.94157 8.57206 5.67209 8.84188C5.40227 9.11171 5.40227 9.54908 5.67209 9.81891L7.3995 11.5463C7.53424 11.6814 7.71113 11.7488 7.88801 11.7488C8.0649 11.7488 8.24179 11.6814 8.37652 11.5463L11.8313 8.0915C12.1012 7.82168 12.1012 7.3843 11.8313 7.11448Z" fill="#F4D8E9"/>
            </svg>
          </div>
          <div class="text-subtitle1 text-weight-regular">
            Motivation - Set your goals and do your best to complete your training program
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GOAL_SETTING_INTRO_VIDEO } from '@/constants/helpers'

export default {
  props: {
    videoUrl: {
      type: String,
      default: GOAL_SETTING_INTRO_VIDEO
    }
  },
  components: {
    'n-multimedia': () => import('@/components/common/multimedia')
  }
}
</script>
