import Vue from 'vue'
import Vuex from 'vuex'

import calendar from './calendar'
import common from './common'
import user from './user'
import session from './session'
import userSession from './user-session'
import trainingPlan from './training-plan'
import trainingRoutine from './training-routine'
import knowledgeTime from './knowledge-time'
import workshops from './workshops'
import notes from './notes'
import accessCode from './access-code'
import payments from './payments'
import experiments from './experiments'
import coaches from './coaches'
import tournaments from './tournaments'
import discovery from './discovery'
import updates from './updates'
import progress from './progress'
import collaborators from './collaborators'
import fortniteSeason from './fortnite-season'
import courses from './courses'
import friendGroups from './friend-groups'

Vue.use(Vuex)
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      calendar,
      common,
      user,
      session,
      trainingPlan,
      trainingRoutine,
      knowledgeTime,
      workshops,
      notes,
      accessCode,
      userSession,
      payments,
      experiments,
      coaches,
      tournaments,
      discovery,
      updates,
      progress,
      collaborators,
      fortniteSeason,
      courses,
      friendGroups
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
