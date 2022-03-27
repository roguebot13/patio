import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { GET_PUBLICATIONS } from '../gql/publication'
import FeedItem from './FeedItem'

export default function UserFeed({ profileId }) {
  if (!profileId || profileId === '') return null

  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_PUBLICATIONS,
    {
      fetchPolicy: 'no-cache',
      variables: {
        request: {
          profileId: profileId,
          publicationTypes: ['POST', 'COMMENT', 'MIRROR'],
          cursor: '{}',
          limit: 10,
        },
      },
    },
  )

  useEffect(refetch, [profileId])

  if (loading) {
    return (
      <div className="text-center">
        <a className="btn btn-ghost loading">Loading...</a>
      </div>
    )
  }

  if (error) {
    console.error(error)
    return null
  }

  const items = data.publications.items
  const showLoadMore =
    data.publications.items.length != data.publications.pageInfo.totalCount &&
    data.publications.pageInfo.next

  return (
    <>
      {items.map((item) => (
        <FeedItem item={item} key={item.id} />
      ))}
      {showLoadMore ? (
        <div className="text-center p-4">
          <button
            className="btn btn-primary btn-wide"
            onClick={() => {
              fetchMore({
                variables: {
                  profileId: profileId,
                  cursor: data.publications.pageInfo.next,
                },
              })
            }}
          >
            Load More
          </button>
        </div>
      ) : (
        ''
      )}
    </>
  )
}
