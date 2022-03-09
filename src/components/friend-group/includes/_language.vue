<template>
  <div class="col scores-container scores-container--show">
    <div class="text-center q-mt-lg justify-center">
      <img :src="ukFlag" class="q-my-lg" alt="UK" />
      <div class="row items-stretch justify-center q-my-lg">
        <q-btn outline
            class="q-btn-main q-px-md btn-join-fg q-my-sm q-mx-lg-md q-mx-md-sm"
            :class="{'full-width': $q.screen.lt.sm}"
            color="white"
            @click="$emit('chooseAnother')">
          Choose another language
        </q-btn>
        <q-btn unelevated
            class="q-btn-main q-px-md btn-join-fg q-my-sm q-mx-lg-md q-mx-md-sm"
            :class="{'full-width': $q.screen.lt.sm}"
            color="dark-pink"
            @click="$emit('next')">
          Yes, I speak English. It's fine
        </q-btn>
      </div>
    </div>
    <div class="row full-width q-mt-lg q-px-lg-lg q-px-sm-none q-pb-md q-pb-md-none text-right justify-center"
      :class="{'mt-lang': $q.screen.lt.sm}">
      <div class="col-6 q-px-lg-none q-pr-sm">
        <q-btn outline
              class="q-btn-main q-px-md btn-join-fg"
              :class="{'full-width': $q.screen.lt.sm, 'btn-previous': $q.screen.gt.sm}"
              color="white"
              @click="$emit('previous')">
          Previous
        </q-btn>
      </div>
      <div class="col-6 q-px-lg-none q-pr-sm">
      </div>
    </div>
  </div>
</template>

<script>
import ukFlag from '@/assets/friend-group/uk-flag.svg'

export default {
  data () {
    return {
      ukFlag
    }
  }
}
</script>

<style lang="scss">
  .mt-lang {
    margin-top: calc(var(--app-height) - 600px);
  }
</style>
