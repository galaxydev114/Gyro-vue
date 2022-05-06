<template>
  <n-modal :visible="visible"
           showClose
           size="custom"
           width="680px"
           @close="$emit('close')">
    <div class="text-center group-modal">
      <div class="text-h1">
        We’ve sent you a direct<br/>
        message to your discord
      </div>
      <div class="text-h5 text-weight-regular q-mt-md">
        <span class="opacity-5 q-mr-xs">Check your Discord DMs to answer the invite or</span><a href="#3" class="text-dark-pink">click here</a>
      </div>
      <div class="discord-block q-mt-xl">
        <q-img src="@/assets/group-preferences/discord-block.png" />
        <div class="click-that">
          <img src="@/assets/group-preferences/click-that.png" width="120" />
        </div>
      </div>
      <div class="row q-col-gutter-lg justify-center q-mt-xl">
        <div class="col-6">
          <c-btn @click="$emit('done')">
            Done
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
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  }
}
</script>

<style lang="scss">
.group-modal{
  background: url("./../../../assets/group-preferences/bg.png") repeat-x top;
  background-size: auto 120px;
  padding: 40px 72px;

  .discord-block{
    position: relative;
    .click-that{
      position: absolute;
      top: 110%;
      right: -8%;
    }
  }

  @media screen and (max-width: $breakpoint-mobile-max) {
    padding: 30px;
    .text-h1{
      font-size: 32px;
    }
    .discord-block{
      margin: 30px 0;
    }
    .click-that{
      img{
        width: 80px;
      }
    }
  }
}
</style>
