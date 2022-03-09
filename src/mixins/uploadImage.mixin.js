import * as api from '@/services/api'
export default {
  methods: {
    async uploadImage (fileName, onSaveCallback, afterSaveCallback) {
      return new Promise((resolve) => {
        const newElem = document.createElement('input')
        newElem.setAttribute('type', 'file')
        newElem.setAttribute('name', 'theName')
        newElem.setAttribute('accept', 'image/*')
        newElem.click()
        newElem.onchange = async (e) => {
          try {
            onSaveCallback()
            const file = newElem.files[0]
            const res = await api.createSessionAttachedImage(file, fileName || file.name)
            resolve(res.data)
          } catch (e) {
            this.$q.notify({
              type: 'negative',
              message: 'Failed to upload, please try again'
            })
            resolve('')
          } finally {
            afterSaveCallback()
          }
        }
      })
    }
  }
}
