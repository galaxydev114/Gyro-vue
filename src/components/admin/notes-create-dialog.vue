<template>
  <div class="modals" @click.self="$emit('close')">
    <div class="modals__dialog">

      <div class="mb-10 d-flex">
        <h3 style="color:black">{{title}}</h3>
        <c-icon
          class="ml-auto modals__close"
          icon="times"
          @click="$emit('close')"
        />
      </div>
      <q-editor
        v-model="content"
        :definitions="{
          upload: {
            tip: 'Upload Image',
            icon: 'image',
            handler: uploadImageToNote
          }
        }"
        min-height="10rem"
        max-height="30rem"
        :toolbar="editorToolbar"
      />
      <c-btn
        class="mt-15 w-100 py-10"
        variant="simple"
        tag="button"
        type="button"
        @click="submit"
      >
        Submit
      </c-btn>

    </div>
    <page-loader v-if="showLoader" />
  </div>
</template>

<script>
import uploadImageMixin from '@/mixins/uploadImage.mixin'
export default {
  components: {
    'page-loader': () => import('@/components/common/page-loader')
  },
  props: {
    title: {
      type: String,
      required: true
    },
    initialNote: {
      type: String
    }
  },

  created () {
    // eslint-disable-next-line eqeqeq
    if (this.initialNote != undefined) {
      this.content = this.initialNote
    }
  },
  mixins: [uploadImageMixin],

  data: () => ({
    showLoader: false,
    content: '',
    editorToolbar: [
      ['bold', 'italic', 'strike', 'underline'],
      ['unordered', 'ordered'],
      ['fullscreen', 'viewsource', 'link'],
      ['upload']
    ]
  }),

  methods: {
    submit () {
      this.$emit('submit', this.content)
    },
    async uploadImageToNote () {
      const imgStr = await this.uploadImage(null, () => { this.showLoader = true }, () => { this.showLoader = false })
      this.content = this.content + `<img src="${imgStr}" />`
    }
  }
}
</script>

<style lang="scss" scoped>
  .modals {
    max-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, .7);
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 99;

    &__close {
      cursor: pointer;
    }

    &__dialog{
      width: 1200px;
      max-width: 80%;
      padding: 20px;
      border-radius: 10px;
      background: rgba(116, 124, 152, .7);
      box-shadow: 0 0 10px #000;
    }
  }

  .grid {
    height: '600px';
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;

    &__column {
      display: grid;
      grid-template-rows: 1fr 60px;
    }
  }
</style>
