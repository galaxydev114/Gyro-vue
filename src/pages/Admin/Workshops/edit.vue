<template>
  <article class="admin-workshop" :class="{'no-scroll': showFull}">
    <section class="form q-mt-lg">
      <q-input placeholder="Title" v-model="title"/>
      <q-input
        v-model="duration"
        label="Duration"
        mask="##:##"
        fill-mask
      />
      <q-input placeholder="Sub-Title" v-model="subTitle"/>
      <q-input placeholder="Approved By (Author)" v-model="approvedBy"/>
      <q-input placeholder="Category of the Workshop (not same as routine category)" v-model="category"/>
      <q-input placeholder="Video URL" v-model="videoUrl"/>
      <q-input placeholder="Thumbnail" v-model="thumbnail"/>
      <div style="padding: 12px 0px">
        <h5>Difficulty</h5>
        <q-btn-toggle v-model="difficulty" :options="difficultyOptions"/>
      </div>

      <div class="q-mt-lg" style="border: 1px solid white; padding: 24px">
        <h4>Credits</h4>

        <q-input placeholder="Title" v-model="credits.title"/>
        <q-input placeholder="Name" v-model="credits.name"/>
        <q-input placeholder="SAC" v-model="credits.sac"/>
        <q-input placeholder="URL" v-model="credits.url"/>
      </div>

      <div class="q-mt-lg" style=" padding: 24px">
        <h4>TimeStamps (Checkpoints)</h4>
        <q-btn-toggle
          v-model="tempTimeStamp.type"
          :options="[
            { label: 'Question', value: 'QUESTION' },
            { label: 'Information', value: 'INFORMATION' },
            { label: 'End of the video', value: 'END_OF_VIDEO' },
          ]"
        />

        <template v-if="tempTimeStamp.type === 'QUESTION'">
          <q-input placeholder="Point of time: XX:XX (minutes:seconds)" mask="##:##" v-model="tempTimeStamp.pointOfTime"/>
          <q-input placeholder="Question" v-model="tempTimeStamp.question"/>

          <div class="q-pa-lg q-mt-lg"
               v-for="i in 4"
               :class="{'q-mb-lg': i === 4}"
               :key="`answer-${i}`"
               style="border: 1px solid white;">
            <div class="row q-col-gutter-lg">
              <div class="col-6 answer-item">
                <div class="column">
                  <div class="flex justify-between items-center q-mb-md">
                    <div class="text-h5">
                      Answer {{ i }}
                    </div>
                    <q-checkbox label="Is it a correct answer?" v-model="tempTimeStamp.answers[i-1].isCorrect"/>
                  </div>
                  <q-editor v-model="tempTimeStamp.answers[i-1].answer"
                            toolbar-color="white"
                            :toolbar="[
                              [
                                {
                                  label: $q.lang.editor.align,
                                  icon: $q.iconSet.editor.align,
                                  fixedLabel: true,
                                  list: 'only-icons',
                                  options: ['left', 'center', 'right', 'justify'],

                                }
                              ],
                              ['bold', 'italic', 'underline'],
                              [{
                                label: $q.lang.editor.fontSize,
                                icon: $q.iconSet.editor.fontSize,
                                fixedLabel: true,
                                fixedIcon: true,
                                list: 'no-icons',
                                options: [
                                  'size-1',
                                  'size-2',
                                  'size-3',
                                  'size-4',
                                  'size-5',
                                ]
                              }]
                            ]"
                  />
                </div>
              </div>
              <div class="col-6 answer-item">
                <div class="column">
                  <div class="text-h5 q-mb-md">
                    Explanation
                  </div>
                  <q-editor v-model="tempTimeStamp.answers[i-1].explanation"
                            toolbar-color="white"
                            :toolbar="[
                              [
                                {
                                  label: $q.lang.editor.align,
                                  icon: $q.iconSet.editor.align,
                                  fixedLabel: true,
                                  list: 'only-icons',
                                  options: ['left', 'center', 'right', 'justify'],

                                }
                              ],
                              ['bold', 'italic', 'underline'],
                              [{
                                label: $q.lang.editor.fontSize,
                                icon: $q.iconSet.editor.fontSize,
                                fixedLabel: true,
                                fixedIcon: true,
                                list: 'no-icons',
                                options: [
                                  'size-1',
                                  'size-2',
                                  'size-3',
                                  'size-4',
                                  'size-5',
                                ]
                              }]
                            ]"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="tempTimeStamp.type === 'INFORMATION'">
          <q-input placeholder="Point of time: XX:XX (minutes:seconds)" mask="##:##" v-model="tempTimeStamp.pointOfTime"/>
          <q-editor v-model="tempTimeStamp.information"/>
        </template>

        <template v-else-if="tempTimeStamp.type === 'END_OF_VIDEO'">
          <q-input placeholder="Point of time: XX:XX (minutes:seconds)" mask="##:##" v-model="tempTimeStamp.pointOfTime"/>
          <q-editor v-model="tempTimeStamp.information"/>
        </template>

        <div style="display:flex">
          <q-btn outline @click="addTimestamp">Add TimeStamp</q-btn>
          <div v-if="tempTSinsertionIndex != null">
            <q-btn outline @click="saveEditTimestamp">Save Edit TimeStamp</q-btn>
            <q-btn outline @click="clearTimestamp">Clear TimeStamp</q-btn>
          </div>
        </div>
      </div>

      <div class="q-mt-lg" style=" padding: 24px">
        <h4>Existing TimeStamps</h4>
        <div class="q-mt-lg">
          <div v-for="(ts, tsIndex) of timestamps" :key="ts.pointOfTime" style="border: 1px solid white; padding: 24px">
            {{ts.type}} - {{ts.data.question || ts.data.information}}
            <div>
                <c-btn
                  tag="button"
                  type="button"
                  bg="f50"
                  color="fff"
                  class="py-25 px-30"
                  @click="editTimestamp(ts, tsIndex)"
                >
                  <q-icon name="edit" class="mr-15" color="dark-pink" size="24px"/>Edit
                </c-btn>

                <c-btn
                  variant="simple"
                  tag="button"
                  type="button"
                  bg="f50"
                  color="fff"
                  class="py-25 px-30"
                  @click="deleteTimestamp(tsIndex)"
                >
                  <q-icon name="delete" class="mr-15" color="dark-pink" size="24px"/>Remove
                </c-btn>
              </div>
          </div>
        </div>
      </div>

      <div class="form__item">
        Is Published?
        <q-toggle
        size="xl"
          v-model="isPublished"
          checked-icon="check"
          color="green"
          unchecked-icon="clear"
        />
      </div>

      <div class="form__item">
        Is Exclusive?
        <q-toggle
          size="xl"
          checked-icon="check"
          unchecked-icon="clear"
          color="green"
          v-model="isExclusive"
        />
      </div>

      <div class="col" v-if="isCreate">
        <q-btn class="q-mt-lg q-mb-lg" style="width: 100%" color="dark-pink" @click="createWorkshop">CREATE WORKSHOP</q-btn>
      </div>
      <div class="col" v-else>
        <q-btn class="q-mt-lg q-mb-lg" style="width: 100%" color="dark-pink" @click="updateWorkshopMethod">UPDATE WORKSHOP</q-btn>
      </div>
    </section>

    <div class="preview" :class="{ 'preview--full-size': showFull}">
      <c-btn @click="showFull = !showFull">
        Toggle full size view
      </c-btn>
      <n-workshop-preview
        ref="preview"
        :title="title"
        :sub-title="subTitle"
        :author="approvedBy"
        :difficulty="difficulty"
        :timestamps="timestamps"
        :duration="duration"
        :videoUrl="videoUrl"
        :credit="credits"
        :thumbnail="thumbnail"/>
    </div>
  </article>
</template>

<script>
import difficultyLevels from '@/constants/difficultyLevels'
import * as api from '@/services/api'
import { mapActions, mapState } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

export default {
  components: {
    'n-workshop-preview': () => import('@/components/gamesense-workshop/workshop-content.vue')
  },
  props: {
    isCreate: Boolean
  },
  data () {
    return {
      showFull: false,
      title: '',
      duration: '00:00',
      subTitle: '',
      approvedBy: 'NOVOS',
      category: '',
      videoUrl: '',
      thumbnail: '',
      isPublished: false,
      isExclusive: false,
      difficulty: 'EASY',
      timestamps: [],
      tempTimeStamp: {
        type: 'QUESTION',
        pointOfTime: '00:00',
        question: '',
        information: '',
        answers: [{ answer: '', isCorrect: false, explanation: '' },
          { answer: '', isCorrect: false, explanation: '' },
          { answer: '', isCorrect: false, explanation: '' },
          { answer: '', isCorrect: false, explanation: '' }]
      },

      credits: {
        title: '',
        name: '',
        sac: '',
        url: ''
      },
      tempTSinsertionIndex: null
    }
  },
  created () {
    this.getAdminAllWorkshops().then(() => {
      const parsedDuration = this.computedWorkshop.duration && new Date(this.computedWorkshop.duration * 1000).toISOString('MM:SS').substr(14, 5)
      this.title = this.computedWorkshop.title
      this.subTitle = this.computedWorkshop.subTitle
      this.approvedBy = this.computedWorkshop.approvedBy
      this.category = this.computedWorkshop.category
      this.videoUrl = this.computedWorkshop.videoUrl
      this.thumbnail = this.computedWorkshop.thumbnail
      this.duration = parsedDuration
      this.isPublished = this.computedWorkshop.isPublished
      this.difficulty = this.computedWorkshop.difficulty
      this.timestamps = this.computedWorkshop.timestamps
      this.isExclusive = this.computedWorkshop.isExclusive

      this.credits = this.computedWorkshop.credits || {}
    })
  },

  computed: {
    ...mapState('workshops', {
      allWorkshops: state => Object.values(state.allAdminWorkshops)
    }),
    difficultyOptions () {
      return difficultyLevels.map(v => ({ label: v, value: v }))
    },

    workshopId () {
      return this.$route.params.workshopId
    },

    computedWorkshop () {
      return cloneDeep(this.workshop)
    },

    workshop () {
      return this.allWorkshops.find((el) => el.id === this.workshopId)
    }
  },

  methods: {
    ...mapActions('workshops', {
      getAdminAllWorkshops: 'getAllAdminWorkshops',
      updateWorkshop: 'updateWorkshop'
    }),
    saveEditTimestamp () {
      this.addEditTimestamp(this.tempTSinsertionIndex)
    },
    editTimestamp (ts, tsIndex) {
      this.tempTSinsertionIndex = tsIndex
      this.tempTimeStamp.type = ts.type
      this.tempTimeStamp.pointOfTime = ts.pointOfTime
      this.tempTimeStamp.question = ts.data?.question
      if (this.tempTimeStamp.type === 'QUESTION') {
        for (let x = 0; x < 4; x++) {
          if (ts.data.answers[x]) {
            this.tempTimeStamp.answers[x] = ts.data.answers[x]
          } else {
            this.tempTimeStamp.answers[x] = { answer: '', isCorrect: false, explanation: '' }
          }
        }
      } else {
        this.tempTimeStamp.information = ts.data?.information
      }
    },
    deleteTimestamp (index) {
      this.timestamps.splice(index, 1)
      this.tempTSinsertionIndex = null
    },
    createWorkshop () {
      const a = this.duration.split(':')
      const seconds = (+a[0]) * 60 + (+a[1])
      const workshopRequestObj = {
        title: this.title,
        subTitle: this.subTitle,
        category: this.category,
        duration: seconds,
        approvedBy: this.approvedBy,
        videoUrl: this.videoUrl,
        thumbnail: this.thumbnail,
        isPublished: this.isPublished,
        difficulty: this.difficulty,
        credits: this.credits,
        timestamps: this.timestamps
      }

      api.createWorkshop(workshopRequestObj)
        .then(() => {
          this.$q.notify({ message: 'Workshop was created', color: 'positive' })
        })
        .catch(err => {
          this.$q.notify({
            message: err.response.data,
            color: 'negative'
          })
        })
    },

    updateWorkshopMethod () {
      const a = this.duration.split(':')
      const seconds = (+a[0]) * 60 + (+a[1])
      const workshopRequestObj = {
        title: this.title,
        subTitle: this.subTitle,
        category: this.category,
        duration: seconds,
        approvedBy: this.approvedBy,
        videoUrl: this.videoUrl,
        thumbnail: this.thumbnail,
        isPublished: this.isPublished,
        isExclusive: this.isExclusive,
        difficulty: this.difficulty,
        credits: this.credits,
        timestamps: this.timestamps
      }

      this.updateWorkshop({ workshopId: this.workshopId, workshopData: workshopRequestObj })
        .then(() => {
          this.$q.notify({ message: 'Workshop was updated', color: 'positive' })
        })
        .catch(err => {
          this.$q.notify({
            message: err.response.data,
            color: 'negative'
          })
        })
    },

    addTimestamp () {
      this.addEditTimestamp()
    },

    addEditTimestamp (index) {
      if (this.tempTimeStamp.type === 'QUESTION') {
        const answers = []
        if (this.tempTimeStamp.answers[0]?.answer) answers.push({ ...this.tempTimeStamp.answers[0] })
        if (this.tempTimeStamp.answers[1]?.answer) answers.push({ ...this.tempTimeStamp.answers[1] })
        if (this.tempTimeStamp.answers[2]?.answer) answers.push({ ...this.tempTimeStamp.answers[2] })
        if (this.tempTimeStamp.answers[3]?.answer) answers.push({ ...this.tempTimeStamp.answers[3] })

        if (index === undefined) {
          this.timestamps.push({
            type: this.tempTimeStamp.type,
            pointOfTime: this.tempTimeStamp.pointOfTime,
            data: {
              question: this.tempTimeStamp.question,
              answers
            }
          })
        } else {
          this.timestamps.splice(index, 1, {
            type: this.tempTimeStamp.type,
            pointOfTime: this.tempTimeStamp.pointOfTime,
            data: {
              question: this.tempTimeStamp.question,
              answers
            }
          })
        }
      } else if (this.tempTimeStamp.type === 'INFORMATION' || this.tempTimeStamp.type === 'END_OF_VIDEO') {
        if (index === undefined) {
          this.timestamps.push({
            type: this.tempTimeStamp.type,
            pointOfTime: this.tempTimeStamp.pointOfTime,
            data: {
              information: this.tempTimeStamp.information
            }
          })
        } else {
          this.timestamps.splice(index, 1, {
            type: this.tempTimeStamp.type,
            pointOfTime: this.tempTimeStamp.pointOfTime,
            data: {
              information: this.tempTimeStamp.information
            }
          })
        }
      }

      this.clearTimestamp()
    },
    clearTimestamp () {
      this.tempTimeStamp = {
        type: 'QUESTION',
        pointOfTime: '00:00',
        question: '',
        information: '',
        answers: [{ answer: '', isCorrect: false, explanation: '' },
          { answer: '', isCorrect: false, explanation: '' },
          { answer: '', isCorrect: false, explanation: '' },
          { answer: '', isCorrect: false, explanation: '' }]
      }
      this.tempTSinsertionIndex = null
    }
  },
  watch: {
    'tempTimeStamp.pointOfTime': function (val) {
      const preview = this.$refs.preview
      if (!preview) return
      const videoPlayer = preview.$refs.videoPlayer
      if (!videoPlayer) return

      const a = val.split(':')
      const seconds = (+a[0]) * 60 + (+a[1])
      videoPlayer.playVideo()
      videoPlayer.seekTo(seconds)
      videoPlayer.pauseVideo()
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-workshop {
  display: grid;
  align-items: start;
  grid-template-columns: minmax(200px, 500px) auto;
  grid-template-rows: auto;
  gap: 1rem;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &.no-scroll{
    overflow: hidden;
  }
  .form-disabled {
    opacity: .4 !important;
    cursor: not-allowed;
    pointer-events: none;
    * {
      opacity: .8 !important;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
}

.form {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  padding-right: 10px;
  width: 100%;
  height: 100vh;
  overflow-y: auto;

  &__item {
    margin-top: 2rem;

    &:first-child { margin-top: 0; }
  }

  .answer-item {
    flex-basis: 500px;
  }
}

.preview {
  grid-column: 2;
  grid-row: 1;
  margin: 0 auto;
  padding-bottom: 30px;
  width: 100%;
  height: 100%;
  overflow-y: auto;

  &--full-size{
    position: absolute;
    height: 100vh;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: hidden;
    width: 100%;
    background: $dark;
  }
}
</style>
