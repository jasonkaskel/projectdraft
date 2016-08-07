import { xhr } from '../../services'
import actions from '../../actions'

export const requestToken = (emailOrCell) => (dispatch, getState) => {
  dispatch(actions.requestTokenStart)
  return xhr('post', '/tokens', {data: { email_or_cell: emailOrCell }})
    .then(
      res => {
        dispatch(actions.requestTokenSuccess(res.data))
      },
      err => {
        dispatch(actions.requestTokenFailure(err))
      }
    )
}

export const login = (token) => (dispatch, getState) => {
  dispatch(actions.loginStart)
  return xhr('post', '/sessions', {data: { token }})
    .then(
      res => {
        dispatch(actions.loginSuccess())
        localStorage.setItem('Client-Access-Token', res.data.session)
      },
      err => {
        dispatch(actions.loginFailure(err))
        dispatch(actions.showLogin())
      }
    )
}
