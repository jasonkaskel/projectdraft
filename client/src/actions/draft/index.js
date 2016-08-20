export const fetchDraftStart = () => ({
  type: 'FETCH_DRAFT_START'
})

export const fetchDraftSuccess = (data) => ({
  type: 'FETCH_DRAFT_SUCCESS',
  data
})

export const fetchDraftFailure = (error) => ({
  type: 'FETCH_DRAFT_FAILURE',
  error
})

export const fetchDraftsStart = () => ({
  type: 'FETCH_DRAFTS_START'
})

export const fetchDraftsSuccess = (data) => ({
  type: 'FETCH_DRAFTS_SUCCESS',
  data
})

export const fetchDraftsFailure = (error) => ({
  type: 'FETCH_DRAFTS_FAILURE',
  error
})

export const fetchAthletesStart = () => ({
  type: 'FETCH_ATHLETE_START'
})

export const fetchAthletesSuccess = (data) => ({
  type: 'FETCH_ATHLETE_SUCCESS',
  data
})

export const fetchAthletesFailure = (error) => ({
  type: 'FETCH_ATHLETE_FAILURE',
  error
})

export const makePickStart = () => ({
  type: 'MAKE_PICK_START'
})

export const makePickSuccess = (data) => ({
  type: 'MAKE_PICK_SUCCESS',
  data
})

export const makePickFailure = (error) => ({
  type: 'MAKE_PICK_FAILURE',
  error
})

export const setSearchTerm = (term) => ({
  type: 'SET_SEARCH_TERM',
  term
})

export const updateSearchFilters = (position, toggle) => ({
  type: 'UPDATE_SEARCH_FILTERS',
  position,
  toggle
})

export const setCurrentPick = (athlete) => ({
  type: 'SET_CURRENT_PICK',
  athlete
})
