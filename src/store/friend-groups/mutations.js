export const setFriendGroups = (state, friendGroups = []) => {
  state.friendGroups = friendGroups.reduce((result, friendGroup) => {
    result[friendGroup.id] = friendGroup
    return result
  }, {})
}

export const setApplications = (state, applications = []) => {
  state.applications = applications.reduce((result, application) => {
    result[application.id] = application
    return result
  }, {})
}

export const updateApplication = (state, application) => {
  state.applications[application.id] = application
}

export const setJoinFGButtonState = (state, value) => {
  state.joinFGButtonState = value || ''
}

export const setPreferredLanguage = (state, value) => {
  state.preferredLanguage = value || ''
}
