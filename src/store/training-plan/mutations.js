import Vue from 'vue'

const _moveWithinDay = (arr, { from, to, routine }) => {
  const newArr = Array.from(arr)
  newArr.splice(from, 1)
  newArr.splice(to, 0, routine)
  return newArr
}

const _addToAnotherDay = (day, { to, routine }) => {
  const clonedDay = Array.from(day)
  clonedDay.splice(to, 0, routine)
  return clonedDay
}

const _removeFromDay = (day, { id }) => {
  return day.filter(activity => activity.activityInstanceId !== id)
}

const _updateActivity = (day, { id, index, startHour }) => {
  return day.map(activity => {
    if (activity.activityInstanceId === id) {
      activity.startHour = startHour
      activity.index = index
    }
    return activity
  })
}

export const moveRoutineWithinDay = (state, { from, to, routine, day }) => {
  Vue.set(state.schedules[day], 'items', _moveWithinDay(state.schedules[day].items, { from, to, routine }))
}

export const addRoutineToAnotherDay = (state, { to, routine, day }) => {
  Vue.set(state.schedules[day], 'items', _addToAnotherDay(state.schedules[day].items, { to, routine }))
}

export const removeRoutineFromDay = (state, { id, day }) => {
  Vue.set(state.schedules[day], 'items', _removeFromDay(state.schedules[day].items, { id }))
}

export const updateActivityInDay = (state, { day, id, index, startHour }) => {
  Vue.set(state.schedules[day], 'items', _updateActivity(state.schedules[day].items, { id, index, startHour }))
}

export const updateActivitiesInDay = (state, { day, activities }) => {
  for (const activity of activities) {
    updateActivityInDay(state, {
      day,
      id: activity.id,
      index: activity.index,
      startHour: activity.startHour
    })
  }
}

export const setCurrentTrainingPlan = (state, trainingPlan) => {
  state.id = trainingPlan.id
  state.userId = trainingPlan.userId
  state.startDate = trainingPlan.startDate
  state.schedules = trainingPlan.schedules
  state.focus = trainingPlan.focus
  state.createdAt = new Date(trainingPlan.createdAt)
  state.updatedAt = new Date(trainingPlan.updatedAt)
}

export const setSelectedRoutine = (state, { position, dayNumber, timeSectionIdx, startHour }) => {
  state.selectedRoutine = { position, dayNumber, timeSectionIdx, startHour }
}

export const setRecomputedTimeSections = (state, timeSectionsByDay) => {
  for (const [dayNumber, timeSections] of timeSectionsByDay.entries()) {
    if (!timeSections) continue
    // Propagate index changes back to underlying data because items in
    // timeSection have been cloned through trainingDay getter when computing time
    // sections (recomputeTimeSections). The trainingDay getter is what provides
    // session durations for calculating time sections.
    const activities = timeSections.flatMap(timeSection =>
      [...timeSection.items.entries()].map(([index, activity]) => ({
        ...activity,
        index,
        startHour: timeSection.start
      })))
    for (const activity of activities) {
      updateActivityInDay(state, {
        day: dayNumber,
        ...activity
      })
    }

    Vue.set(state.timeSectionsByDay, dayNumber, timeSections)
  }
}

export const addTimeSection = (state, { dayNumber, start }) => {
  let index = 0
  for (const timeSection of state.timeSectionsByDay[dayNumber]) {
    if (timeSection.start > start) { break }
    index++
  }
  state.timeSectionsByDay[dayNumber].splice(index, 0, {
    start,
    end: null,
    items: []
  })
}

export const changeTimeSection = (state, { dayNumber, timeSectionIdx, start, offset = 0 }) => {
  Vue.set(state.timeSectionsByDay[dayNumber][timeSectionIdx], 'start', start)
  for (const activity of state.timeSectionsByDay[dayNumber][timeSectionIdx].items) {
    updateActivityInDay(state, {
      day: dayNumber,
      ...activity,
      startHour: start,
      index: activity.index + offset
    })
  }
}

export const moveActivityInTimeSection = (state, { dayNumber, timeSectionIdx, activity, from, to }) => {
  state.timeSectionsByDay[dayNumber][timeSectionIdx].items.splice(from, 1)
  state.timeSectionsByDay[dayNumber][timeSectionIdx].items.splice(to, 0, activity)
}

export const addActivityToTimeSection = (state, { dayNumber, timeSectionIdx, activity, to }) => {
  state.timeSectionsByDay[dayNumber][timeSectionIdx].items.splice(to, 0, activity)
}

export const removeActivityFromTimeSection = (state, { dayNumber, timeSectionIdx, from }) => {
  state.timeSectionsByDay[dayNumber][timeSectionIdx].items.splice(from, 1)
}
