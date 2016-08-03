import axios from 'axios'

import actions from '../../actions'
import { API_URL } from '../../constants'

export const fetchDraft = () => (dispatch, getState) => {
  dispatch(actions.fetchDraftStart)
  return axios.get(`${API_URL}/hc_draft`)
    .then(
      res => {
        dispatch(actions.fetchDraftSuccess(res.data))
      },
      err => {
        dispatch(actions.fetchDraftFailure(err))
      }
    )
}

export const fetchAthletes = () => (dispatch, getState) => {
  dispatch(actions.fetchAthletesStart)
  return axios.get(`${API_URL}/api/athletes`)
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
  return axios.post(`${API_URL}/api/picks`, {
    athlete_id: athlete.id,
    team_id: team.id,
  })
    .then(
      res => {
        dispatch(actions.makePickSuccess(res.data))
      },
      err => {
        dispatch(actions.makePickFailure(err))
      },
    )
}
