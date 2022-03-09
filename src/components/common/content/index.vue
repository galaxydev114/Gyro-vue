<template>
  <div class="content-part">
    <slot />
  </div>
</template>

<script>
export default {
  mounted () {
    setTimeout(() => {
      const links = this.$el.querySelectorAll('a')

      for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', (e) => {
          this.goLink(e, links[i].href)
        })
      }
    }, 300)
  },
  methods: {
    goLink (e, href) {
      e.preventDefault()
      window.open(href, '_blank')
    }
  },
  beforeDestroy () {
    const links = this.$el.querySelectorAll('a')
    for (let i = 0; i < links.length; i++) {
      links[i].removeEventListener('click', (e) => {
        this.goLink(e, links[i].href)
      })
    }
  }
}
</script>
