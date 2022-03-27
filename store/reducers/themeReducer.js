export const LOCAL_THEME_KEY = 'currentTheme'
let initialState = ''
if (typeof window !== 'undefined') {
  if (window.localStorage.getItem(LOCAL_THEME_KEY)) {
    initialState = window.localStorage.getItem(LOCAL_THEME_KEY)
  }
}

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      let newTheme
      if (state === 'bumblebee') newTheme = 'halloween'
      else newTheme = 'bumblebee'
      window.localStorage.setItem(LOCAL_THEME_KEY, newTheme)
      return newTheme
    case 'SWITCH_THEME':
      window.localStorage.setItem(LOCAL_THEME_KEY, action.payload)
      return action.payload
    default:
      return state
  }
}

export default reducer
