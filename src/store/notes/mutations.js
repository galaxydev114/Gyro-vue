import Vue from 'vue'

export const setSavePending = (state, value) => {
  state.isSaveOverlapping = state.isSavePending && value
  state.isSavePending = value
}

export const setNoteUpdated = (state, note) => {
  Vue.set(state.notes[note.id], 'dirty', false)
}

export const setContext = (state, value) => {
  state.noteContextString = value || ''
}

// CRUD
export const addNewNote = (state, note) => {
  Vue.set(state.notes, note.id, note)
}

export const setNotes = (state, notes) => {
  state.notes = notes?.reduce((map, note) => {
    map[note.id] = note
    return map
  }, {})
}

export const updateNote = (state, note) => {
  Vue.set(state.notes, note.id, { ...note, dirty: true })
}

export const setNoteDeleted = (state, { id, val }) => {
  Vue.set(state.notes[id], 'deleted', val)
}
