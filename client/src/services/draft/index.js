import { xhr } from '../../services'
import actions from '../../actions'

export const fetchDraft = (draft_id) => (dispatch, getState) => {
  dispatch(actions.fetchDraftStart)
  return xhr('get', `/drafts/${draft_id}`)
    .then(
      res => {
        dispatch(actions.fetchDraftSuccess(res.data))
      },
      err => {
        if (err.response.status === 401) dispatch(actions.showLogin())
        dispatch(actions.fetchDraftFailure(err))
      }
    )
}

export const fetchDrafts = () => (dispatch, getState) => {
  dispatch(actions.fetchDraftsStart)
  return xhr('get', '/drafts')
    .then(
      res => {
        dispatch(actions.fetchDraftsSuccess(res.data))
      },
      err => {
        if (err.response.status === 401) dispatch(actions.showLogin())
        dispatch(actions.fetchDraftsFailure(err))
      }
    )
}

export const fetchAthletes = () => (dispatch, getState) => {
  dispatch(actions.fetchAthletesStart)
  return xhr('get', '/athletes')
    .then(
      res => {
        dispatch(actions.fetchAthletesSuccess(res.data))
      },
      err => {
        dispatch(actions.fetchAthletesFailure(err))
      }
    )
}

export const makePick = (athlete, team) => (dispatch, getState) => {
  dispatch(actions.makePickStart)
  return xhr('post', '/picks', {data: {
    athlete_id: athlete.id,
    team_id: team.id,
  }})
    .then(
      res => {
        dispatch(actions.makePickSuccess(res.data))
      },
      err => {
        dispatch(actions.makePickFailure(err))
      },
    )
}
