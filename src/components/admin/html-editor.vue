<template>
  <q-editor
    :label="label"
    :value="value"
    :toolbar="toolbar"
    :definitions="{
      upload: {
        tip: 'Upload Image',
        icon: 'image',
        handler: handleImageUpload
      }
    }"
    toolbar-color="dark-pink"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'html-editor',

  props: {
    label: String,
    value: String
  },

  data: () => ({
    toolbar: [
      ['bold', 'italic', 'strike', 'underline'],
      ['unordered', 'ordered'],
      ['fullscreen', 'viewsource', 'link'],
      ['upload']
    ]
  }),

  methods: {
    handleImageUpload () {
      this.$emit('upload-image')
    }
  }
}
</script>

<style scoped>

</style>
