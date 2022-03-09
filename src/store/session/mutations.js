import Vue from 'vue'
export const addNewSession = (store, session) => {
  store.sessions[session.id] = session
}

export const setSessions = (store, sessions) => {
  store.sessions = sessions.reduce((map, session) => {
    map[session.id] = session
    return map
  }, {})
}

export const updateSession = (store, session) => {
  store.sessions[session.id] = session
}

export const addSessionStats = (store, session) => {
  Vue.set(store.sessionsStats, [session.sessionId], session)
}
