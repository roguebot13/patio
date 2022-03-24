import Head from 'next/head'
import ClientOnly from '../components/ClientOnly'
import ExploreFeed from '../components/ExploreFeed'
import Link from 'next/link'
import { useState } from 'react'
import { ExlporePublicationsSortCriteria } from '../gql/explorePublications'
import PageSelector from '../components/PageSelector'

export default function ExplorePage() {
  const [exploreTab, setExploreTab] = useState(
    ExlporePublicationsSortCriteria.TOP_COMMENTED,
  )

  return (
    <div data-theme="bumblebee">
      <Head>
        <title>Explore - Patio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ClientOnly>
          <div className="flex justify-center w-screen h-screen px-4">
            <div className="flex w-full max-w-screen-lg">
              <PageSelector active="explore" />
              <div className="flex flex-col flex-grow border-l border-r border-gray-300">
                <div className="flex justify-between flex-shrink-0 px-8 py-4 border-b border-gray-300">
                  <h1 className="text-xl">Explore</h1>
                </div>
                <div className="flex-grow h-0 overflow-auto">
                  <div className="flex w-full p-8 border-b-1 border-gray-300">
                    <div className="tabs">
                      <div
                        className={
                          'tab tab-bordered' +
                          (exploreTab ===
                          ExlporePublicationsSortCriteria.TOP_COMMENTED
                            ? ' tab-active'
                            : '')
                        }
                        onClick={() => {
                          setExploreTab(
                            ExlporePublicationsSortCriteria.TOP_COMMENTED,
                          )
                        }}
                      >
                        Top Comments
                      </div>
                      <div
                        className={
                          'tab tab-bordered' +
                          (exploreTab ===
                          ExlporePublicationsSortCriteria.TOP_COLLECTED
                            ? ' tab-active'
                            : '')
                        }
                        onClick={() => {
                          setExploreTab(
                            ExlporePublicationsSortCriteria.TOP_COLLECTED,
                          )
                        }}
                      >
                        Top Collected
                      </div>
                    </div>
                  </div>
                  <ExploreFeed sortCriteria={exploreTab} />
                </div>
              </div>
              <div className="flex flex-col flex-shrink-0 w-64 py-4 pl-4">
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
