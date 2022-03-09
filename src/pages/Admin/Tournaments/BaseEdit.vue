<template>
  <article class="admin-tournament" :class="{'no-scroll': showFull}">
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
          v-model="tournament.title"
        />
      </div>

      <div class="form__item">
        <q-input
          ref="formDescription"
          clearable autogrow
          type="textarea"
          label="Description"
          v-model="tournament.description"
        />
      </div>

      <div class="form__item">
        <q-input
          ref="formEventId"
          label="EventId"
          :disable="Boolean(!isDuplicate && initialTournament && initialTournament.eventId)"
          :rules="[
            value => Boolean(value) || 'EventId required',
            value => !hasDuplicateId || 'Must not have same id as duplicated event'
          ]"
          v-model="tournament.eventId"
        />
      </div>
      <div class="form__item">
        <q-input
          ref="formEventWindowId"
          label="EventWindowId"
          :disable="Boolean(!isDuplicate && initialTournament && initialTournament.eventWindowId)"
          :rules="[
            value => Boolean(value) || 'EventWindowId required',
            value => !hasDuplicateId || 'Must not have same id as duplicated event'
          ]"
          v-model="tournament.eventWindowId"
        />
      </div>

      <div class="form__item">
        <q-input
          ref="formThumbUrl"
          clearable
          label="Thumbnail URL"
          :rules="[value => Boolean(value) || 'Thumbnail required']"
          v-model="tournament.thumbnail"
        />
      </div>

      <div class="form__item">
        <q-input
          ref="formStartAt"
          clearable dark filled
          label="Start At"
          type="datetime"
          mask="datetime"
          v-model="tournament.startAt"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date v-model="tournament.startAt" mask="YYYY-MM-DDTHH:mm+00:00">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="tournament.startAt" mask="YYYY-MM-DDTHH:mm+00:00" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="form__item">
        <q-input
          ref="formEndAt"
          clearable dark filled
          label="End At"
          type="datetime"
          mask="datetime"
          v-model="tournament.endAt"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date v-model="tournament.endAt" mask="YYYY-MM-DDTHH:mm+00:00">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="tournament.endAt" mask="YYYY-MM-DDTHH:mm+00:00" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="form__item group">
        <q-input
          ref="formMode"
          clearable
          label="Mode"
          :rules="[value => Boolean(value) || 'Mode required']"
          v-model="tournament.mode"
        />
        <q-select
          ref="formAlgoType"
          clearable
          label="Algo Type"
          :rules="[value => Boolean(value) || 'Algo Type required']"
          v-model="tournament.algorithmType"
          :options="algoTypes"
        />
        <q-input
          ref="formIntroVideoURL"
          clearable
          label="Intro Video URL"
          :rules="[value => Boolean(value) || 'Intro Video URL required']"
          v-model="tournament.introductionVideoUrl"
        />
      </div>

      <div class="form__item">
        <q-select
          ref="formRegion"
          clearable
          label="Regions"
          v-model="tournament.regions"
          use-input
          use-chips
          multiple
          input-debounce="0"
          new-value-mode="add-unique"
          :options="regions"
        />
      </div>

      <div class="form__item">
        Platforms
        <q-option-group
          v-model="tournament.platforms"
          :options="platforms"
          type="checkbox"
        />
      </div>

      <div class="form__item">
        <q-input
          clearable
          label="Requirements"
          v-model="temporaryRequirement"
          @keydown.enter.prevent="addNewRequirement"
        />

        <q-chip
          removable
          v-for="requirement of tournament.requirements"
          :key="requirement"
          color="dark-pink"
          @remove="deleteRequirement(requirement)"
        >
          {{requirement}}
        </q-chip>
      </div>

      <div class="form__item">
        <c-btn type="submit">
          {{isDuplicate ? 'Create Duplication' : 'Save'}}
        </c-btn>
      </div>
    </q-form>

    <div class="tournament__preview" :class="{ 'tournament__preview--full-size': showFull}">
      <n-list-item-preview
        :title="convertedTournament.title"
        :image="convertedTournament.thumbnail"
        :date="convertedTournament.startAt"
        :location="convertedTournament.regions"
        :requirements="convertedTournament.requirements"
        :platforms="convertedTournament.platforms"
        :mode="convertedTournament.mode"
        :type="'PREVIEW'"
      />
      <div class="text-h5 q-mt-md">Intro video</div>
      <n-multimedia v-if="tournament.introductionVideoUrl"
        :src="tournament.introductionVideoUrl"/>
    </div>
  </article>
</template>

<script>
import union from 'lodash/union'
import { mapGetters } from 'vuex'
import { tournaments } from '@/constants'

export default {
  components: {
    'n-multimedia': () => import('@/components/common/multimedia'),
    'n-list-item-preview': () => import('@/components/tournaments/days-list/tournament')
  },

  props: {
    initialTournament: {
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
      tournament: {
        eventId: '',
        eventWindowId: '',
        title: '',
        description: '',
        thumbnail: '',
        startAt: '',
        endAt: '',
        regions: [],
        platforms: [],
        mode: '',
        algorithmType: '',
        introductionVideoUrl: '',
        requirements: []
      },
      temporaryRequirement: '',
      platforms: tournaments.platforms,
      regions: tournaments.regions,
      algoTypes: tournaments.algorithmTypes,
      editorToolbar: [
        ['bold', 'italic', 'strike', 'underline'],
        ['unordered', 'ordered'],
        ['fullscreen', 'viewsource', 'link']
      ]
    }
  },
  computed: {
    ...mapGetters('user', {
      isReadonlyAdmin: 'isReadonlyAdmin',
      isAdmin: 'isAdmin'
    }),

    hasDuplicateId () {
      return this.isDuplicate &&
        this.tournament.eventId === this.initialTournament.eventId &&
        this.tournament.eventWindowId === this.initialTournament.eventWindowId
    },

    convertedTournament () {
      return {
        ...this.tournament,
        platforms: this.unconvertPlatforms(this.tournament.platforms)
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
      if (this.initialTournament) {
        this.tournament.eventId = this.initialTournament.eventId
        this.tournament.eventWindowId = this.initialTournament.eventWindowId
        this.tournament.title = this.initialTournament.title
        this.tournament.description = this.initialTournament.description
        this.tournament.thumbnail = this.initialTournament.thumbnail
        this.tournament.startAt = this.initialTournament.startAt
        this.tournament.endAt = this.initialTournament.endAt
        this.tournament.regions = this.initialTournament.regions
        this.tournament.platforms = this.convertPlatforms(this.initialTournament.platforms)
        this.tournament.mode = this.initialTournament.mode
        this.tournament.algorithmType = this.initialTournament.algorithmType
        this.tournament.introductionVideoUrl = this.initialTournament.introductionVideoUrl
        this.tournament.requirements = this.initialTournament.requirements
      }
    },

    convertPlatforms (platforms) {
      return platforms
        .map(platform => this.platforms.find(p => p.values.includes(platform))?.value)
        .filter(Boolean)
    },
    unconvertPlatforms (platforms) {
      return union(...platforms
        .map(platform => this.platforms.find(p => p.value === platform)?.values || [])
      )
    },

    addNewRequirement (event) {
      this.tournament.requirements.push(this.temporaryRequirement)
      this.temporaryRequirement = ''
    },

    deleteRequirement (requirement) {
      const requirements = this.tournament.requirements.filter(r => r !== requirement)
      this.$set(this.tournament, 'requirements', requirements)
    },

    checkIsFormValid () {
      return this.$refs.createForm.validate()
    },

    saveChanges () {
      this.checkIsFormValid().then(isSuccess => {
        if (isSuccess && this.isAdmin) {
          this.$emit('submit', this.convertedTournament)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-tournament {
  height: 90vh;
  display: grid;
  align-items: start;
  grid-template-columns: minmax(200px, 1fr) 1fr;
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
  height: 100%;
  overflow: auto;
  margin: auto;

  &__item {
    margin-top: 2rem;

    &:first-child { margin-top: 0; }
  }
}

.tournament__preview {
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
