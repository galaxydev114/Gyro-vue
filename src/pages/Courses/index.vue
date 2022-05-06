<template>
  <div class="courses-page">
    <div class="courses-page__navigation">
      <div class="relative-position z-index-3 d-flex items-center q-sm-pb-sm cursor-clickable"
           @click="trackAction('Click Go Back'); $router.push({name: 'TrainingPlan'})">
        <c-icon icon="leftArrowRounded"
                class="q-mr-sm"/>
        <span>Go back</span>
      </div>
    </div>
    <div class="courses-page__content">
      <div class="courses-page__header"
           :style="`background-image: url(${imageSrc})`">
        <div class="courses-page__header-details">
          <div class="d-flex items-center">
            <div class="border-right text-gray">
              <routine-category
                :category="category"
                size="20px"
                class="text-weight-regular" />
            </div>
            <div class="border-right text-gray">
              {{ `${courseDuration} min` }}
            </div>
          </div>
        </div>
        <div class="relative-position z-index-3 d-flex justify-between q-pt-sm courses-page__header-description">
          <div>
            <div class="text-h2">
              {{course && course.title}}
            </div>
            <div>
              {{course && course.next}}
            </div>
          </div>
          <div v-if="nextActivity" class="column text-center">
            <c-btn @click="handleContinueCourse">
              {{ progress === 0 ? $q.screen.gt.sm ? 'Start the course' : 'Start' : $q.screen.gt.sm ? 'Continue the course' : 'Continue' }}
            </c-btn>
            <small class="q-mt-sm opacity-75">
              Your next activity:<br/>
              {{`${nextActivityTitle}`}}
            </small>
          </div>
        </div>
        <div class="courses-page__header-gradient"></div>
      </div>
      <div class="courses-page__progress q-mx-lg d-flex items-center justify-between relative-position z-index-3">
        <span class="q-mr-md">
          {{ Math.round(progress * 100) }}%
        </span>
        <q-linear-progress
          size="md"
          :value="progress"
          rounded
          color="green"
          track-color="soft-tone"
        />
      </div>
      <div class="courses-page__list">
        <div class="courses-page__list-item" v-for="obj in list" :key="obj.blockTitle || obj.id" ref="courseActivityEls">
          <div class="courses-page__list-item-count"
               :class="{
                  'courses-page__list-item-count--label': obj.blockTitle, // check if it's label
                  'courses-page__list-item-count--done': obj.isCompleted
            }">
            <div class="courses-page__list-block" v-if="obj.blockTitle"><span>{{ obj.blockTitle }}</span></div>
            <span v-else-if="!obj.isCompleted">{{ obj.position }}</span>
            <template v-else>
              <span v-if="obj.id !== completedActivityId"><c-icon icon="check" width="12px"/></span>
              <span v-else class="relative-position" style="background: #433558">
                <lottie-animation path="lottie-animations/MarkAsDone_CheckIcon.json"
                                  class="absolute"
                                  :width="90"
                                  :height="90"
                                  :loop="false"
                                  v-if="fireDoneAnimation"
                                  style="top: -30px; left: -30px; z-index: 99"/>
              </span>
            </template>
          </div>
          <div class="courses-page__list-item-content">
            <template v-if="obj.id">
              <n-course-card @click="handleCourseActivityClick"
                             @done="handleDone(routes.find(el => el.id === obj.id))"
                             v-bind="routes.find(el => el.id === obj.id)"
                             shortApproved
                             vertical
                             class="q-my-sm"/>
            </template>
          </div>
        </div>
      </div>
    </div>
    <rate-modal :visible="showRate" :data="course"  @close="handleCloseRate" @rate="handleRate"/>
    <page-loader v-if="isDataLoading"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import segmentAnalyticsMixin from '@/mixins/segmentAnalytics.mixin'
import * as api from '@/services/api'

export default {
  components: {
    'routine-category': () => import('@/components/common/activity-category'),
    'n-course-card': () => import('@/components/courses/item'),
    'rate-modal': () => import('@/components/courses/rate-modal'),
    'page-loader': () => import('@/components/common/page-loader')
  },
  props: {
    courseId: {
      type: String,
      default: null
    },
    completedActivityId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      course: null,
      isDataLoading: false,
      showRate: false,
      progress: 0,
      fireDoneAnimation: false
    }
  },
  async created () {
    await this.fetchCourseData()
    setTimeout(this.initView, 400)
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/currentUser'
    }),
    list () {
      if (!this.course) {
        return null
      }
      const flatContents = this.course?.contents.map(el => ([{
        blockTitle: el.title
      },
      ...el.trainingActivityIds.map(id => {
        const activity = this.course?.activities.find(el => el.id === id)
        return {
          isCompleted: activity?.isCompleted,
          position: activity?.courseActivityIndex + 1,
          id: id
        }
      })])).flat()
      return flatContents
    },
    next () {
      return '' // TO-DO We don't support several courses yet
    },
    title () {
      return this.course?.title
    },
    imageSrc () {
      return this.course?.coverPic
    },
    category () {
      return this.course?.skills[0]
    },
    nextActivity () {
      const firstNonCompletedActivityId = this.course?.progress.find(el => !el.isCompleted)?.id
      return firstNonCompletedActivityId && this.course.activities.find(el => el.id === firstNonCompletedActivityId)
    },
    nextActivityTitle () {
      return this.nextActivity?.title
    },
    routes () {
      return this.course?.activities.map(el => ({
        ...el,
        skill: el.skill || el.category,
        duration: el.duration || Math.round(el.videoDurationSeconds / 60)
      }))
    },
    courseDuration () {
      return this.course?.activities.reduce((sum, activity) => sum + activity.duration, 0)
    }
  },
  methods: {
    ...mapActions({
      getUserCourses: 'courses/getUserCourses'
    }),
    trackAction (event, opts = {}) {
      segmentAnalyticsMixin.methods.trackAction('Course: ' + event,
        {
          ...opts,
          courseId: this.course?.id,
          courseTitle: this.title
        })
    },
    async fetchCourseData (forceTrackCompletion = false) {
      this.isDataLoading = true
      const response = await api.getUserCourse(this.currentUser.id, this.courseId)

      if (response.status === 200) {
        this.course = response.data
      }

      this.isDataLoading = false

      if ((this.completedActivityId || forceTrackCompletion) && !this.nextActivity) {
        this.showRate = true
        this.trackAction('Course complete', {
          ...this.course
        })
      }
    },
    async handleDone (activity) {
      this.fireDoneAnimation = true
      if (activity?.knowledgeTimeId) {
        await api.markKnowledgeDoneNew(this.currentUser.id, activity.knowledgeTimeId)
      } else if (activity?.gamesenseWorkshopId) {
        await api.markWorkshopDone(this.currentUser.id, activity.gamesenseWorkshopId)
      } else if (activity?.trainingRoutineId) {
        await api.completeDiscoveredRoutine(activity.trainingRoutineId, this.currentUser.id)
      } else {
        console.error('Done handler called, but no activity was loaded')
      }
      this.$router.replace({ name: 'Course', params: { id: this.courseId }, query: { completedActivityId: activity.id } })
      await this.fetchCourseData(true)
      this.initProgressAnimation()
    },
    clearRouteQuery () {
      this.$router.replace({ name: this.$router.name, params: this.$router.params, query: null })
    },
    handleRate (rating) {
      this.trackAction('Submit Ratings', rating)
      this.clearRouteQuery()
      this.fireDoneAnimation = true
      this.$router.push({ name: 'TrainingPlan' })
    },
    handleCloseRate () {
      this.trackAction('Close Rate Modal')
      if (this.completedActivityId) {
        this.clearRouteQuery()
      }
      this.showRate = false
      this.fireDoneAnimation = true
      this.initProgressAnimation()
    },
    handleCourseActivityClick (id) {
      this.trackAction('Click on Activity', {
        courseId: this.courseId,
        ...this.course.activities.find(el => el.id === id)
      })
      this.$router.push({ name: 'CourseActivity', params: { activityId: id } })
    },
    handleContinueCourse () {
      this.trackAction('Click on Continue Button', {
        nextActivityId: this.nextActivity?.id,
        nextActivityTitle: this.nextActivity?.title
      })
      this.$router.push({ name: 'CourseActivity', params: { activityId: this.nextActivity.id } })
    },
    initView () {
      const nextId = this.nextActivity?.id
      if (nextId && this.list) {
        this.list.forEach((el, idx) => {
          if (el.id === nextId) {
            const target = this.$refs.courseActivityEls[idx]
            const parent = document.getElementsByClassName('courses-page__content')[0]
            const topSpace = target.offsetTop - (window.innerHeight / 2 + 100)
            parent.scrollTo({ behavior: 'smooth', top: topSpace })
            const checkIfScrollToIsFinished = setInterval(() => {
              if ((topSpace >= parent.scrollTop)) {
                setTimeout(() => {
                  this.fireDoneAnimation = true
                  this.initProgressAnimation()
                  clearInterval(checkIfScrollToIsFinished)
                }, 250)
              }
            }, 25)
          }
        })
      }
    },
    initProgressAnimation () {
      if (this.completedActivityId) {
        this.progress = this.course?.progress?.length && (this.course.progress.filter(el => el.isCompleted).length - 1) / this.course.progress.length
        setTimeout(() => {
          this.progress = this.course?.progress?.length && this.course.progress.filter(el => el.isCompleted).length / this.course.progress.length
        }, 1500)
      } else {
        this.progress = this.course?.progress?.length && this.course.progress.filter(el => el.isCompleted).length / this.course.progress.length
      }
    }
  },
  mounted () {
    this.trackAction('Visit Course')
  }
}
</script>

<style lang="scss" scoped>
.courses-page{
  $root: &;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  &__navigation{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 40px 40px 20px;
    background: linear-gradient(180deg, #1C102C 0%, rgba(28, 16, 44, 0.5) 68.33%, rgba(28, 16, 44, 0) 100%);
    z-index: 999;
    @media (max-width: $breakpoint-410-max) {
      padding: 15px;
    }
  }
  &__header{
    width: 100%;
    background-size: cover;
    background-position: center;
    position: relative;
    padding: 96px 40px 40px;
    z-index: 990;
    .border-right{
      padding-right: 15px;
      margin-right: 15px;
      border-right: 1px solid #433558;
      @media (max-width: $breakpoint-410-max) {
        margin-right: 5px;
        padding-right: 5px;
      }
    }
    &-gradient{
      background: linear-gradient(180deg, rgba(76,55,119,0) 0%, #231638 100%);
      height: 100%;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
    }
    &-details{
      display: flex;
      flex-direction: column;
      @media (max-width: $breakpoint-sm-max) {
        flex-direction: row;
        width: 100%;
        align-items: center;
        justify-content: space-between;
      }
    }
    &-description {
      @media (max-width: $breakpoint-410-max) {
        flex-direction: column;
        .column {
          margin-top: 16px;
        }
      }
    }

    @media (max-width: $breakpoint-410-max) {
      padding: 50px 15px 15px;
    }
  }
  &__progress{
    &--animated{
      animation: scaledAnim 1.5s alternate 1 ease-in;
      animation-delay: 2s;
    }
  }
  &__content{
    width: 100%;
    overflow-y: auto;
    position: relative;
    z-index: 990;
  }
  &__list{
    display: flex;
    flex-direction: column;
    width: 900px;
    max-width: 95%;
    margin: 48px auto;
    &-item{
      position: relative;
      display: flex;
      align-items: stretch;
      min-height: 150px;
      width: 100%;
      &:first-child{
        min-height: 70px;
        #{$root}__list-item-count{
          align-items: flex-start;
        }
      }
      &:last-child{
        min-height: 70px;
        #{$root}__list-item-count{
          &:before{
            height: 50%;
          }
          align-items: center;
        }
      }
      @media (max-width: $breakpoint-sm-max){
        min-height: 70px;
      }
    }
    &-item-count{
      width: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      span{
        display: inline-flex;
        align-items: center;
        background: $soft-tone;
        height: 32px;
        min-width: 32px;
        text-align: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        position: relative;
        z-index: 10;
        padding: 0 8px;
        border-radius: 100%;
      }
      &--label{
        span{
          border-radius: 8px;
        }
      }
      &--done{
        span{
          background: $green;
        }
      }
      &:before{
        content: "";
        display: block;
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        border-left: 2px dashed $soft-tone;
      }
      @media (max-width: $breakpoint-sm-max) {
        width: 50px;
        flex-basis: 50px;
        &--label{
          span{
            border-radius: 8px;
            position: absolute;
            left: 10px;
            white-space: nowrap;
          }
        }
      }
    }
    &-block{
      background: $soft-tone;
      border-radius: 8px;
      padding: 6px 10px 6px 10px;
      span{
        height: auto;
        padding: 0px;
      }
    }
    &-item-content{
      flex: 1;
      @media (max-width: $breakpoint-565-max) {
        max-width: calc(100% - 50px);
      }
    }

    @media (max-width: $breakpoint-565-max) {
      padding: 0 20px 0 0;
    }
  }
  .z-index-3{
    z-index: 3;
  }

  .done-animated{
    animation: scaledAnim 1.5s alternate 1 ease-in;
    animation-delay: 0.5s;
  }

  @keyframes scaledAnim {
    0%   {transform: scale(1);}
    50%   {transform: scale(1.3);}
    100% {transform: scale(1);}
  }
}
</style>
