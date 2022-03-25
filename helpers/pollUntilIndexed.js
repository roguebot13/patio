import apolloClient from '../apollo-client'

import { HAS_TX_BEEN_INDEXED } from '../gql/indexer'

export const hasTxBeenIndexed = (txHash) => {
  return apolloClient.query({
    query: HAS_TX_BEEN_INDEXED,
    variables: {
      request: {
        txHash,
      },
    },
    fetchPolicy: 'network-only',
  })
}

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export const pollUntilIndexed = async (txHash) => {
  while (true) {
    const result = await hasTxBeenIndexed(txHash)
    const response = result.data.hasTxHashBeenIndexed
    if (response.__typename === 'TransactionIndexedResult') {
      if (response.metadataStatus) {
        if (response.metadataStatus.status === 'SUCCESS') {
          return response
        }

        if (response.metadataStatus.status === 'METADATA_VALIDATION_FAILED') {
          throw new Error(response.metadataStatus.reason)
        }
      } else {
        if (response.indexed) {
          return response
        }
        await sleep(1000)
        continue
      }
    }

    throw new Error(response.reason)
    // it got reverted and failed!
    // throw new Error(response.reason)
  }
}
