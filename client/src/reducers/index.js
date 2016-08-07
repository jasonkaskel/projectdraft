import { combineReducers } from 'redux'
import draft from './draft'
import login from './login'

const appStore = combineReducers({
  draft,
  login,
})

export default appStore
