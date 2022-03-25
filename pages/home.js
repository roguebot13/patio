import Head from 'next/head'
import Link from 'next/link'
import { useSelector } from 'react-redux'

export default function HomePage() {
  const currentProfile = useSelector((state) => state.profile)
  return (
    <>
      <Head>
        <title>Home - Patio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-between flex-shrink-0 px-8 py-4 border-b border-base-300">
        <h1 className="text-xl">Home</h1>
      </div>
      <div className="flex-grow h-0 overflow-auto">
        {currentProfile.id ? (
          <div className="flex w-full p-8 border-b border-base-300">
            <span className="flex-shrink-0 w-12 h-12 bg-primary rounded-full"></span>
            <div className="flex flex-col flex-grow ml-4">
              <textarea
                className="textarea textarea-bordered"
                name=""
                id=""
                rows="3"
                placeholder="What's happening?"
              ></textarea>
              <div className="flex justify-between mt-2">
                <button className="flex items-center h-8 px-3 text-xs rounded-sm hover:bg-base-200">
                  Attach
                </button>
                <button className="btn btn-primary">Post</button>
              </div>
            </div>
          </div>
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
