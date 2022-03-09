import Vue from 'vue'

export const setUserKnowledgeTimeStatuses = (store, userKnowledgeTimes) => {
  for (const userKnowledge of userKnowledgeTimes) {
    Vue.set(store.knowledgeTimes, userKnowledge.knowledgeTimeId, userKnowledge)
  }
}

// CRUD
export const addNewKnowledgeTime = (store, knowledgeTime) => {
  store.knowledgeTimes[knowledgeTime.id] = knowledgeTime
}

export const setKnowledges = (store, knowledgeTimes) => {
  store.knowledgeTimes = knowledgeTimes?.reduce((map, knowledgeTime) => {
    map[knowledgeTime.id] = knowledgeTime
    return map
  }, {})
}

export const updateKnowledgeTime = (state, knowledgeTime) => {
  state.knowledgeTimes = {
    ...state.knowledgeTimes,
    [knowledgeTime.id]: knowledgeTime
  }
}
