<template>
  <approved-by
    :name="coach.name"
    :avatar-link="coach.avatarLink"
    :profile-link="coach.profileLink"
    :minimal="minimal"
    :short="short"
    :label="label"
  />
</template>

<script>
import { mapState } from 'vuex'
import _approvedBy from './_approved-by'

export default {
  components: {
    'approved-by': _approvedBy
  },

  props: {
    author: {
      type: String,
      required: true
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
  },

  computed: {
    ...mapState({
      coach: function (state) {
        if (!this.author) { return this.unknownCoach }
        return state.coaches.coaches[this.author.toLowerCase()] || this.unknownCoach
      }
    }),

    unknownCoach () {
      return {
        name: this.author,
        avatarLink: require('@/assets/onboarding/user.svg'),
        profileLink: undefined
      }
    }
  }
}
</script>
