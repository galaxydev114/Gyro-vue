<template>
  <div v-if="isKovaakUrl(src)">
    <div class="text-h4">
      KovaaK's playlist
      <a href='https://youtu.be/FVAZ-xFqou4' target="_blank" rel="noopener noreferrer" class="text-dark-pink text-underline text-weight-bold">
      <c-icon icon="question" class="q-ml-sm">
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
      This routine uses a KovaaK's playlist
    </p>
    <q-card bordered class="q-mt-md">
      <q-card-section>
        <div class="flex items-center justify-between q-py-sm">
          <div class="text-h5 text-weight-bold">
            {{name}}
          </div>
          <div>
            <q-icon name="save_alt" color="dark-pink" size="20px" style="cursor: pointer" @click="downloadPlaylist"/>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
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
