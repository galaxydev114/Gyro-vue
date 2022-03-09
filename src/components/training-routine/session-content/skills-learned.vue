<template>
  <section class="q-mt-xl">
    <div class="text-h4">Skills learned</div>

    <div class="skills-list q-mt-md">
      <q-card
        bordered
        class="q-mb-md"
        v-for="skill of skills"
        :key="skill"
      >
        <q-card-section
          class="items-center flex border"
          :class="`border--${skill.toLowerCase()}`"
        >
          <routine-category :category="skill" size="24px" hideText />
          <span class="text-weight-bold text-h5 q-px-md">
            {{ skill }}
          </span>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    skills: {
      type: Array,
      default: () => []
    }
  },
  components: {
    'routine-category': () => import('@/components/common/activity-category')
  }
}
</script>

<style scoped lang="scss">
.skills-list{
  .border{
    border-left: 5px;
    border-left-style: solid;

    &--aiming{
      border-left-color: $yellow;
    }
    &--building{
      border-left-color: $purple
    }
    &--editing{
      border-left-color: $dark-pink
    }
  }
}
</style>
