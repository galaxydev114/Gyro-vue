<template>
  <button :disabled="disabled" class="paypal">
    Pay with <span class="italic deep-blue">Pay</span><span class="italic blue">Pal</span>
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.paypal {
  --black: #000000d3;
  --yellow: #FFD700;
  --deep-blue: #253B80;
  --blue: #169BD7;

  width: 100%;
  max-width: 320px;
  height: 2.875rem; //46px
  border: none;
  border-radius: 6px;
  background-color: var(--yellow);
  font-weight: bold;
  font-size: 1rem;
  color: var(--black);

  .italic {
    font-style: italic;
    font-size: 1.2rem;
    font-weight: bolder;
  }
  .deep-blue {
    color: var(--deep-blue);
  }
  .blue {
    color: var(--blue);
  }
}
</style>
