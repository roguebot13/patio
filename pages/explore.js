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
    <>
      <Head>
        <title>Explore - Patio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col flex-grow border-l border-r border-gray-300">
        <div className="flex justify-between items-center flex-shrink-0 px-8 py-4 border-b border-gray-300">
          <h1 className="text-xl">Explore</h1>
          <input
            className="input input-sm input-bordered rounded-full"
            type="search"
            placeholder="Search posts"
          />
        </div>
        <div className="flex-grow h-0 overflow-auto">
          <div className="flex w-full p-8 border-b-1 border-gray-300">
            <div className="tabs">
              <div
                className={
                  'tab tab-bordered' +
                  (exploreTab === ExlporePublicationsSortCriteria.TOP_COMMENTED
                    ? ' tab-active'
                    : '')
                }
                onClick={() => {
                  setExploreTab(ExlporePublicationsSortCriteria.TOP_COMMENTED)
                }}
              >
                Top Comments
              </div>
              <div
                className={
                  'tab tab-bordered' +
                  (exploreTab === ExlporePublicationsSortCriteria.TOP_COLLECTED
                    ? ' tab-active'
                    : '')
                }
                onClick={() => {
                  setExploreTab(ExlporePublicationsSortCriteria.TOP_COLLECTED)
                }}
              >
                Top Collected
              </div>
            </div>
          </div>
          <ExploreFeed sortCriteria={exploreTab} />
        </div>
      </div>
    </>
  )
}
