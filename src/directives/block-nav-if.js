export default {
  bind: (el, binding, vnode) => {
    if (!(binding.expression in vnode.context.$data)) {
      console.error('Provided expression is not bound to the component context as $data property. The directive will not work.')
      return
    }

    el.__blockNavIf_unblock = () => {
      if (el.__blockNavIf_removeRouterHook) {
        // enable navigation away from page by removing the hook
        el.__blockNavIf_removeRouterHook()
        el.__blockNavIf_removeRouterHook = null
      }
    }
    el.__blockNavIf_enabled = true
  },

  update: (el, binding, vnode) => {
    if (!el.__blockNavIf_enabled) {
      return
    }

    const { value, oldValue } = binding
    if (value === oldValue) {
      return
    }
    if (!value) {
      el.__blockNavIf_unblock()
      return
    }

    // stops navigation away from this page, reset the watched variable first
    const router = vnode.context.$router
    el.__blockNavIf_removeRouterHook = router.beforeEach((to, from, next) => {
      vnode.context.$data[binding.expression] = false
      next(false)
    })
  },

  unbind: (el) => {
    if (el.__blockNavIf_unblock) {
      el.__blockNavIf_unblock()
    }
  }
}
