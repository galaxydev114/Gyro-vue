import dayjs from 'dayjs'

export const tournaments = (state, getters) => {
  return state.tournaments.map(tournament => {
    const key = `${tournament.eventId}:${tournament.eventWindowId}`
    const isParticipating = Boolean(getters.userTournamentsMap[key])

    return {
      eventId: tournament.eventId,
      eventWindowId: tournament.eventWindowId,
      date: tournament.startAt,
      title: tournament.title,
      location: tournament.regions,
      type: isParticipating ? 'PARTICIPATING' : 'UPCOMING',
      image: tournament.thumbnail,
      platforms: tournament.platforms,
      requirements: tournament.requirements
    }
  })
}

export const sortedTournaments = (state, getters) => {
  let arr = Array.from(getters.tournaments)
  const { input, typeSelected, select } = state.filters

  if (input && input.length) {
    arr = arr.filter((t) => t.title.toLowerCase().includes(input.toLowerCase()))
  }

  if (select && select.length && select.toLowerCase() !== 'all') {
    arr = arr.filter((t) => t.location.some((val) => val.toLowerCase() === select.toLowerCase()))
  }

  if (typeSelected === 'participating') {
    arr = arr.filter((t) => t.type.toLowerCase() === typeSelected.toLowerCase())
  }

  if (!arr || !arr.length) {
    return {}
  }

  arr = arr.reduce((acc, value) => {
    const dateStr = dayjs(value.date).format('MM-DD-YY').toString()
    // Group initialization

    if (!acc[dateStr]) {
      acc[dateStr] = []
    }

    // Grouping
    acc[dateStr].push(value)

    return acc
  }, {})

  return arr
}

export const userTournamentsMap = (state) => {
  return state.userTournaments.reduce((result, tournament) => {
    const key = `${tournament.tournamentEventId}:${tournament.tournamentEventWindowId}`
    result[key] = tournament
    return result
  }, {})
}
