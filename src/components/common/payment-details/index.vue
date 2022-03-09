<template>
  <div class="payment-details">
    <div class="payment-details__info column">
      <div class="font-roboto q-mb-xs text-weight-regular">
        {{ name }}
      </div>
      <div class="row text-weight-medium" style="font-size: 12px">
        <div class="text-gray opacity-5">
          {{ getDate }}
        </div>
        <div class="divider"></div>
        <div v-html="getStatus"></div>
      </div>
    </div>
    <div class="payment-details__action" @click="download()">
      <c-icon icon="download" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      require: true
    },
    date: {
      type: String,
      require: true
    },
    status: {
      type: String,
      require: true
    }
  },
  computed: {
    getDate () {
      return this.$date(this.date).format('MMMM DD, YYYY')
    },
    getStatus () {
      switch (this.status) {
        case 'pending':
          return '<span class="text-blue">Pending</span>'
        case 'canceled':
          return '<span class="text-dark-pink">Canceled</span>'
        case 'completed':
          return '<span class="text-green">Completed</span>'
        default:
          return '-'
      }
    }
  },
  methods: {
    download () {}
  }
}
</script>

<style lang="scss" scoped>
.payment-details{
  width: 100%;
  padding: 14px 20px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid $mid-tone;
  height: 72px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .divider{
    height: 16px;
    width: 2px;
    background: $mid-tone;
    margin: 0 15px;
  }
  &__action{
    cursor: pointer;
    transition: all .3s ease-in-out;
    &:hover{
      transform: scale(1.1);
    }
  }
}
</style>
