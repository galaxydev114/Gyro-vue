<template>
  <div class="col scores-container scores-container--show">
    <div class="q-mt-lg justify-center row">
      <div class="col-12 q-mt-lg q-mb-lg-lg q-mb-sm" :class="{'text-center': $q.screen.gt.xs}">
        <span class="label lbl-lang">When do you usually play?</span>
      </div>
      <div class="row justify-center q-mb-lg">
          <div v-for="cat of availableItems" :key="cat.label" class="col-md-3 col-sm-3 col-12 q-px-lg-md q-px-md-sm q-px-sm-sm">
            <q-btn outline
              class="btn-join-fg q-px-md q-my-sm full-width btn-available"
              :class="{'btn-selected': selectedAvailability.includes(cat.label.toLowerCase())}"
              @click="onToggleAvailable(cat.label.toLowerCase())">
              {{cat.label}}
            </q-btn>
          </div>
      </div>
    </div>
    <div class="row full-width q-mt-lg q-px-lg-lg q-px-sm-none q-pb-md q-pb-md-none text-right justify-center mt-fixed-bottom">
      <div class="col-6 q-px-lg-none q-pr-sm">
        <c-btn outline
              class="btn-join-fg"
              :class="{'full-width': $q.screen.lt.sm, 'btn-previous': $q.screen.gt.xs}"
              color="light-pink"
              :bold="false"
              @click="$emit('previous')">
          Previous
        </c-btn>
      </div>
      <div class="col-6 q-px-lg-none q-pl-sm">
        <q-btn unelevated
             class="q-btn-main q-px-md btn-join-fg"
             :class="{'full-width': $q.screen.lt.sm, 'btn-next': $q.screen.gt.xs}"
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
    onToggleAvailable (availability) {
      if (this.selectedAvailability.includes(availability)) {
        this.$emit('selected', this.selectedAvailability.filter(el => el !== availability))
      } else {
        this.$emit('selected', [...this.selectedAvailability, availability])
      }
    }
  }
}
</script>

<style lang="scss">
  .btn-available {
    font-family: 'Bebas Neue';
    font-size: 20px;
    font-weight: 400;
    .q-btn__wrapper:before {
      border: 2px solid $soft-tone;
    }
  }
  .btn-selected {
    color: $dark-pink !important;
    .q-btn__wrapper:before {
      border: 1px solid $dark-pink;
    }
  }
</style>
