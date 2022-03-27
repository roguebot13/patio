import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Post from './Post'
import CreateMirror from './createMirror'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CreateComment from './CreateComment'
import CreateCollect from './CreateCollect'

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
          <a
            className="font-semibold link link-primary no-underline"
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

          <span className="ml-auto text-sm text-accent-content">
            {dayjs(item.createdAt).fromNow()}
          </span>
        </div>
        <div className="mt-1 max-h-48 text-ellipsis overflow-hidden max-w-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {item.metadata.content}
          </ReactMarkdown>
        </div>
        <div className="border-l border-primary my-4">
          <Post item={item.mainPost} quoted={true} />
        </div>
        <div className="flex mt-2 -ml-2 gap-2">
          <div
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <CreateComment item={item} />
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <CreateMirror item={item} />
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <CreateCollect item={item} />
          </div>
        </div>
      </div>
    </div>
  )
}
