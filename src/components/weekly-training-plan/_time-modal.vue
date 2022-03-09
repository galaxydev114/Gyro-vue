<template>
  <n-modal :visible="visible"
           @close="$emit('close')">
    <div class="modal-time text-center q-pa-xs" :class="{
        'q-pa-xl': $q.screen.gt.xs,
      }">
      <slot />
      <div>
        <q-time
          flat
          :bordered="false"
          :minute-options="[ 0, 15, 30, 45 ]"
          v-model="time"
        />
      </div>
      <div class="row q-mt-xs" :class="{
        'q-col-gutter-lg': $q.screen.gt.xs,
        'q-col-gutter-md': $q.screen.lt.sm,
      }">
        <div class="col q-mt-sm-sm">
          <c-btn outline @click="$emit('close')">
            Cancel
          </c-btn>
        </div>
        <div class="col q-mt-sm-sm">
          <c-btn @click="$emit('add', time)">
            {{ confirmText }}
          </c-btn>
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
    confirmText: {
      type: String,
      default: 'Add'
    },
    defaultTime: {
      type: String,
      default: null
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  data () {
    return {
      time: null
    }
  },
  watch: {
    visible () {
      this.time = (this.defaultTime
        ? this.$dayjs.timeOfDay(this.defaultTime)
        : this.$dayjs(Date.now())
      )
        .roundMinsBlock(15)
        .format('HH:mm')
    }
  }
}
</script>

<style lang="scss">
.q-time__header{
  background: transparent;
  font-family: "rift", sans-serif;
  font-weight: bold;
}
.q-time__header-label{
  .q-time__link{
    font-size: 52px;
  }
}
.q-time__header-ampm{
  .q-time__link{
    font-size: 16px;
    color: $pink;
  }
}
.q-time__clock{
  background: #382B4B;
}
.q-time__clock-position--active{
  background: $dark-pink;
}
.q-time__clock-pointer{
  color: $dark-pink;
}
</style>
