export default {
  methods: {
    isVideoUrl (url) {
      return url?.match(/\.(mp4|m3u8)$/) != null
    },

    isImageUrl (url) {
      return url?.match(/\.(jpeg|jpg|gif|png|webp)$/) != null
    },

    isYoutubeUrl (url) {
      return url?.match(/^https:\/\/www.youtube.com\/embed/) != null
    },
    isKovaakUrl (url) {
      return url?.match(/\.(json)$/) != null
    }
  }
}
