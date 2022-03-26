import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { TIMELINE_QUERY } from '../gql/timeline'
import FeedItem from './FeedItem'

export default function TimelineFeed({ profileId }) {
  if (!profileId || profileId === '') return null

  const { data, loading, error, fetchMore, refetch } = useQuery(
    TIMELINE_QUERY,
    {
      variables: {
        profileId: profileId,
        cursor: '{}',
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

  const items = data.timeline.items
  const showLoadMore =
    data.timeline.items.length != data.timeline.pageInfo.totalCount &&
    data.timeline.pageInfo.next

  return (
    <>
      {items.map((item) => (
        <FeedItem item={item} />
      ))}
      {showLoadMore ? (
        <div className="text-center p-4">
          <button
            className="btn btn-primary btn-wide"
            onClick={() => {
              fetchMore({
                variables: {
                  profileId: profileId,
                  cursor: data.timeline.pageInfo.next,
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
