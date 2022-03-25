import Head from 'next/head'
import { useQuery } from '@apollo/client'
import { GET_PROFILE_BY_HANDLE, GET_PROFILE_BY_OWNER } from '../../gql/profile'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import TimelineFeed from '../../components/TimelineFeed'

export default function UserPage() {
  const router = useRouter()
  let gqlVariables = {},
    gqlQuery
  if (ethers.utils.isAddress(router.query.userId)) {
    gqlQuery = GET_PROFILE_BY_OWNER
    gqlVariables = { address: router.query.userId }
  } else {
    gqlQuery = GET_PROFILE_BY_HANDLE
    gqlVariables = { handle: router.query.userId }
  }
  const { data, loading, error, fetchMore, refetch } = useQuery(gqlQuery, {
    variables: gqlVariables,
  })

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

  const profile = data.profiles.items[0]

  return (
    <>
      <Head>
        <title>
          {profile.name} (@{profile.handle}) - Patio
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex-grow h-0 overflow-auto">
        <div className="flex flex-col border-b border-base-300">
          <img
            className="object-cover object-center w-full h-64"
            src={profile.coverPicture?.original.url}
            alt="cover"
          />
          <div className="flex px-6 items-center relative -top-12 h-20">
            <div className="avatar">
              <div className="w-36 h-36 rounded-full bg-primary ring ring-primary">
                <img src={profile.picture?.original.url} />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 prose max-w-none">
            <h1>{profile.name}</h1>
            <h4>@{profile.handle}</h4>
            <p>{profile.bio}</p>

            <div className="flex gap-2">
              <div className="flex items-center mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                <span className="px-2 text-sm">{profile.location}</span>
              </div>

              <div className="flex items-center mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>

                <span className="px-2 text-sm">{profile.website}</span>
              </div>

              <div className="flex items-center mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  className="h-4 w-4"
                >
                  <path
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="3"
                    stroke="currentColor"
                    d="M49,11.096c-1.768,0.784-3.664,1.311-5.658,1.552c2.035-1.22,3.597-3.151,4.332-5.448c-1.903,1.127-4.013,1.947-6.255,2.388c-1.795-1.916-4.354-3.11-7.186-3.11c-5.44,0-9.849,4.409-9.849,9.847c0,0.771,0.088,1.522,0.257,2.244c-8.184-0.412-15.441-4.332-20.299-10.29c-0.848,1.458-1.332,3.149-1.332,4.953c0,3.416,1.735,6.429,4.38,8.197c-1.616-0.051-3.132-0.495-4.46-1.233c0,0.042,0,0.082,0,0.125c0,4.773,3.394,8.748,7.896,9.657c-0.824,0.227-1.694,0.346-2.592,0.346c-0.636,0-1.253-0.062-1.856-0.178c1.257,3.909,4.892,6.761,9.201,6.84c-3.368,2.641-7.614,4.213-12.23,4.213c-0.797,0-1.579-0.044-2.348-0.137c4.356,2.795,9.534,4.425,15.095,4.425c18.114,0,28.022-15.007,28.022-28.016c0-0.429-0.011-0.856-0.029-1.275C46.012,14.807,47.681,13.071,49,11.096z"
                  />
                </svg>

                <span className="px-2 text-sm">{profile.twitterUrl}</span>
              </div>
            </div>
            <div className="flex gap-4 text-sm mt-4">
              <div className="">
                <span className="font-semibold">
                  {profile.stats.totalFollowing}
                </span>
                <span className="ml-1">Following</span>
              </div>
              <div className="">
                <span className="font-semibold">
                  {profile.stats.totalFollowers}
                </span>
                <span className="ml-1">Followers</span>
              </div>
            </div>
          </div>
        </div>
        <TimelineFeed profileId={profile.id} />
      </div>
    </>
  )
}
