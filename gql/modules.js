import apolloClient from '../apollo-client'
// this is showing you how you use it with react for example
// if your using node or something else you can import using
// @apollo/client/core!
import { gql } from '@apollo/client'

const ENABLED_MODULES = gql`
  query {
    enabledModules {
      collectModules {
        moduleName
        contractAddress
        inputParams {
          name
          type
        }
        redeemParams {
          name
          type
        }
        returnDataParms {
          name
          type
        }
      }
      followModules {
        moduleName
        contractAddress
        inputParams {
          name
          type
        }
        redeemParams {
          name
          type
        }
        returnDataParms {
          name
          type
        }
      }
      referenceModules {
        moduleName
        contractAddress
        inputParams {
          name
          type
        }
        redeemParams {
          name
          type
        }
        returnDataParms {
          name
          type
        }
      }
    }
  }
`

export const enabledModules = () => {
  return apolloClient.query({
    query: ENABLED_MODULES,
  })
}
