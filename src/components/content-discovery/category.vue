<template>
  <div
    class="category"
    @click="$emit('click', skill)"
  >
    <c-skill-icons v-slot="{ getIcon }">
      <img :src="getIcon(skill)" width="30px" height="30px"/>
    </c-skill-icons>

    <div>
      <div class="category__skill text-h5">{{skill.toLowerCase()}}</div>
      <div><small class="text-gray">{{total}} routines</small></div>
    </div>
  </div>
</template>

<script>
import SkillIcons from '@/components/common/skill-icons-manager'

export default {
  components: {
    'c-skill-icons': SkillIcons
  },

  props: {
    skill: String,
    total: String
  }
}
</script>

<style scoped lang="scss">
.category {
  width: 150px;
  height: 150px;
  border: 1.5px solid $soft-tone;
  border-radius: 6px;
  box-sizing: border-box;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  @media (max-width: $breakpoint-sm-max) {
    width: 120px;
    height: 120px;
  }
  @media (max-width: $breakpoint-410-max) {
    width: 110px;
    height: 110px;
    justify-content: center;
    img{
      margin-bottom: 10px;
    }
  }
}
.category__skill {
  text-transform: capitalize;
}
</style>
