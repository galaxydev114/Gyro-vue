import Hls from 'hls.js'

export default {
  bind: (el, binding) => {
    if (el.nodeName !== 'VIDEO') {
      return
    }

    const src = binding.value || el.src
    if (!src || !src.endsWith('.m3u8')) {
      el.src = src
      return
    }

    if (el.canPlayType('application/vnd.apple.mpegurl')) {
      // Some browers (safari and ie edge) support HLS natively
      el.src = src
    } else if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(el)
      el.__hls = hls
    } else {
      console.error("This is a legacy browser that doesn't support MSE")
    }
  },

  update: (el, binding) => {
    if (el.nodeName !== 'VIDEO') {
      return
    }

    if (binding.value === binding.oldValue) {
      return
    }

    const src = binding.value
    if (!src || !src.endsWith('.m3u8')) {
      el.src = src
      return
    }

    if (el.canPlayType('application/vnd.apple.mpegurl')) {
      // Some browers (safari and ie edge) support HLS natively
      el.src = src
    } else if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(el)
      // eslint-disable-next-line no-unused-expressions
      el.__hls?.destroy()
      el.__hls = hls
    } else {
      console.error("This is a legacy browser that doesn't support MSE")
    }
  },

  unbind: (el) => {
    if (el.__hls) {
      el.__hls.destroy()
    }
  }
}
