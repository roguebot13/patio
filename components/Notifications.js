import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NotificationsSystem, {
  atalhoTheme,
  dismissNotification,
  setUpNotifications,
} from 'reapop'
// run this function when your application starts before creating any notifications
setUpNotifications({
  defaultProps: {
    position: 'top-right',
    dismissible: true,
    dismissAfter: 6000,
  },
})

export default function Notifications() {
  const dispatch = useDispatch()
  // 1. Retrieve the notifications to display.
  const notifications = useSelector((state) => state.notifications)

  return (
    <div>
      <NotificationsSystem
        // 2. Pass the notifications you want Reapop to display.
        notifications={notifications}
        // 3. Pass the function used to dismiss a notification.
        dismissNotification={(id) => dispatch(dismissNotification(id))}
        // 4. Pass a builtIn theme or a custom theme.
        theme={atalhoTheme}
      />
    </div>
  )
}
