<template>
  <section>
    <div class="text-h4">
      {{title}}
      <c-icon v-if="tooltipDescription" icon="question" class="q-ml-sm">
        <q-tooltip
          anchor="top middle"
          self="bottom middle"
          max-width="240px"
          content-style="background-color: #382B4B; font-size: 14px"
          :offset="[10, 10]"
          @show="$emit('tooltip-hover')"
        >
          {{tooltipDescription}}
        </q-tooltip>
      </c-icon>
    </div>

    <p class="text-gray q-my-xs">{{subtitle}}</p>

    <q-card bordered class="q-mt-md">
      <q-card-section>
        <q-img
          :src="mapImgSrc"
          width="100%"
          class="q-mb-md"
        />
        <div class="text-subtitle1 text-weight-bold">
          {{mapName}}
        </div>
      </q-card-section>
      <q-card-section
        class="bg-soft-tone flex items-center justify-between"
        @click="copyMapCodeToClipboard"
      >
        <span class="text-h5 text-weight-regular">Code: {{mapCode}}</span>
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
    subtitle: {
      type: String,
      default: 'Where to play this routine'
    },
    tooltipDescription: {
      type: String
    },
    mapImgSrc: {
      type: String,
      default: 'https://aggbwkxwqp.cloudimg.io/img.dexerto.com/_s3_/uploads/2020/10/05004041/Fortnite-Original-Map.png?w=620'
    },
    mapName: {
      type: String,
      required: true
    },
    mapCode: {
      type: String,
      required: true
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
