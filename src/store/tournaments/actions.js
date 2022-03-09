import Vue from 'vue'
import * as api from '@/services/api'
import { segmentIdentify, sendSegmentEvent } from '@/services/segment'

export function getTournamentsAdminList ({ commit, rootState }) {
  return api.getTournaments()
    .then((res) => res?.data?.tournaments && commit('setTournaments', res?.data?.tournaments))
    .catch(error => {
      throw new Error(`Failed to get tournaments: ${error}`)
    })
}

export async function getTournaments ({ commit, rootState }) {
  const userId = rootState.user.currentUser.id
  if (!userId) {
    return
  }

  const getTournaments = api.getTournaments()
    .then((res) => res?.data?.tournaments && commit('setTournaments', res?.data?.tournaments))
    .catch(error => {
      throw new Error(`Failed to get tournaments: ${error}`)
    })

  const getUserTournaments = api.getUserTournaments(userId)
    .then((res) => {
      return res?.data?.userTournaments && commit('setUserTournaments', res?.data?.userTournaments)
    })
    .catch(error => {
      throw new Error(`updateUserTournaments: ${error}`)
    })

  api.getUserTournaments(userId, true)
    .then((res) => {
      segmentIdentify(userId, { userTournamentsCount: res?.data?.userTournaments?.length || 0 })
      // eslint-disable-next-line no-unused-expressions
      res?.data?.userTournaments.forEach(userTournamnet => {
        const daysDiff = Vue.prototype.$date(userTournamnet.startAt).diff(Vue.prototype.$date().startOf('day'), 'days')
        if (daysDiff === 0 || daysDiff === 1) {
          sendSegmentEvent('Tournaments: come back on tournament or prep day', {
            dayType: daysDiff === 0 ? 'EVENT' : 'PREP',
            userTournamnet
          })
        }
      })
    })
    .catch(error => {
      throw new Error(`updateUserTournaments: ${error}`)
    })

  const getRegions = api.getTournamentRegions()
    .then((res) => res.data?.regions || [])
    .then(regions => commit('setRegions', regions))
    .catch(err => {
      throw new Error(`Failed to get tournament regions: ${err}`)
    })

  return Promise.all([getTournaments, getUserTournaments, getRegions])
}

export async function createTournament (ctx, tournamentData) {
  const response = await api.createTournament(tournamentData)
    .catch(api.handleError)

  return response.data?.tournament
}

export async function participateInTournament (ctx, {
  eventId: tournamentEventId,
  eventWindowId: tournamentEventWindowId
}) {
  const userId = ctx.rootState.user.currentUser.id
  if (!userId) {
    return
  }

  const response = await api.createUserTournament(userId, { tournamentEventId, tournamentEventWindowId })
  if (response.status === 200) {
    ctx.commit('addUserTournament', response.data.userTournament)
  }
}

export async function removeParticipation (ctx, { eventId, eventWindowId }) {
  const userId = ctx.rootState.user.currentUser.id
  if (!userId) {
    return
  }

  const userTournament = ctx.getters.userTournamentsMap[`${eventId}:${eventWindowId}`]
  if (!userTournament) {
    return
  }

  const response = await api.deleteUserTournament(userId, userTournament.id)
  if (response.status === 200) {
    ctx.commit('removeUserTournament', userTournament.id)
  }
}

export async function updateTournament (ctx, tournamentData) {
  const response = await api.updateTournament(tournamentData)
    .catch(api.handleError)

  return response.data?.tournament
}

export async function getUserTournaments ({ commit }, { userId }) {
  return api.getUserTournaments(userId)
    .then((res) => res?.data?.userTournaments && commit('setUserTournaments', res?.data?.userTournaments))
    .catch(error => {
      throw new Error(`updateUserTournaments: ${error}`)
    })
}

export async function updateTournamentStatusForUser ({ commit }, { userId, tournamentId, status }) {
  return api.updateTournamentStatusForUser(userId, tournamentId, status)
    .then((res) => res?.data?.userTournaments && commit('setUserTournaments', res?.data?.userTournaments))
    .catch(error => {
      throw new Error(`updateTournamentStatusForUser: ${error}`)
    })
}
