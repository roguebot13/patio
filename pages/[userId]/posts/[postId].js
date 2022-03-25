import Head from 'next/head'
import { useQuery } from '@apollo/client'
import { GET_PUBLICATION } from '../../../gql/publication'
import { useRouter } from 'next/router'
import PostFeed from '../../../components/PostFeed'
import Link from 'next/link'
import Post from '../../../components/Post'
import dayjs from 'dayjs'

export default function PostPage() {
  const router = useRouter()

  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_PUBLICATION,
    {
      variables: {
        publicationId: router.query.postId,
      },
    },
  )

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

  const post = data.publication

  return (
    <>
      <Head>
        <title>
          {post.profile.name} (@{post.profile.handle}) Post - Patio
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex-grow h-0 overflow-auto">
        {post.__typename === 'Comment' ? (
          <Post item={post.mainPost} mainPost={true} />
        ) : (
          ''
        )}
        <div className="flex flex-col border-b border-base-300 p-8">
          <div className="flex">
            <div className="flex-shrink-0 avatar">
              <div className="w-12 h-12 rounded-full bg-primary">
                <img src={post.profile.picture?.original.url} />
              </div>
              {post.__typename === 'Comment' ? (
                <span className="absolute h-6 w-0.5 -top-6 left-6 bg-base-300"></span>
              ) : (
                ''
              )}
            </div>
            <div className="ml-4">
              <div>
                <Link href={'/' + post.profile.handle}>
                  <a className="font-semibold link link-primary no-underline hover:underline">
                    {post.profile.name}
                  </a>
                </Link>
              </div>
              <div>
                <Link href={'/' + post.profile.handle}>
                  <span className="cursor-pointer">@{post.profile.handle}</span>
                </Link>
              </div>
            </div>
            <span className="ml-auto text-sm text-accent-content">
              {dayjs(post.createdAt).fromNow()}
            </span>
          </div>
          <p className="mt-8">{post.metadata.content}</p>
        </div>
        <PostFeed publicationId={post.id} />
      </div>
    </>
  )
}
