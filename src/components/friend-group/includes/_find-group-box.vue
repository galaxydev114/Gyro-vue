<template>
  <div class="q-pa-sm box-item full-width">
    <div class="box-item--bg q-py-lg-lg q-py-sm-md q-px-lg-lg q-px-sm-sm row">
      <div class="col-7 q-py-md q-px-md gt-sm">
        <div class="text-h2 q-pt-lg-md q-pb-sm-sm text-white">
          NOVOS-XBOX
        </div>
        <div class="text-h2 q-pb-lg-md q-pb-sm-sm text-white">
          Europe
        </div>
      </div>
      <div class="col-5 q-py-md text-right q-px-lg gt-sm">
        <img :src="euMapIcon" :width="140" :height="105" class="q-mt-md" alt="open-league" />
      </div>
      <div class="col q-py-lg q-px-md lt-md column items-center">
        <img :src="boxIcon" :width="56" :height="43.5" class="q-mt-lg-lg" alt="open-league" />
        <div class="text-h3 q-pt-sm text-white">
          16 members
        </div>
      </div>
      <div class="col q-py-lg q-px-md lt-md column items-center">
        <img :src="euMapIcon" :width="77" :height="42" class="q-mt-lg-lg" alt="open-league" />
        <div class="text-h3 q-pt-sm text-white">
          Europe
        </div>
      </div>
    </div>
    <div class="box-item--black q-mt-sm q-pa-sm row">
      <div class="col q-px-sm column items-center">
        <img
          :src="platformIcon"
          :width="32"
          :height="32"/>
        <span class="q-mt-sm">
          Xbox
        </span>
      </div>
      <div class="col q-px-sm column items-center">
        <img
          :src="levelIcon"
          :width="32"
          :height="32"/>
        <span class="q-mt-sm">
          HIGH
        </span>
      </div>
      <div class="col q-px-sm column items-center gt-md">
        <img
          :src="membersIcon"
          :width="63"
          :height="32"/>
        <span class="q-mt-sm">
          16 members
        </span>
      </div>
      <div class="col q-px-sm column items-center">
        <img
          :src="timeIcon"
          :width="32"
          :height="32"/>
        <span class="q-mt-sm">
          Morning
        </span>
      </div>
      <div class="col q-px-sm column items-center">
        <img
          :src="spanishIcon"
          :width="32"
          :height="32"/>
        <span class="q-mt-sm">
          Spanish
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import boxIcon from '@/assets/friend-group/box.svg'
import levelIcon from '@/assets/friend-group/level.svg'
import platformIcon from '@/assets/friend-group/platform.svg'
import timeIcon from '@/assets/friend-group/time.svg'
import membersIcon from '@/assets/friend-group/members.svg'
import spanishIcon from '@/assets/friend-group/sp-flag.svg'
import euMapIcon from '@/assets/friend-group/map/eu.svg'

export default {
  data () {
    return {
      boxIcon,
      levelIcon,
      platformIcon,
      timeIcon,
      membersIcon,
      spanishIcon,
      euMapIcon
    }
  }
}
</script>

<style lang="scss">
  .box-item {
    background: $dark-one;
    border-radius: 24px;
    &--bg {
      background-image: url('../../../assets/friend-group/novos-bg.svg');
      background-size: cover;
      border-radius: 12px;
    }
    &--black {
      background: $dark-sec;
      border-radius: 18px;
      span {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 140%;
        color: $gray-violet;
      }
    }
  }
</style>
