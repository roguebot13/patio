import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Post from './Post'

export default function Comment({ item }) {
  const router = useRouter()
  return (
    <div
      className="flex w-full p-8 border-b border-base-300 hover:bg-base-200 cursor-pointer"
      onClick={() => {
        router.push('/' + item.profile.handle + '/posts/' + item.id)
      }}
    >
      <div className="flex-shrink-0 avatar">
        <div className="w-12 h-12 rounded-full bg-primary">
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

          <span className="ml-auto text-sm text-accent-content">
            {dayjs(item.createdAt).fromNow()}
          </span>
        </div>
        <p className="mt-1 max-h-96 text-ellipsis overflow-hidden">
          {item.metadata.content}
        </p>
        <div className="border-l border-primary my-4">
          <Post item={item.mainPost} quoted={true} />
        </div>
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
      </div>
    </div>
  )
}
