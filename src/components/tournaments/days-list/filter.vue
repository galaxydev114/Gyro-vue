<template>
  <div class="flex">
    <div class="col-12 col-md flex items-center justify-between justify-sm-start no-wrap">
      <div class="btn-group q-mr-sm-lg">
        <c-btn
          class="btn-group__item"
          :flat="typeSelected !== 'all'"
          noWidth
          size="sm"
          @click="applyTypeSelectedFilter('all')"
        >
          ALL
        </c-btn>
        <c-btn
          class="btn-group__item"
          :flat="typeSelected !== 'participating'"
          noWidth
          size="sm"
          @click="applyTypeSelectedFilter('participating')"
        >
          Participating
        </c-btn>
      </div>
      <q-select
        v-if="options && options.length"
        style="width: 150px; max-width: 40%"
        outlined
        color="dark-pink"
        :value="select"
        :options="selectOptions"
        :label-slot="!select"
        :popup-content-style="{ 'max-height':'300px' }"
        @input="applySelectFilter">
            <span slot="label">
              All
            </span>
      </q-select>
    </div>
    <div class="col-12 col-md q-pl-md-lg q-ml-auto q-mt-md q-mt-md-none">
      <q-input
        outlined
        clearable
        class="full-width"
        placeholder="Search for a tournament..."
        :value="input"
        @input="applyInputFilter"
      >
        <template v-slot:prepend>
          <img src="@/assets/icons/search.svg" alt="search icon"/>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import userGeo from '@/services/geo'

export default {
  props: {
    options: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    ...mapMutations({
      setFilterInput: 'tournaments/setFilterInput',
      setFilterTypeSelected: 'tournaments/setFilterTypeSelected',
      setFilterSelect: 'tournaments/setFilterSelect'
    }),
    trackSearch () {
      this.trackAction('Tournaments: List: Search', {
        input: this.input,
        select: this.select,
        typeSelected: this.typeSelected
      })
    },
    applyInputFilter (value) {
      this.setFilterInput(value)
      this.trackSearch()
    },
    applySelectFilter (value) {
      this.trackAction('Tournaments: List: Filter by category', { category: value })
      this.setFilterSelect(value)
      userGeo.setUserRegion(value)
      this.trackSearch()
    },
    applyTypeSelectedFilter (value) {
      this.trackAction((value === 'participating')
        ? 'Tournaments: List: Click participating tab'
        : 'Tournaments: List: Click All tab')

      this.setFilterTypeSelected(value)
      this.trackSearch()
    }
  },
  computed: {
    ...mapState({
      input: state => state.tournaments.filters.input,
      typeSelected: state => state.tournaments.filters.typeSelected,
      select: state => state.tournaments.filters.select
    }),
    selectOptions () {
      return ['All', ...this.options]
    },
    getUserRegion () {
      return userGeo.userRegion?.toUpperCase()
    }
  },
  mounted () {
    this.setFilterSelect(this.getUserRegion)
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: $breakpoint-tablet-max) {
  .col-12{
    width: 100%!important;
    flex: 0 0 100%;
    justify-content: space-between;
    margin-bottom: 16px;
  }
}
.btn-group {
  display: inline-flex;
  flex-direction: row;
  border: 1px solid $soft-tone;
  border-radius: 6px;
  padding: 4px 2px;
  width: auto;
  .btn-group__item{
    margin: 0 2px;
    height: 40px;
    /deep/ .q-btn{
      height: 100%;
      line-height: 14px;
      @media (max-width: $breakpoint-sm-max) {
        &__wrapper{
          padding: 12px 15px;
        }
      }
    }
  }
}
</style>
