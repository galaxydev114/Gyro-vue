export default {
  data () {
    return {
      storyboardMetadata: undefined
    }
  },

  methods: {
    async loadStoryboard (src) {
      // get data for fetch
      const playbackId = src.match(/stream\.mux\.com\/(\w+).m3u8/)?.[1]
      const storyboardUrl = playbackId && `https://image.mux.com/${playbackId}/storyboard.json`
      if (!storyboardUrl) {
        return
      }

      const storyboardMetadata = await fetch(storyboardUrl)
        .catch(() => {})
        .then(res => res?.ok && res.json())
      if (!storyboardMetadata) {
        return
      }

      this.storyboardMetadata = storyboardMetadata

      // fetch metadata images
      try {
        const response = await fetch(this.storyboardMetadata.url)
        const data = await response.blob()
        const metadata = {
          type: 'image/jpeg'
        }
        const file = new File([data], 'videoThumbnails.jpg', metadata)
        // convert image to base64
        const toBase64 = file => new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result)
          reader.onerror = error => reject(error)
        })
        this.storyboardMetadata.url = await toBase64(file)
      } catch (e) {
      }
    }
  }
}
