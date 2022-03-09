<template>
  <section>
    <q-card :bordered="!minimal" :flat="minimal">
      <q-card-section :class="{
        'q-pa-none': minimal,
        'q-pb-sm': minimal
      }">
        <div class="text-h5 text-gray">
          {{ title }}
        </div>
        <p class="text-gray q-my-xs opacity-75">
          {{ mapName }}
        </p>
      </q-card-section>
      <q-card-section
        class="bg-soft-tone flex items-center justify-between q-py-sm"
        :class="{'q-pa-sm': minimal }"
        @click="copyMapCodeToClipboard"
      >
        <span :class="`${ minimal ? 'text-subtitle2' : 'text-h5'} text-weight-regular`">Code: {{mapCode}}</span>
        <q-icon name="content_copy"
                color="dark-pink"
                size="20px"
                class="cursor-clickable">
          <q-tooltip anchor="top left"
                     self="bottom middle"
                     max-width="240px"
                     content-style="background-color: #382B4B; font-size: 14px"
                     @hide="copied = false"
                     :offset="[10, 10]">
            {{ label }}
          </q-tooltip>
        </q-icon>
      </q-card-section>
    </q-card>
  </section>
</template>

<script>
import { copyToClipboard } from 'quasar'
export default {
  props: {
    title: {
      type: String,
      default: 'Creative Map'
    },
    tooltipDescription: {
      type: String
    },
    mapName: {
      type: String,
      required: true
    },
    mapCode: {
      type: String,
      required: true
    },
    minimal: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      copied: false
    }
  },
  computed: {
    label () {
      return this.copied ? 'Copied!' : 'Copy to clipboard'
    }
  },

  methods: {
    async copyMapCodeToClipboard () {
      this.copied = true
      try {
        await copyToClipboard(this.mapCode)
        this.$emit('copy')

        this.$q.notify({
          type: 'positive',
          message: 'Copied!'
        })
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Oops! Something went wrong (('
        })
      }
    }
  }
}
</script>

<style>
</style>
