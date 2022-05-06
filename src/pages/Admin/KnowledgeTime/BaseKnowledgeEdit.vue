<template>
  <article class="admin-knowledge" :class="{'no-scroll': showFull}">
    <q-form
      :class="{'form-disabled': isReadonlyAdmin}"
      class="form"
      ref="createForm"
      @submit.prevent="saveChanges"
    >
      <div class="form__item">
        <q-input
          ref="formTitle"
          clearable
          label="Title"
          :rules="[value => Boolean(value) || 'Title required']"
          v-model="knowledge.title"
        />
      </div>

      <div class="form__item">
        <q-input
          ref="formDescription"
          clearabl
          label="Description"
          v-model="knowledge.description"
        />
      </div>

      <div class="form__item">
        <q-input
          ref="formVideourl"
          clearable
          label="Video URL"
          v-model="knowledge.videoUrl"
        />
      </div>

      <div class="form__item">
        <q-input
          ref="formCreator"
          clearable
          label="Video Creator"
          v-model="knowledge.creator"
        />
      </div>

      <div class="form__item">
        <q-input
          ref="formThumbnail"
          clearable
          label="Thumbnail for Video"
          v-model="knowledge.thumbnail"
        />
      </div>

      <div class="form__item">
        <q-select
          ref="formCategory"
          clearable
          label="Category"
          :options="categories"
          :rules="[value => Boolean(value) || 'Category required']"
          v-model="knowledge.category"
        />
      </div>

      <div class="form__item">
        <q-select
          ref="formDifficulty"
          clearable
          label="Difficulty"
          :options="difficultyLevels"
          :rules="[value => Boolean(value) || 'Difficulty required']"
          v-model="knowledge.difficulty"
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
          v-model="knowledge.startLevel"
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
          v-model="knowledge.endLevel"
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
          v-model="knowledge.optimalLevel"
        />
      </div>

      <div class="form__item group">
        <h4>Insights</h4>
        <q-input
          clearable
          label="Title"
          v-model="temporaryInsight.title"
        />

        <q-editor
          v-model="temporaryInsight.description"
          :toolbar="editorToolbar"
        />

        <c-btn
          v-if="temporaryInsightIndex !== null"
          outline
          @click="cancelInsightEditing"
        >
          Cancel
        </c-btn>
        <c-btn @click="addNewInsight">{{temporaryInsightIndex !== null ? 'Save' : 'Add'}}</c-btn>

        <draggable v-model="knowledge.insights">
          <div
            v-for="(insight, insightIndex) of knowledge.insights"
            :key="insight.title"
            class="insights"
          >
            <div>
              <b style="font-size: 1.1rem">{{insight.title}}</b>
              <br>
              <p v-html="insight.description"></p>
            </div>

            <div class="insights__actions">
              <c-btn
                variant="simple"
                tag="button"
                type="button"
                bg="f50"
                color="fff"
                class="py-25 px-30"
                @click="deleteInsight(insight)"
              >
                <q-icon name="delete" class="mr-15" color="dark-pink" size="24px"/>Remove
              </c-btn>
              <c-btn
                tag="button"
                type="button"
                bg="f50"
                color="fff"
                class="py-25 px-30"
                @click="editInsight(insight, insightIndex)"
              >
                <q-icon name="edit" class="mr-15" color="dark-pink" size="24px"/>Edit
              </c-btn>
            </div>
          </div>
        </draggable>
      </div>

      <div class="form__item">
        Is Published?
        <q-toggle
          size="xl"
          checked-icon="check"
          unchecked-icon="clear"
          color="green"
          v-model="knowledge.isPublished"
        />
      </div>
      <div class="form__item">
        Is Discoverable?
        <q-toggle
          size="xl"
          checked-icon="check"
          unchecked-icon="clear"
          color="green"
          v-model="knowledge.isDiscoverable"
        />
      </div>
      <div class="form__item">
        Is Exclusive?
        <q-toggle
          size="xl"
          checked-icon="check"
          unchecked-icon="clear"
          color="green"
          v-model="knowledge.isExclusive"
        />
      </div>

      <div class="form__item">
        <q-input
          ref="formDuration"
          clearable
          label="Duration in Seconds"
          type="number"
          :rules="[
            value => value > 0 || 'Duration should be greater than 0',
            value => typeof value === 'string' || 'Duration should be a number'
          ]"
          v-model="knowledge.videoDurationSeconds"
        />
        <c-btn @click="fetchVideoDuration">
          Fetch video duration from youtube
        </c-btn>
      </div>

      <div class="form__item">
        <c-btn type="submit">
          {{isDuplicate ? 'Create Duplication' : 'Save'}}
        </c-btn>
      </div>
    </q-form>
    <c-btn @click="toggleFullSize" class="q-mt-md" outline>
      Toggle full size view
    </c-btn>

    <div class="knowledge__preview" :class="{ 'knowledge__preview--full-size': showFull}">
      <c-btn @click="showFull = !showFull" v-if="showFull">
        Toggle full size view
      </c-btn>
      <n-video-item :item="videoData" />
      <n-video-preview ref="preview"
        :data="videoData"
      />
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'
import { categories, difficultyLevels } from '@/constants'
import VideoPreview from 'components/knowledge/in-video'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
    'n-video-item': () => import('@/components/knowledge/list/item'),
    'n-video-preview': VideoPreview
  },

  props: {
    initialKnowledgeTime: {
      type: Object
    },
    isDuplicate: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      showFull: false,
      knowledge: {
        title: '',
        description: '',
        category: '',
        videoDurationSeconds: 0,
        videoUrl: '',
        creator: '',
        difficulty: 'EASY',
        startLevel: 0,
        endLevel: 0,
        optimalLevel: 0,
        insights: [],
        thumbnail: '',
        isExclusive: false,
        isDiscoverable: false,
        isPublished: false
      },
      temporaryInsight: {
        title: '',
        description: ''
      },
      categories: categories,
      difficultyLevels: difficultyLevels,
      editorToolbar: [
        ['bold', 'italic', 'strike', 'underline'],
        ['unordered', 'ordered'],
        ['fullscreen', 'viewsource', 'link']
      ],
      temporaryInsightIndex: null
    }
  },
  computed: {
    ...mapGetters('user', {
      isReadonlyAdmin: 'isReadonlyAdmin',
      isAdmin: 'isAdmin'
    }),

    videoData () {
      return {
        title: this.knowledge.title,
        description: this.knowledge.description,
        video: this.knowledge.videoUrl,
        thumbnail: this.knowledge.thumbnail,
        creator: this.knowledge.creator,
        category: this.knowledge.category,
        difficulty: this.knowledge.difficulty,
        insights: this.knowledge.insights,
        time: parseInt(this.knowledge.videoDurationSeconds / 60)
      }
    }
  },
  mounted () {
    this.cloneInitialPropsToModel()
  },

  methods: {
    toggleFullSize () {
      this.showFull = !this.showFull
      window.scrollTo(0, 0)
    },
    cloneInitialPropsToModel () {
      if (this.initialKnowledgeTime) {
        this.knowledge.title = this.initialKnowledgeTime.title
        this.knowledge.description = this.initialKnowledgeTime.description
        this.knowledge.category = this.initialKnowledgeTime.category
        this.knowledge.videoDurationSeconds = this.initialKnowledgeTime.videoDurationSeconds.toString()
        this.knowledge.videoUrl = this.initialKnowledgeTime.videoUrl
        this.knowledge.creator = this.initialKnowledgeTime.creator
        this.knowledge.difficulty = this.initialKnowledgeTime.difficulty
        this.knowledge.startLevel = this.initialKnowledgeTime.startLevel.toString()
        this.knowledge.endLevel = this.initialKnowledgeTime.endLevel.toString()
        this.knowledge.optimalLevel = this.initialKnowledgeTime.optimalLevel.toString()
        this.knowledge.insights = this.initialKnowledgeTime.insights || []
        this.knowledge.thumbnail = this.initialKnowledgeTime.thumbnail
        this.knowledge.isExclusive = this.initialKnowledgeTime.isExclusive
        this.knowledge.isPublished = this.initialKnowledgeTime.isPublished
        this.knowledge.isDiscoverable = this.initialKnowledgeTime.isDiscoverable
      }
    },

    addNewInsight () {
      if (this.temporaryInsight.title === '') return

      if (this.temporaryInsightIndex !== null) {
        this.knowledge.insights.splice(this.temporaryInsightIndex, 1, this.temporaryInsight)
        this.temporaryInsightIndex = null
      } else {
        this.knowledge.insights.push({
          title: this.temporaryInsight.title,
          description: this.temporaryInsight.description
        })
      }

      this.temporaryInsight = { title: '', description: '' }
    },
    deleteInsight (step) {
      const insights = this.knowledge.insights.filter(_step => _step.title !== step.title)

      this.knowledge = {
        ...this.knowledge,
        insights
      }
    },

    editInsight (insight, insightIndex) {
      this.temporaryInsight = insight
      this.temporaryInsightIndex = insightIndex
    },
    cancelInsightEditing () {
      this.temporaryInsight = { title: '', description: '' }
      this.temporaryInsightIndex = null
    },

    async fetchVideoDuration () {
      const seconds = await this.$refs.preview?.$children
        .find(child =>
          child.$options._componentTag === 'n-multimedia'
        )?.$refs.videoPlayer?.ytPlayer?.getDuration()
      if (seconds) {
        this.knowledge.videoDurationSeconds = seconds.toString()
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Oops, something went wrong, try again.'
        })
      }
    },

    checkIsFormValid () {
      return this.$refs.createForm.validate()
    },

    saveChanges () {
      this.checkIsFormValid().then(isSuccess => {
        if (isSuccess && this.isAdmin) {
          this.$emit('submit', {
            ...this.knowledge,
            insights: JSON.stringify(this.knowledge.insights)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-knowledge {
  display: grid;
  align-items: start;
  grid-template-columns: minmax(200px, 500px) auto;
  grid-template-rows: auto;
  gap: 1rem;
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

  &__item {
    margin-top: 2rem;

    &:first-child { margin-top: 0; }
  }
}

.knowledge__preview {
  grid-column: 2;
  grid-row: 1;
  margin: 0 auto;
  width: 100%;
  padding-bottom: 30px;
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

.insights {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  border-top: 2px solid $dark-pink;
  padding: 10px 0;

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
