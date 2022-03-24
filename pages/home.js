import Head from 'next/head'
import ClientOnly from '../components/ClientOnly'
import ExploreFeed from '../components/ExploreFeed'
import Link from 'next/link'
import PageSelector from '../components/PageSelector'

export default function HomePage() {
  return (
    <div data-theme="bumblebee">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ClientOnly>
          <div className="flex justify-center w-screen h-screen px-4">
            <div className="flex w-full max-w-screen-lg">
              <PageSelector active="home" />
              <div className="flex flex-col flex-grow border-l border-r border-gray-300">
                <div className="flex justify-between flex-shrink-0 px-8 py-4 border-b border-gray-300">
                  <h1 className="text-xl">Home</h1>
                </div>
                <div className="flex-grow h-0 overflow-auto">
                  <div className="flex w-full p-8 border-b-4 border-gray-300">
                    <span className="flex-shrink-0 w-12 h-12 bg-gray-400 rounded-full"></span>
                    <div className="flex flex-col flex-grow ml-4">
                      <textarea
                        className="p-3 bg-transparent border border-gray-500 rounded-sm"
                        name=""
                        id=""
                        rows="3"
                        placeholder="What's happening?"
                      ></textarea>
                      <div className="flex justify-between mt-2">
                        <button className="flex items-center h-8 px-3 text-xs rounded-sm hover:bg-gray-200">
                          Attach
                        </button>
                        <button className="flex items-center h-8 px-3 text-xs rounded-sm bg-gray-300 hover:bg-gray-400">
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                  <ExploreFeed />
                </div>
              </div>
              <div className="flex flex-col flex-shrink-0 w-1/4 py-4 pl-4">
                <input
                  className="flex items-center h-8 px-2 border border-gray-500 rounded-sm"
                  type="search"
                  Placeholder="Search…"
                />
                <div>
                  <h3 className="mt-6 font-semibold">Trending</h3>
                  <div className="flex w-full py-4 border-b border-gray-300">
                    <span className="flex-shrink-0 w-10 h-10 bg-gray-400 rounded-full"></span>
                    <div className="flex flex-col flex-grow ml-2">
                      <div className="flex text-sm">
                        <span className="font-semibold">Username</span>
                        <span className="ml-1">@username</span>
                      </div>
                      <p className="mt-1 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        et dolore magna aliqua.{' '}
                        <a className="underline" href="#">
                          #hashtag
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full py-4 border-b border-gray-300">
                    <span className="flex-shrink-0 w-10 h-10 bg-gray-400 rounded-full"></span>
                    <div className="flex flex-col flex-grow ml-2">
                      <div className="flex text-sm">
                        <span className="font-semibold">Username</span>
                        <span className="ml-1">@username</span>
                      </div>
                      <p className="mt-1 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        et dolore magna aliqua.{' '}
                        <a className="underline" href="#">
                          #hashtag
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full py-4 border-b border-gray-300">
                    <span className="flex-shrink-0 w-10 h-10 bg-gray-400 rounded-full"></span>
                    <div className="flex flex-col flex-grow ml-2">
                      <div className="flex text-sm">
                        <span className="font-semibold">Username</span>
                        <span className="ml-1">@username</span>
                      </div>
                      <p className="mt-1 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        et dolore magna aliqua.{' '}
                        <a className="underline" href="#">
                          #hashtag
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ClientOnly>
      </main>
    </div>
  )
}
