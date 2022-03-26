import { useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import {
  EXPLORE_PUBLICATIONS_QUERY,
  ExlporePublicationsSortCriteria,
} from '../gql/explorePublications'
import Link from 'next/link'
import FeedItem from './FeedItem'

export default function ExploreFeed({
  sortCriteria = ExlporePublicationsSortCriteria.TOP_COMMENTED,
}) {
  const { data, loading, error, fetchMore, refetch } = useQuery(
    EXPLORE_PUBLICATIONS_QUERY,
    {
      variables: {
        sortCriteria: sortCriteria,
        cursor: '{}',
      },
    },
  )

  useEffect(refetch, [sortCriteria])

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

  const items = data.explorePublications.items
  const showLoadMore =
    data.explorePublications.items.length !=
      data.explorePublications.pageInfo.totalCount &&
    data.explorePublications.pageInfo.next
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
                  sortCriteria: sortCriteria,
                  cursor: data.explorePublications.pageInfo.next,
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
