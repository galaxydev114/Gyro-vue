<template>
  <div class="add-tournament">
    <c-icon icon="plusPink" width="44px" @click="$emit('click')"/>
    <div :class="`text-${$q.screen.gt.md ? 'h2' : 'h3'} font-roboto text-soft-tone q-mt-md q-mb-lg`" style="text-transform: none">
      Let's add tournaments here!
    </div>
    <c-btn flat
           dense
           noHover
           @click="$emit('click')"
           textColor="dark-pink">
      Browse for tournaments
    </c-btn>
  </div>
</template>

<style lang="scss" scoped>
.add-tournament{
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center ;
  align-items: center;
  border: 2px dashed $soft-tone;
  height: 240px;
  padding: 0 20px;
  border-radius: 6px;
}
</style>
