<template>
  <article class="thumbnails-page">
    <section>
      <h2 class="no-margin">Upload thumbnail</h2>

      <form
        class="form form__thumbnails-page"
        enctype="multipart/form-data"
        @submit.prevent.stop="uploadFile"
      >
        <div class="form__row">
          <input type="file" name="file" ref="fileUpload" @change="handleFileChange"/>
          <q-btn :loading="loading" type="submit" color="dark-pink">Upload</q-btn>
        </div>
      </form>
    </section>

    <section>
      <h2 class="no-margin">Available thumbnails</h2>

      <ul>
        <li v-for="(thumbnail, key) in thumbnails" :key="key">
          <q-btn icon="content_copy" size="sm" flat round color="dark-pink" @click="copyLinkToClipboard(key)"/>
          <q-btn icon="preview" size="sm" flat round color="dark-pink" @click="previewImage(key)"/>
          {{thumbnail}}

          <div>
            <img class="image-preview" v-if="linkForPreview && linkForPreview.includes(key)" :src="linkForPreview" alt="thumbnail"/>
          </div>
        </li>
      </ul>
    </section>
  </article>
</template>

<script>
import { contentDataPath } from '@/constants'

export default {
  name: 'thumbnails-manager',

  props: {
    loading: {
      type: Boolean,
      default: false
    },
    thumbnails: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      fileToUpload: null,
      linkForPreview: null
    }
  },

  created () {
    this.$emit('fetch')
  },

  methods: {
    handleFileChange () {
      this.fileToUpload = this.$refs.fileUpload.files[0]
    },

    uploadFile () {
      const formData = new FormData()

      if (!this.fileToUpload) {
        this.$q.notify({
          type: 'error',
          message: 'Please, choose file first'
        })
        return
      }
      formData.append('file', this.fileToUpload)

      this.loading = true

      this.$emit('upload', formData)
    },

    copyLinkToClipboard (key) {
      const link = `${contentDataPath}/${key}`
      navigator.clipboard.writeText(link)
      this.$q.notify({ type: 'info', message: `Link was copied to clipboard: ${link}` })
    },

    previewImage (key) {
      this.linkForPreview = `${contentDataPath}/${key}`
    }
  }
}
</script>

<style scoped>
.thumbnails-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 100%;
}

.form__thumbnails-page { margin-top: 1rem; }
.form__row { margin: 1rem 0; }
.form__row:first-child { margin: 0 0 1rem 0; }
.form__row:last-child { margin: 1rem 0 0 0; }

.image-preview {
  width: 300px;
  height: auto;
}
</style>
