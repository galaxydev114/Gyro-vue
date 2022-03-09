<template>
  <div class="col scores-container scores-container--show">
    <c-category-list :categories="categoryItemArray" :activeIndex="3"/>
    <div class="full-width q-mt-lg-xl q-px-lg-lg q-px-sm-none q-pb-md q-pb-md-none text-right justify-center">
      <q-btn unelevated
             class="q-btn-main q-px-lg btn-join-fg"
             :class="{'full-width': $q.screen.lt.sm, 'btn-next': $q.screen.gt.md}"
             color="dark-pink"
             @click="$emit('next')">
        Next
      </q-btn>
    </div>
  </div>
</template>

<script>

export default {
  components: {
    'c-category-list': () => import('./_category-list')
  },

  computed: {
    categoryItemArray () {
      return [
        {
          step: 1,
          icon: 'fg_beginner',
          class: 'beginner',
          label: 'Beginners',
          description: '200 - 450'
        },
        {
          step: 2,
          icon: 'fg_intermediate',
          class: 'intermediate',
          label: 'Intermediate',
          description: '451 - 700'
        },
        {
          step: 3,
          icon: 'fg_advanced',
          class: 'advanced',
          label: 'Advanced',
          description: '701 - 950'
        },
        {
          step: 4,
          icon: 'fg_pros',
          class: 'pros',
          label: 'Pros',
          description: '951 - 1200'
        }
      ]
    }
  }
}
</script>
