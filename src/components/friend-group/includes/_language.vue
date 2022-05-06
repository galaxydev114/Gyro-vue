<template>
  <div class="col scores-container scores-container--show">
    <div class="text-center q-mt-lg justify-center">
      <img :src="ukFlag" :width="$q.screen.gt.xs? 240 : 160" class="q-my-lg" alt="UK" />
      <div class="row items-stretch justify-center q-my-lg lang-select">
        <q-btn outline
            class="q-btn-main q-px-md btn-join-fg q-my-sm q-mx-lg-md q-mx-md-sm q-mx-sm-sm no-border"
            :class="{'full-width': $q.screen.lt.sm}"
            @click="$emit('chooseAnother')">
          Choose another language
        </q-btn>
        <q-btn unelevated
            class="q-btn-main q-px-md btn-join-fg q-my-sm q-mx-lg-md q-mx-md-sm q-mx-sm-sm"
            :class="{'full-width': $q.screen.lt.sm}"
            color="dark-pink"
            @click="$emit('next')">
          Yes, I speak English. It's fine
        </q-btn>
      </div>
    </div>
    <div class="row full-width q-mt-lg q-px-lg-lg q-px-sm-none q-pb-md q-pb-md-none text-right justify-start mt-fixed-bottom">
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
    </div>
  </div>
</template>

<script>
import ukFlag from '@/assets/friend-group/uk-lang-flag.svg'

export default {
  data () {
    return {
      ukFlag
    }
  }
}
</script>

<style lang="scss">
  .lang-select .q-btn--outline .q-btn__wrapper:before {
    border: 2px solid $soft-tone;
  }
</style>
