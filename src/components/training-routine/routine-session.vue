<template>
  <div class="session" @click.stop="goNext">
    <div class="session__info">
      <span class="session__title">{{title}}</span>
    </div>

    <div class="session__meta">
      <label class="checkbox">
        <!-- <input type="checkbox" class="checkbox__custom" :checked="isDone"> -->
        <div
          class="checkbox__toggle"
          :class="{'checkbox__toggle--done': isDone}"
          @click.stop="markAsDone"
        >
          <span class="checkbox__index">{{index}}</span>
        </div>
      </label>

      <span class="session__duration">{{duration}} minutes</span>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    isDone: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    duration: {
      type: [String, Number],
      default: 'N/A'
    },
    index: {
      type: Number
    }
  },
  methods: {
    goNext () {
      if (!this.$route.params.sessionId || this.$route.params.sessionId !== this.id) {
        this.$emit('go')
      }
    },
    markAsDone () {
      this.$emit('mark-as-done', this.id)
    }
  }
}
</script>

<style scoped lang="scss">
.session {
  display: grid;
  grid-template-columns: auto 60px;
  justify-content: space-between;
  padding: 15px;
  border: 1.5px solid $soft-tone;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color .3s ease-in-out, transform .3s;
  user-select: none;
}
.session:hover {
  transform: scale(1.05);
}

.session__title {
  font-size: 1rem;
  font-weight: 700;
  color: #DFDAE7;
}
.session__duration {
  font-size: 12px;
  color: #DFDAE7;
  opacity: 50%;
  margin-top: 2px;
}
.session__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.checkbox {
  display: block;
}
.checkbox__toggle {
  width: 1.25rem;
  height: 1.25rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $soft-tone;
  border-radius: 50%;
  cursor: pointer;
  box-sizing: border-box;

  color: $dark-pink;
  border: 1.5px solid $dark-pink;
  transition: background-color .3s, border-color .3s;

  &--done {
    border-color: $dark-pink;
    background: $dark-pink url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=) center no-repeat;
    background-size: 75%;
  }
}
.checkbox__toggle--done .checkbox__index {
  visibility: hidden;
}
</style>
