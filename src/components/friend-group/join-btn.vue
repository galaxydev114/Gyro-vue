<template>
  <div v-if="state=='findJoin' && isShowBtnComputed" class="fg-join-btn">
    <div v-on="$listeners" class="full-width fg-join-link fg-find justify-center cursor-clickable">
      <span >Find a Friends Group</span>
    </div>
    <div v-if="showClose" class="btn__close" @click="setShowBtn(false)">
      <c-icon icon="closeWhiteCircle" />
    </div>
  </div>
  <div v-else-if="state=='hasJoin'" class="relative-position">
    <div class="fg-join-tooltip  q-mt-xs-md q-mt-md-none" v-if="this.$route.query.joined && firstJoined && showingTooltip">
      <div class="tooltip-content text-center">
        <div class="text-h3 text-center q-pt-md">
          Your Friends Group
        </div>
        <div class="text-center tooltip-desc q-mt-sm">
          Here you can see all of the info about your Friends Group, access, change or leave it
        </div>
        <q-btn unelevated
          class="btn-got-it full-width q-mt-md"
          color="light-pink"
          @click="setShowToolTip(false)"
        >
          Got it
        </q-btn>
      </div>
    </div>
    <div v-on="$listeners" class="full-width fg-join-link fg-has-join justify-center cursor-clickable items-center d-flex q-mt-xs-sm q-mt-md-none">
      <span class="q-mr-sm join-span">{{userFriendGroup.name}}</span>
      <img
        class="q-mr-xs-md q-mr-md-none"
        :src="hasJoinIcon"
        :width="40"
        :height="40"/>
    </div>
  </div>
  <div v-on="$listeners" v-else-if="state=='noJoin'" class="full-width fg-join-link fg-no-joined justify-center cursor-clickable items-center d-flex">
    <img :src="noJoinIcon"
      :width="32"
      :height="32"/>
    <span class="q-ml-md">No FG Yet</span>
  </div>
  <div v-else-if="state=='waitingForGroupAuto'">
    <div v-on="$listeners" class="full-width fg-join-link fg-no-joined justify-center cursor-clickable items-center d-flex">
      <span class="q-mr-md join-span">Application in Progress</span>
      <img :src="noJoinIcon" class="q-mr-xs-md q-mr-md-none"
        :width="52"
        :height="52"/>
    </div>
  </div>
  <div v-on="$listeners" v-else-if="state=='waitingForGroupAdmin'" class="full-width fg-join-link fg-no-joined justify-center cursor-clickable items-center d-flex">
    <span class="q-mr-md join-span">Application in Progress (Admin)</span>
    <img :src="noJoinIcon" class="q-mr-xs-md q-mr-md-none"
      :width="52"
      :height="52"/>
  </div>
  <div v-else-if="state=='canJoin' && isShowBtnComputed" class="fg-join-btn">
    <div v-on="$listeners" class="full-width fg-join-link fg-can-join justify-center cursor-clickable items-center d-flex">
      <span >Join a FG now</span>
    </div>
    <div v-if="showClose" class="btn__close" @click="setShowBtn(false)">
      <c-icon icon="closeWhiteCircle" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import hasJoinIcon from '@/assets/friend-group/hasJoin-icon.svg'
import noJoinIcon from '@/assets/friend-group/noJoin-icon.svg'
import { getLocalstorage, setLocalstorage } from '@/services/localstorageservice'

export default {
  data () {
    return {
      hasJoinIcon,
      noJoinIcon,
      isShowBtn: true,
      showingTooltip: true
    }
  },
  props: {
    state: {
      type: String,
      default: null
    },
    showClose: {
      type: Boolean,
      default: true
    },
    firstJoined: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters({
      userFriendGroup: 'user/userFriendGroup'
    }),
    isShowBtnComputed () {
      return getLocalstorage('FGBtnStatus') !== null ? getLocalstorage('FGBtnStatus') === 'true' : this.isShowBtn
    }
  },
  methods: {
    setShowBtn (val) {
      setLocalstorage('FGBtnStatus', val)
      this.isShowBtn = val
    },
    setShowToolTip (val) {
      if (this.$route.query.joined) {
        const query = Object.assign({}, this.$route.query)
        delete query.joined
        this.$router.replace({ query })
      }
      this.showingTooltip = val
    }
  }
}
</script>

<style lang="scss">
  .fg-join-tooltip {
    position: absolute;
    background-color: transparent;
    font-size: 14px;
    padding: 0px 10px;
    width: 292px;
    left: -292px;
    top: 25px;
    &:after {
      content: ' ';
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 10px solid $dark-pink;
      right: 0px;
      position: absolute;
      top: 5px;
    }
    .tooltip-content {
      background: $dark-pink;
      border-radius: 6px;
      padding: 16px;
      position: relative;
      .tooltip-desc {
        white-space: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        color: $gray;
      }
      .btn-got-it {
        font-size: 16px;
        font-family: Rift;
        line-height: 0;
        font-weight: 600;
        color: $dark-pink !important;
      }
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      left: unset;
      position: relative;
      width: 100%;
      top: unset;
      &:after {
        border-top: 10px solid $dark-pink;
        border-right: 10px solid transparent;
        border-left: 10px solid transparent;
        left: calc(50% - 5px);
        top: unset;
      }
    }
  }
  .fg-join-btn{
    position: relative;
    .btn__close {
      position: absolute;
      cursor: pointer;
      top: -5px;
      right: -5px;
      transition: all .1s ease-in-out;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  .fg-join-link {
    border-radius: 6px;
    padding: 14px 28px;
    font-family: 'Roboto';
    font-weight: 600;
    font-size: 16px;
    @media screen and (max-width: $breakpoint-xs-max) {
      .join-span {
        order: 2;
      }
    }
  }
  .fg-find {
    background: $blue;
    &:hover {
      background: #6E65E7;
    }
    &:active {
      background: #7E76EA;
    }
    &:disabled {
      background: $blue;
      opacity: 0.6;
    }
  }
  .fg-has-join {
    background: linear-gradient(180deg, rgba(101, 51, 209, 0.3) 0%, rgba(51, 105, 209, 0.3) 100%);
    border-radius: 8px;
    border: 1.5px solid #6533D1;
    padding: 6px 12px;
    @media (max-width: $breakpoint-sm-max) {
      justify-content: start;
    }
    &:hover {
      border: 1.5px solid #7F54D9;
      background: linear-gradient(180deg, rgba(127, 84, 217, 0.3) 0%, rgba(84, 129, 217, 0.3) 100%);
    }
    &:active {
      border: 1.5px solid #7F54D9;
      background: linear-gradient(180deg, rgba(145, 109, 222, 0.3) 0%, rgba(109, 148, 222, 0.3) 100%);
    }
    &:disabled {
      border: 1.5px solid #6533D1;
      background: linear-gradient(180deg, rgba(101, 51, 209, 0.3) 0%, rgba(51, 105, 209, 0.3) 100%);
      opacity: 0.6;
    }
  }
  .fg-can-join {
    background: linear-gradient(180deg, #6533D1 0%, #3369D1 100%);
    box-shadow: 0px 4px 16px rgba(54, 102, 210, 0.3);
    &:hover {
      background: linear-gradient(180deg, #7F54D9 0%, #5884DA 100%, #5481D9 100%);
    }
    &:active {
      background: linear-gradient(180deg, #916DDE 0%, #6D94DE 100%);
    }
    &:disabled {
      background: linear-gradient(180deg, #6533D1 0%, #3369D1 100%);
      opacity: 0.6;
    }
  }
  .fg-no-joined {
    padding: 6px 12px;
    background: rgba(35, 21, 56, 0.5);
    border: 1.5px solid #5B506D;
    box-sizing: border-box;
    border-radius: 8px;
    @media (max-width: $breakpoint-sm-max) {
      justify-content: start;
    }
    &:hover {
      background: rgba(58, 35, 93, 0.5);
      border: 1.5px solid #6E6184;
    }
    &:active {
      background: rgba(70, 42, 111, 0.5);
      border: 1.5px solid #887B9E;
    }
    &:disabled {
      opacity: 0.6;
    }
  }
</style>
