import { gql } from '@apollo/client'

export const HAS_TX_BEEN_INDEXED = gql`
  query($request: HasTxHashBeenIndexedRequest!) {
    hasTxHashBeenIndexed(request: $request) {
      ... on TransactionIndexedResult {
        indexed
        txReceipt {
          to
          from
          contractAddress
          transactionIndex
          root
          gasUsed
          logsBloom
          blockHash
          transactionHash
          blockNumber
          confirmations
          cumulativeGasUsed
          effectiveGasPrice
          byzantium
          type
          status
          logs {
            blockNumber
            blockHash
            transactionIndex
            removed
            address
            data
            topics
            transactionHash
            logIndex
          }
        }
        metadataStatus {
          status
          reason
        }
      }
      ... on TransactionError {
        reason
        txReceipt {
          to
          from
          contractAddress
          transactionIndex
          root
          gasUsed
          logsBloom
          blockHash
          transactionHash
          blockNumber
          confirmations
          cumulativeGasUsed
          effectiveGasPrice
          byzantium
          type
          status
          logs {
            blockNumber
            blockHash
            transactionIndex
            removed
            address
            data
            topics
            transactionHash
            logIndex
          }
        }
      }
      __typename
    }
  }
`
