<template>
  <n-modal :visible="visible" @close="$emit('close')" size="xl" showHeader showClose>
    <div class="modal-congrats text-center">
      <div class="text-h1" style="text-transform: unset">
        Congratulations for completing<br>
        <span class="text-pink">
          {{ data && data.title }}
        </span>
      </div>

      <div class="q-pb-sm q-pt-lg q-mt-lg border-top" >
        <div class="text-h4 text-center q-mb-md">
          How was the level of the series?
        </div>
        <div class="q-gutter-md">
          <q-radio class="like-button-select text-uppercase font-rift" v-model="difficulty" val="easy" label="Easy" />
          <q-radio class="like-button-select text-uppercase font-rift" v-model="difficulty" val="just_right" label="Just right" />
          <q-radio class="like-button-select text-uppercase font-rift" v-model="difficulty" val="hard" label="Hard"/>
        </div>
      </div>
      <div class="q-pb-xl q-pt-lg q-mt-lg border-top" >
        <div class="text-h4 text-center q-mb-md">
          Rate the series
        </div>
        <div class="row items-center justify-center">
          <div v-for="i in 5"
               :key="i"
               :class="{'selected': i <= selected}"
               @click="selected = i"
               class="q-mx-xs rate-star cursor-pointer">
            <c-icon icon="starFillPink" class="float-left" width="40px"></c-icon>
          </div>
        </div>
      </div>

      <div class="d-flex items-center justify-center">
        <c-btn
          :bold="false"
          :disabled="!difficulty && !selected"
          @click="submitRate"
        >
          {{ctaTitle}}
        </c-btn>
      </div>
    </div>
  </n-modal>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default: () => {}
    },
    ctaTitle: {
      type: String,
      default: 'Back to training'
    }
  },
  data () {
    return {
      difficulty: null,
      selected: 0
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  methods: {
    submitRate () {
      this.$emit('rate', {
        difficulty: this.difficulty,
        stars: this.selected
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.text-h4 {
  font-size: 24px;
}
.modal-congrats{
  padding: 30px;

  .like-button-select{
    padding: 10px 10px;
    width: 100px;
    text-align: center;
    justify-content: center;
    /deep/ .q-radio__label{
      font-size: 20px;
    }
  }
  .border-top{
    border-top: 1px solid $soft-tone;
  }

  .rate-star{
    filter: brightness(0) invert(1);
    opacity: .3;
    &.selected{
      opacity: 1;
      filter: unset;
    }
  }

  @media (max-width: $breakpoint-565-max) {
    padding: 15px;
    .text-h1{
      font-size: 32px;
    }
    .text-h2{
      font-size: 24px;
    }
  }
}
</style>
