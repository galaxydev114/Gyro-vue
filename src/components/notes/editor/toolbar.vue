<template>
  <div>
    <q-btn-dropdown flat
      menu-anchor="bottom left"
      menu-self="top left"
      class="editor-menu__dropdown q-py-sm"
      content-style="z-index: 999999"
    >
      <q-list class="o-heading-list">
        <q-item v-for="(item, index) in dropdownOptions" :key="index"
                :class="{ 'is-active': item.isActive(isActive) }"
                @click.native.stop="item.onSelect(commands)()"
                clickable v-close-popup
        >
          <q-item-section>{{item.label}}</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <button
      class="menububble__button"
      :class="{ 'is-active': isActive.bold() }"
      @click="commands.bold"
    >
      <q-icon name="format_bold" />
    </button>

    <button
      class="menububble__button"
      :class="{ 'is-active': isActive.italic() }"
      @click="commands.italic"
    >
      <q-icon name="format_italic" />
    </button>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.editor-menu {
  &__dropdown {
    /deep/ .q-btn__wrapper {
      padding: 0;
      line-height: 12px;
    }
  }
}
</style>