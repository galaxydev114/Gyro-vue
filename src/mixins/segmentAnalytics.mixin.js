import { sendSegmentEvent } from '@/services/segment'

export default {
  methods: {
    trackAction (event, opts = {}) {
      if (this.externalTrackAction) {
        this.externalTrackAction(event, opts)
      } else {
        sendSegmentEvent(event, opts)
      }
    }
  }
}
