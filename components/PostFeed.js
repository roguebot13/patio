import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { GET_PUBLICATIONS } from '../gql/publication'
import Post from './Post'

export default function PostFeed({ publicationId }) {
  if (!publicationId || publicationId === '') return null

  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_PUBLICATIONS,
    {
      variables: {
        request: {
          commentsOf: publicationId,
          cursor: '{}',
          limit: 10,
        },
      },
    },
  )

  useEffect(refetch, [publicationId])

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
        <Post item={item} key={item.id} />
      ))}
      {showLoadMore ? (
        <div className="text-center p-4">
          <button
            className="btn btn-primary btn-wide"
            onClick={() => {
              fetchMore({
                variables: {
                  request: {
                    commentsOf: publicationId,
                    cursor: data.publications.pageInfo.next,
                    limit: 10,
                  },
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
