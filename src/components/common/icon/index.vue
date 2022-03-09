<template>
  <div class="c-icon" @click="$emit('click')">
    <img :src="icons[icon]" :width="width" :height="height" class="no-pointer-events"/>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: 'undefined'
    },
    width: {
      type: String,
      default: () => '20px'
    },
    height: {
      type: String,
      default: () => 'auto'
    }
  },
  data () {
    return {
      icons: {
        leftArrowRounded: require('@/assets/icons/left arrow.svg'),
        rightArrowRounded: require('@/assets/icons/right arrow.svg'),
        rightArrow: require('@/assets/icons/right-arrow-flat.svg'),
        leftArrowPink: require('@/assets/icons/left-arrow-pink.svg'),
        rightArrowPink: require('@/assets/icons/right-arrow-pink.svg'),
        arrowsDrag: require('@/assets/icons/arrows-drag-icon.svg'),
        done: require('@/assets/icons/icon-done.png'),
        closeCircle: require('@/assets/icons/close circle.svg'),
        close: require('@/assets/icons/close-icon.svg'),
        plusPink: require('@/assets/icons/plus-icon-pink.svg'),
        plus: require('@/assets/icons/plus-icon.svg'),
        timer: require('@/assets/icons/timer-icon.svg'),
        notes: require('@/assets/icons/notes-icon.svg'),
        question: require('@/assets/icons/question.svg'),
        email: require('@/assets/icons/email-icon.svg'),
        lock: require('@/assets/icons/lock-icon.svg'),
        user: require('@/assets/icons/user-icon.svg'),
        volume_mute: require('@/assets/icons/volume_mute.svg'),
        volume_up: require('@/assets/icons/volume_up.svg'),
        volume_low: require('@/assets/icons/volume_low.svg'),
        stop: require('@/assets/icons/stop.svg'),
        play: require('@/assets/icons/play.svg'),
        repeat: require('@/assets/icons/repeat.svg'),
        back5: require('@/assets/icons/back5.svg'),
        pause: require('@/assets/icons/pause.svg'),
        purpleCheck: require('@/assets/icons/purple-check.svg'),
        download: require('@/assets/icons/download.svg'),
        routines: require('@/assets/icons/routines-icon.svg'),
        knowledge: require('@/assets/icons/knowledge.svg'),
        tournament: require('@/assets/icons/tournament.svg'),
        check: require('@/assets/icons/check-icon.svg'),
        checkRound: require('@/assets/icons/check-round-icon.svg'),
        change: require('@/assets/icons/change-icon.svg'),
        edit: require('@/assets/icons/edit-icon.svg'),
        goBack: require('@/assets/icons/go-back.svg'),
        notepad: require('@/assets/icons/notepad.svg'),
        trash: require('@/assets/icons/trash-icon.svg'),
        save: require('@/assets/icons/save-icon.svg'),
        trophy: require('@/assets/icons/trophy.svg'),
        trophyNew: require('@/assets/icons/trophy-new.svg'),
        goldenTrophy: require('@/assets/icons/golden_trophy.svg'),
        info: require('@/assets/icons/info-icon.svg'),
        calendar: require('@/assets/trainingPlan/icons/calendar.svg'),
        progress: require('@/assets/trainingPlan/icons/progress.svg'),
        progressGreen: require('@/assets/trainingPlan/icons/progress-green.svg'),
        location: require('@/assets/icons/location.svg'),
        championDivision: require('@/assets/icons/champion-division.svg'),
        solo: require('@/assets/icons/solo.svg'),
        graph: require('@/assets/icons/graph.svg'),
        minusPink: require('@/assets/icons/minusPink.svg'),
        cup: require('@/assets/icons/cup.svg'),
        moneybag: require('@/assets/icons/moneybag.svg'),
        youtube: require('@/assets/icons/youtube.svg'),
        twitch: require('@/assets/icons/twitch.svg'),
        twitter: require('@/assets/icons/twitter.svg'),
        starTrophy: require('@/assets/icons/star-trophy.svg'),
        quote: require('@/assets/icons/quote.svg'),
        share: require('@/assets/icons/share.svg'),
        setting: require('@/assets/icons/setting.svg'),
        subtitle: require('@/assets/icons/subtitle.svg'),
        videoFull: require('@/assets/icons/videoFull.svg'),
        videoMin: require('@/assets/icons/videoMin.svg'),
        pip: require('@/assets/icons/pip.svg'),
        rightChevron: require('@/assets/icons/rightChevron.svg'),
        cogRounded: require('@/assets/icons/cogRounded.svg'),
        supportPink: require('@/assets/icons/supportPink.svg'),
        sharePink: require('@/assets/icons/sharePink.svg'),
        starPink: require('@/assets/icons/starPink.svg'),
        menuPink: require('@/assets/icons/menuPink.svg'),
        tip: require('@/assets/icons/tip.svg'),
        rotatePhone: require('@/assets/icons/rotate phone.svg'),
        infoRounded: require('@/assets/icons/infoIcon.svg'),
        couponGreen: require('@/assets/icons/coupone-green.svg'),
        couponPink: require('@/assets/icons/coupone-pink.svg'),
        allCategories: require('@/assets/icons/all-categories.svg')
      }
    }
  }
}
</script>

<style lang="scss">
.c-icon{
  display: inline-flex;
}
</style>
