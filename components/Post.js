import dayjs from 'dayjs'
import Link from 'next/link'

export default function Post({ item, quoted = false }) {
  return (
    <div
      className={
        'flex w-full p-8 border-gray-300' + (!quoted ? ' border-b' : '')
      }
    >
      <div className="flex-shrink-0 avatar">
        <div className="w-12 h-12 rounded-full bg-gray-400">
          <img src={item.profile.picture?.original.url} />
        </div>
      </div>
      <div className="flex flex-col flex-grow ml-4">
        <div className="flex">
          <Link href={'/' + item.profile.handle}>
            <a className="font-semibold link link-primary no-underline">
              {item.profile.name}
            </a>
          </Link>
          <Link href={'/' + item.profile.handle}>
            <span className="ml-1 cursor-pointer">@{item.profile.handle}</span>
          </Link>

          {!quoted ? (
            <span className="ml-auto text-sm">
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
