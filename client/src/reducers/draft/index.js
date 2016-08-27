import update from 'react/lib/update';

const initialState = {
  isFetching: false,
  isMakingPick: false,
  isUpdatingDraft: false,
  updateDraftError: null,
  makePickError: null,
  drafts: [],
  draft: {
    teams: [],
    picks: [],
    total_rounds: 15,
    positions: {},
  },
  team: null,
  athletes: null,
  searchTerm: '',
  searchFilters: ["QB", "WR", "RB", "TE"],
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
        team: action.data.team,
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
          picks: state.draft.picks.concat([action.data.pick]),
          on_the_clock: action.data.on_the_clock,
          can_pick: action.data.can_pick,
        },
        athletes: splicePicksIntoAthletes(state.athletes, [action.data.pick]),
        currentPick: null,
        searchTerm: '',
        searchFilters: [],
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
    case 'REORDER_TEAMS':
      return {
        ...state,
        draft: update(state.draft, {
          teams: {
            $splice: [
              [action.dragged, 1],
              [action.hovered, 0, action.team]
            ]
          }
        })
      }
    case 'UPDATE_DRAFT_ORDER_START':
      return {
        ...state,
        isUpdatingDraft: true,
        updateDraftError: null
      }
    case 'UPDATE_DRAFT_ORDER_SUCCESS':
      return {
        ...state,
        isUpdatingDraft: false,
        updateDraftError: false,
        draft: {
          ...state.draft,
          teams: action.data.draft.teams,
        },
      }
    case 'UPDATE_DRAFT_ORDER_FAILURE':
      return {
        ...state,
        isUpdatingDraft: false,
        updateDraftError: action.err
      }
    default:
      return state
  }
}

export default draft
