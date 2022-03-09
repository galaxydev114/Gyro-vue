<template>
  <div class="col scores-container scores-container--show">
    <div class="q-mt-lg justify-center row">
      <div class="col-12 q-mt-lg q-mb-lg-lg q-mb-sm" :class="{'text-center': $q.screen.gt.sm}">
        <label class="label lbl-lang">When do you usually play?</label>
      </div>
      <div class="row justify-center q-mb-lg">
          <div v-for="(cat, index) in availableItems" :key="cat.label" class="col-md-3 col-12 q-px-lg-md q-px-md-sm">
            <q-btn outline
              class="q-btn-main q-px-md q-my-sm full-width btn-available"
              :class="{'btn-selected': selectedAvailability.includes(index)}"
              @click="onToggleAvailable(index)">
              {{cat.label}}
            </q-btn>
          </div>
      </div>
    </div>
    <div class="row full-width q-mt-lg q-px-lg-lg q-px-sm-none q-pb-md q-pb-md-none text-right justify-center"
      :class="{'mt-available': $q.screen.lt.sm}">
      <div class="col-6 q-px-lg-none q-pr-sm">
        <q-btn outline
              class="q-btn-main q-px-md btn-join-fg"
              :class="{'full-width': $q.screen.lt.sm, 'btn-previous': $q.screen.gt.sm}"
              color="white"
              @click="$emit('previous')">
          Previous
        </q-btn>
      </div>
      <div class="col-6 q-px-lg-none q-pl-sm">
        <q-btn unelevated
             class="q-btn-main q-px-md btn-join-fg"
             :class="{'full-width': $q.screen.lt.sm, 'btn-next': $q.screen.gt.sm}"
             color="dark-pink"
             :disable="selectedAvailability.length === 0"
             @click="$emit('next')">
          Next
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    selectedAvailability: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      availableItems: [
        {
          label: 'Morning'
        },
        {
          label: 'Afternoon'
        },
        {
          label: 'Night'
        },
        {
          label: 'Dawn'
        }
      ]
    }
  },
  methods: {
    onToggleAvailable (step) {
      var index = this.selectedAvailability.indexOf(step)
      if (index !== -1) {
        this.selectedAvailability.splice(index, 1)
      } else {
        this.selectedAvailability.push(step)
      }
    }
  }
}
</script>

<style lang="scss">
  .btn-available {
    font-family: Bebas Neue;
    font-size: 20px;
  }
  .btn-selected {
    color: $dark-pink;
  }
  .mt-available {
    margin-top: calc(var(--app-height) - 740px);
  }
</style>
