export const LOCAL_PROFILE_KEY = 'currentProfile'
let initialState = {}
if (typeof window !== 'undefined') {
  if (window.localStorage.getItem(LOCAL_PROFILE_KEY)) {
    initialState = JSON.parse(window.localStorage.getItem(LOCAL_PROFILE_KEY))
  }
}

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'UPDATE_LOCAL_PROFILE':
      const profile = action.payload
      window.localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile))
      return profile
    case 'REMOVE_LOCAL_PROFILE':
      window.localStorage.removeItem(LOCAL_PROFILE_KEY)
      return {}
    default:
      return state
  }
}

export default reducer
