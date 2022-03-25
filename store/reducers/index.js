import { combineReducers } from 'redux'
// import hydrateReducer from "./hydrate";
import { reducer as notificationsReducer } from 'reapop'
import profileReducer from './profileReducer'

const rootReducer = combineReducers({
  //   hydrate: hydrateReducer,
  notifications: notificationsReducer(),
  profile: profileReducer,
})

export default rootReducer
