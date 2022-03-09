export default {
  title: 'Icons'
}

export const Icons = () => ({
  title: 'icons',
  components: {
    'c-icon': () => import('@/components/common/icon')
  },
  data() {
    return {
      bigIcons: [
        'info',
        'knowledge',
        'tournament',
        'done'
      ],
      icons: [
        'leftArrowRounded',
        'rightArrowRounded',
        'rightArrow',
        'leftArrowPink',
        'rightArrowPink',
        'arrowsDrag',
        'closeCircle',
        'close',
        'plusPink',
        'plus',
        'timer',
        'notes',
        'question',
        'email',
        'lock',
        'user',
        'volume_mute',
        'volume_up',
        'stop',
        'play',
        'repeat',
        'back5',
        'pause',
        'purpleCheck',
        'download',
        'routines',
        'check',
        'checkRound',
        'change',
        'edit',
        'goBack',
        'notepad',
        'trash',
        'save',
        'trophy',
        'goldenTrophy',
        'calendar',
        'progress',
        'location',
        'championDivision',
        'solo',
        'graph',
        'minusPink',
        'cup',
        'moneybag',
        'youtube',
        'twitch',
        'twitter',
        'starTrophy',
        'quote'
      ]
    }
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div class="col-3 q-my-md items-center flex" v-for="icon in icons">
        <c-icon :icon="icon" class="q-mr-lg"/>
        Icon name <strong style="margin-left: 15px">{{ icon }}</strong>
      </div>
    </div>
    <div class="row q-mb-lg">
      <div class="col-3 q-my-md items-center flex" v-for="icon in bigIcons">
        <c-icon :icon="icon" width="68px" class="q-mr-lg"/>
        Icon name <strong style="margin-left: 15px">{{ icon }}</strong>
      </div>
    </div>
    </div>`
})
