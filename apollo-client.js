import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://api-mumbai.lens.dev',
  cache: new InMemoryCache(),
})

export default client
