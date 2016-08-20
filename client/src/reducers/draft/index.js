const DEFAULT_SEARCH_FILTERS = ["QB","WR","RB","TE","K","DEF"]

const initialState = {
  isFetching: false,
  isMakingPick: false,
  makePickError: null,
  drafts: [],
  draft: {
    teams: [],
    picks: [],
    total_rounds: 15,
  },
  athletes: null,
  searchTerm: null,
  searchFilters: DEFAULT_SEARCH_FILTERS,
  currentPick: null,
}

const splicePicksIntoAthletes = (athletes, picks) => {
  if (athletes === null) return null

  return athletes.map(a => {
    const pick = picks.filter(p => p.athlete_id === a.id)
    if (pick.length === 0) return a
    return {
      ...a,
      pick: pick
    }
  })
}

const draft = (state = initialState, action) => {
  switch(action.type) {
    case 'FETCH_DRAFT_START':
      return {
        ...state,
        isFetching: true,
        error: null
      }
    case 'FETCH_DRAFT_SUCCESS':
      return {
        ...state,
        isFetching: false,
        error: null,
        draft: action.data.draft,
        athletes: splicePicksIntoAthletes(state.athletes, action.data.draft.picks)
      }
    case 'FETCH_DRAFT_FAILURE':
      return {
        ...state,
        error: action.error.response.status === 401 ?
          null :
          "There was an error with your request"
      }
    case 'FETCH_DRAFTS_START':
      return {
        ...state,
        isFetching: true,
        error: null
      }
    case 'FETCH_DRAFTS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        error: null,
        drafts: action.data.drafts,
      }
    case 'FETCH_DRAFTS_FAILURE':
      return {
        ...state,
        error: action.error.response.status === 401 ?
          null :
          "There was an error with your request"
      }
    case 'FETCH_ATHLETE_START':
      return {
        ...state,
        isFetching: true,
        error: null
      }
    case 'FETCH_ATHLETE_SUCCESS':
      return {
        ...state,
        isFetching: false,
        error: null,
        athletes: action.data.athletes
      }
    case 'FETCH_ATHLETE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.err
      }
    case 'MAKE_PICK_START':
      return {
        ...state,
        isMakingPick: true,
        makePickError: null
      }
    case 'MAKE_PICK_SUCCESS':
      return {
        ...state,
        isMakingPick: false,
        makePickError: null,
        draft: {
          ...state.draft,
          picks: state.draft.picks.concat([action.data.pick])
        },
        athletes: splicePicksIntoAthletes(state.athletes, [action.data.pick]),
        currentPick: null,
        searchTerm: null,
        searchFilters: DEFAULT_SEARCH_FILTERS
      }
    case 'MAKE_PICK_FAILURE':
      return {
        ...state,
        isMakingPick: false,
        makePickError: action.error.response.status === 403 ?
          "It is not currently your pick" :
          "There was an error with your request",
      }
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.term
      }
    case 'UPDATE_SEARCH_FILTERS':
      return {
        ...state,
        searchFilters:
          action.toggle
            ? state.searchFilters.concat(action.position)
            : state.searchFilters.filter(position => position !== action.position)
      }
    case 'SET_CURRENT_PICK':
      return {
        ...state,
        currentPick: action.athlete
      }
    default:
      return state
  }
}

export default draft
