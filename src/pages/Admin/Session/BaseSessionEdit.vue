<template>
  <article class="admin-session" :class="{'no-scroll': showFull}">
    <q-form
      :class="{'form-disabled': isReadonlyAdmin}"
      class="form"
      ref="createEditSessionForm"
      @submit.prevent="saveChanges"
    >
      <div class="form__item">
        <q-input
          ref="formTitle"
          clearable
          label="Title"
          :rules="[value => Boolean(value) || 'Title required']"
          v-model="session.title"
        />
      </div>

      <div class="form__item">
        <q-input
          ref="formSubtitle"
          clearabl
          label="Subtitle"
          v-model="session.subtitle"
        />
      </div>

      <div class="form__item">
        <q-input
          ref="formVideourl"
          clearable
          label="Video URL"
          v-model="session.videoUrl"
        />
      </div>
      <div class="form__item">
        <q-input
          ref="formThumbnail"
          clearable
          label="Video Thumbnail URL"
          v-model="session.thumbnail"
        />
      </div>
      <div class="form__item">
        <q-input
          ref="formKovaakurl"
          clearable
          label="KovaaK's URL (Optional)"
          v-model="session.kovaakUrl"
        />
      </div>
      <div class="form__item">
        <q-input
          ref="formKovaakName"
          clearable
          label="KovaaK's Name (Optional)"
          v-model="session.kovaakName"
        />
      </div>

      <div class="form__item">
        <q-select
          ref="formType"
          clearable
          label="Type (Category)"
          :options="categories"
          :rules="[value => Boolean(value) || 'Type required']"
          v-model="session.type"
        />
      </div>

      <div class="form__item">
        <q-input
          clearable
          label="Approved By"
          v-model="session.approvedBy"
        />
      </div>

      <div class="form__item">
        <q-select
          ref="formDifficulty"
          clearable
          label="Difficulty"
          :options="difficultyLevels"
          :rules="[value => Boolean(value) || 'Difficulty required']"
          v-model="session.difficulty"
        />
      </div>

      <div class="form__item group">
        <h4>Map details</h4>
        <q-input
          clearable
          label="Map Title"
          v-model="session.map.title"
        />

        <q-input
          clearable
          label="Map Subtitle"
          v-model="session.map.subtitle"
        />

        <q-input
          clearable
          label="Tooltip Description"
          v-model="session.map.tooltipDescription"
        />

        <q-input
          clearable
          label="Link to Map image"
          v-model="session.map.mapImgSrc"
        />

        <q-input
          clearable
          label="Map Name"
          :rules="[value => Boolean(value) || 'Map image required']"
          v-model="session.map.mapName"
        />
        <q-input
          clearable
          label="Map Code"
          mask="####-####-####"
          hint="Mask: ####-####-####"
          :rules="[value => Boolean(value) || 'Map image required']"
          v-model="session.map.mapCode"
        />
      </div>

      <div class="form__item">
        <q-input
          clearable
          label="Skills Learned"
          v-model="temporarySkillName"
          @keydown.enter.prevent="addNewSkill"
        />

        <q-chip
          removable
          v-for="skill of session.skills"
          :key="skill"
          color="dark-pink"
          @remove="deleteSkill(skill)"
        >
          {{skill}}
        </q-chip>
      </div>

      <div class="form__item group">
        <h4>Steps (Instructions)</h4>
        <q-input
          clearable
          label="Step Title"
          v-model="temporaryStep.title"
        />

        <q-editor
          :definitions="{
            upload: {
              tip: 'Upload Image',
              icon: 'image',
              handler: uploadImageToStep
            }
          }"
          v-model="temporaryStep.description"
          :toolbar="editorToolbar"
        />

        <c-btn v-if="temporaryStep.insertionIndex !== null" outline @click="cancelEditing">Cancel editing</c-btn>
        <c-btn @click="addNewStep">Save</c-btn>

        <draggable v-model="session.steps">
          <div
            v-for="(step, stepIndex) of session.steps"
            :key="`step.title-${stepIndex}`"
            class="step"
          >
            <div style="width: 100%;">
              <b style="font-size: 1.1rem">{{step.title}}</b>
              <br>
              <p v-html="step.description"></p>

              <div class="step__actions">
                <c-btn
                  tag="button"
                  type="button"
                  bg="f50"
                  color="fff"
                  class="py-25 px-30"
                  @click="editStep(step, stepIndex)"
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
                  @click="deleteStep(stepIndex)"
                >
                  <q-icon name="delete" class="mr-15" color="dark-pink" size="24px"/>Remove
                </c-btn>
              </div>
            </div>
          </div>
        </draggable>
      </div>

      <div class="form__item group">
        <h4>Notes</h4>
        <q-editor
          label="Note"
          :definitions="{
            upload: {
              tip: 'Upload Image',
              icon: 'image',
              handler: uploadImageToNote
            }
          }"
          v-model="temporaryNote"
          :toolbar="editorToolbar"
        />

        <c-btn
          v-if="temporaryNoteIndex !== null"
          outline
          @click="cancelNoteEditing"
        >
          Cancel
        </c-btn>
        <c-btn @click="addNewNote">Save</c-btn>

        <draggable v-model="session.notes">
          <div
            v-for="(note, noteIndex) of session.notes"
            :key="note"
            class="step"
          >
            <div style="width: 100%;">
              <p v-html="note"></p>

              <div class="step__actions">
                <c-btn
                  tag="button"
                  type="button"
                  bg="f50"
                  color="fff"
                  class="py-25 px-30"
                  @click="editNote(note, noteIndex)"
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
                  @click="deleteNote(note)"
                >
                  <q-icon name="delete" class="mr-15" color="dark-pink" size="24px"/>Remove
                </c-btn>
              </div>
            </div>
          </div>
        </draggable>
      </div>

      <div class="form__item">
        <q-input
          ref="formFOV"
          clearable
          label="FOV (Field of View)"
          v-model="session.fov"
        />
      </div>

      <edit-benchmark v-model="session.benchmark"/>

      <div class="form__item group">
        <h4>Credits</h4>
        <q-input
          clearable
          label="Credit Title"
          v-model="temporaryCredit.title"
        />
        <q-input
          clearable
          label="Value"
          v-model="temporaryCredit.value"
        />
        <q-input
          clearable
          label="Code (optional)"
          v-model="temporaryCredit.code"
        />

        <c-btn @click="addNewCredit">Add</c-btn>

        <div
          v-for="credit of session.credits"
          :key="credit.title"
          @dblclick="deleteCredit(credit)"
        >
          title:
          <b style="font-size: 1.1rem">{{credit.title}}</b>
          <br>
          value:
          <b style="font-size: 1.1rem">{{credit.value}}</b>
          <br>
          code:
          <b style="font-size: 1.1rem">{{credit.code}}</b>
        </div>
      </div>

      <div class="form__item">
        <q-input
          ref="formDuration"
          clearable
          label="Duration"
          type="number"
          :rules="[
            value => value > 0 || 'Duration should be greater than 0',
            value => typeof value === 'string' || 'Duration should be a number'
          ]"
          v-model="session.duration"
        />
      </div>

      <q-toggle
        size="xl"
        v-model="session.isScoreInversed"
        checked-icon="check"
        color="green"
        unchecked-icon="clear"
      >
        Is Score Inversed
      </q-toggle>
      <q-toggle
        size="xl"
        v-model="session.isScoreTime"
        checked-icon="check"
        color="green"
        unchecked-icon="clear"
      >
        Is Score In Time Format
      </q-toggle>

      <q-dialog v-model="showResetScoreDialog" persistent>
        <q-card style="background: #231538;">
          <q-card-section class="row items-center">
            <span class="q-ml-sm text-h2">{{`DELETE ALL PLAYERS SCORES FOR `}}<br><span class="text-red">{{`${session.title} ?`}}</span></span>
            <span class="q-ml-sm text-bold">( Meant for TRACKABLE SESSIONS. Ensure you have saved the session first! )</span>
          </q-card-section>

          <q-card-actions align="right">
            <c-btn type="submit" class="q-mr-sm" v-close-popup>
              CANCEL
            </c-btn>
            <c-btn type="submit" @click="$emit('resetSessionUsersScores')" v-close-popup>
              DELETE SCORES
            </c-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <div class="form__item">
        <c-btn type="submit">
          {{isDuplicate ? 'Create Duplication' : 'Save'}}
        </c-btn>
      </div>
      <div style="padding-top:20px">
        <c-btn @click="resetScoreClicked">
          Reset score (tracking)
        </c-btn>
      </div>
    </q-form>
    <div class="session__preview column" :class="{ 'session__preview--full-size': showFull}">
      <div class="col col-shrink row q-mb-md">
        <c-btn @click="toggleFullSize" class="col" outline>
          Toggle full size view
        </c-btn>
      </div>
      <n-session-preview-new
        class="col full-width" style="outline: 2px solid yellow;"
        :sessions="[{ id: 'preview', ...session }]"
        sessionId="preview"
        :title="session.title"
        :subtitle="session.subtitle"
        :videoUrl="session.videoUrl"
        :thumbnail="session.thumbnail"
        :category="session.type"
        :author="session.approvedBy"
        :difficulty="session.difficulty"
        :content="session.content"
        :notes="session.notes"
        :credits="session.credits"
        :map="session.map"
        :benchmark="session.benchmark"
        :duration="parseInt(session.duration)"
      />
    </div>
    <page-loader v-if="showLoader" />
  </article>
</template>

<script>
import { mapGetters } from 'vuex'
import { categories, difficultyLevels } from '@/constants'
import EditBenchmark from '@/components/admin/session/edit-benchmark'
import draggable from 'vuedraggable'
import uploadImageMixin from '@/mixins/uploadImage.mixin'

export default {
  components: {
    'n-session-preview-new': () => import('@/components/training-routine-new/index.vue'),
    'page-loader': () => import('@/components/common/page-loader'),
    EditBenchmark,
    draggable
  },

  props: {
    initialSession: {
      type: Object
    },
    isDuplicate: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      showResetScoreDialog: false,
      showFull: false,
      showNew: true,
      showLoader: false,
      session: {
        title: '',
        subtitle: '',
        type: '',
        duration: 0,
        approvedBy: '',
        videoUrl: '',
        thumbnail: '',
        kovaakUrl: '',
        kovaakName: '',
        difficulty: 'EASY',
        skills: [],
        map: {
          title: 'Creative Map',
          subtitle: 'Where to play this routine',
          tooltipDescription: '',
          mapImgSrc: 'https://aggbwkxwqp.cloudimg.io/img.dexerto.com/_s3_/uploads/2020/10/05004041/Fortnite-Original-Map.png?w=620',
          mapName: '',
          mapCode: ''
        },
        steps: [],
        notes: [],
        credits: [],
        fov: '',
        benchmark: {
          bronze: '',
          silver: '',
          gold: '',
          platinum: '',
          diamond: ''
        }
      },
      temporarySkillName: '',
      temporaryStep: {
        title: '',
        description: '',
        insertionIndex: null
      },
      temporaryCredit: {
        title: '',
        value: '',
        code: null
      },
      temporaryNote: '',
      temporaryNoteIndex: null,
      categories: categories,
      difficultyLevels: difficultyLevels,
      editorToolbar: [
        ['bold', 'italic', 'strike', 'underline'],
        ['unordered', 'ordered'],
        ['fullscreen', 'viewsource', 'link'],
        ['upload']
      ]
    }
  },
  computed: {
    ...mapGetters('user', {
      isReadonlyAdmin: 'isReadonlyAdmin',
      isAdmin: 'isAdmin'
    })
  },
  mounted () {
    this.cloneInitialPropsToModel()
  },
  mixins: [uploadImageMixin],
  methods: {
    async uploadImageToNote () {
      const imgStr = await this.uploadImage(this.session.title, () => { this.showLoader = true }, () => { this.showLoader = false })
      this.temporaryNote = this.temporaryNote + `<img src="${imgStr}" />`
    },
    async uploadImageToStep () {
      const imgStr = await this.uploadImage(this.session.title, () => { this.showLoader = true }, () => { this.showLoader = false })
      this.$set(this.temporaryStep, 'description', this.temporaryStep.description + `<img src="${imgStr}" />`)
    },
    toggleFullSize () {
      this.showFull = !this.showFull
      window.scrollTo(0, 0)
    },
    cloneInitialPropsToModel () {
      if (this.initialSession) {
        this.session.title = this.initialSession.title
        this.session.subtitle = this.initialSession.subtitle
        this.session.type = this.initialSession.type
        this.session.duration = this.initialSession.duration.toString()
        this.session.approvedBy = this.initialSession.approvedBy
        this.session.videoUrl = this.initialSession.videoUrl
        this.session.kovaakUrl = this.initialSession.kovaakUrl
        this.session.kovaakName = this.initialSession.kovaakName
        this.session.difficulty = this.initialSession.difficulty
        this.session.skills = this.initialSession.skills
        this.session.map = this.initialSession.map
        this.session.steps = this.initialSession.steps || []
        this.session.notes = this.initialSession.notes || []
        this.session.credits = (!this.initialSession.credits || (this.initialSession.credits.length === undefined && typeof this.initialSession.credits === 'object')) ? [] : this.initialSession.credits
        this.session.fov = this.initialSession.fov
        this.session.benchmark = this.initialSession.benchmark
        this.session.isScoreInversed = this.initialSession.isScoreInversed
        this.session.isScoreTime = this.initialSession.isScoreTime
      }
    },

    addNewSkill (event) {
      if (this.temporarySkillName === '') return
      this.session.skills.push(this.temporarySkillName)
      this.temporarySkillName = ''
    },

    addNewStep () {
      if (this.temporaryStep.title === '') return
      if (this.temporaryStep.insertionIndex !== null) {
        this.session.steps.splice(this.temporaryStep.insertionIndex, 1, {
          title: this.temporaryStep.title,
          description: this.temporaryStep.description
        })
        this.temporaryStep.insertionIndex = null
      } else {
        this.session.steps.push({
          title: this.temporaryStep.title,
          description: this.temporaryStep.description
        })
      }

      this.temporaryStep = { title: '', description: '', insertionIndex: null }
    },

    addNewNote () {
      if (this.temporaryNote === '') return
      if (this.temporaryNoteIndex !== null) {
        this.session.notes.splice(this.temporaryNoteIndex, 1, this.temporaryNote)
        this.temporaryNoteIndex = null
      } else {
        this.session.notes.push(this.temporaryNote)
      }

      this.temporaryNote = ''
    },

    addNewCredit () {
      if (!this.temporaryCredit.title || !this.temporaryCredit.value) return false
      this.session.credits.push({
        title: this.temporaryCredit.title,
        value: this.temporaryCredit.value,
        code: this.temporaryCredit.code
      })

      this.temporaryCredit = { title: '', value: '', code: null }
    },

    deleteSkill (skill) {
      const skills = this.session.skills.filter(_skill => _skill !== skill)

      this.session = {
        ...this.session,
        skills
      }
    },

    deleteStep (index) {
      this.session.steps.splice(index, 1)

      this.session = {
        ...this.session,
        steps: this.session.steps
      }
    },

    deleteNote (note) {
      const notes = this.session.notes.filter(_note => _note !== note)

      this.session = {
        ...this.session,
        notes
      }
    },

    deleteCredit (credit) {
      const credits = this.session.credits.filter(_credit => _credit !== credit)

      this.session = {
        ...this.session,
        credits
      }
    },

    editStep (step, stepIndex) {
      this.temporaryStep.title = step.title
      this.temporaryStep.description = step.description
      this.temporaryStep.insertionIndex = stepIndex
    },

    cancelEditing () {
      this.temporaryStep = {
        title: '',
        description: '',
        insertionIndex: null
      }
    },

    editNote (note, noteIndex) {
      this.temporaryNote = note
      this.temporaryNoteIndex = noteIndex
    },

    cancelNoteEditing () {
      this.temporaryNote = ''
      this.temporaryNoteIndex = null
    },

    checkIsFormValid () {
      return this.$refs.createEditSessionForm.validate()
    },

    resetScoreClicked () {
      this.showResetScoreDialog = true
    },
    saveChanges () {
      this.checkIsFormValid().then(isSuccess => {
        if (isSuccess && this.isAdmin) {
          this.$emit('submit', {
            ...this.session,
            steps: JSON.stringify(this.session.steps),
            credits: JSON.stringify(this.session.credits)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-session {
  display: grid;
  align-items: start;
  grid-template-columns: minmax(200px, 500px) auto;
  grid-template-rows: auto;
  gap: 1rem;
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
  width: 100%;
  margin: auto;
  overflow-y: auto;
  height: 100%;
  padding-right: 10px;

  &__item {
    margin-top: 2rem;

    &:first-child { margin-top: 0; }
  }
}

.step {
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-top: 2px solid $dark-pink;
  padding: 10px 0;

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}

.session__preview {
  grid-column: 2;
  grid-row: 1;
  margin: 0 auto;
  width: 100%;
  padding: 0 5px 20px;
  overflow-y: auto;
  height: 100%;
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

.group {
  box-sizing: border-box;
  padding-left: 2rem;
  border-left: 5px solid $pink;
  border-radius: 6px;

  & > * {
    margin-top: 1rem;

    &:first-child { margin-top: 0; }
  }
}
</style>
