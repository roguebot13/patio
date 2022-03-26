import '../styles/globals.css'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo-client'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ClientOnly from '../components/ClientOnly'
import PageSelector from '../components/PageSelector'
import Notifications from '../components/Notifications'
import rootReducer from '../store/reducers'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

dayjs.extend(relativeTime)
const store = createStore(rootReducer)

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ClientOnly>
          <div
            className="flex justify-center w-screen h-screen px-4 bg-base-100 text-base-content"
            data-theme="halloween"
          >
            <div className="flex w-full max-w-screen-lg">
              <PageSelector active="home" />
              <div className="flex flex-col flex-grow border-l border-r border-base-300">
                <Component {...pageProps} />
              </div>
            </div>
          </div>
          <Notifications />
        </ClientOnly>
      </ApolloProvider>
    </Provider>
  )
}

export default MyApp
