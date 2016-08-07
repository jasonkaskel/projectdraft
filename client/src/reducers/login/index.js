const initialState = {
  emailOrCell: null,
  isFetching: false,
  error: null,
  token: null,
  loggedIn: false,
  showLogin: false,
  loginDisabled: false,
}

const login = (state = initialState, action) => {
  switch(action.type) {
    case 'REQUEST_TOKEN_START':
      return {
        ...state,
        isFetching: true,
        error: null,
        loginDisabled: true,
      }
    case 'REQUEST_TOKEN_SUCCESS':
      return {
        ...state,
        isFetching: false,
        error: null,
        token: action.data.token, // TODO: just for dev purposes
        loginDisabled: false,
      }
    case 'REQUEST_TOKEN_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error.response.status === 404 ?
          "Invalid or expired token" :
          "There was an error with your request",
        loginDisabled: false,
      }
    case 'LOGIN_START': {
      return {
        ...state,
        isFetching: true,
        error: null
      }
    }
    case 'LOGIN_SUCCESS': {
      return {
        ...state,
        isFetching: false,
        error: null
      }
    }
    case 'LOGIN_FAILURE': {
      return {
        ...state,
        isFetching: false,
        error: action.error.response.status === 404 ?
          "Invalid or expired token" :
          "There was an error with your request",
      }
    }
    case 'SHOW_LOGIN': {
      return {
        ...state,
        showLogin: true
      }
    }
    case 'HIDE_LOGIN': {
      return {
        ...state,
        showLogin: false
      }
    }
    case 'SET_EMAIL_OR_CELL': {
      return {
        ...state,
        emailOrCell: action.emailOrCell,
      }
    }
    case 'LOGIN': {
      return {
        ...state,
        loggedIn: true
      }
    }
    default:
      return state
  }
}

export default login
