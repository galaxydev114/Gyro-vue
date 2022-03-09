<template>
  <article>
    <h1>Platform News</h1>

    <div>
      <h3>Content</h3>
      <html-editor
        label="Content"
        :value="content"
        @input="($event) => content = $event"
        @upload-image="handleContentImageUpload"
      />

      <h3>Mobile content</h3>
      <html-editor
        label="Content"
        :value="mobileContent || ''"
        @input="($event) => mobileContent = $event"
        @upload-image="handleMobileContentImageUpload"
      />

      <q-input
        class="q-mt-lg"
        v-model="ctaName"
        label="CTA Name"
      />

      <q-input
        class="q-mt-lg"
        v-model="backgroundColor"
        label="Background color"
      />

      <div class="row items-end">
        <c-btn
          style="width: fit-content"
          class="q-mt-lg q-mr-lg"
          outline
          @click="doPreview"
        >
          Preview
        </c-btn>

        <q-toggle
          v-model="isPreviewMobile"
        >
          Mobile ?
        </q-toggle>
      </div>

      <c-btn
        style="width: fit-content"
        class="q-mt-lg"
        :disabled="isLoading"
        @click="publish"
      >
        Publish
      </c-btn>
    </div>

    <modal-platform-news
      :is-visible="preview.isModalVisible"
      :content="preview.content"
      :cta-name="preview.ctaName"
      :background-color="preview.backgroundColor"
      @close="() => preview.isModalVisible = false"
    />
  </article>
</template>

<script>
import { createPlatformNews, hostPlatformNewsImage } from '@/services/api'
import ModalPlatformNews from 'components/common/modal/modal-platform-news/modal-platform-news'
import HtmlEditor from 'components/admin/html-editor'

export default {
  components: { HtmlEditor, ModalPlatformNews },

  data: () => {
    return {
      content: '',
      mobileContent: null,
      ctaName: 'Close',
      backgroundColor: 'dark-pink',

      isPreviewMobile: false,

      preview: {
        isModalVisible: false,
        content: '',
        backgroundColor: 'dark-pink',
        ctaName: 'Close'
      },

      isLoading: false
    }
  },

  methods: {
    async publish () {
      try {
        this.isLoading = true
        await createPlatformNews({
          content: this.content,
          mobileContent: this.mobileContent,
          ctaName: this.ctaName,
          styles: {
            backgroundColor: this.backgroundColor
          }
        })
        this.content = ''
        this.mobileContent = null
        this.$q.notify({
          color: 'positive',
          message: 'Success'
        })
      } catch (e) {
        this.$q.notify({
          color: 'negative',
          message: e?.response?.data || e.message
        })
      } finally {
        this.isLoading = false
      }
    },

    uploadImage (fileName) {
      return new Promise((resolve, reject) => {
        const newElem = document.createElement('input')
        newElem.setAttribute('type', 'file')
        newElem.setAttribute('name', 'theName')
        newElem.setAttribute('accept', 'image/*')
        newElem.click()
        newElem.onchange = async () => {
          try {
            const file = newElem.files[0]
            const res = await hostPlatformNewsImage(file, fileName || file.name)
            resolve(res.data)
          } catch (e) {
            this.$q.notify({
              type: 'negative',
              message: 'Failed to upload, please try again'
            })
            reject(e)
          }
        }
      })
    },

    async handleContentImageUpload () {
      const imgStr = await this.uploadImage()
      this.content += `<img alt="" src="${imgStr}" />`
    },

    async handleMobileContentImageUpload () {
      const imgStr = await this.uploadImage()
      this.mobileContent += `<img alt="" src="${imgStr}" />`
    },

    doPreview () {
      this.preview = {
        content: this.isPreviewMobile ? this.mobileContent : this.content,
        ctaName: this.ctaName,
        backgroundColor: this.backgroundColor,
        isModalVisible: true
      }
    }
  }
}
</script>

<style scoped>

</style>
