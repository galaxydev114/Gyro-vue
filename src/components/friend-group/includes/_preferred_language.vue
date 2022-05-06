<template>
  <div class="col scores-container scores-container--show">
    <div class="q-mt-lg justify-center">
      <div class="row items-stretch justify-center q-my-lg">
        <div class="input-wrapper q-mt-lg" :class="{'full-width': $q.screen.lt.sm}">
          <span class="label lbl-lang">Choose a language</span>
          <q-select
            class="lbl-lang q-mt-sm text-weight-regular"
            :class="{'full-width': $q.screen.lt.sm, 'select-lang': $q.screen.gt.xs}"
            :value="selectedLanguage"
            outlined
            color="dark-pink"
            :options="languages"
            @input="applySelectFilter"
            >
          </q-select>
        </div>
      </div>
    </div>
    <div class="row full-width q-mt-lg q-px-lg-lg q-px-sm-none q-pb-md q-pb-md-none text-right justify-center mt-fixed-bottom">
      <div class="col-6 q-px-lg-none q-pr-sm">
        <c-btn outline
              class="btn-join-fg"
              :bold="false"
              :class="{'full-width': $q.screen.lt.sm, 'btn-previous': $q.screen.gt.xs}"
              color="light-pink"
              @click="$emit('previous')">
          Previous
        </c-btn>
      </div>
      <div class="col-6 q-px-lg-none q-pl-sm">
        <q-btn unelevated
             class="q-btn-main q-px-md btn-join-fg"
             :class="{'full-width': $q.screen.lt.sm, 'btn-next': $q.screen.gt.xs}"
             color="dark-pink"
             @click="$emit('next')">
          Next
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    languages: {
      type: Array,
      default: () => []
    },
    selectedLanguage: {
      type: String,
      default: null
    }
  },
  methods: {
    applySelectFilter (value) {
      this.$emit('selected', value)
    }
  }
}
</script>
<style lang="scss">
  .select-lang {
    width: 300px;
    max-width: 300px;
  }
</style>
