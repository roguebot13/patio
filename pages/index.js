import Head from 'next/head'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import TimelineFeed from '../components/TimelineFeed'
import CreatePost from '../components/CreatePost'

export default function HomePage() {
  const currentProfile = useSelector((state) => state.profile)
  return (
    <>
      <Head>
        <title>Home - Patio</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="flex justify-between flex-shrink-0 px-8 py-4 border-b border-base-300">
        <h1 className="text-xl">Home</h1>
      </div>
      <div className="flex-grow h-0 overflow-auto">
        {currentProfile.id ? (
          <>
            <CreatePost />
            <TimelineFeed profileId={currentProfile.id} />
          </>
        ) : (
          <div>
            <div className="px-8 pt-8 text-center">
              Please create a profile for personalized feed
            </div>
            <div className="p-8 text-center">
              <Link href="/create-profile">
                <a className="btn btn-wide btn-primary">Create Profile</a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
