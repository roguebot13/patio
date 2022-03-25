import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://api-mumbai.lens.dev',
  request: (operation) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      operation.setContext({
        headers: {
          'x-access-token': accessToken,
        },
      })
    }
  },
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          explorePublications: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: ['sortCriteria'],

            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing = { items: [] }, incoming) {
              return {
                ...incoming,
                items: [...existing.items, ...incoming.items],
              }
            },
          },
          timeline: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: ['profileId'],

            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing = { items: [] }, incoming) {
              return {
                ...incoming,
                items: [...existing.items, ...incoming.items],
              }
            },
          },
        },
      },
    },
  }),
})

export default client
