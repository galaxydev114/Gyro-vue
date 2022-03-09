<template>
  <div class="col scores-container scores-container--show">
    <div class="q-mt-lg justify-center">
      <div class="row items-stretch justify-center q-my-lg">
        <div class="input-wrapper q-mt-lg" :class="{'full-width': $q.screen.lt.sm}">
          <label class="label lbl-lang">Choose a language</label>
          <q-select
            class="lbl-lang q-mt-sm text-weight-regular"
            :class="{'full-width': $q.screen.lt.sm, 'select-lang': $q.screen.gt.sm}"
            :value="selectedLangauge"
            outlined
            color="dark-pink"
            :options="options"
            @input="applySelectFilter"
            >
          </q-select>
        </div>
      </div>
    </div>
    <div class="row full-width q-mt-lg q-px-lg-lg q-px-sm-none q-pb-md q-pb-md-none text-right justify-center"
      :class="{'mt-pref-lang': $q.screen.lt.sm}">
      <div class="col-6 q-px-lg-none q-pr-sm">
        <q-btn outline
              class="q-btn-main q-px-md btn-join-fg"
              :class="{'full-width': $q.screen.lt.sm, 'btn-previous': $q.screen.gt.sm}"
              color="white"
              @click="$emit('chooseEnglish')">
          Previous
        </q-btn>
      </div>
      <div class="col-6 q-px-lg-none q-pl-sm">
        <q-btn unelevated
             class="q-btn-main q-px-md btn-join-fg"
             :class="{'full-width': $q.screen.lt.sm, 'btn-next': $q.screen.gt.sm}"
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
  data () {
    return {
      options: [
        'English', 'Spanish', 'French'
      ],
      selectedLangauge: 'English'
    }
  },
  methods: {
    applySelectFilter (value) {
      this.selectedLangauge = value
    }
  }
}
</script>
<style lang="scss">
  .mt-pref-lang {
    margin-top: calc(var(--app-height) - 470px);
  }
  .select-lang {
    width: 300px;
    max-width: 300px;
  }
</style>
