import { sendSegmentEvent } from '@/services/segment'

export default {
  methods: {
    trackAction (event, opts = {}) {
      sendSegmentEvent(event, opts)
    }
  }
}
