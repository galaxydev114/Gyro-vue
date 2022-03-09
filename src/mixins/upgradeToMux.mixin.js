import * as api from '@/services/api'
export default {
  methods: {
    isValidMuxSource (videoUrl) {
      return videoUrl && !(videoUrl.match(/^https:\/\/www.youtube.com\/embed/) ||
        videoUrl.match(/^https:\/\/stream.mux.com/) ||
        videoUrl.match(/\.(jpeg|jpg|gif|png|webp)$/))
    },
    isMux (videoUrl) {
      return videoUrl?.match(/^https:\/\/stream.mux.com/)
    },
    upgradeToMux (type, content, field) {
      return api.upgradeToMux(type, content, field)
    }
  }
}
