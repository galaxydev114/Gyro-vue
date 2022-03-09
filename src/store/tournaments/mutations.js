export const setTournaments = (state, tournaments) => {
  state.tournaments = tournaments
}

export const setUserTournaments = (state, userTournaments) => {
  state.userTournaments = userTournaments
}

export const addUserTournament = (state, userTournament) => {
  state.userTournaments = [...state.userTournaments, userTournament]
}

export const removeUserTournament = (state, userTournamentId) => {
  state.userTournaments = state.userTournaments.filter(tournament => tournament.id !== userTournamentId)
}

export const setRegions = (state, regions = []) => {
  state.regions = regions
}

export const setFilterInput = (state, value) => {
  state.filters.input = value
}

export const setFilterTypeSelected = (state, value) => {
  state.filters.typeSelected = value
}

export const setFilterSelect = (state, value) => {
  state.filters.select = value
}
