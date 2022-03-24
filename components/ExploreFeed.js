import { useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import {
  EXPLORE_PUBLICATIONS_QUERY,
  ExlporePublicationsSortCriteria,
} from '../gql/explorePublications'

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

  const posts = data.explorePublications.items

  return (
    <>
      {posts.map((post) => (
        <div className="flex w-full p-8 border-b border-gray-300">
          <div className="flex-shrink-0 avatar">
            <div className="w-12 h-12 rounded-full bg-gray-400">
              <img src={post.profile.picture?.original.url} />
            </div>
          </div>
          <div className="flex flex-col flex-grow ml-4 prose">
            <div className="flex">
              <span className="font-semibold">{post.profile.name}</span>
              <span className="ml-1">@{post.profile.handle}</span>
              <span className="ml-auto text-sm">
                {dayjs(post.createdAt).fromNow()}
              </span>
            </div>
            <p className="mt-1 max-h-96 text-ellipsis overflow-hidden">
              {post.metadata.content}
            </p>
            <div className="flex mt-2">
              <button className="text-sm font-semibold">
                Collects - {post.stats.totalAmountOfCollects}
              </button>
              <button className="ml-2 text-sm font-semibold">
                Comments - {post.stats.totalAmountOfComments}
              </button>
              <button className="ml-2 text-sm font-semibold">
                Mirrors - {post.stats.totalAmountOfMirrors}
              </button>
            </div>
          </div>
        </div>
      ))}
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
    </>
  )
}
