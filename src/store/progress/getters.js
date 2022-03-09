import dayjs from 'dayjs'

export const haveProgress = (state) => {
  return Object.keys(state.userProgress.groups).length > 0 ||
    (state.userScore && Object.keys(state.userScore).length > 0)
}

const formatValue = x => x === null ? NaN : x
const replaceNaNs = x => isNaN(x) ? 0 : x

export const skillScoreChart = (state) => {
  let isUserDataPredicted = false
  let userData = state.isUserFilterEnabled
    ? Object.entries(state.userScore).map(([key, stat]) => {
      const period = {
        x: key,
        y: Math.round(formatValue(stat.score)),
        uncertain: stat.blendFactor
      }
      period.y = replaceNaNs(period.y)
      return period
    })
    : []
  if (userData.length === 1) {
    // Only 1 point -- add second one for prediction
    const x = dayjs(userData[0].x)
      .add(1, 'day')
      .format('MM/DD/YYYY')
    const y = Math.round(userData[0].y * 1.05)
    isUserDataPredicted = true
    const nextX = dayjs(userData[0].x)
      .add(2, 'day')
      .format('MM/DD/YYYY')
    const nextY = Math.round(userData[0].y * 1.15)
    userData = [...userData, { x, y }, { x: nextX, y: nextY, predicted: true }]
  }

  userData.sort((a, b) => dayjs(a.x).isAfter(dayjs(b.x)) ? 1 : -1)

  return { userData, isUserDataPredicted }
}

export const userTrackedRoutinesProgress = (state) => {
  return state.userTrackedRoutinesProgress
}

// Arena Placement Chart
export const winRatioChart = (state) => {
  let isUserDataPredicted = false
  const userData = state.isUserFilterEnabled
    ? Object.entries(state.userProgress.groups).map(([key, stat]) => {
      const period = {
        x: key,
        placement1: formatValue(stat.winRatio),
        placement2: formatValue(stat.top10PcRatio),
        placement3: formatValue(stat.top25PcRatio),
        matchesPlayed: stat.matchesPlayed
      }
      period.rest = 1 - period.placement1 - period.placement2 - period.placement3
      period.placement1 = replaceNaNs(period.placement1)
      period.placement2 = replaceNaNs(period.placement2)
      period.placement3 = replaceNaNs(period.placement3)
      period.rest = replaceNaNs(period.rest)
      return period
    })
    : []

  if (userData.length === 1) {
    // Only 1 point -- add second one for prediction
    isUserDataPredicted = true
    userData.push({
      x: dayjs(userData[0].x)
        .add(1, state.view === '2wktrend' ? 'day' : state.view)
        .format('MM/DD/YYYY'),
      placement1: userData[0].placement1 * 1.1,
      placement2: userData[0].placement2 * 1.1,
      placement3: userData[0].placement3 * 1.1,
      rest: 1 - userData[0].placement1 * 1.1 - userData[0].placement2 * 1.1 - userData[0].placement3 * 1.1,
      predicted: true
    })
    userData.push({
      x: dayjs(userData[0].x)
        .add(2, state.view === '2wktrend' ? 'day' : state.view)
        .format('MM/DD/YYYY'),
      placement1: userData[0].placement1 * 1.3,
      placement2: userData[0].placement2 * 1.3,
      placement3: userData[0].placement3 * 1.3,
      rest: Math.max(0, 1 - userData[0].placement1 * 1.3 - userData[0].placement2 * 1.3 - userData[0].placement3 * 1.3),
      predicted: true
    })
  }

  userData.sort((a, b) => dayjs(a.x).isAfter(dayjs(b.x)) ? 1 : -1)

  return { userData, isUserDataPredicted }
}

export const killDeathChart = state => {
  let isUserDataPredicted = false
  let userData = state.isUserFilterEnabled
    ? Object.entries(state.userProgress.groups).map(([key, stat]) => {
      const period = {
        x: key,
        y: formatValue(stat.kpg?.toFixed(2)),
        matchesPlayed: stat.matchesPlayed
      }
      period.y = replaceNaNs(period.y)
      return period
    })
    : []

  if (userData.length === 1) {
    // Only 1 point -- add second one for prediction
    const x = dayjs(userData[0].x)
      .add(1, state.view === '2wktrend' ? 'day' : state.view)
      .format('MM/DD/YYYY')
    const y = userData[0].y * 1.1
    isUserDataPredicted = true
    userData = [...userData, { x, y, predicted: true }, {
      x: dayjs(userData[0].x)
        .add(2, state.view === '2wktrend' ? 'day' : state.view)
        .format('MM/DD/YYYY'),
      y: userData[0].y * 1.3,
      predicted: true
    }]
  }

  userData.sort((a, b) => dayjs(a.x).isAfter(dayjs(b.x)) ? 1 : -1)

  return { userData, isUserDataPredicted }
}

export const timePlayedChart = state => {
  const { isUserFilterEnabled, isAverageUserFilterEnabled } = state
  const categories = ['Public', 'Arena']

  if (isUserFilterEnabled && isAverageUserFilterEnabled) {
    return {
      categories,
      userData: [state.userProgress.timePlayedPublic, state.userProgress.timePlayedArena],
      averageUserData: [state.averageUserProgress.timePlayedPublic, state.averageUserProgress.timePlayedArena]
    }
  }

  if (isUserFilterEnabled && !isAverageUserFilterEnabled) {
    return {
      categories,
      userData: [state.userProgress.timePlayedPublic, state.userProgress.timePlayedArena],
      averageUserData: []
    }
  }

  if (!isUserFilterEnabled && isAverageUserFilterEnabled) {
    return {
      categories,
      userData: [],
      averageUserData: [state.averageUserProgress.timePlayedPublic, state.averageUserProgress.timePlayedArena]
    }
  }

  return {
    categories,
    userData: [],
    averageUserData: []
  }
}
