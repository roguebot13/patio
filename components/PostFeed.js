import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { GET_COMMENTS_BY_PUBLICATION } from '../gql/publication'
import Post from './Post'

export default function PostFeed({ publicationId }) {
  if (!publicationId || publicationId === '') return null

  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_COMMENTS_BY_PUBLICATION,
    {
      variables: {
        publicationId: publicationId,
        cursor: '{}',
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
        <Post item={item} />
      ))}
      {showLoadMore ? (
        <div className="text-center p-4">
          <button
            className="btn btn-primary btn-wide"
            onClick={() => {
              fetchMore({
                variables: {
                  publicationId: publicationId,
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
