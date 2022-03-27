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

const ENABLED_CURRENCIES = gql`
  query {
    enabledModuleCurrencies {
      name
      symbol
      decimals
      address
    }
  }
`

export const enabledCurrencies = () => {
  return apolloClient.query({
    query: ENABLED_CURRENCIES,
  })
}

const MODULE_APPROVAL_DATA = gql`
  query($request: GenerateModuleCurrencyApprovalDataRequest!) {
    generateModuleCurrencyApprovalData(request: $request) {
      to
      from
      data
    }
  }
`

export const getModuleApprovalData = (moduleApprovalRequest) => {
  return apolloClient.query({
    query: MODULE_APPROVAL_DATA,
    variables: {
      request: moduleApprovalRequest,
    },
  })
}
