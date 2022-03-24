import { useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import {
  explorePublicationsQuery,
  ExlporePublicationsSortCriteria,
} from '../gql/explorePublications'

export default function ExploreFeed({
  sortCriteria = ExlporePublicationsSortCriteria.TOP_COMMENTED,
}) {
  const { data, loading, error } = useQuery(
    explorePublicationsQuery({ sortCriteria }),
  )

  if (loading) {
    return (
      <h2>
        <a href="#loading" aria-hidden="true" class="aal_anchor" id="loading">
          <svg
            aria-hidden="true"
            class="aal_svg"
            height="16"
            version="1.1"
            viewBox="0 0 16 16"
            width="16"
          >
            <path
              fill-rule="evenodd"
              d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
            ></path>
          </svg>
        </a>
        Loading...
      </h2>
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
    </>
  )
}
