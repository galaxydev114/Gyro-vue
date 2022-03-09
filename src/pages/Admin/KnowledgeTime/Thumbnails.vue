<template>
  <thumbnails-manager
    :loading="isFileUploading"
    :thumbnails="thumbnails"
    @fetch="fetchListOfThumbnails"
    @upload="uploadFile"
  />
</template>

<script>
import { getListOfKnowledgeThumbnails, uploadKnowledgeThumbnail } from '@/services/api'
import ThumbnailsManager from '@/components/admin/thumbnails-manager'

export default {
  components: { ThumbnailsManager },
  data () {
    return {
      isFileUploading: false,
      thumbnails: []
    }
  },
  methods: {
    uploadFile (formData) {
      this.isFileUploading = true
      uploadKnowledgeThumbnail(formData)
        .then(() => {
          this.$q.notify({ type: 'success', message: 'File was uploaded' })
          this.fetchListOfThumbnails()
        })
        .catch(() => {
          this.$q.notify({ type: 'danger', message: 'Failed to upload' })
        })
        .finally(() => {
          this.isFileUploading = false
        })
    },
    async fetchListOfThumbnails () {
      const response = await getListOfKnowledgeThumbnails()
      if (response.status === 200) {
        this.thumbnails = response.data.thumbnails.Contents
          .map(content => content.Key)
          .reduce((accumulator, key) => {
            const splitKey = key.split('/')
            accumulator[key] = splitKey[splitKey.length - 1]
            return accumulator
          }, {})
      }
    }
  }
}
</script>

<style scoped></style>
