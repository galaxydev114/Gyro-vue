<template>
  <div class="question-explanation">
    <slot />
    <div class="question-explanation__footer q-mt-md">
      <c-btn @click="$emit('continue')" :bold="false">
        CONTINUE
      </c-btn>
      <c-btn @click="$emit('redo')"
        :bold="false"
        outline
        class="q-mt-sm"
      >
        TRY AGAIN
      </c-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.question-explanation{
  width: 100%;
  max-height: 100%;
  height: auto;
  overflow-y: auto;
  /deep/ img{
    width: 100%;
    height: auto;
    max-height: 250px;
  }
}
</style>
