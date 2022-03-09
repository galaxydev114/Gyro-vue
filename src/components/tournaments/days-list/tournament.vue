<template>
  <div class="tournament-item" :class="{ 'tournament-item--small': small }">
    <div class="tournament-item__left">
      <q-img :src="image" class="tournament-item__img" v-if="!small"/>
      <q-img :src="image" class="tournament-item__img" ratio="1.3" v-else/>
      <div v-if="!small" :class="`tournament-item__type tournament-item__type--${type.toLowerCase()}`">
        {{ type.toLowerCase() }}
      </div>
    </div>

    <div class="tournament-item__content column row-md q-pt-sm-sm full-width q-pl-md q-pl-md-none justify-md-between">
      <div class="tournament-item__center">
        <div class="text-h4">
          {{ title }}
        </div>
        <div class="row items-center q-my-sm q-my-sm-sm text-gray">
          <div class="col-auto q-mr-sm q-mr-sm-md flex text-gray">
            <c-icon icon="calendar" class="q-mr-sm float-left"/>
            <span class="q-mt-xs">{{ date | date }}</span>
          </div>
          <div class="col-auto q-mr-sm-md flex text-gray">
            <c-icon icon="location" class="q-mr-sm float-left"/>
            <span class="q-mt-xs">{{ location | list }}</span>
          </div>
        </div>
        <div class="flex cat-list" v-if="!small && (mode || (requirements && requirements.length))">
          <div class="cat-list__item" v-if="requirements && requirements.length">
            <c-icon icon="championDivision" class="q-mr-sm" /> {{ requirements | list }}
          </div>
          <div class="cat-list__item" v-if="mode">
            <c-icon icon="solo" class="q-mr-sm" />
            {{ mode }}
          </div>
        </div>
      </div>
      <div class="tournament-item__right" v-if="!small" >
        <platforms
          :desktop="platforms.includes('Windows')"
          :mobile="platforms.includes('Android')"
          :nintendo="platforms.includes('Switch')"
          :ps="platforms.includes('PS4')"
          :xbox="platforms.includes('XboxOne')"
        />
        <div class="q-mt-lg q-mt-sm-auto btns-blk">
          <c-btn @click="$emit('add')"
                 noWidth
                 v-if="isAddButtonVisible">
            ADD tournament
          </c-btn>
          <c-btn  @click="$emit('remove')"
                  noWidth
                  outline
                  v-else>
            Remove
          </c-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayJs from 'dayjs'

export default {
  props: {
    image: String,
    title: String,
    date: String,
    location: { type: Array, default: () => [] },
    requirements: { type: Array, default: () => [] },
    platforms: { type: Array, default: () => [] },
    mode: String,
    type: String,
    small: Boolean
  },
  inheritAttrs: false,
  components: {
    platforms: () => import('@/components/common/platforms')
  },
  filters: {
    date: v => `${dayJs(v).format('DD/MM')} at ${dayJs(v).format('HH:mm ')}`,
    list: (v) => v.join(', ')
  },
  computed: {
    isAddButtonVisible () {
      return this.type === 'UPCOMING'
    }
  }
}
</script>

<style lang="scss" scoped>
.tournament-item{
  border: 1px solid $soft-tone;
  border-radius: 6px;
  padding: 15px;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  @media all and (max-width: $breakpoint-565-max){
    align-items: flex-start;
    position: relative;
    padding-bottom: 75px;
    &--small {
      padding-bottom: initial;
    }
    &__content{
      max-width: 70%;
    }
  }
  &__img{
    width: 100%;
    border-radius: 6px;
  }
  &__type{
    position: absolute;
    right: 15px;
    top: 15px;
    text-transform: uppercase;
    border: 2px solid $light-pink;
    border-radius: 6px;
    display: inline-block;
    box-sizing: border-box;
    color: $gray;
    background: rgba(244, 216, 233, 0.3);
    padding: 3px 10px;
    font-size: 12px;
    font-weight: bold;
    &--participating{
      border-color: #2CAD6D;
      background-color: rgba(44, 173, 109, 0.3);
      @media (max-width: $breakpoint-sm-max + 1) {
        background-color: rgba(44, 173, 109, 1);
        color: $dark;
      }
    }
    &--upcoming{
      border-color: #E7A957;
      background-color: rgba(231, 169, 87, 0.3);
      @media (max-width: $breakpoint-sm-max + 1) {
        background-color: rgba(231, 169, 87, 1);
        color: $dark;
      }
    }
    @media (max-width: $breakpoint-sm-max + 1) {
      left: 0;
      bottom: 0;
      top: unset;
      right: 0;
      text-align: center;
      padding: 5px 0;
      border-radius: 0 0 6px 6px;
    }
  }
  &__left{
    width: 90px;
    flex: 0 0 90px;
    @media (max-width: $breakpoint-tablet-max + 1) {
      max-width: 140px;
      width: 40%;
      flex: 0 0 40%;
    }
    @media (max-width: $breakpoint-sm-max + 1) {
      position: relative;
    }
    @media (max-width: $breakpoint-mobile-max + 1) {
      width: 30%;
      flex: 0 0 30%;
    }
  }
  &__center{
    padding-left: 16px;
    display: flex;
    flex-direction: column;
    .cat-list{
      height: 48px;
      align-items: center;
      margin-top: auto;
      &__item{
        margin-right: 15px;
        padding-right: 15px;
        border-right: 1px solid $soft-tone;
        font-size: 14px;
        color: $gray;
        display: inline-flex;
        align-items: center;
        @media all and (max-width: $breakpoint-410-max){
          margin-right: 10px;
          padding-right: 10px;
        }
        &:last-child{
          padding-right: 0;
          border: none;
        }
      }
    }
    @media (max-width: $breakpoint-tablet-max) {
      flex-direction: column;
      .n-btn{
        width: 100%;
        max-width: 100%!important;
        margin-top: 16px;
      }
    }
    @media (max-width: $breakpoint-sm-max) {
      padding: 0;
      .text-h4{
        font-weight: 400;
      }
      .btn-block{
        width: 100%;
      }
    }
    @media all and (max-width: $breakpoint-410-max){
      overflow: hidden;
      width: 100%;
      .text-h4{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 16px;
      }
    }
  }
  &__right{
    width: 200px;
    flex: 0 0 200px;
    padding-left: 15px;
    justify-content: flex-end;
    align-items: flex-end;
    flex-direction: column;
    display: flex;
    @media (max-width: $breakpoint-tablet-max + 1) {
      margin-top: auto;
      flex-direction: column;
      align-items: flex-start;
      flex: unset;
      width: 100%;
    }
    @media (max-width: $breakpoint-sm-max) {
      padding: 0;
      .btns-blk{
        width: 100%;
      }
    }
    @media all and (max-width: $breakpoint-565-max){
      padding: 0;
      width: 100%;
      flex: 0 0 100%;
      .btns-blk{
        position: absolute;
        bottom: 15px;
        right: 15px;
        left: 15px;
        width: auto;
      }
    }
  }
}
</style>
