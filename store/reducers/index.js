import { combineReducers } from 'redux'
// import hydrateReducer from "./hydrate";
import { reducer as notificationsReducer } from 'reapop'
import profileReducer from './profileReducer'
import themeReducer from './themeReducer'

const rootReducer = combineReducers({
  //   hydrate: hydrateReducer,
  notifications: notificationsReducer(),
  profile: profileReducer,
  theme: themeReducer,
})

export default rootReducer
