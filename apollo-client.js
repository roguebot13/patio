import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client'

const httpLink = new HttpLink({ uri: 'https://api-mumbai.lens.dev/' })

// example how you can pass in the x-access-token into requests using `ApolloLink`
const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  // if your using node etc you have to handle your auth different
  const token = localStorage.getItem('accessToken')

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      'x-access-token': token ? `Bearer ${token}` : '',
    },
  })

  // Call the next link in the middleware chain.
  return forward(operation)
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
          publications: {
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
          // profiles: {
          //   keyArgs: ['address', 'handle'],

          //   // Concatenate the incoming list items with
          //   // the existing list items.
          //   merge(existing = { items: [] }, incoming) {
          //     return {
          //       ...incoming,
          //       items: [...existing.items, ...incoming.items],
          //     }
          //   },
          // },
        },
      },
    },
  }),
})

export default client
