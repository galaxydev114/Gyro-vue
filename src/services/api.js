import dayjs from 'dayjs'
import axios from 'axios'
import withCancelToken from '@/util/withCancelToken'
import * as LocalStorageService from '@/services/localstorageservice'

function getAuthHeader () {
  const token = LocalStorageService.getAccessToken()

  if (token) {
    return { Authorization: 'Bearer ' + token }
  } else {
    return {}
  }
}

function prepareFilePostRequest (file, filename) {
  var formData = new FormData()
  formData.append('file', file)
  formData.append('filename', filename)
  return [formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }]
}

const axiosClient = axios.create({
  baseURL: process.env.VUE_APP_SERVER_BASE_URL
})

axiosClient.interceptors.request.use(config => {
  config.headers = getAuthHeader()
  return config
}, error => Promise.reject(error))

const loadSecret = () => localStorage.getItem('superuser') || false

/**
 * @param {Error | import('axios').AxiosError} err
 */
export const handleError = err => {
  if (err.response) {
    throw new Error(err.response.data)
  }

  throw err
}

export const register = body => axiosClient.post('/gyro/auth/register', body).catch(res => { throw res.response })
export const login = body => axiosClient.post('/gyro/auth/login', body).catch(res => { throw res.response })
export const logout = body => axiosClient.post('/gyro/auth/logout', body, { headers: getAuthHeader() }).catch(res => { throw res.response })
export const resetPassword = body => axiosClient.post('/gyro/auth/reset-password', body).catch(res => { throw res.response })
export const changePassword = body => axiosClient.post('/gyro/auth/change-password', body).catch(res => { throw res.response })

export const createUser = body => axiosClient.post('/gyro/users', body)
export const getUser = userId => axiosClient.get(`/gyro/users/${userId}`, { headers: getAuthHeader() })
export const updateUserNickname = (userId, nick) => axiosClient.patch(`/gyro/users/${userId}/nickname`, { nick })
export const updateUserEpicAccount = (userId, code) => axiosClient.post(`/gyro/users/${userId}/link-epic`, { code })
export const unlinkUserEpicAccount = (userId) => axiosClient.post(`/gyro/users/${userId}/unlink-epic`)
export const updateUserPreferences = (userId, userPreferencesUpdated) => axiosClient.patch(`/gyro/users/${userId}/preferences`, userPreferencesUpdated)
export const editUserPreferences = (userId, userPreferencesUpdated) => axiosClient.patch(`/gyro/users/${userId}/editpreferences`, { userPreferencesUpdated })
export const getLastUserPreferences = (userId) => axiosClient.get(`/gyro/users/${userId}/preferences`)
export const getUserScore = (FnNickname, userId, forceCalc) => axiosClient.get('gyro/users/stats', { params: { nick: FnNickname, userId, forceCalc } })
export const getUserEpicStats = (userId, { fortniteNickname, epicUserId }) => axiosClient.get(`gyro/users/${userId}/epicStats`, { params: { fortniteNickname, epicUserId } })
export const getUserTrackedRoutinesProgress = (userId) => axiosClient.get(`gyro/users/${userId}/routines-progress`)
export const getUserProgress = (userId, { season, view = 'week', mode = 'all' }) => axiosClient.get(`gyro/users/${userId}/progress`, { params: { season, view, mode } })
export const reloadUserProgress = (userId) => axiosClient.post(`gyro/users/${userId}/progress`)
export const finishonboarding = (body) => axiosClient.post('gyro/users/finishonboarding', body)
export const sendEarlyAccessEmailReminder = (body) => axiosClient.post('gyro/users/earlyaccess', body)
export const trackLastLoggedIn = (userId, body) => axiosClient.patch(`gyro/users/${userId}/activity`, body)

// Training plan
export const generateTrainingPlan = (userId, secret) => axiosClient.post(`/gyro/users/${userId}/training-plan`, { secret })
export const getUsersCurrentTrainingPlanWithRoutines = (userId) => axiosClient.get(`/gyro/users/${userId}/training-plan/routines`, { headers: { secret: loadSecret() } })
export const getAdminTrainingPlanWithAllRoutines = (userId, secret) => axiosClient.get(`/gyro/users/${userId}/training-plan/routines/all`, { headers: { secret } })
export const deleteRoutineFromTrainingPlan = (userId, routineId) => axiosClient.delete(`/gyro/users/${userId}/training-plan/routines/${routineId}`, { headers: { secret: loadSecret() } })
export const adjustRoutineTimeWithinDay = (userId, userRoutineId, body) => axiosClient.patch(`/gyro/users/${userId}/training-plan/routines/${userRoutineId}/time-slot`, body, { headers: { secret: loadSecret() } })
export const updateTrainingPlan = withCancelToken((cancelToken, trainingPlan) => axiosClient.put(`/gyro/training-plans/${trainingPlan.id}`, { trainingPlan }, { cancelToken }))

// Sessions
export const createSession = body => axiosClient.post('/gyro/sessions', body)
export const getSessions = (sessionIds = [], fulldesc = false) => axiosClient.get('/gyro/sessions', {
  params: { sessionIds, fulldesc }
})
export const updateSession = (sessionId, body) => axiosClient.put(`/gyro/sessions/${sessionId}`, body)
export const getTrainingRoutineSessions = userTrainingRoutineId => axiosClient.get(`/gyro/training-routines/${userTrainingRoutineId}/sessions`, { headers: getAuthHeader() })
export const deleteSession = (sessionId) => axiosClient.delete(`/gyro/sessions/${sessionId}`)
export const getTrainingRoutinesSessions = (userTrainingRoutineIds) => axiosClient.post('/gyro/training-routines/sessions', { userTrainingRoutineIds })
export const markSessionAsDone = (routineId, sessionId) => axiosClient.put(`/gyro/users/routines/${routineId}/sessions/${sessionId}/is-completed`, { isCompleted: dayjs().format('YYYY-MM-DD') })

export const setSessionScoreGetStats = (sessionId, score) => axiosClient.put(`/gyro/users/sessions/${sessionId}/score`, { score })
export const getSessionScoreStats = (sessionId) => axiosClient.get(`/gyro/users/sessions/${sessionId}/score`)

// Routines
export const createRoutine = body => axiosClient.post('/gyro/training-routines', body)
export const getRoutines = (isWeightOverTime) => axiosClient.get('/gyro/training-routines', { params: { isWeightOverTime } })
export const getRoutine = (routineId) => axiosClient.get(`/gyro/training-routines/${routineId}`)
export const updateRoutine = (routineId, body) => axiosClient.put(`/gyro/training-routines/${routineId}`, body)
export const deleteRoutine = (routineId) => axiosClient.delete(`/gyro/training-routines/${routineId}`)
export const markRoutineAsDone = (routineId) => axiosClient.put(`/gyro/users/routines/${routineId}/is-completed`, { isCompleted: dayjs().format('YYYY-MM-DD') })
export const getRoutineUserData = (userId, trainingRoutineId) => axiosClient.get(`/gyro/users/${userId}/routines/${trainingRoutineId}/stats`)
export const getAlternativeRoutines = (userId, excludeIds, skillBased) => axiosClient.get(`/gyro/users/${userId}/alternative-routines`, {
  params: { excludeIds, skillBased }
})
export const createUserRoutine = (userId, trainingRoutineId) => axiosClient.post(`/gyro/users/${userId}/routines/${trainingRoutineId}`)
export const getPaginatedRoutines = ({ page, creator, category, title, difficulty, userId }) => {
  let query = {}
  if (userId) query = { ...query, userId }
  if (page) query = { ...query, page }
  if (creator) query = { ...query, creator }
  if (category) query = { ...query, category }
  if (title) query = { ...query, title }
  if (difficulty) query = { ...query, difficulty }
  return axiosClient.get('/gyro/training-routines/paginated', { params: query })
}

// KnowledgeTime
export const createKnowledge = body => axiosClient.post('/gyro/knowledge', body)
export const getKnowledges = () => axiosClient.get('/gyro/knowledge')
export const getKnowledge = (knowledgeId) => axiosClient.get(`/gyro/knowledge/${knowledgeId}`)
export const updateKnowledge = (knowledgeId, body) => axiosClient.put(`/gyro/knowledge/${knowledgeId}`, body)
export const deleteKnowledge = (knowledgeId) => axiosClient.delete(`/gyro/knowledge/${knowledgeId}`)
export const getUserKnowledges = (userId) => axiosClient.get(`/gyro/users/${userId}/knowledge`)
export const markKnowledgeDoneNew = (userId, knowledgeId) => axiosClient.put(`/gyro/users/${userId}/knowledge/${knowledgeId}/watched`)
export const markKnowledgeDoneExisting = (userKnowledgeId) => axiosClient.put(`/gyro/users/knowledge/${userKnowledgeId}/watched`)
export const markKnowledgeUndone = (userId, knowledgeId) => axiosClient.put(`/gyro/users/${userId}/knowledge/${knowledgeId}/unwatched`)
export const uploadKnowledgeThumbnail = data => axiosClient.post('/gyro/thumbnails/knowledge', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const getListOfKnowledgeThumbnails = () => axiosClient.get('/gyro/thumbnails/knowledge')

// Notes
export const createUserNote = (body) => axiosClient.post('gyro/notes', body)
export const getUserNotes = (userId) => axiosClient.get(`/gyro/users/${userId}/notes`)
export const updateNote = withCancelToken((cancelToken, noteId, body) => axiosClient.put(`/gyro/notes/${noteId}`, body, { cancelToken }))
export const deleteNote = (noteId) => axiosClient.delete(`/gyro/notes/${noteId}`)

// Torunaments
export const createTournament = body => axiosClient.post('/gyro/tournaments', body)
export const createUserTournament = (userId, { tournamentEventId, tournamentEventWindowId }) => axiosClient.post(`/gyro/users/${userId}/tournaments`, { tournamentEventId, tournamentEventWindowId })
export const getTournaments = () => axiosClient.get('/gyro/tournaments')
export const getTournamentRegions = () => axiosClient.get('/gyro/tournaments/regions')
export const updateTournament = body => axiosClient.put('/gyro/tournaments', body, {
  params: { eventId: body.eventId, eventWindowId: body.eventWindowId }
})
export const getUserTournaments = (userId, getFuture = undefined) => axiosClient.get(`/gyro/users/${userId}/tournaments`, { params: { getFuture } })
export const updateTournamentStatusForUser = (userId, tournamentId, status) => axiosClient.patch(`/gyro/users/${userId}/tournaments`, { tournamentId, status }) // {tournamentsId, status: true/false}
export const deleteUserTournament = (userId, userTournamentId) => axiosClient.delete(`/gyro/users/${userId}/tournaments/${userTournamentId}`)
export const deleteRescheduledUserTournaments = (userId) => axiosClient.post(`/gyro/users/${userId}/tournaments/rescheduled`, { mode: 'D' })

// Access Code
export const validateAccessCode = (accessCode) => axiosClient.get(`/gyro/access-code/${accessCode}`)
export const attachAccessCode = (accessCode, body) => axiosClient.post(`/gyro/access-code/${accessCode}`, body)
export const createAccessCode = body => axiosClient.post('/gyro/access-code', body)
export const updateAccessCode = (id, body) => axiosClient.put(`/gyro/access-code/${id}`, body)

// Access Codes
export const fetchAccessCodes = (secret) => axiosClient.get('/gyro/access-codes/', { headers: { secret } })

// Payments
export const getPaymentPlans = () => axiosClient.get('/gyro/payments/plans')
export const getCheckoutPageUrl = (userId, paymentPlanId, couponCode) => axiosClient.get('/gyro/payments/checkoutPage', { params: { userId, paymentPlanId, couponCode } })
export const getSubscription = () => axiosClient.get('/gyro/payments/subscription', { headers: getAuthHeader() })
export const cancelSubscription = () => axiosClient.post('/gyro/payments/subscription/cancel', {}, { headers: getAuthHeader() })
export const obtainPfToken = () => axiosClient.get('/gyro/payments/pfToken')
export const proceedCheckout = ({ userId, pfToken, paymentPlanId }) => axiosClient.post('/gyro/payments/checkout', { userId, pfToken, paymentPlanId })
export const refundByEmail = (email) => axiosClient.post('/gyro/payments/refund', { email })
export const refundByCsv = (formData) => axiosClient.post('/gyro/payments/refund', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

// Activities
export const getUserActivitiesStats = (userId) => axiosClient.get(`/gyro/users/${userId}/activities`)

// Discovery
export const discoverActivities = (userId) => axiosClient.get('/gyro/discovery/activities?type=all', {
  params: { userId }
})
export const getNewestActivities = () => axiosClient.get('/gyro/discovery/activities?type=newest')
export const getAllSkillTypes = () => axiosClient.get('/gyro/training-routines/skills')
export const completeDiscoveredRoutine = (trainingRoutineId, userId) => axiosClient.put(`/gyro/discovery/training-routines/${trainingRoutineId}/is-completed`, { isCompleted: dayjs().format('YYYY-MM-DD') }, { params: { userId } })

// Workshops
export const discoverWorkshops = (userId) => axiosClient.get('/gyro/discovery/activities?type=workshops', {
  params: { userId }
})
export const getAdminAllWorkshops = () => axiosClient.get('/gyro/workshops')
export const updateWorkshop = (workshopId, body) => axiosClient.put(`/gyro/workshops/${workshopId}`, body)
export const deleteWorkshop = (workshopId) => axiosClient.delete(`/gyro/workshops/${workshopId}`)
export const getWorkshopById = workshopId => axiosClient.get(`/gyro/workshops/${workshopId}`)
export const createWorkshop = workshop => axiosClient.post('/gyro/workshops', workshop)
export const getAllWorkshopCategories = () => axiosClient.get('/gyro/workshops/categories')
export const getPaginatedWorkshops = ({ page, creator, category, title, difficulty, userId }) => {
  let query = {}
  if (userId) query = { ...query, userId }
  if (page) query = { ...query, page }
  if (creator) query = { ...query, creator }
  if (category) query = { ...query, category }
  if (title) query = { ...query, title }
  if (difficulty) query = { ...query, difficulty }
  return axiosClient.get('/gyro/workshops/paginated', { params: query })
}
export const markWorkshopDone = (userId, workshopId) => axiosClient.put(`/gyro/users/${userId}/workshops/${workshopId}/is-completed`, { isCompleted: dayjs().format('YYYY-MM-DD') })

// Content partners
export const getCoaches = () => axiosClient.get('/gyro/coaches')
export const getCollaborators = () => axiosClient.get('/gyro/collaborators')
export const createPartner = body => axiosClient.post('/gyro/collaborators', body)
export const getPartnerById = partnerId => axiosClient.get(`/gyro/collaborators/${partnerId}`)
export const updatePartner = (partnerId, body) => axiosClient.patch(`/gyro/collaborators/${partnerId}`, body)
export const deletePartner = partnerId => axiosClient.delete(`/gyro/collaborators/${partnerId}`)
export const getListOfPartnersThumbnails = () => axiosClient.get('/gyro/thumbnails/partners')
export const uploadPartnerThumbnail = formData => axiosClient.post('/gyro/thumbnails/partners', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

// Assets
export const createSessionAttachedImage = (file, filename) => axiosClient.post('/gyro/sessions/hostedimage', ...prepareFilePostRequest(file, filename))
export const upgradeToMux = (contentType, contentData, contentField) => axiosClient.post('/gyro/assets/upgradeVideo', contentData, {
  params: { type: contentType, field: contentField }
})
export const getMuxVideoLink = (videoUrl) => axiosClient.get('/gyro/assets/video', { params: { url: videoUrl } })
export const hostPlatformNewsImage = (file, filename) => axiosClient.post('/gyro/platform-news/image', ...prepareFilePostRequest(file, filename))

// Referrals
export const getReferralsDataForUser = (userId) => axiosClient.get(`/gyro/users/${userId}/referrals`)
export const joinReferralProgram = (userId) => axiosClient.post(`/gyro/users/${userId}/referrals`)

// Platform news
export const getPlatformNews = (userId) => axiosClient.get(`/gyro/users/${userId}/platform-news`)
export const visitPlatformNews = (userId, platformNewsId) => axiosClient.patch(`/gyro/users/${userId}/platform-news/${platformNewsId}/visit`)
export const deletePlatformNews = (platformNewsId) => axiosClient.delete(`/gyro/platform-news/${platformNewsId}`)
export const createPlatformNews = (data) => axiosClient.post('/gyro/platform-news', data)
export const getAllPlatformNews = () => axiosClient.get('/gyro/platform-news')

// Other
export const sendReferralAnalytics = (userId, referralId, eventId) => axiosClient.post('/gyro/events/referrals', {
  userId, referralId, eventId
})
export const testNotifications = (body) => axiosClient.post('/gyro/notifications', body)
export const getPlatformUpdates = () => axiosClient.get('/gyro/updates')
export const regenerateTrainingPlan = (userId) => axiosClient.post(`/gyro/users/${userId}/training-plan/regenerate`)
export const createSupportTicket = ({ userId, name, email, description }) => axiosClient.post(`/gyro/users/${userId}/support/tickets`, { name, email, description })
export const getPartnerEarnings = (partnerId) => axiosClient.get(`/gyro/collaborators/${partnerId}/earnings`)
