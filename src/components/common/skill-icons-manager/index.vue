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
        aiming: require('@/assets/category-icons/aiming.svg'),
        editing: require('@/assets/category-icons/editing.svg'),
        building: require('@/assets/category-icons/building.svg'),
        mixed: require('@/assets/category-icons/mixed.svg'),
        fighting: require('@/assets/category-icons/fighting.svg'),
        gamesense: require('@/assets/category-icons/gamesense.svg'),
        br: require('@/assets/category-icons/br.svg'),
        vod_review: require('@/assets/category-icons/vod_review.svg'),
        rest: require('@/assets/category-icons/rest.svg'),
        knowledge: require('@/assets/category-icons/knowledge.svg'),
        routine: require('@/assets/category-icons/routine.svg'),
        stretches: require('@/assets/category-icons/stretches.svg'),
        arena: require('@/assets/category-icons/arena.svg'),
        box_fighting: require('@/assets/category-icons/box_fighting.svg'),
        gameplay: require('@/assets/category-icons/br.svg'),
        // TODO - mechanics is client-side name for building + editing + mechanical skill on server side
        mechanical: require('@/assets/category-icons/mechanics.svg'),
        mechanics: require('@/assets/category-icons/mechanics.svg'),
        mental: require('@/assets/category-icons/mental.svg'),
        mentality: require('@/assets/category-icons/mental.svg'),
        gamesense_workshop: require('@/assets/icons/puzzle-piece.svg'),
        workshop: require('@/assets/icons/puzzle-piece.svg'),
        tournament: require('@/assets/icons/trophy.svg'),
        warm_up: require('@/assets/icons/warm-up.svg')
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
