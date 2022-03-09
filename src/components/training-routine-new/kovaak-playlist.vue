<template>
  <q-card :bordered="!minimal" :flat="minimal">
    <q-card-section :class="{
        'q-pa-none': minimal,
        'q-pb-sm': minimal
      }">
      <div class="text-h5 flex items-center text-gray">
        KovaaK's playlist
        <a href='https://youtu.be/FVAZ-xFqou4'
           target="_blank"
           rel="noopener noreferrer"
           class="text-dark-pink text-underline text-weight-bold">
          <c-icon icon="question" class="q-ml-sm float-left" width="18px">
            <q-tooltip anchor="top middle"
                       self="bottom middle"
                       max-width="240px"
                       content-style="background-color: #382B4B; font-size: 14px"
                       :offset="[10, 10]"
                       @show="$emit('tooltip-hover')">
              Click to learn how to import a KovaaK's playlist
            </q-tooltip>
          </c-icon>
        </a>
      </div>
      <p class="text-gray q-my-xs">
        This routine uses KovaaK's playlist
      </p>
    </q-card-section>
    <q-card-section class="bg-soft-tone flex items-center justify-between q-py-sm"
                    :class="{'q-pa-sm': minimal }">
      <span :class="`${ minimal ? 'text-subtitle2' : 'text-h5'} text-weight-regular`">
        {{name}}
      </span>
      <c-icon icon="download" class="cursor-pointer" @click="downloadPlaylist">
        <q-tooltip anchor="top left"
                   self="bottom middle"
                   max-width="240px"
                   content-style="background-color: #382B4B; font-size: 14px"
                   :offset="[10, 10]">
          Download
        </q-tooltip>
      </c-icon>
    </q-card-section>
  </q-card>
</template>

<script>
import axios from 'axios'
import urlTypes from '@/mixins/urlType.mixins'
export default {
  props: {
    name: {
      type: String,
      require: true
    },
    src: {
      type: String,
      require: true
    },
    minimal: {
      type: Boolean,
      default: false
    }
  },
  mixins: [
    urlTypes
  ],
  methods: {
    downloadPlaylist () {
      axios.get(this.src, { responseType: 'blob' })
        .then(response => {
          const blob = new Blob([response.data], { type: 'application/json' })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = this.name
          link.click()
          URL.revokeObjectURL(link.href)
          this.$emit('click')
        })
    }
  }
}
</script>
