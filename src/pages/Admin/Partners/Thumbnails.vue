<template>
  <thumbnails-manager
    :loading="isFileUploading"
    :thumbnails="thumbnails"
    @upload="uploadPartnersThumbnail"
    @fetch="fetchListOfThumbnails"
  />
</template>

<script>
import ThumbnailsManager from 'components/admin/thumbnails-manager'
import { getListOfPartnersThumbnails, uploadPartnerThumbnail } from '@/services/api'

export default {
  name: 'Thumbnails',
  components: { ThumbnailsManager },
  data: () => ({
    isFileUploading: false,
    thumbnails: []
  }),
  methods: {
    uploadPartnersThumbnail (formData) {
      this.isFileUploading = true
      uploadPartnerThumbnail(formData)
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
      const response = await getListOfPartnersThumbnails()
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

<style scoped>

</style>
