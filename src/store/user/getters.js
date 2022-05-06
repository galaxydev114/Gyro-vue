import { capitalize } from 'lodash'
import { fgRegionsMap, languages } from '@/constants'

export const isLoggedIn = (state) => !!state.currentUser

export const currentUser = (state) => state.currentUser

export const currentUserComputedName = (state) => {
  return state.currentUser ? (state.currentUser.fortniteNickname || state.currentUser.email?.split('@')[0]) : ''
}

export const skillsPriorityArray = (state) => {
  return state.skillsPriorityArray?.filter(skill => !skill.name.startsWith('__'))
}

export const hoursPlayADay = (state) => {
  return state.hoursPlayADay
}

export const hoursSleepingADay = (state) => {
  return state.hoursSleepingADay
}

export const daysAvailableArray = (state) => {
  return state.daysAvailableArray
}

export const timeInADayArray = (state) => {
  return state.timeInADayArray
}

export const userScore = (state) => {
  return state.score
}

export const isScoreArenaBased = (_, getters) => {
  return getters.userScore?.arena_matches > 10
}

export const arenaKD = (state, getters) => {
  return parseFloat(Math.min((getters.userScore?.arena_kd || 0), state.maxScores.maxKD).toFixed(2))
}

export const publicKD = (state, getters) => {
  return parseFloat(Math.min((getters.userScore?.pubs_kd || 0), state.maxScores.maxKD).toFixed(2))
}

export const arenaPlacement = (_, getters) => {
  return parseFloat((getters.userScore?.arena_placement || 100).toFixed(2))
}

export const publicPlacement = (_, getters) => {
  return parseFloat((getters.userScore?.pubs_placement || 100).toFixed(2))
}

export const powerRank = (state, getters) => {
  return Math.round(getters.userScore?.log_pr ? Math.min(Math.pow(Math.E, getters.userScore?.log_pr, state.maxScores.maxPR)) : 0)
}

export const currentUserScore = (state) => {
  return Math.round(parseFloat(state?.score?.score))
}

export const nextMonthUserScore = (state) => {
  const currentScore = currentUserScore(state)
  return currentScore ? Math.round(parseFloat(currentScore + (200 * Math.pow(1 - (currentScore / 1200), 2)))) : currentScore
}

export const preferenceScheduleTrainingPlan = (state) => {
  return state.preferenceScheduleTrainingPlan
}
export const techniquesArray = (state) => {
  return state.techniquesArray
}
export const toolsArray = (state) => {
  return state.toolsArray
}

/* access control */
// demo/test features
export const isPaymentDemoUser = () => {
  return localStorage.getItem('payment') === 'OrHagibor'
}
export const isSuperUser = () => {
  return localStorage.getItem('superuser') === 'aosi'
}
// roles
export const userRoles = (state) => {
  return state.currentUser?.role || ''
}
export const isAdmin = (state, getters) => {
  return getters.userRoles.includes('admin/content')
}
export const isReadonlyAdmin = (state, getters) => {
  return getters.userRoles.includes('admin/readonly')
}
/**/

export const userCollaborator = (state, getters, rootState) => {
  let tempCollab = null
  Object.keys(rootState.collaborators?.collaborators).map((nick) => {
    if (rootState.collaborators?.collaborators[nick].userId === state.currentUser?.id) {
      tempCollab = rootState.collaborators?.collaborators[nick]
    }
  })
  return tempCollab
}

export const isPaidUser = (state) => {
  return state.paymentPref?.isPaid
}

export const isFailedSubscriptionUser = (state) => {
  return state.paymentPref?.isFailed
}

export const canGenerateTrainingPlan = (state) => {
  return state.paymentPref?.canGenerateTrainingPlan
}

export const trialDaysLeft = (state) => {
  return state.paymentPref?.trialDaysLeft
}

export const userActivitiesCount = (state) => {
  return state.activitiesStats?.userActivitiesCount
}

export const isAllowedToUsePlatform = (state) => {
  return trialDaysLeft(state) > 0 || isPaidUser(state) || isPaymentDemoUser(state)
}

export const userDiscordData = (state) => {
  return state.discordData
}

export const userDiscordTokenValid = (state) => {
  return new Date(state.discordData?.accessTokenValidTill) > new Date()
}

export const userFriendGroupApplicationId = (state) => {
  return state.userFriendGroupApplication.id
}

export const getJoinFGState = (state) => {
  return 'hasJoin'
  // if (!state.userFriendGroupApplication) {
  //   return 'findJoin'
  // } else if (state.userFriendGroupApplication?.processingStatus === 'admin_pending') {
  //   return 'waitingForGroupAdmin'
  // } else if (state.userFriendGroupApplication?.processingStatus === 'auto_pending') {
  //   return 'waitingForGroupAuto'
  // } else if (state.userFriendGroupApplication?.joinDate) {
  //   return 'hasJoin'
  // } else if (state.userFriendGroupApplication?.friendGroupId) {
  //   return 'canJoin'
  // }
  // TODO - logic to be finished according to design states
  // findJoin, hasJoin, canJoin, noJoin, waitingForGroupAuto, waitingForGroupAdmin
}

const getScoreString = (score) => {
  const maxScore = 1200
  if (score < 0.25 * maxScore) {
    return 'Beginner'
  } else if (score < 0.87 * maxScore) {
    return 'Advanced'
  } else if (score < 750) {
    return 'PRO'
  }
}

export const userFriendGroupPreferences = (state) => {
  if (!state.userFriendGroupApplication) {
    return {}
  } else {
    const { platform, availability, region, language } = state.userFriendGroupApplication
    return {
      language: languages.getLangNameForCode(language),
      platform: capitalize(platform),
      skillScore: getScoreString(currentUserScore(state)),
      availability: availability && (availability?.length > 1 ? 'Flexible' : capitalize(availability[0])),
      region: fgRegionsMap[region]
    }
  }
}

export const userFriendGroupCriteria = (state) => {
  if (!state.userFriendGroup) {
    return {}
  } else {
    const { platform, availability, region, language, skillScoreMax } = state.userFriendGroup?.criteria
    return {
      language: languages.getLangNameForCode(language),
      platform: capitalize(platform),
      skillScore: getScoreString(skillScoreMax),
      availability: capitalize(availability),
      region: fgRegionsMap[region]
    }
  }
}

export const userFriendGroupInfo = (state) => {
  return {
    ...userFriendGroupCriteria(state),
    name: state.userFriendGroup?.name,
    url: state.userFriendGroup?.url
  }
}

export const userFriendGroup = (state) => {
  return state.userFriendGroup
}

export const userFriendGroupSelection = (state) => {
  return state.userFriendGroupApplication
}
