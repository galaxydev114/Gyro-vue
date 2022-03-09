<template>
  <section :class="{'q-mt-xl': paddingTop && showHeader}">
    <template v-if="showHeader">
      <div class="text-h4 text-gray">
        Credits
      </div>
      <p class="text-gray q-my-xs paragraph-small opacity-75">
        Support this routine creators with Fortnite's creator code.
      </p>
    </template>
    <q-card :bordered="!minimal"
            :flat="minimal"
            :class="{'q-mt-md': showHeader}" v-for="(credit, i) of credits" :key="i">
      <q-card-section :class="{
        'q-pa-none': minimal,
        'q-pb-sm': minimal
      }">
        <slot>
          <div class="flex items-center justify-between text-h5 q-py-sm">
            <div class="text-weight-regular">
              {{credit.title}}
            </div>
            <a v-if="credit && credit.url" :href="credit.url" target="_blank">{{credit.value}}</a>
            <div v-else>
              {{credit.value}}
            </div>
          </div>
        </slot>
      </q-card-section>
      <q-card-section v-if="credit.code"
                      class="bg-soft-tone flex items-center justify-between"
                      :class="{'q-pa-sm': minimal }"
                      @click="copy(credit.code)">
        <span :class="`${ minimal ? 'text-subtitle2' : 'text-h5'} text-weight-regular`">Code: {{credit.code}}</span>
        <q-icon name="content_copy"
                color="dark-pink"
                size="20px"
                class="cursor-clickable">
          <q-tooltip anchor="top left"
                     self="bottom middle"
                     max-width="240px"
                     content-style="background-color: #382B4B; font-size: 14px"
                    @hide="copied = false"
                     :offset="[10, 10]">
            {{ label }}
          </q-tooltip>
        </q-icon>
      </q-card-section>
    </q-card>
  </section>
</template>

<script>

export default {
  name: 'n-credits',
  props: {
    paddingTop: {
      type: Boolean,
      default: true
    },
    credits: {
      type: [Object, Array]
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    minimal: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      copied: false
    }
  },
  methods: {
    copy (code) {
      this.copied = true
      this.$emit('copy', code)
    }
  },
  computed: {
    label () {
      return this.copied ? 'Copied!' : 'Copy to clipboard'
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  color: $dark-pink
}
</style>
