import '../styles/globals.css'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo-client'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ClientOnly from '../components/ClientOnly'
import Notifications from '../components/Notifications'
import rootReducer from '../store/reducers'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import Layout from '../components/Layout'

dayjs.extend(relativeTime)
const store = createStore(rootReducer)

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ClientOnly>
          <Layout Component={Component} pageProps={pageProps} />
          <Notifications />
        </ClientOnly>
      </ApolloProvider>
    </Provider>
  )
}

export default MyApp
