<template>
  <n-modal
    :visible="true"
    :size="$q.screen.lt.md ? 'custom' : 'xl'"
    width="100%"
    height="80vh"
    showClose
    @close="closeModal">
    <article class="pick-routine">

      <section class="pick-routine__content">
        <h1 class="pick-routine__title">SELECT A NEW activity</h1>
        <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
        ">
          <div class="pick-routine__information">
            All activities with any category<br/> and difficulty level are available
          </div>
          <c-btn @click="createOwnRoutineClicked" class="q-my-sm">
            Create your own activity
          </c-btn>
        </div>
        <div class="search">
          <q-input outlined
                   class="full-width"
                   v-model="filterValue"
                   @input="searchEvent"
                   placeholder="Search for activity">
            <template v-slot:prepend>
              <img src="@/assets/icons/search.svg" alt="search icon"/>
            </template>
          </q-input>
          <div class="preferences-icon relative-position q-ml-lg q-mt-sm"
               style="cursor: pointer">
            <img src="@/assets/icons/preferences.svg"
                 style="cursor: pointer"
                 @click="toggleFilter"
                 id="filterIcon"
                 alt="preferences icon"/>
            <div class="routines-filters"
                 v-if="showFilters"
                 v-outside-click="outsideClickHandler"
                 :class="{'routines-filters--active': showFilters}">
              <div class="row q-pt-lg full-width">
                <div class="col-12  q-mb-md q-pb-xs border-bottom">
                  <div class="row justify-between items-center">
                    <div class="col">
                      <div class="font-rift text-uppercase text-weight-bold" style="font-size: 18px">
                        Filters
                      </div>
                    </div>
                    <div class="col text-right flex items-center justify-end">
                      <div class="font-rift text-uppercase text-weight-bold text-dark-pink"
                           @click="clearFilters"
                           style="font-size: 18px; cursor: pointer">
                        Clear All
                      </div>
                      <div @click="showFilters = false" class="lt-sm q-ml-md">
                        <c-icon icon="closeCircle" class="float-right" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="text-subtitle1">
                    Difficulty
                  </div>
                  <div class="q-mt-md select-list">
                    <q-checkbox class="like-button-select q-mr-md" @input="searchEvent" label="Easy"
                                v-model="difficulty" val="easy"/>
                    <q-checkbox class="like-button-select q-mr-md" @input="searchEvent" label="Intermediate"
                                v-model="difficulty" val="intermediate"/>
                    <q-checkbox class="like-button-select q-mr-md" @input="searchEvent" label="Advanced"
                                v-model="difficulty" val="advanced"/>
                  </div>
                </div>
                <div class="col-12 q-mt-lg">
                  <div class="text-subtitle1 q-mb-md">
                    Category
                  </div>
                  <q-select outlined
                            clearable
                            class="full-width"
                            v-model="category"
                            :popup-content-style="{ height:'300px', zIndex: '15951'}"
                            :popup-content-class="'popUpContent'"
                            :options="categories"
                            @clear="searchEvent"
                            @input="searchEvent"/>
                </div>
                <div class="col-12 q-mt-lg">
                  <c-btn @click="showFilters = false">
                    apply filters
                  </c-btn>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="routines-wrapper">
          <list
            class="routines"
            title="Available routines"
          >
            <template v-slot:afterTitle>
              <span class="routines__aftertitle">({{ routinesAvailable }})</span>
            </template>

            <template v-if="infiniteList && infiniteList.length">
              <n-routine
                class="routines__item"
                v-for="routine in infiniteList"
                :key="routine.id"
                :ref="`routine.${routine.id}`"
                :id="routine.id"
                :title="routine.title"
                :category="routine.skill"
                :author="routine.approvedBy"
                :difficulty="routine.difficulty"
                :tags="routine.tags"
                :isActive="routine.id === chosenRoutine.id"
                :collapsed="$q.screen.lt.md && !!chosenRoutine"
                @hide="clearChoosedRoutine"
                @click="selectRoutine(routine, `routine.${routine.id}`)"
              >
                <c-btn @click="selectRoutineClicked" class="q-my-lg">
                  Add Activity
                </c-btn>

                <div class="q-my-lg">
                  <chip
                    class="q-mr-sm q-mt-sm"
                    v-for="tag of routine.tags"
                    :key="tag"
                  >
                    {{ tag }}
                  </chip>
                </div>

                <list
                  class="sessions q-pa-none"
                  title="Sessions"
                  :description="`${routineDuration} minutes`"
                >
                  <div
                    class="sessions__item session"
                    v-for="session in chosenRoutine.sessions"
                    :key="session.id"
                  >
                    <h4 class="session__title">{{ session.title }}</h4>
                    <span class="session__duration">{{ session.duration }} minutes</span>
                  </div>
                </list>
              </n-routine>
              <infinite-loading :identifier="infiniteId" @infinite="infiniteHandler">
                <div slot="no-more"></div>
              </infinite-loading>
            </template>
            <template v-else>
              <div class="text-h4 text-gray opacity-5 text-center q-mt-xl">
                Oops!<br/>
                Sorry but we don't have routines :(
              </div>
            </template>
          </list>
        </div>
      </section>

      <section class="pick-routine__preview gt-sm">
        <div class="pick-routine__preview-content">
          <h2 class="pick-routine__title pick-routine__title--secondary">{{ chosenRoutine.title }}</h2>

          <div class="sessions-wrapper">
            <list
              class="sessions"
              title="Sessions"
              :description="`${routineDuration} minutes`"
            >
              <div
                class="sessions__item session"
                v-for="session in chosenRoutine.sessions"
                :key="session.id"
              >
                <h4 class="session__title">{{ session.title }}</h4>
                <span class="session__duration">{{ session.duration }} minutes</span>
              </div>
            </list>
          </div>

          <div class="q-my-sm">
            <chip
              class="q-mr-sm q-mt-sm"
              v-for="tag of chosenRoutine.tags"
              :key="tag"
            >
              {{ tag }}
            </chip>
          </div>
        </div>

        <div class="pick-routine__preview-actions">
          <c-btn @click="selectRoutineClicked">
            Add Activity
          </c-btn>
          <c-btn
            flat
            noHover
            text-color="dark-pink"
            @click="closeModal"
          >
            Cancel
          </c-btn>
        </div>
      </section>

    </article>
  </n-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import * as api from '@/services/api'
import List from './list'
import Routine from './routine'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  components: {
    'n-routine': Routine,
    'n-modal': () => import('@/components/dashboard/modal'),
    chip: () => import('@/components/training-routine/chip'),
    List,
    InfiniteLoading
  },

  props: {
    availableRoutines: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      firstLoad: true,
      pageIndex: 1,
      infiniteId: +new Date(),
      chosenRoutine: {
        id: 1,
        description: '',
        sessions: []
      },
      list: [],
      filterValue: '',
      category: '',
      showFilters: false,
      difficulty: [],
      categories: [
        'AIMING',
        'EDITING',
        'BUILDING',
        'FIGHTING',
        'GAMESENSE',
        'WORKSHOP',
        'BR',
        'VOD Review',
        'REST',
        'KNOWLEDGE',
        'WARM UP'
      ]
    }
  },
  mounted () {
    this.selectRoutine(this.availableRoutines[0])
    this.list = this.availableRoutines
  },
  computed: {
    ...mapGetters('user', {
      currentUser: 'currentUser'
    }),
    routinesAvailable () {
      return this.list.length
    },

    routineDuration () {
      return this.chosenRoutine?.sessions
        ?.reduce((duration, session) => duration + session.duration, 0)
    },
    infiniteList () {
      return this.list.slice(0, 10 * this.pageIndex)
    },
    addRoutineTypeformModalUrl () {
      return `https://novos.typeform.com/to/a0WyLdki#email=${this.currentUser.email}`
    }
  },

  methods: {
    clearChoosedRoutine () {
      this.chosenRoutine = {
        id: 1,
        description: '',
        sessions: []
      }
    },
    infiniteHandler ($state) {
      setTimeout(() => {
        if (this.pageIndex * 10 < this.list.length) {
          if (this.firstLoad) {
            this.firstLoad = false
            $state.loaded()
          } else {
            this.pageIndex += 1
            $state.loaded()
          }
        } else {
          $state.complete()
        }
      }, 1000)
    },
    toggleFilter () {
      this.trackAction('Click toggle show filters')
      this.showFilters = !this.showFilters
    },
    outsideClickHandler () {
      if (this.$q.screen.gt.sm) {
        this.toggleFilter()
      }
    },
    clearFilters () {
      this.difficulty = []
      this.category = ''
      this.filterValue = ''
      this.selectRoutine(this.availableRoutines[0])
      this.list = this.availableRoutines
      this.pageIndex = 1
      this.infiniteId += 1
    },
    async selectRoutine (routine, ref) {
      if (!routine) {
        return
      }

      const response = await api.getSessions(routine.defaultSessionIds)
      const sessions = response.data.sessions

      this.chosenRoutine = { ...routine, sessions }

      if (routine && this.$q.screen.lt.md) {
        setTimeout(() => {
          const el = this.$refs[ref]?.[0]?.$el
          const elTop = el?.offsetTop
          const list = document.getElementsByClassName('list__content')?.[0]
          if (el && elTop && list) {
            list.scrollTop = elTop - 300
          }
        }, 100)
      }
    },
    closeModal () {
      this.showFilters = false
      this.difficulty = []
      this.category = ''
      this.filterValue = ''
      this.trackAction('Cancel Pick Another routine')
      this.$emit('close')
    },
    selectRoutineClicked () {
      this.trackAction('Approve Pick Another routine', this.chosenRoutine)
      this.$emit('select', this.chosenRoutine)
    },
    createOwnRoutineClicked () {
      this.trackAction('Click on CREATE YOUR OWN ACTIVITIY')
      window.open(this.addRoutineTypeformModalUrl, '_blank')
    },
    searchEvent () {
      const filterValue = this.filterValue?.toLowerCase()
      const category = this.category?.toLowerCase()
      const difficulty = Array.from(this.difficulty)
      const _list = Array.from(this.availableRoutines)

      this.pageIndex = 1
      this.infiniteId += 1
      this.trackAction('Filters searchEvent', { searchValue: filterValue, category, difficulty })

      this.list = _list.filter(item => {
        let resultValue, resultCategory, resultDifficulty
        // Filter by input value
        if (filterValue && filterValue.length) {
          resultValue = (item.title && item.title.toLowerCase().includes(filterValue)) ||
            (item.skill && item.skill.toLowerCase().includes(filterValue)) ||
            (item.difficulty && item.difficulty.toLowerCase().includes(filterValue)) ||
            (item.approvedBy && item.approvedBy.toLowerCase().includes(filterValue)) ||
            (item.tags?.join(' ').toLowerCase()?.includes(filterValue))
        }
        // Filter by category
        if (category && category.length) {
          resultCategory = item.skill && item.skill.toLowerCase() === category
        }
        // Filter by difficulty
        if (difficulty && difficulty.length) {
          resultDifficulty = item.difficulty && difficulty.includes(item.difficulty.toLowerCase())
        }

        return (typeof (resultValue) === 'boolean' ? resultValue : true) &&
          (typeof (resultCategory) === 'boolean' ? resultCategory : true) &&
          (typeof (resultDifficulty) === 'boolean' ? resultDifficulty : true)
      })
    }
  },
  watch: {
    availableRoutines () {
      this.selectRoutine(this.availableRoutines[0])
      this.list = this.availableRoutines
      this.pageIndex = 1
      this.infiniteId += 1
    }
  }
}
</script>

<style lang="scss" scoped>

.search {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: $breakpoint-sm-max) {
    margin-top: 20px;
  }

  &__field {
    width: 100%;
  }
}

.pick-routine {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: auto;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  background-color: $dark;
  border-radius: 12px;
  position: relative;

  &__content {
    padding: 40px 30px 0;
    box-sizing: border-box;
    flex: 0 0 calc(100% - 300px);
    @media (max-width: $breakpoint-sm-max) {
      flex: 0 0 100%;
      width: 100%;
      box-sizing: border-box;
      padding: 20px;
    }
  }

  &__preview {
    background-color: $mid-tone;
    display: flex;
    flex-direction: column;
    flex: 0 0 300px;
  }

  &__preview-actions {
    height: 100px;
  }

  &__preview-content {
    height: calc(100% - 160px);
    padding: 0 40px;
    margin: 30px 0;
    border-radius: 0 12px 12px 0;
    overflow-y: auto;
    width: 300px;
    word-break: break-word;
  }

  /* &__preview-content {
    flex-grow: 2;
  } */

  &__preview-actions {
    height: 100px;
    padding: 0 30px 30px 30px;
  }

  &__preview-description {
    margin-top: 30px;
  }

  &__close-icon {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
  }

  &__title {
    font-size: 2.25rem;
    margin: 0;
    line-height: 110%;
    font-family: 'Rift', 'sans-serif';
    color: $gray;

    &--secondary {
      font-size: 1.5rem;
      font-family: Roboto;
    }
    @media (max-width: $breakpoint-xs-max) {
      font-size: 1.55rem;
      padding: 0 30px;
      text-align: center;
      margin: 0 auto;
    }
  }

  &__information {
    color: $gray;
    line-height: 140%;
    opacity: 0.7;
    font-size: 1rem;
    @media (max-width: $breakpoint-xs-max) {
      display: none;
    }
  }
}

.sessions-wrapper,
.routines-wrapper {
  margin-top: 15px;
  transition: all .3s ease-in-out;
}

.routines-wrapper {
  height: calc(100% - 180px);
  @media (max-width: $breakpoint-xs-max) {
    height: calc(100% - 90px);
  }
}

.routines {
  --font-family: 'Rift';
  --font-size: 1rem;

  &__aftertitle {
    color: $pink;
  }

  &__item {
    margin-bottom: 10px;
  }
}

.sessions {
  --font-size: 1rem;

  &__item {
    margin-bottom: 10px;
  }
}

.session {
  padding: 15px 20px;
  border-radius: 6px;
  background-color: $dark;
  color: $gray;

  &__title {
    font-size: 1rem;
    margin: 0 0 5px 0;
  }

  &__duration {
    opacity: 0.5;
  }
}

.routines-filters {
  overflow: hidden;
  transition: all .3s ease-in-out;
  background: $mid-tone;
  padding: 15px;
  width: 425px;
  border-radius: 8px;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 9;
  display: none;

  &--active {
    display: flex;
    box-shadow: 0 0 10px rgba(0, 0, 0, .3);
  }
  @media (max-width: $breakpoint-xs-max) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: unset;
    border-radius: 0;
    width: 100%;
    .select-list{
      margin: 0 -10px;
    }
    .like-button-select{
      width: calc( 50% - 20px);
      margin: 10px;
    }
  }

}

</style>
