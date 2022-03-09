export default {
  title: 'VideoPlayer'
}

export const VideoPlayerCheckpoints = () => ({
  title: 'Video Player with checkpoint',
  components: {
    'chekpoints-video-player': () => import('@/components/checkpoints-video-player'),
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div class="col-12">
        <chekpoints-video-player src="http://localhost:8020/b64182fa-aa84-4664-8b98-44b1772462b3" />
      </div>
    </div>
    </div>`
})

export const VideoPlayerTransparent = () => ({
  title: 'Video Player - transparent navigation(default)',
  components: {
    'video-player': () => import('@/components/video-player'),
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div class="col-12">
        <video-player src="https://tippingpoint.dev/assets/videos/runner.mp4"
                      thumbnail="https://assets.codepen.io/32795/poster.png" />
      </div>
    </div>
    </div>`
})

export const VideoPlayer = () => ({
  title: 'Video Player',
  components: {
    'video-player': () => import('@/components/video-player'),
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div class="col-12">
        <video-player src="https://tippingpoint.dev/assets/videos/runner.mp4"
                      thumbnail="https://assets.codepen.io/32795/poster.png"
                      :transparent="false" />
      </div>
    </div>
    </div>`
})
