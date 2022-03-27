import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CreateMirror from './createMirror'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Post({
  item,
  quoted = false,
  mainPost = false,
  itemMirroredBy = '',
}) {
  const router = useRouter()
  return (
    <div
      className={
        'flex w-full p-8 border-base-300 hover:bg-base-200 cursor-pointer' +
        (!quoted ? ' border-b' : '') +
        (mainPost ? ' border-b-0' : '')
      }
      onClick={() => {
        router.push('/' + item.profile.handle + '/posts/' + item.id)
      }}
    >
      <div className="flex-shrink-0 avatar">
        <div className="w-12 h-12 rounded-full bg-primary">
          <img src={item.profile.picture?.original.url} />
        </div>
        {mainPost ? (
          <span className="absolute h-full w-0.5 top-12 left-6 bg-base-300"></span>
        ) : (
          ''
        )}
      </div>
      <div className="flex flex-col flex-grow ml-4">
        <div className="flex">
          <a
            className="font-semibold link link-primary no-underline hover:underline"
            onClick={(e) => {
              router.push('/' + item.profile.handle)
              e.stopPropagation()
            }}
          >
            {item.profile.name}
          </a>

          <span
            className="ml-1 cursor-pointer"
            onClick={(e) => {
              router.push('/' + item.profile.handle)
              e.stopPropagation()
            }}
          >
            @{item.profile.handle}
          </span>

          {!quoted ? (
            <span className="ml-auto text-sm text-accent-content">
              {dayjs(item.createdAt).fromNow()}
            </span>
          ) : (
            ''
          )}
        </div>
        <div className="mt-1 max-h-48 text-ellipsis overflow-hidden">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {item.metadata.content}
          </ReactMarkdown>
        </div>
        {!quoted ? (
          <div className="flex mt-2 -ml-2 gap-2">
            <button
              className="btn btn-sm btn-ghost tooltip tooltip-bottom flex items-center"
              data-tip="Comment"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{item.stats.totalAmountOfComments}</span>
            </button>
            <div
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <CreateMirror item={item} itemMirroredBy={itemMirroredBy} />
            </div>
            <button
              className="btn btn-sm btn-ghost tooltip tooltip-bottom flex items-center"
              data-tip="Collect"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
              <span>{item.stats.totalAmountOfCollects}</span>
            </button>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
