export default {
  title: 'Buttons'
}

export const Button = () => ({
  title: 'pink',
  components: {
    'c-btn': () => import('@/components/common/button')
  },
  template: `<div>
  <div class="row q-mb-lg">
    <div class="col">
      <c-btn size="lg">Button</c-btn>
    </div>
    <div class="col q-px-xl">
      <c-btn>Button</c-btn>
    </div>
    <div class="col">
      <c-btn size="sm">Button</c-btn>
    </div>
  </div>
  <div class="row q-mb-lg">
    <div class="col">
      <c-btn bold size="lg">Bold</c-btn>
    </div>
    <div class="col q-px-xl">
      <c-btn bold>Bold</c-btn>
    </div>
    <div class="col">
      <c-btn bold size="sm">Bold</c-btn>
    </div>
  </div>

  <div class="row q-mb-lg">
    <div class="col">
      <c-btn bold size="lg" disabled>Disabled</c-btn>
    </div>
    <div class="col q-px-xl">
      <c-btn bold disabled>Disabled</c-btn>
    </div>
    <div class="col">
      <c-btn bold size="sm" disabled>Disabled</c-btn>
    </div>
  </div>

  <div class="row q-mb-lg">
    <div class="col">
      <c-btn flat size="lg">Flat</c-btn>
    </div>
    <div class="col q-px-xl">
      <c-btn flat>Flat</c-btn>
    </div>
    <div class="col">
      <c-btn flat size="sm">Flat</c-btn>
    </div>
  </div>

  <div class="row q-mb-lg">
    <div class="col">
      <c-btn outline size="lg">Outline</c-btn>
    </div>
    <div class="col q-px-xl">
      <c-btn outline>Outline</c-btn>
    </div>
    <div class="col">
      <c-btn outline size="sm">Outline</c-btn>
    </div>
  </div>

  <div class="row q-mb-lg">
    <div class="col">
      <c-btn outline dashed size="lg">dashed</c-btn>
    </div>
    <div class="col q-px-xl">
      <c-btn outline dashed>dashed</c-btn>
    </div>
    <div class="col">
      <c-btn outline dashed size="sm">dashed</c-btn>
    </div>
  </div>

  <div class="row q-mb-lg">
    <div class="col">
      <c-btn outline noHover size="lg">no Hover</c-btn>
    </div>
    <div class="col q-px-xl">
      <c-btn outline noHover>no Hover</c-btn>
    </div>
    <div class="col">
      <c-btn outline noHover size="sm">no Hover</c-btn>
    </div>
  </div>
  </div>`
})
