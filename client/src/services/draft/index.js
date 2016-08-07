import { xhr } from '../../services'
import actions from '../../actions'

export const fetchDraft = () => (dispatch, getState) => {
  dispatch(actions.fetchDraftStart)
  return xhr('get', '/hc_draft')
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
