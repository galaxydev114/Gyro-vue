<template>
  <div class="routine-category">
    <c-skill-icons v-slot="{ getIcon }">
      <img class="routine-category__icon"
           :class="{'q-mr-none': hideText , 'q-mr-sm': !hideText}"
           :src="getIcon(category)"
           :width="size"
           :height="size"/>
    </c-skill-icons>

    <span
      v-if="!hideText"
      class="routine-category__title"
      :class="{
        'routine-category__title--small': small,
        'routine-category__title--xsmall': xsmall,
        'routine-category__title--uppercase': uppercase,
        'text-weight-bold': bold
       }"
    >
      {{text}}
    </span>
  </div>
</template>

<script>
import SkillIcons from '@/components/common/skill-icons-manager'

export default {
  props: {
    category: {
      type: String,
      required: true,
      default: 'undefined'
    },
    small: {
      type: Boolean,
      default: false
    },
    xsmall: {
      type: Boolean,
      default: false
    },
    hideText: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: '28px'
    },
    uppercase: {
      type: Boolean,
      default: true
    },
    bold: {
      type: Boolean,
      default: false
    }
  },

  components: {
    'c-skill-icons': SkillIcons
  },

  computed: {
    text () {
      if (!this.category) {
        return this.category
      }

      if (this.small) {
        return this.category.charAt(0).toUpperCase() + this.category.toLocaleLowerCase().slice(1)
      }

      return this.category
    }
  }
}
</script>

<style scoped lang="scss">
.routine-category {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
}
.routine-category__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.routine-category__title {
  text-transform: capitalize;
  color: $gray;
  font-size: 0.75rem;
  line-height: 120%;
  opacity: 0.7;
  user-select: none;

  &--small {
    font-size: 1rem;
    text-transform: none;
    opacity: initial;
  }

  &--xsmall{
    font-size: 12px;
    opacity: initial;
  }

  &--uppercase{
    text-transform: uppercase;
  }
}
</style>
