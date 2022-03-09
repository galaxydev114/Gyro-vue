<template>
  <n-modal :visible="getHasError" @close="$emit('close')">
    <div class="modal-oops text-center">
      <img src="@/assets/onboarding/info-icon.svg"
           class="q-mt-md"
           height="160" width="160" />
      <div class="text-h2" style="margin-top: -40px">
        Something went wrong
      </div>
      <div class="text-h5 text-weight-regular q-mt-sm opacity-5">
        To avoid this in the future, please
      </div>
      <a href="" class="text-h5 text-dark-pink text-weight-bold">
        report a bug
      </a>
      <div class="modal-oops__footer">
        <c-btn class="q-mt-xs text-uppercase" @click="goToPlan">
          Go to your training plan
        </c-btn>
      </div>
    </div>
  </n-modal>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  methods: {
    ...mapMutations({
      setHasError: 'common/setHasError'
    }),
    goToPlan () {
      this.setHasError(false)
      this.$router.push('/training-plan')
    }
  },
  computed: {
    ...mapGetters({
      getHasError: 'common/getHasError'
    })
  }
}
</script>

<style lang="scss">
.modal-oops{
  &__footer{
    padding: 170px 40px 40px;
    width: 100%;
    background: url("./../../../assets/oops.png") center bottom no-repeat;
  }
}
</style>
