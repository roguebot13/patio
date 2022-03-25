import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Post({ item, quoted = false, mainPost = false }) {
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
        <p className="mt-1 max-h-48 text-ellipsis overflow-hidden">
          {item.metadata.content}
        </p>
        {!quoted ? (
          <div className="flex mt-2">
            <button className="text-sm font-semibold">
              Collects - {item.stats.totalAmountOfCollects}
            </button>
            <button className="ml-2 text-sm font-semibold">
              Comments - {item.stats.totalAmountOfComments}
            </button>
            <button className="ml-2 text-sm font-semibold">
              Mirrors - {item.stats.totalAmountOfMirrors}
            </button>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
