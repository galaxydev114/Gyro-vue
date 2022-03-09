<template>
  <article>
    <h1>Mux video help</h1>

    <p>
      <a href="https://mux.com">Mux</a> is the service we're using to host our
      <br>
      in-house videos for
      a smoother experience for users.
    </p>

    <ol>
      <li><h3>How to use Mux video going forward?</h3>
        Same workflow!<br/> A video URL pasted into routines, sessions, knowledge, and workshops
        will be upgraded automatically to a Mux link on the back-end after you save.
      </li>
      <li><h3>What about existing content?</h3>
        Go to the list view. If the video in some content is ready for upgrading, you'll see this new icon
        <q-icon name="video_library" size="24px" title="Upgrade video to Mux" />
        in the Actions column.<br/> Just click it!
      </li>
      <li><h3>What is this form?</h3>
        Generate a new link or query an existing link for some in-house video in the form below.
        <ol>
          <li>Upload a video to S3, or any other place with a public link</li>
          <li>Paste into the box, Make sure the video shows up in VIDEO TEST below</li>
          <li>Press the button and you should get a link. If the status is not ready yet,
              please wait for a few minutes while Mux downloads our video and converts it.</li>
        </ol>
      </li>
    </ol>

    <q-card class="form-card">
      <q-input
        class="form-card__item"
        v-model="videoUrl"
        outlined
        placeholder="Video URL"
        @input="streamUrl = ''"
      />
      <c-btn class="form-card__item" @click="getLink">Get Mux link</c-btn>
    </q-card>

    <q-input
      class="form-card__item"
      v-model="streamUrl"
      outlined readonly
      placeholder="Mux stream URL"
    >
      <template v-slot:append>
        <q-btn round dense flat icon="content_copy"
          @click="copyUrl"
        />
      </template>
    </q-input>
    <q-input
      class="q-my-sm"
      filled readonly
      :value="videoAssetInfo"
    />
    <span class="q-my-sm text-h3">Video Test: </span>{{ testUrl }}
    <video
      controls
      width="100%"
      v-video-src="testUrl"
    />
  </article>
</template>

<script>
import * as api from '@/services/api'
import { copyToClipboard } from 'quasar'

export default {
  data: () => ({
    videoUrl: '',
    streamUrl: '',
    videoAssetInfo: null
  }),

  computed: {
    testUrl () {
      return this.streamUrl || this.videoUrl
    }
  },

  methods: {
    getLink () {
      return api.getMuxVideoLink(this.videoUrl)
        .then((res) => {
          const videoAsset = res.data?.videoAsset || {}
          this.streamUrl = videoAsset.streamUrl
          this.videoAssetInfo = `STATUS: ${videoAsset.streamStatus}`
        })
        .catch((err) => {
          this.videoAssetInfo = err.response.data
        })
    },
    copyUrl () {
      return copyToClipboard(this.streamUrl)
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Copied!'
          })
        })
        .catch(() => {
          this.$q.notify({
            type: 'negative',
            message: 'Oops! Something went wrong (('
          })
        })
    }
  }
}
</script>
