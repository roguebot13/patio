import { gql } from '@apollo/client'
import apolloClient from '../apollo-client'

export const GET_PROFILE_BY_OWNER = gql`
  query Profiles($address: EthereumAddress!) {
    profiles(request: { ownedBy: [$address], limit: 10 }) {
      items {
        id
        name
        bio
        location
        website
        twitterUrl
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        handle
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        ownedBy
        depatcher {
          address
          canUseRelay
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ... on FeeFollowModuleSettings {
            type
            amount {
              asset {
                symbol
                name
                decimals
                address
              }
              value
            }
            recipient
          }
          __typename
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`

export const GET_PROFILE_BY_HANDLE = gql`
  query Profiles($handle: Handle!) {
    profiles(request: { handles: [$handle], limit: 1 }) {
      items {
        id
        name
        bio
        location
        website
        twitterUrl
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        handle
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        ownedBy
        depatcher {
          address
          canUseRelay
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ... on FeeFollowModuleSettings {
            type
            amount {
              asset {
                symbol
                name
                decimals
                address
              }
              value
            }
            recipient
          }
          __typename
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`

export const CREATE_PROFILE = gql`
  mutation($request: CreateProfileRequest!) {
    createProfile(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
      __typename
    }
  }
`

export const UPDATE_PROFILE = gql`
  mutation($request: UpdateProfileRequest!) {
    updateProfile(request: $request) {
      id
    }
  }
`

export const CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA = gql`
  mutation($request: UpdateProfileImageRequest!) {
    createSetProfileImageURITypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          SetProfileImageURIWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          imageURI
          profileId
        }
      }
    }
  }
`

export const updateProfile = (request) => {
  return apolloClient.mutate({
    mutation: UPDATE_PROFILE,
    variables: {
      request,
    },
  })
}

export const createSetProfileImageUriTypedData = (request) => {
  return apolloClient.mutate({
    mutation: CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA,
    variables: {
      request,
    },
  })
}

export const getProfile = (handle) => {
  return apolloClient.query({
    query: GET_PROFILE_BY_HANDLE,
    variables: {
      handle,
    },
  })
}
