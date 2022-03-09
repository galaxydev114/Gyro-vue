<script>
import { getRoutineCategoryNormalized } from '@/util/routineHelpers'

export default {
  render () {
    return this.$scopedSlots.default({
      getIcon: this.getIcon
    })
  },

  computed: {
    icons () {
      return {
        // Friend Group Icon
        fg_beginner: require('@/assets/friend-group/beginner.svg'),
        fg_intermediate: require('@/assets/friend-group/intermediate.svg'),
        fg_advanced: require('@/assets/friend-group/advanced.svg'),
        fg_pros: require('@/assets/friend-group/pros.svg'),
        fg_lg_open: require('@/assets/friend-group/open-league.svg'),
        fg_lg_contender: require('@/assets/friend-group/contender-league.svg'),
        fg_lg_champion: require('@/assets/friend-group/champion-league.svg')
      }
    }
  },

  methods: {
    getIcon (skill) {
      const key = getRoutineCategoryNormalized(skill)
      return this.icons[key]
    }
  }
}
</script>
