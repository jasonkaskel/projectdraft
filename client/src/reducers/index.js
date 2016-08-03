import { combineReducers } from 'redux'
import draft from './draft'

const appStore = combineReducers({
  draft,
})

export default appStore
