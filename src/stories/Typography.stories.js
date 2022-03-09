export default {
  title: 'Typography'
}

export const Typography = () => ({
  title: 'Typography',
  methods: {
    generateClass (i) {
      return 'text-h' + i
    }
  },
  template: `<div>
  <div class="row q-mb-lg">
    <div v-for="h in 6"
    class="col-12 q-my-md items-center flex text-weight-bold"
    :class="generateClass(h)">
    Title size is h{{ h }}
    </div>
    <div class="col-12 q-my-md items-center flex text-subtitle1">
      Title size is text-subtitle1
    </div>
    <div class="col-12 q-my-md items-center flex text-subtitle2">
      Title size is text-subtitle2
    </div>
    <div class="col-12 q-my-md items-center flex text-subtitle1 font-rift text-weight-bold">
      Title size is text-subtitle1 and font-family: Rift
    </div>
  </div>
  </div>`
})
