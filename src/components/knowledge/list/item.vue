<template>
  <div @click="$emit('click', { item, position })"
       @mouseleave="showDropdown = false"
       class="videos-list__item relative-position"
       :class="{
                'videos-list__item--done': item.isDone,
                'videos-list__item--active': item._id === routeId,
              }"
       v-if="item">
    <div class="ribbon ribbon--top-left" v-if="item.isExclusive">Exclusive</div>
    <div class="videos-list__item-img">
      <q-img
        :src="videoThumbnail"/>
    </div>
    <div class="relative-position">
      <div class="videos-list__item-desc q-my-lg">
        <div class="text-h5 q-mb-sm">
          {{ item.title }}
        </div>
        <div v-if="item.creator" class="text-subtitle3 q-mb-sm">
          By: {{ item.creator }}
        </div>
        <div>
          {{ item.description }}
        </div>
      </div>
      <div class="videos-list__item-drop">
        <div class="videos-list__item-drop-btn"
             v-outside-click="() => (showDropdown = false)"
             @click.stop="showDropdownOptions">
          <span class='span-points'></span>
          <span class='span-points'></span>
          <span class='span-points'></span>
        </div>
        <div class="videos-list__item-drop-content" v-if="showDropdown">
          <div @click.stop="$emit('watched', item.isDone); showDropdown = false">
            Mark as {{ item.isDone ? 'unwatched' : 'watched' }}
          </div>
        </div>
      </div>
    </div>
    <div class="videos-list__item-tags q-mt-auto">
      <div class="videos-list__item-tag">
        <routine-category :category="item.category" size="20px" xsmall/>
      </div>
      <div class="videos-list__item-tag text-weight-bold">
        {{ item.time }} min
      </div>
      <div class="videos-list__item-tag text-weight-bold text-pink" v-if="item.isNew">
        NEW
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      require: true
    },
    position: {
      type: Number
    }
  },
  components: {
    'routine-category': () => import('@/components/common/activity-category')
  },
  data () {
    return {
      difficultyLevel: 'INTERMEDIATE',
      showDropdown: false
    }
  },
  computed: {
    routeId () {
      return this.$route.params.subid
    },
    videoId () {
      const matched = this.item.video.match(/youtube.com\/embed\/([^#&?]*)/)
      if (matched) {
        return matched[1]
      }
      return null
    },
    videoThumbnail () {
      if (this.videoId) {
        return `https://i.ytimg.com/vi/${this.videoId}/mqdefault.jpg`
      } else if (this.item.thumbnail) {
        return this.item.thumbnail
      }
      return 'https://aggbwkxwqp.cloudimg.io/img.dexerto.com/_s3_/uploads/2020/10/05004041/Fortnite-Original-Map.png?w=620'
    }
  },
  methods: {
    showDropdownOptions () {
      this.showDropdown = !this.showDropdown
      this.trackAction('Knowledge time: click Knowledge Time options', {
        'knowledge-id': this.item._id,
        date: new Date()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.videos-list__item {
  $root: &;
  padding: 18px 15px;
  border-radius: 6px;
  border: 1px solid $soft-tone;
  width: calc(100% / 3 - 10px);
  margin: 0 5px 10px;
  transition: all .2s ease-in-out;
  display: flex;
  flex-direction: column;
  color: #fff;
  @media (max-width: $breakpoint-md-max) {
    width: calc(100% / 2 - 10px);
  }
  @media (max-width: $breakpoint-xs-max) {
    width: 100%;
    margin: 10px 0;
  }

  &-desc {
    padding-right: 10px;
  }
  &-drop {
    position: absolute;
    top: 24px;
    right: 0;
    z-index: 99;
    display: none;

    &-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 18px;
      height: 18px;
      transform: translateX(50%);

      .span-points {
        width: 4px;
        height: 4px;
        background: $gray;
        border-radius: 2px;
        margin-bottom: 3px;
      }
      &:hover {
        cursor: pointer;

        span {
          background: $dark-pink;
        }
      }
    }

    &-content {
      position: absolute;
      top: 24px;
      right: 0;
      background: $mid-tone;
      border-radius: 6px;
      z-index: 10;
      width: 200px;
      overflow: hidden;
      border: 1px solid $soft-tone;
      @media (max-width: $breakpoint-xs-max){
        right: -50%;
      }

      div {
        padding: 6px 10px;
        font-size: 14px;
        overflow: hidden;
        cursor: pointer;
        color: #fff;

        &:hover {
          color: $dark-pink;
          background: $soft-tone;
        }
      }
    }
  }

  &:hover {
    background: $dark-sec;
    text-decoration: none;
    cursor: pointer;

    #{$root}-drop {
      display: block;
    }
  }

  &--active {
    border-color: $dark-pink;
  }

  &-img {
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  &-difficulty {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 9;
  }

  &-tags {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: flex-start;
    color: #DFDAE7;
    font-size: 12px;
    white-space: nowrap;
  }

  &-tag {
    padding-right: 10px;
    margin-right: 10px;
    border-right: 1px solid $soft-tone;

    &:last-child {
      border: none;
      margin: 0;
    }
  }

  &--done {

    #{$root}-desc {
      opacity: .4;
      text-decoration: line-through;
    }

    #{$root}-tags {
      opacity: .4;
    }

    #{$root}-img {
      opacity: .4;
    }
  }
}
</style>
