<template>
  <div class="approved-by" :class="{'approved-by--minimal': minimal}">
    <div :class="['avatar', { 'avatar--none': minimal }]" role="img">
      <img class="avatar__img" :src="avatarLink">
    </div>

    <span
      class="approved-by__text text-weight-medium"
    >
      <template v-if="!short">{{ label }} </template><a :href="profileLink" target="_blank">{{name}}</a>
    </span>
  </div>
</template>

<script>
export default {
  name: 'approved-by',

  props: {
    name: {
      type: String,
      require: true
    },
    avatarLink: {
      type: String,
      default: require('@/assets/onboarding/user.svg')
    },
    profileLink: {
      type: String
    },
    minimal: {
      type: Boolean,
      default: false
    },
    short: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'Approved by'
    }
  }
}
</script>

<style lang="scss" scoped>
.approved-by {
  display: flex;
  align-items: center;

  &--minimal{
    font-size: 12px;
  }

  &__text {
    a {
      color: $dark-pink
    }
  }

  &__text--minimal {
    color: $gray;
    opacity: 0.7;
    text-transform: uppercase;
    font-size: 0.75rem;
  }
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 5px;

  &--none {
    display: none;
  }

  &__img {
    width: 100%;
    height: 100%;
    background-size: cover;
  }

  &__item {
    margin: 0 15px;
  }
}
</style>
