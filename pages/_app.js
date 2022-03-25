import '../styles/globals.css'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo-client'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ClientOnly from '../components/ClientOnly'
import PageSelector from '../components/PageSelector'

dayjs.extend(relativeTime)

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <ClientOnly>
        <div
          className="flex justify-center w-screen h-screen px-4"
          data-theme="bumblebee"
        >
          <div className="flex w-full max-w-screen-lg">
            <PageSelector active="home" />
            <div className="flex flex-col flex-grow border-l border-r border-gray-300">
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </ClientOnly>
    </ApolloProvider>
  )
}

export default MyApp
