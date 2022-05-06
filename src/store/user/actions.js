import { segmentIdentify, sendSegmentEvent } from '@/services/segment'
import { setUser as setSentryUser } from '@sentry/browser'
import * as api from '@/services/api'
import * as LocalStorageService from '@/services/localstorageservice'

export async function login ({ dispatch }, body) {
  const { userId, token } = await api.login(body).then(res => res.data)

  return dispatch('authorizeUser', { userId, token })
}

export async function authorizeUserStored ({ dispatch }) {
  // try to load pretended user first
  const userIdFromSession = sessionStorage.getItem('userId')
  const userTokenFromSession = sessionStorage.getItem('userToken')
  if (userIdFromSession && userTokenFromSession) {
    return dispatch('loadUser', userIdFromSession)
  }

  // try to log in with stored credentials
  const userId = localStorage.getItem('userId')
  const token = LocalStorageService.getAccessToken()
  if (userId && token) {
    return dispatch('authorizeUser', { userId, token })
  } else {
    throw new Error('Invalid stored user session!')
  }
}

export async function authorizeUser ({ commit, dispatch, getters }, { userId, token }) {
  if (!userId || !token) {
    throw new Error('Invalid user session!')
  }

  localStorage.setItem('userId', userId)
  LocalStorageService.setUserToken({
    access: { token },
    refresh: {}
  })

  try {
    await dispatch('loadUser', userId)
    sendSegmentEvent('Login by AnyMethod Success', { userId })
    return true
  } catch (err) {
    sendSegmentEvent('Login by AnyMethod Failure', err)
    dispatch('logout')
    return false
  }
}

export async function loadUser ({ commit, dispatch, getters }, userId) {
  userId = userId || sessionStorage.getItem('userId') || localStorage.getItem('userId')
  if (!userId) {
    return dispatch('logout')
  }
  const res = await api.getUser(userId)
  const {
    user,
    userExperiments,
    userPaymentPref,
    trainingPlansAmount,
    completedOnboarding,
    collaborator,
    userFriendGroupApplication,
    userDiscordData,
    userFriendGroup
  } = res.data
  commit('setUser', user)
  commit('setCollaborator', collaborator)
  if (completedOnboarding === undefined || completedOnboarding === null) {
    await dispatch('getLastUserPreferences', { userId })
  } else {
    commit('setUserCompletedOnboarding', completedOnboarding)
  }
  commit('setTrainingPlansAmount', trainingPlansAmount)
  commit('setDiscordData', userDiscordData)
  commit('experiments/setUserExperiments', userExperiments, { root: true })
  commit('user/setUserPaymentPref', userPaymentPref, { root: true })
  if (getters.isPaidUser) {
    commit('payments/setUserSubscription', userPaymentPref.userSubscription, { root: true })
  }
  commit('setUserFriendGroupApplication', userFriendGroupApplication)
  commit('setUserFriendGroup', userFriendGroup)
  segmentIdentify(userId, {
    ...user,
    userPaymentPref,
    paymentMode: userPaymentPref?.userSubscription?.bluesnap?.paymentInfo?.type,
    playerCoupon: userPaymentPref?.userSubscription?.couponCode,
    experiments: userExperiments
  })
  setSentryUser({ id: userId })
}

export function resetPassword (ctx, { email, referrer }) {
  return api.resetPassword({ email, referrer })
}

export function changePassword (ctx, body) {
  return api.changePassword(body)
}

export async function logout ({ commit, getters }) {
  const userId = getters.currentUser?.id
  if (userId) {
    await api.logout({ userId }).catch(() => {})
  }
  LocalStorageService.clearToken()
  commit('setUser', null)
  localStorage.removeItem('userId')
  setSentryUser(null)
}

export async function getLastUserPreferences ({ commit }, { userId }) {
  return api.getLastUserPreferences(userId)
    .then((res) => res?.data?.userPreferences && commit('setUserPreferences', res?.data?.userPreferences))
    .catch(error => {
      throw new Error(`updateUserPreferences: ${error}`)
    })
}

export async function updateUserNickname ({ commit }, { userId, nickname }) {
  const user = await api.updateUserNickname(userId, nickname)
    .then(res => res.data.user)
    .catch(error => {
      throw new Error(`updateUserNickname: ${error}`)
    })
  if (!user) return
  commit('setUser', user)
  return user
}

export async function linkUserDiscordAccount ({ commit }, { userId, code, redirectUri }) {
  const user = await api.linkUserDiscordAccount(userId, code, redirectUri) // OAuth2 code
    .then(res => res.data.user)
    .catch(error => {
      throw new Error(`linkUserDiscordAccount: ${error}`)
    })
  if (!user) return
  commit('setUser', user)
  return user
}

export async function updateUserEpicId ({ commit }, { userId, code }) {
  const user = await api.updateUserEpicAccount(userId, code) // OAuth2 code
    .then(res => res.data.user)
    .catch(error => {
      throw new Error(`updateUserEpicId: ${error}`)
    })
  if (!user) return
  commit('setUser', user)
  return user
}

export async function unlinkUserEpicId ({ commit }, { userId }) {
  const user = await api.unlinkUserEpicAccount(userId)
    .then(res => res.data.user)
    .catch(error => {
      throw new Error(`unlinkUserEpicId: ${error}`)
    })
  if (!user) return
  commit('setUser', user)
  return user
}

export async function updateUserPreferences ({ commit }, { userId, updatedUserPreferences }) {
  return api.updateUserPreferences(userId, updatedUserPreferences).then().catch(error => {
    throw new Error(`updateUserPreferences: ${error}`)
  })
}

export async function editUserPreferencesFlow ({ commit, dispatch }, { userId, updatedUserPreferences }) {
  await dispatch('editUserPreferences', { userId, updatedUserPreferences })
  await dispatch('getLastUserPreferences', { userId })
  return dispatch(
    'trainingPlan/fetchUserCurrentTrainingPlan',
    null,
    { root: true }
  )
}

export async function editUserPreferences ({ commit, rootGetters }, { userId, updatedUserPreferences }) {
  return api.editUserPreferences(userId, updatedUserPreferences)
}

export async function finishUserPreferences ({ commit, dispatch }, { userId }) {
  commit('setUserCompletedOnboarding', true)
  dispatch('updateUserPreferences', { userId, updatedUserPreferences: { isCompleted: true } })
}

export async function saveUserSkillPriority ({ commit, dispatch }, { userId, userSkillPriority }) {
  commit('setSkillsPriorityArray', userSkillPriority)
  dispatch('updateUserPreferences', { userId, updatedUserPreferences: { preferences: JSON.stringify(userSkillPriority) } })
}

export async function saveUserTools ({ commit, dispatch }, { userId, userTools }) {
  commit('setToolsArray', userTools)
  dispatch('updateUserPreferences', { userId, updatedUserPreferences: { tools: JSON.stringify(userTools) } })
}

export async function saveUserTechniques ({ commit, dispatch }, { userId, userTechniques }) {
  commit('setTechniquesArray', userTechniques)
  dispatch('updateUserPreferences', { userId, updatedUserPreferences: { techniques: JSON.stringify(userTechniques) } })
}

export async function saveUserAvailabilty ({ commit, dispatch }, { userId, userAvailabilty }) {
  commit('setHoursPlayADay', userAvailabilty.playTime)
  commit('setHoursSleepingADay', userAvailabilty.sleepTime)
  commit('setDaysAvailableArray', userAvailabilty.dayPlay)
  commit('setTimeInADayArray', userAvailabilty.dayTime)

  dispatch('updateUserPreferences', {
    userId,
    updatedUserPreferences: {
      trainingHours: Number(userAvailabilty.playTime),
      sleepingRoutine: Number(userAvailabilty.sleepTime),
      trainingDays: JSON.stringify(userAvailabilty.dayPlay),
      usuallyPlay: JSON.stringify(userAvailabilty.dayTime)
    }
  })
}

export async function saveUserTrainingSchedule ({ commit, dispatch }, { userId, userTrainingSchedule }) {
  commit('setScheduleTrainingPlan', userTrainingSchedule)
  return dispatch('updateUserPreferences', { userId, updatedUserPreferences: { weekCalendarPreferences: JSON.stringify(userTrainingSchedule) } })
}

export function saveUserGoals ({ commit, dispatch }, { userId, goals }) {
  commit('setGoalsObject', goals)
  return dispatch('updateUserPreferences', { userId, updatedUserPreferences: { goals: JSON.stringify(goals) } })
}

export async function registerNewUser ({ dispatch }, { accessCode, email, password, role = 'earlyaccess2', referralLink, tapfiliateRef }) {
  const res = await api.register({ accessCode, email, password, role, referralLink, tapfiliateRef })

  if (res.status === 200) {
    return dispatch('login', { email, password })
  }
}

export async function getCurrentUserScore ({ commit, state }) {
  if (state.currentUser.id) {
    return api.getUserScore(null, state.currentUser.id).then(response => {
      if (response.data?.userScore) return commit('setUserScore', response.data?.userScore)
    })
  } else {
    throw new Error(`No id for current user ${state.currentUser.id}`)
  }
}

export async function getUserScore ({ commit, state }, { fortniteNickname, userId, forceCalc = false }) {
  if (fortniteNickname || userId) {
    return api.getUserScore(fortniteNickname, userId, forceCalc).then(response => {
      if (response.data?.userScore) return commit('setUserScore', response.data?.userScore)
    })
  } else {
    throw new Error(`No fortniteNickname or userId set for get userScore: ${fortniteNickname} & ${userId}`)
  }
}

export async function finishOnboarding ({ state, dispatch }, userId) {
  if (userId) {
    await api.finishonboarding({ userId })
    await dispatch('loadUser', userId)
      .catch((err) => {
        const detail = err.response?.data || JSON.stringify(err)
        throw new Error('Refetching user after onboarding failed: ' + detail)
      })
  } else {
    throw new Error('finished onboarding without setting email', JSON.stringify(state.currentUser))
  }
}

export async function sendReminderEarlyAccessEmail ({ state }, email) {
  if (email) {
    api.sendEarlyAccessEmailReminder({ email: email })
  } else {
    throw new Error('sendReminderEarlyAccessEmail without setting email', email)
  }
}

export async function getUserActivitiesStats ({ state, commit }, userId) {
  if (userId) {
    return api.getUserActivitiesStats(userId).then(response => commit('setUserActivitiesStats', response.data.userActivitiesStats))
  } else {
    throw new Error('getUserActivitiesStats without user Id', userId)
  }
}

export async function joinReferralProgram ({ commit }, userId) {
  if (!userId) return
  const user = await api.joinReferralProgram(userId)
    .then(res => res.data.user)
    .catch(error => {
      throw new Error(`joinReferralProgram: ${error}`)
    })
  if (!user) return
  commit('setUser', user)
  return user
}

export function getReferralsData ({ commit }, userId) {
  if (userId) {
    return api.getReferralsDataForUser(userId)
      .then(res => res.data.referralsData)
  } else {
    throw new Error('getReferralsData without user Id', userId)
  }
}

export async function applyForFriendGroup ({ commit }, { userId, applicationData }) {
  const result = await api.applyForFriendGroup(userId, applicationData)
  if (result.status === 200) {
    commit('setUserFriendGroupApplication', result.data.userFriendGroupApplication)
    commit('setUserFriendGroup', result.data.userFriendGroup)
  }
}

// TODO not used atm
export async function findFriendGroup ({ commit }, userId) {
  const result = await api.findFriendGroup(userId)
  if (result.status === 200) {
    commit('setUserFriendGroupApplication', result.data.userFriendGroupApplication)
  }
}

export async function joinFriendGroup ({ commit }, userId) {
  const result = await api.joinFriendGroup(userId)
  if (result.status === 200) {
    commit('setUserFriendGroupApplication', result.data.userFriendGroupApplication)
  }
}

// TODO not used atm
export async function requestAdminAssignment ({ commit }, userId) {
  const result = await api.requestAdminAssignment(userId)
  if (result.status === 200) {
    commit('setUserFriendGroupApplication', null)
  }
}

export async function leaveFriendGroup ({ commit }, userId) {
  const result = await api.leaveFriendGroup(userId)
  if (result.status === 200) {
    commit('setUserFriendGroupApplication', null)
  }
}
