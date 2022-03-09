import * as api from '@/services/api'
import htmlToPlaintext from '@/util/htmlToPlaintext'
import { debounce } from 'quasar'

export const searchNotes = ({ getters }, query) => {
  const {
    q: queryString,
    verbatim = false,
    searchTitle = true,
    searchContent = true
  } = query

  function searchInText (text) {
    if (verbatim && typeof queryString === 'string') {
      const result = text.indexOf(queryString)
      if (result >= 0) {
        return { index: result, length: queryString.length }
      }
    } else {
      const keywords = typeof queryString === 'string' ? queryString.split(' ') : queryString
      const result = text.match(new RegExp(keywords.join('|'), 'i'))
      if (result !== null) {
        return { index: result.index, length: result[0].length }
      }
    }

    // not found
    return { index: -1, length: 0 }
  }

  const results = []

  getters.notes.forEach(note => {
    let found = false
    const executeSearch = (text, key) => {
      if (found || !text) return
      const res = searchInText(text)
      if (res.index >= 0) {
        results.push({
          ...note,
          matchIndex: res.index,
          matchLength: res.length,
          matchKey: key
        })
        found = true
      }
    }

    if (!found && searchTitle) {
      executeSearch(note.title, 'title')
    }
    if (!found && searchContent) {
      // To avoid searching in xml tags in richtext notes, parse it and reduce to plaintext first
      const plainContent = htmlToPlaintext(note.description)
      executeSearch(plainContent, 'description')
    }
  })

  return results
}

// CRUD
export const createNote = async ({ commit, rootGetters }, noteData) => {
  const response = await api.createUserNote({
    ...noteData,
    userId: rootGetters['user/currentUser'].id
  })
    .catch(api.handleError)

  const note = response.data?.note
  if (note) {
    commit('addNewNote', note)
    return note
  }
}

export const getNotes = async ({ commit, rootGetters }) => {
  const response = await api.getUserNotes(rootGetters['user/currentUser'].id)
    .catch(api.handleError)

  if (response.status === 200) {
    commit('setNotes', response.data.notes)
  }
}

export const updateNote = async ({ dispatch, commit, state }, noteData) => {
  commit('setSavePending', true)

  // update store from component data
  commit('updateNote', noteData)

  try {
    const response = await debounce(api.updateNote, 500)(noteData.id, noteData)
      .catch(api.handleError)

    if (response.status !== 200) {
      throw new Error(response.data)
    }

    const note = response.data.note
    if (note && !state.isSaveOverlapping) {
      // confirm that changes have really been saved on server
      commit('setNoteUpdated', note)
    }
    commit('setSavePending', false)
    return true
  } catch {
    return false
  }
}

export const deleteNote = async ({ commit }, noteId) => {
  commit('setNoteDeleted', { id: noteId, val: true })
  await api.deleteNote(noteId)
    .catch(api.handleError)
}

export const undeleteNote = ({ commit, dispatch, state }, noteId) => {
  commit('setNoteDeleted', { id: noteId, val: false })
  return dispatch('createNote', state.notes[noteId])
}
