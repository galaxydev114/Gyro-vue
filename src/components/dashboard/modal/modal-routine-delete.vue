<template>
  <n-modal :visible="visible">
    <div class="routine__m text-center">
      <div class="routine__mcontent">
        <div class="text-h3 text-weight-bold">
          Are you sure you want to delete this routine?
        </div>
        <div class="row d-flex items-center justify-between">
          <template v-if="spinner">
            <div class="col-12 text-center q-mt-lg">
              <q-circular-progress
                indeterminate
                size="30px"
                color="dark-pink"
                track-color="mid-tone">
              </q-circular-progress>
            </div>
          </template>
          <template v-else>
            <c-btn class="col-12 col-sm q-mx-sm-md q-mt-md" outline @click="$emit('close')">
              Cancel
            </c-btn>
            <c-btn class="col-12 col-sm q-mx-sm-md q-mt-md" @click="$emit('delete')">
              Delete
            </c-btn>
          </template>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    spinner: {
      type: Boolean,
      default: true
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  data () {
    return {
      deleteOpt: '',
      deleteOptions: [
        {
          label: 'The whole routine',
          value: true
        },
        {
          label: 'Just this day',
          value: false
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.routine{
  &__mmodal{
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  &__mcontent{
    padding: 30px;
  }
  &__mfooter{
    background: $dark-one;
    padding: 5px 10px;
    font-size: 14px;
    .n-btn{
      display: inline-block;
      .q-btn{
        font-family: 'Roboto', '-apple-system', 'Helvetica Neue', Helvetica, Arial, sans-serif!important;
        text-transform: lowercase;
        font-weight: 400;
        line-height: inherit;
        font-size: 14px;
      }
    }
  }
}
</style>
