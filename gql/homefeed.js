import { gql } from '@apollo/client'
import apolloClient from '../apollo-client'
import sortBy from 'lodash/sortBy'

const GET_FOLLOWING = gql`
  query($request: FollowingRequest!) {
    following(request: $request) {
      items {
        profile {
          id
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

const GET_PUBLICATION_STATS = gql`
  query GetFollowingPublicaitons($profileId: ProfileId!) {
    publications(
      request: {
        publicationTypes: [POST, COMMENT, MIRROR]
        profileId: $profileId
        limit: 50
      }
    ) {
      items {
        __typename
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }

  fragment PostFields on Post {
    id
    stats {
      ...PublicationStatsFields
    }
    createdAt
    appId
  }

  fragment PublicationStatsFields on PublicationStats {
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }

  fragment MirrorBaseFields on Mirror {
    id
    stats {
      ...PublicationStatsFields
    }
    createdAt
    appId
  }

  fragment MirrorFields on Mirror {
    ...MirrorBaseFields
    mirrorOf {
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
    }
  }

  fragment CommentBaseFields on Comment {
    id
    stats {
      ...PublicationStatsFields
    }
    createdAt
    appId
  }

  fragment CommentFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
        mirrorOf {
          ... on Post {
            ...PostFields
          }
          ... on Comment {
            ...CommentMirrorOfFields
          }
        }
      }
    }
  }

  fragment CommentMirrorOfFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
      }
    }
  }
`

export const GET_PUBLICATIONS = gql`
  query CommentsOfPublication($publicationIds: [InternalPublicationId!]) {
    publications(request: { publicationIds: $publicationIds, limit: 10 }) {
      items {
        __typename
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }

  fragment MediaFields on Media {
    url
    mimeType
  }

  fragment ProfileFields on Profile {
    id
    name
    bio
    location
    website
    twitterUrl
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    ownedBy
    depatcher {
      address
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
            name
            symbol
            decimals
            address
          }
          value
        }
        recipient
      }
    }
  }

  fragment PublicationStatsFields on PublicationStats {
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    media {
      original {
        ...MediaFields
      }
    }
    attributes {
      displayType
      traitType
      value
    }
  }

  fragment Erc20Fields on Erc20 {
    name
    symbol
    decimals
    address
  }

  fragment CollectModuleFields on CollectModule {
    __typename
    ... on EmptyCollectModuleSettings {
      type
    }
    ... on FeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
    ... on RevertCollectModuleSettings {
      type
    }
    ... on TimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
  }

  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
  }

  fragment MirrorBaseFields on Mirror {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
  }

  fragment MirrorFields on Mirror {
    ...MirrorBaseFields
    mirrorOf {
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
    }
  }

  fragment CommentBaseFields on Comment {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
  }

  fragment CommentFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
        mirrorOf {
          ... on Post {
            ...PostFields
          }
          ... on Comment {
            ...CommentMirrorOfFields
          }
        }
      }
    }
  }

  fragment CommentMirrorOfFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
      }
    }
  }
`

const getFollowing = (address) => {
  return apolloClient.query({
    query: GET_FOLLOWING,
    variables: {
      request: {
        address,
        limit: 50, // Max limit
      },
    },
  })
}

const getPublicationStats = (profileId) => {
  return apolloClient.query({
    query: GET_PUBLICATION_STATS,
    variables: {
      profileId,
    },
  })
}

const getPublications = (publicationIds) => {
  return apolloClient.query({
    query: GET_PUBLICATIONS,
    variables: {
      request: {
        publicationIds,
        limit: 10,
      },
    },
  })
}

const computePublicationScore = (pub) => {
  const mirrorBoost = 1,
    collectBoost = 1,
    commentBoost = 1
  let score = 0
  if (pub) {
    switch (pub.__typename) {
      case 'Post':
        score =
          pub.stats.totalAmountOfMirrors * mirrorBoost +
          pub.stats.totalAmountOfCollects * collectBoost +
          pub.stats.totalAmountOfComments * commentBoost
        break
      case 'Comment':
        score = 0.8 * computePublicationScore(pub.mainPost)
      case 'Mirror':
        score = 0.5 * computePublicationScore(pub.mirrorOf)
    }
  }
  return score
}

export const getHomeFeedPublications = async (address) => {
  console.log('Constructing home feed..')
  const followRes = await getFollowing(address)
  let profileReqs = []
  for (let i = 0; i < followRes.data.following.items.length; i++) {
    profileReqs.push(
      getPublicationStats(followRes.data.following.items[i].profile.id),
    )
  }
  const profileRes = await Promise.all(profileReqs)
  console.log(profileRes)
  const publications = []
  for (let i = 0; i < profileRes.length; i++) {
    for (let j = 0; j < profileRes[i].data.publications.items.length; j++) {
      console.log('comp', profileRes[i].data.publications.items[j].id)
      publications.push({
        id: profileRes[i].data.publications.items[j].id,
        score: computePublicationScore(
          profileRes[i].data.publications.items[j],
        ),
      })
    }
  }
  const sorted = sortBy(publications, ['score'])
  console.log(sorted)
  return sorted
}
