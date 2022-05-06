import * as api from '@/services/api'
import Vue from 'vue'
import pick from 'lodash/pick'

export const generateTrainingPlan = async ({ rootState, dispatch, rootGetters }) => {
  const response = await api.generateTrainingPlan(rootState.user.currentUser.id, localStorage.getItem('superuser'))

  if (response.status === 200) {
    return dispatch('fetchUserCurrentTrainingPlan')
  }
}

export const fetchUserCurrentTrainingPlan = async ({ state, rootState, commit, dispatch, getters, rootGetters }) => {
  let response
  const userId = rootState.user?.currentUser?.id

  try {
    if (rootGetters['user/isSuperUser']) {
      response = await api.getAdminTrainingPlanWithAllRoutines(userId, localStorage.getItem('superuser'))
    } else {
      response = await api.getUsersCurrentTrainingPlanWithRoutines(userId)
    }
  } catch (error) {
    if (error.response.status === 404) {
      await dispatch('generateTrainingPlan')
      response = await rootGetters['user/isSuperUser']
        ? api.getAdminTrainingPlanWithAllRoutines(userId, localStorage.getItem('superuser'))
        : api.getUsersCurrentTrainingPlanWithRoutines(userId)
    }

    throw error
  }

  if (response.status === 200) {
    commit('user/setTrainingPlansAmount', response.data.trainingPlansAmount, { root: true })
    commit('setCurrentTrainingPlan', response.data.trainingPlan)

    const routines = Object.values(response.data.activitiesPerDay).flat()
    const routineIds = routines.map(routine => routine.id)
    await dispatch('trainingRoutine/fetchRoutinesSessions', routineIds, { root: true })

    commit('trainingRoutine/setRoutines', routines, { root: true })
    await dispatch('user/getUserActivitiesStats', userId, { root: true })

    const shouldUpdate = await dispatch('recomputeTimeSections')
    if (shouldUpdate) {
      const request = pick(state, ['id', 'schedules'])
      return api.updateTrainingPlan(request)
    } else {
      return response.data.trainingPlan
    }
  }
}

export const recomputeTimeSections = (ctx) => {
  const timeSectionsByDay = []
  let didAddIndex = false
  for (let day = 0; day < 7; day++) {
    const dayNumber = day + 1
    const activities = ctx.getters[`trainingDay${day + 1}`] || []
    let timeSections = {}

    // Filter activities with no order in a specific section, we have to
    // merge them in. Do this in the second pass
    const newActivities = []
    const sortedActivities = []

    activities.forEach(activity => {
      (activity.index === undefined || activity.index === null ? newActivities : sortedActivities).push(activity)
    })

    // First pass: sort activities into time slots based on index and section start
    for (const activity of sortedActivities) {
      // make a new time section if not found
      if (!(activity.startHour in timeSections)) {
        timeSections[activity.startHour] = {
          start: activity.startHour,
          items: [],
          end: Vue.dayjs.timeOfDay(activity.startHour)
        }
      }

      // add to the correct time section
      timeSections[activity.startHour].items.push(activity)
      timeSections[activity.startHour].end = timeSections[activity.startHour].end
        .add(activity.duration, 'minute')
    }

    // Sort by index
    for (const timeSection of Object.values(timeSections)) {
      timeSection.items = timeSection.items.sort((a, b) => a.index - b.index)
    }

    // Sort new activities by start time
    newActivities.sort((a, b) => {
      return Vue.dayjs.timeOfDay(a.startHour).valueOf() - Vue.dayjs.timeOfDay(b.startHour).valueOf()
    })

    // Second pass: insert activities without section index into correct
    // slot. If time sections up to now is empty, this assigns indexes to
    // all of the activities.
    for (const activity of newActivities) {
      // Find the first section that this falls inside
      const timeSection = Object.values(timeSections).find(timeSection => {
        const aTime = Vue.dayjs.timeOfDay(activity.startHour)
        const tStart = Vue.dayjs.timeOfDay(timeSection.start)
        const tEnd15MinRounded = timeSection.end.roundMinsBlock(15)
        return !aTime.isBefore(tStart, 'minutes') && !aTime.isAfter(tEnd15MinRounded, 'minutes')
      })

      if (timeSection) {
        // Find the right insertion point
        let index = 0
        const aTime = Vue.dayjs.timeOfDay(activity.startHour)
        let time = Vue.dayjs.timeOfDay(timeSection.start)
        while (aTime.isAfter(time) && index < timeSection.items.length) {
          time = time.add(timeSection.items[index].duration)
          index++
        }
        timeSection.items.splice(index, 0, activity)
        timeSection.end = timeSection.end
          .add(activity.duration, 'minute')

        activity.index = index
        activity.startHour = timeSection.start
      } else {
        // We did not find a section that fits this, make a new time section
        activity.index = 0
        timeSections[activity.startHour] = {
          start: activity.startHour,
          items: [activity],
          end: Vue.dayjs.timeOfDay(activity.startHour)
            .add(activity.duration, 'minute')
        }
      }
      didAddIndex = true
    }

    timeSections = Object.values(timeSections)
    timeSections.sort((a, b) => {
      return Vue.dayjs.timeOfDay(a.start) - Vue.dayjs.timeOfDay(b.start)
    })
    timeSections.forEach(timeSection => {
      timeSection.end = timeSection.end.format('HH:mm')
      timeSection.items.sort((a, b) => a.index - b.index)
      timeSection.items.forEach((activity, index) => { activity.index = index })
    })
    timeSectionsByDay[dayNumber] = timeSections
  }
  ctx.commit('setRecomputedTimeSections', timeSectionsByDay)
  return didAddIndex
}

export const updateActivitiesInTimeSection = (ctx, { dayNumber, timeSection }) => {
  if (!timeSection.items) {
    return
  }
  const activitiesInDay = [...timeSection.items.entries()]
    .map(([index, activity]) => {
      return {
        ...activity,
        index,
        startHour: timeSection.start
      }
    })
  ctx.commit('updateActivitiesInDay', {
    day: dayNumber,
    activities: activitiesInDay
  })
}

export const addTimeSection = (ctx, { dayNumber, start }) => {
  const timeAdded = Vue.dayjs.timeOfDay(start)
  const haveOverlap = ctx.state.timeSectionsByDay[dayNumber].some(timeSection => {
    const timeStart = Vue.dayjs.timeOfDay(timeSection.start)
    const timeEnd = Vue.dayjs.timeOfDay(timeSection.end)
    return !timeAdded.isBefore(timeStart, 'minutes') && !timeAdded.isAfter(timeEnd, 'minutes')
  })
  if (haveOverlap) {
    return false
  }

  ctx.commit('addTimeSection', { dayNumber, start })
  return true
}

export const changeTimeSection = (ctx, { dayNumber, timeSectionIdx, start, offset = 0, checkMerge = false }) => {
  if (checkMerge) {
    const newStartTime = Vue.dayjs.timeOfDay(start)
    const newEndTime = ctx.state.timeSectionsByDay[dayNumber][timeSectionIdx].items
      .reduce((endTime, activity) => {
        return endTime.add(activity.duration, 'minute')
      }, newStartTime)

    const overlappingSections = [...ctx.state.timeSectionsByDay[dayNumber].entries()]
      .filter(([idx, timeSection]) => {
        const timeStart = Vue.dayjs.timeOfDay(timeSection.start)
        const timeEnd = Vue.dayjs.timeOfDay(timeSection.end)
        return idx !== timeSectionIdx && (
          // IMPORTANT NOTE: this condition is different, it's ok if we change
          // time section start to be the same as another (they will just merge)
          (newStartTime.isAfter(timeStart, 'minutes') && !newStartTime.isAfter(timeEnd, 'minutes')) ||
          // end does not lie inside another section
          (!newEndTime.isBefore(timeStart, 'minutes') && !newEndTime.isAfter(timeEnd, 'minutes')) ||
          // starts not later and ends not earlier means other section is inside this one
          (!newStartTime.isAfter(timeStart, 'minutes') && !newEndTime.isBefore(timeEnd, 'minutes'))
        )
      })
    if (overlappingSections.length > 0) {
      overlappingSections.push([timeSectionIdx, {
        ...ctx.state.timeSectionsByDay[dayNumber][timeSectionIdx],
        start // indicate the new start time
      }])
      return { wouldSectionsMerge: true, overlappingSections }
    }
  }

  // `offset` is the offset of activity index in section, used when merging
  // sections to keep correct ordering
  ctx.commit('changeTimeSection', { dayNumber, timeSectionIdx, start, offset })
  if (ctx.state.timeSectionsByDay[dayNumber][timeSectionIdx].items.length > 0) {
    return ctx.dispatch('updateTrainingPlan')
  }
}

export const adjustRoutineWithinDay = async (ctx, { dayNumber, timeSectionIdx, activity, oldIndex, newIndex }) => {
  try {
    ctx.commit('moveActivityInTimeSection', {
      dayNumber,
      timeSectionIdx,
      activity,
      from: oldIndex,
      to: newIndex
    })
    ctx.dispatch('updateActivitiesInTimeSection', {
      dayNumber,
      timeSection: ctx.state.timeSectionsByDay[dayNumber][timeSectionIdx]
    })
    ctx.dispatch('updateTrainingPlan')
  } catch { }
}

export const moveActivity = async (ctx, { addDayNumber, addTimeSectionIdx, newIndex, rmDayNumber, rmTimeSectionIdx, oldIndex, activity }) => {
  try {
    const removedId = ctx.state.timeSectionsByDay[rmDayNumber][rmTimeSectionIdx].items[oldIndex].id
    const startHour = ctx.state.timeSectionsByDay[addDayNumber][addTimeSectionIdx].start

    ctx.commit('removeRoutineFromDay', {
      day: rmDayNumber,
      id: removedId
    })

    ctx.commit('addRoutineToAnotherDay', {
      day: addDayNumber,
      routine: {
        ...activity,
        startHour,
        index: newIndex
      },
      to: newIndex
    })

    if (addDayNumber === rmDayNumber && addTimeSectionIdx === rmTimeSectionIdx) {
      // this is actually replacing an activity do nothing, so that the activity
      // card does not disappear until we fetch new activity data
    } else {
      ctx.commit('removeActivityFromTimeSection', {
        dayNumber: rmDayNumber,
        timeSectionIdx: rmTimeSectionIdx,
        from: oldIndex
      })

      ctx.commit('addActivityToTimeSection', {
        dayNumber: addDayNumber,
        timeSectionIdx: addTimeSectionIdx,
        activity: {
          ...activity,
          startHour,
          index: newIndex
        },
        to: newIndex
      })
    }
  } catch { }
}

export const updateTrainingPlan = async (ctx) => {
  const request = pick(ctx.state, ['id', 'schedules'])
  const userId = ctx.rootState.user.currentUser.id

  try {
    const response = await api.updateTrainingPlan(request)
    ctx.commit('setCurrentTrainingPlan', response.data.trainingPlan)
    ctx.dispatch('recomputeTimeSections')
    await ctx.dispatch('user/getUserActivitiesStats', userId, { root: true })
  } catch { }
}

export const pickAnotherRoutine = async (ctx, { newRoutine, oldId }) => {
  const { position, dayNumber, startHour } = ctx.state.selectedRoutine

  ctx.commit('removeRoutineFromDay', { id: oldId, day: dayNumber })
  ctx.commit('addRoutineToAnotherDay', {
    to: position,
    routine: {
      startHour: startHour,
      index: position,
      duration: ctx.rootGetters['trainingRoutine/getRoutineDuration'](newRoutine.id),
      id: newRoutine.id,
      activityInstanceId: newRoutine.id
    },
    day: dayNumber
  })

  ctx.dispatch('updateTrainingPlan', [dayNumber])
}

export const regenerateTrainingPlan = async (ctx) => {
  await api.regenerateTrainingPlan(ctx.rootState.user.currentUser.id)
  ctx.dispatch('fetchUserCurrentTrainingPlan')
}

export const getUserFriendGroupEvents = async (ctx) => {
  try {
    const response = await api.getUserFriendGroupEvents(ctx.rootState.user.currentUser.id)
    ctx.commit('setUserFriendGroupEvents', response.data.userFriendGroupEvents)
  } catch { }
}

export const updateUserFGEventStatus = async (ctx, friendGroupId, status) => {
  const response = await api.updateUserFGEventStatus(ctx.rootState.user.currentUser.id, friendGroupId, status)
  ctx.commit('setUserFriendGroupEventStatus', response.data.userFriendGroupEvent)
}

export const subscribeToEvent = async (ctx, friendGroupId) => {
  return updateUserFGEventStatus(ctx, friendGroupId, 'subscribed_internal')
}

export const unsubscribeFromEvent = async (ctx, friendGroupId) => {
  return updateUserFGEventStatus(ctx, friendGroupId, 'none')
}

export const declineEvent = async (ctx, friendGroupId) => {
  return updateUserFGEventStatus(ctx, friendGroupId, 'declined')
}
