export const requestTokenStart = () => ({
  type: 'REQUEST_TOKEN_START'
})

export const requestTokenSuccess = (data) => ({
  type: 'REQUEST_TOKEN_SUCCESS',
  data
})

export const requestTokenFailure = (error) => ({
  type: 'REQUEST_TOKEN_FAILURE',
  error
})

export const loginStart = () => ({
  type: 'LOGIN_START'
})

export const loginSuccess = (data) => ({
  type: 'LOGIN_SUCCESS',
  data
})

export const loginFailure = (error) => ({
  type: 'LOGIN_FAILURE',
  error
})

export const showLogin = () => ({
  type: 'SHOW_LOGIN',
})

export const hideLogin = () => ({
  type: 'HIDE_LOGIN',
})

export const setEmailOrCell = (emailOrCell) => ({
  type: 'SET_EMAIL_OR_CELL',
  emailOrCell
})
