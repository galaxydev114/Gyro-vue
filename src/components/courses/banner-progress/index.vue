<template>
  <div class="course-progress-banner"
       :class="{'course-progress-banner--minimized': small}"
       :style="`background-image: url(${data.imageSrc})`">
    <div class="course-progress-banner__action">
      <c-icon icon="closeCircle" v-if="!minimized"  @click="$emit('close')"></c-icon>
      <c-icon icon="rightArrowRounded" :class="`arrow ${small ? 'down' : 'up' }`"  @click="small = !small" v-else></c-icon>
    </div>
    <div v-if="!small" class="full-width flex justify-between items-center q-pb-sm relative-position z-index-3">
      <div>
        <routine-category
          :category="data.category"
          size="20px"
          class="text-weight-regular" />
      </div>
    </div>
    <div class="full-width d-flex justify-between items-center relative-position z-index-3 course-progress-banner__info">
      <div class="course-progress-banner__info-details">
        <div class="row">
          <div :class="`${small ? 'text-h3' : 'text-h2'} text-gray`">
            {{ data.title }}
          </div>
          <routine-category
            v-if="small"
            :category="data.category"
            size="20px"
            class="text-weight-bold q-ml-md" />
        </div>
        <div v-if="!small">
          {{ data.next }}
        </div>
      </div>
      <div class="course-progress-banner__info-action" v-if="!small">
        <c-btn @click="$emit('start')">
          {{ data.progress === 1 ? 'Overview' : data.progress === 0 ? 'Start making progress' : 'Continue making progress' }}
        </c-btn>
      </div>
    </div>
    <div class="course-progress-banner__progress q-mt-md d-flex items-center justify-between relative-position z-index-3">
      <span class="q-mr-md">
        {{ Math.round(data.progress * 100) }}%
      </span>
      <q-linear-progress
        size="md"
        :value="data.progress"
        rounded
        color="green"
        track-color="soft-tone"
      />
    </div>
    <div class="course-progress-banner__gradient"></div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    minimized: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'routine-category': () => import('@/components/common/activity-category')
  },
  data () {
    return {
      small: false
    }
  }
}
</script>

<style lang="scss" scoped>
.course-progress-banner{
  display: flex;
  flex-direction: column;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: 12px 28px;
  transition: all .2s ease;
  height: auto;
  max-height: 200px;
  &--minimized{
    @media (max-width: $breakpoint-565-max) {
      padding: 5px 28px;
    }
    max-height: 56px;
    align-items: center;
  }
  &__action{
    position: absolute;
    top: 16px;
    right: 28px;
    z-index: 999;
  }
  .arrow{
    transform: rotate(90deg);
    filter: brightness(0) invert(1);
    opacity: .6;
    &.up{
      transform: rotate(-90deg);
    }
  }
  .z-index-3{
    z-index: 3;
  }
  &__gradient{
    background: linear-gradient(180deg, rgba(76,55,119,0) 0%, rgba(28,16,44,1) 100%);
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
  }
  @media (max-width: $breakpoint-565-max) {
    &__info{
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      &-action{
        margin-top: 15px;
      }
    }
  }
}
</style>
