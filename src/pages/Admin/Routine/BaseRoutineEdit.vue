<template>
  <article class="admin-routine" :class="{'no-scroll': showFull}">
    <q-form
      :class="{'form-disabled': isReadonlyAdmin}"
      class="form"
      ref="createEditRoutineForm"
      @submit.prevent="saveChanges"
    >
      <div class="form__item">
        <q-input
          ref="formTitle"
          clearable
          label="Title"
          :rules="[value => Boolean(value) || 'Title required']"
          v-model="routine.title"
        />
      </div>

      <div class="form__item">
        <q-input
          ref="formSubtitle"
          clearable
          label="Subtitle"
          v-model="routine.subtitle"
        />
      </div>

      <div class="form__item">
        <q-select
          ref="formSkill"
          clearable
          label="Skill (Category)"
          :options="categories"
          :rules="[value => Boolean(value) || 'Skill required']"
          v-model="routine.skill"
        />
      </div>

      <div class="form__item">
        <q-input
          ref="formStartLevel"
          clearable
          label="Start level"
          type="number"
          :rules="[
            value => value > 0 || 'Start Level should be greater than 0',
            value => typeof value === 'string' || 'Start Level should be a number'
          ]"
          v-model="routine.startLevel"
        />
      </div>

      <div class="form__item">
        <q-input
          ref="formEndLevel"
          clearable
          label="End level"
          type="number"
          :rules="[
            value => value > 0 || 'End Level should be greater than 0',
            value => typeof value === 'string' || 'End Level should be a number'
          ]"
          v-model="routine.endLevel"
        />
      </div>

      <div class="form__item">
        <q-input
          ref="formOptima;Level"
          clearable
          label="Optimal level"
          type="number"
          :rules="[
            value => value > 0 || 'Optima; Level should be greater than 0',
            value => typeof value === 'string' || 'Optimal Level should be a number'
          ]"
          v-model="routine.optimalLevel"
        />
      </div>

      <div class="form__item">
        <q-input

          clearable
          label="Approved By"
          v-model="routine.approvedBy"
        />
      </div>

      <div class="form__item">
        <q-input

          clearable
          label="Video/image URL"
          v-model="routine.videoUrl"
        />
      </div>

      <div class="form__item">
        <q-input

          clearable
          label="Thumbnail image URL"
          v-model="routine.thumbnail"
        />
      </div>

      <div class="form__item">
        <q-input
          clearable
          label="2nd Video/image URL"
          v-model="routine.secVideoUrl"
        />
      </div>

      <div class="form__item">
        <q-input
          clearable
          label="2nd Thumbnail image URL"
          v-model="routine.secThumbnail"
        />
      </div>

      <div class="form__item">
        <q-select
          ref="formDifficulty"
          clearable
          label="Difficulty"
          :options="difficultyLevels"
          :rules="[value => Boolean(value) || 'Difficulty required']"
          v-model="routine.difficulty"
        />
      </div>

      <div class="form__item">
        <q-input

          clearable
          label="Tag"
          v-model="temporaryTagName"
          @keydown.enter.prevent="addNewTag"
        />

        <q-chip
          removable
          v-for="tag of routine.tags"
          :key="tag"
          color="dark-pink"
          @remove="deleteTag(tag)"
        >
          {{tag}}
        </q-chip>
      </div>

      <sessions-list
        style="padding-top:10px"
        title="Sessions list"
        v-model="routine.defaultSessionIds"
        :columns="columnSessionsToAdd"
        :rows="sessionsToAdd"
        :mapSelectedRow="mapSession"/>

      <div class="form__item">
        Notes Subtitle
        <q-editor
          v-model="routine.notesSubtitle"
          :definitions="{
            upload: {
              tip: 'Upload Image',
              icon: 'image',
              handler: uploadImageToNotesSub
            }
          }"
          min-height="4rem"
          :toolbar="editorToolbar"
        />
      </div>
      <notes-list
        style="padding-top:10px"
        title="Notes list"
        v-model="routine.notes"/>

      <credits-list
        style="padding-top:10px"
        title="Credit list"
        v-model="routine.credits"/>
      <div class="form__item">
        <q-input
          ref="formWeight"
          clearable
          label="Routine Weight"
          type="number"
          :rules="[
            value => value > 0 || 'Weight should be greater than 0',
            value => typeof value === 'string' || 'Weight should be a number'
          ]"
          v-model="routine.weight"
        />
      </div>
      <div class="form__item">
        Is Published?
        <q-toggle
        size="xl"
          v-model="routine.isPublished"
          checked-icon="check"
          color="green"
          unchecked-icon="clear"
        />
      </div>
      <div class="form__item">
        Is Discoverable?
        <q-toggle
        size="xl"
          v-model="routine.isDiscoverable"
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
          color="green"
          unchecked-icon="clear"
          v-model="routine.isExclusive"
        />
      </div>
      <div class="form__item">
        <c-btn @click="updateLastUpdated" style="margin-bottom:5px">
          Save & Update date
        </c-btn>
        <c-btn type="submit">
          {{isDuplicate ? 'Create Duplication' : 'Save'}}
        </c-btn>
      </div>
    </q-form>

    <div class="routine__preview column" :class="{ 'routine__preview--full-size': showFull}">
      <div class="col col-shrink row q-mb-md">
        <c-btn @click="toggleFullSize" class="col" outline>
          Toggle full size view
        </c-btn>
        <c-btn @click="toggleRoutineVideo" class="col" outline>
          Toggle routine video
        </c-btn>
      </div>
      <n-routine-preview-new
        class="col full-width" style="outline: 2px solid yellow;"
        :title="routine.title"
        :subtitle="routine.subtitle"
        :category="routine.skill"
        :author="routine.approvedBy"
        :difficulty="routine.difficulty"
        :tags="routine.tags"
        :content="routine.content"
        :notesSubtitle="routine.notesSubtitle"
        :notes="routine.notes"
        :credits="routine.credits"
        :lastUpdated="routine.lastUpdated"
        :videoUrl="showSecondVideo ? routine.secVideoUrl : routine.videoUrl"
        :thumbnail="showSecondVideo ? routine.secThumbnail: routine.thumbnail"
        :sessions="routine.defaultSessionIds"
      />
    </div>
    <page-loader v-if="showLoader" />
  </article>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { categories, difficultyLevels } from '@/constants'
import sessionsList from '@/components/admin/list-with-modal/sessions'
import notesList from '@/components/admin/list-with-modal/notes'
import creditsList from '@/components/admin/list-with-modal/credits'
import uploadImageMixin from '@/mixins/uploadImage.mixin'

export default {
  components: {
    'page-loader': () => import('@/components/common/page-loader'),
    'n-routine-preview-new': () => import('@/components/training-routine-new/index.vue'),
    sessionsList,
    notesList,
    creditsList
  },

  props: {
    initialRoutine: {
      type: Object
    },
    isDuplicate: {
      type: Boolean,
      default: false
    }
  },
  mixins: [uploadImageMixin],

  data () {
    return {
      showLoader: false,
      showFull: false,
      showSecondVideo: false,
      routine: {
        title: '',
        subtitle: '',
        skill: '',
        startLevel: 0,
        endLevel: 0,
        optimalLevel: 0,
        approvedBy: '',
        videoUrl: '',
        thumbnail: '',
        secVideoUrl: '',
        secThumbnail: '',
        difficulty: 'EASY',
        tags: [],
        defaultSessionIds: [],
        content: '',
        notesSubtitle: '',
        notes: [],
        credits: [],
        isPublished: null,
        isDiscoverable: null,
        isExclusive: false,
        weight: 100
      },
      temporaryTagName: '',
      categories: categories,
      difficultyLevels: difficultyLevels,
      editorToolbar: [
        ['bold', 'italic', 'strike', 'underline'],
        ['unordered', 'ordered'],
        ['fullscreen', 'viewsource', 'link'],
        ['upload']
      ],
      showDialog: false,
      columnSessionsToAdd: [
        {
          label: 'Id',
          field: 'id'
        },
        {
          label: 'Title',
          field: 'title'
        },
        {
          label: 'Map Code',
          field: 'map.mapCode'
        },
        {
          label: 'Time',
          field: 'duration'
        },
        {
          label: 'Tags',
          field: 'tags'
        }
      ]
    }
  },

  async mounted () {
    await this.fetchAllSessions()
    this.cloneInitialPropsToModel()
  },

  computed: {
    ...mapState('session', {
      sessionsToAdd: state => Object.values(state.sessions)
    }),
    ...mapGetters({
      getSession: 'session/getSession',
      isReadonlyAdmin: 'user/isReadonlyAdmin',
      isAdmin: 'user/isAdmin'
    })
  },

  methods: {
    ...mapActions('session', {
      fetchAllSessions: 'fetchAllSessions'
    }),
    toggleFullSize () {
      this.showFull = !this.showFull
      window.scrollTo(0, 0)
    },
    toggleRoutineVideo () {
      this.showSecondVideo = !this.showSecondVideo
      window.scrollTo(0, 0)
    },
    cloneInitialPropsToModel () {
      if (this.initialRoutine) {
        this.routine.title = this.initialRoutine.title
        this.routine.subtitle = this.initialRoutine.subtitle
        this.routine.skill = this.initialRoutine.skill
        this.routine.startLevel = this.initialRoutine.startLevel.toString()
        this.routine.endLevel = this.initialRoutine.endLevel.toString()
        this.routine.optimalLevel = this.initialRoutine.optimalLevel.toString()
        this.routine.approvedBy = this.initialRoutine.approvedBy
        this.routine.videoUrl = this.initialRoutine.videoUrl
        this.routine.thumbnail = this.initialRoutine.thumbnail
        this.routine.secVideoUrl = this.initialRoutine.secVideoUrl
        this.routine.secThumbnail = this.initialRoutine.secThumbnail
        this.routine.difficulty = this.initialRoutine.difficulty
        this.routine.tags = this.initialRoutine.tags
        this.routine.defaultSessionIds = this.initialRoutine.defaultSessionIds.map((id) => this.getSession(id))
        this.routine.content = this.initialRoutine.content
        this.routine.notesSubtitle = this.initialRoutine.notesSubtitle
        this.routine.notes = this.initialRoutine.notes
        this.routine.credits = this.initialRoutine.credits
        this.routine.isPublished = this.initialRoutine.isPublished
        this.routine.isDiscoverable = this.initialRoutine.isDiscoverable
        this.routine.isExclusive = this.initialRoutine.isExclusive
        this.routine.weight = this.initialRoutine.weight
      }
    },

    mapSession (el) {
      return {
        id: el?.id,
        title: el.title,
        duration: el.duration
      }
    },
    addNewTag (event) {
      this.routine.tags.push(this.temporaryTagName)
      this.temporaryTagName = ''
    },

    deleteTag (tag) {
      const tags = this.routine.tags.filter(_tag => _tag !== tag)

      this.routine = {
        ...this.routine,
        tags
      }
    },

    checkIsFormValid () {
      if (this.routine.isPublished && this.routine.defaultSessionIds.length === 0) {
        this.$q.notify({
          color: 'dark-pink',
          textColor: 'white',
          icon: 'error',
          message: 'Routine can not be published with no sessions',
          badgeClass: 'hidden'
        })
        return false
      }
      return this.$refs.createEditRoutineForm.validate()
    },

    saveChanges () {
      this.checkIsFormValid().then(isSuccess => {
        if (isSuccess && this.isAdmin) {
          this.$emit('submit', {
            ...this.routine,
            credits: JSON.stringify(this.routine.credits),
            notes: JSON.stringify(this.routine.notes),
            tags: JSON.stringify(this.routine.tags),
            defaultSessionIds: this.routine.defaultSessionIds.map((item) => item?.id)
          })
        }
      })
    },
    updateLastUpdated () {
      this.checkIsFormValid().then(isSuccess => {
        if (isSuccess && this.isAdmin) {
          this.$emit('submit', {
            ...this.routine,
            credits: JSON.stringify(this.routine.credits),
            notes: JSON.stringify(this.routine.notes),
            tags: JSON.stringify(this.routine.tags),
            defaultSessionIds: this.routine.defaultSessionIds.map((item) => item?.id),
            lastUpdate: new Date()
          })
        }
      })
    },
    async uploadImageToNotesSub () {
      const imgStr = await this.uploadImage(this.routine.title, () => { this.showLoader = true }, () => { this.showLoader = false })
      this.$set(this.routine, 'notesSubtitle', this.routine.notesSubtitle + `<img src="${imgStr}" />`)
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-routine {
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
  height: 100%;
  overflow-y: auto;

  &__item {
    margin-top: 2rem;

    &:first-child { margin-top: 0; }
  }
}

.routine__preview {
  grid-column: 2;
  grid-row: 1;
  margin: 0 auto;
  padding: 0 5px 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;

  &--full-size{
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    width: 100%;
    background: $dark;
  }
}
</style>
