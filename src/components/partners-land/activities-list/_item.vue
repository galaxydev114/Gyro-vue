<template>
  <div class="activities-item q-mb-sm q-pa-sm non-selectable"
       :class="{
         'activities-item--lock': locked,
         'activities-item--active': open
       }">
    <div class="activities-item__header" @click="$emit('click')">
      <div class="activities-item__img q-mr-lg">
        <q-img :src="thumbnail" v-if="thumbnail"/>
        <div class="no-img bg-soft-tone full-height full-width flex items-center justify-center" v-else>
          <q-icon name="image" class="text-dark" size="42px"/>
        </div>
        <div class="control-item" v-if="isPlay">
          <c-icon icon="play" color="dark-pink" width="18px" class="q-ml-sm" />
        </div>
      </div>
      <div class="activities-item__description">
        <div class="title">
          {{ title }}
        </div>
       <div :class="`badge badge--${badgeColor} float-right`" v-if="badgeText">
         {{ badgeText }}
       </div>
      </div>
      <div class="activities-item__icon q-ml-auto q-pr-sm">
        <c-icon class="float-right" width="24px" icon="lock" v-if="locked" />
        <c-icon class="float-right" width="24px" :icon="open ? 'minusPink' : 'plusPink'" v-else />
      </div>
    </div>
    <div class="activities-item__content" v-if="open">
       <n-multimedia v-if="contentVideoURL" :src="contentVideoURL"/>
      <div v-if="content" class="q-mt-md">
        <p v-html="content"></p>
      </div>
      <c-btn v-if="shouldShowCTA" :bold="false" @click="$emit('clickCta')">
        View Now
      </c-btn>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    'n-multimedia': () => import('@/components/common/multimedia')
  },
  props: {
    locked: {
      type: Boolean,
      default: false
    },
    open: {
      type: Boolean,
      default: false
    },
    thumbnail: {
      type: String,
      default: () => ''
    },
    title: {
      type: String,
      default: () => ''
    },
    badgeColor: {
      type: String,
      default: ''
    },
    isPlay: {
      type: Boolean,
      default: false
    },
    badgeText: {
      type: String,
      default: ''
    },
    contentVideoURL: {
      type: String,
      default: null
    },
    content: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: null
    },
    shouldShowCTA: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>

.activities-item{
  $root: &;
  border-radius: 6px;
  border: 2px solid $dark-one;
  background: $dark-one;
  &__header{
    display: flex;
    align-items: center;
    transition: all .3s ease;
    cursor: pointer;
  }
  &__description{
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-right: 16px;
    .title{
      font-weight: 700;
      font-size: 18px;
      max-width: calc(100% - 130px);
      @media all and (min-width: $breakpoint-sm-max){
        font-size: 16px;
      }
      @media all and (min-width: $breakpoint-lg-max){
        font-size: 24px;
      }
    }
    @media all and (max-width: $breakpoint-tablet-min){
      flex-direction: column;
      align-items: flex-start;
      .title{
        max-width: 100%;
      }
      .badge{
        margin: 16px 0 0;
      }
    }
  }
  &--lock{
    border-color: $mid-tone;
    background: transparent;
    #{$root}__img,
    #{$root}__description{
      opacity: .5;
    }
  }
  &__img{
    position: relative;
    min-width: 150px;
    height: 80px;
    flex-grow: 2;
    img{
      width: 100%;
      height: 100%;
      border-radius: 6px;
      object-fit: cover;
      float: left;
      overflow: hidden;
      opacity: .8;
    }
  }
  &__content{
    margin-top: 10px;
    padding: 15px 10px;
    border-top: 1px solid $soft-tone;
  }
  .list-icon{
    width: 32px;
    height: 32px;
    background: $pink;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
  }

  @media all and (max-width: $breakpoint-565-max){
    &__header{
      flex-wrap: wrap;
    }
    &__img{
      width: 100%;
      height: auto;
      margin: 0 0 16px!important;
      .no-img{
        min-height: 100px;
      }
    }
    &__description{
      max-width: calc(100% - 50px);
    }
  }
}

.badge{
  display: inline-block;
  padding: 4px 15px;
  border-radius: 6px;
  border: 2px solid;
  background: $soft-tone;
  color: #DFDAE7;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 12px;
  &--green{
    border-color: $green;
    background: #264348;
  }
  &--pink{
    border-color: $pink;
    background: #5B1A4B;
  }
  &--red{
    border-color: $dark-pink;
    background: rgba(227, 79, 79, 0.3);
  }
  &--blue{
    border-color: $blue;
    background: #33266B;
  }
}

.control-item{
  position: absolute;
  top: 25%;
  left: 30%;
  width: 50px;
  height: 50px;
  margin: 0 6px;
  border-radius: 100%;
  border: 4px solid rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(0) invert(1) opacity(0.7);
  transition: all .2s ease-in-out;
  &:hover{
    cursor: pointer;
    transform: scale(1.05);
  }
}

</style>
