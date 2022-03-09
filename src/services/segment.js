import Segment from '@dansmaculotte/vue-segment'
import Vue from 'vue'

function initSegment ({ router, Vue }) {
  Vue.use(Segment, {
    writeKey: process.env.SEGMENT_API,
    disabled: false,
    router
  })
}

function sendSegmentEvent (eventType, eventProperties) {
  Vue.prototype.$segment.track(eventType, eventProperties)
}

function segmentIdentify (userId, trait) {
  Vue.prototype.$segment.identify(userId, trait)
}

export { initSegment, sendSegmentEvent, segmentIdentify }
