export const setCollaborators = (state, collaborators = []) => {
  state.collaborators = collaborators.reduce((result, collaborator) => {
    result[collaborator.slug] = collaborator
    return result
  }, {})
}
