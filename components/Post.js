import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CreateMirror from './createMirror'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CreateComment from './CreateComment'
import CreateCollect from './CreateCollect'

const renderProfileImg = (item) => {
  if (item.collectedBy && item.collectedBy.defaultProfile) {
    return <img src={item.collectedBy.defaultProfile.picture?.original.url} />
  } else if (item.collectedBy && item.collectedBy.address) {
    return (
      <img
        src={
          'https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=' +
          item.collectedBy.address.slice(-1)
        }
      />
    )
  } else {
    return <img src={item.profile.picture?.original.url} />
  }
}

const renderProfileTitle = (item, router) => {
  let profileName, profileHandle
  if (item.collectedBy && item.collectedBy.defaultProfile) {
    profileName = item.collectedBy.defaultProfile.name
    profileHandle = item.collectedBy.defaultProfile.handle
    return (
      <>
        <a
          className="font-semibold link link-primary no-underline hover:underline"
          onClick={(e) => {
            router.push('/' + profileHandle)
            e.stopPropagation()
          }}
        >
          {profileName}
        </a>
        <span
          className="ml-1 cursor-pointer"
          onClick={(e) => {
            router.push('/' + profileHandle)
            e.stopPropagation()
          }}
        >
          @{profileHandle}
        </span>
        <span className="mx-1">collected from</span>
        <div className="avatar mr-1">
          <div className="w-6 h-6 rounded-full bg-primary">
            <img src={item.profile.picture?.original.url} />
          </div>
        </div>
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
      </>
    )
  } else if (item.collectedBy) {
    let trimText = item.collectedBy.address.slice(4, 60)
    if (trimText.length) {
      profileName = item.collectedBy.address.replace(trimText, '...')
    }
    return (
      <>
        <a
          className="font-semibold link link-primary no-underline hover:underline"
          target="_blank"
          href={
            'https://mumbai.polygonscan.com/address/' + item.collectedBy.address
          }
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {profileName}
        </a>
      </>
    )
  } else {
    profileName = item.profile.name
    profileHandle = item.profile.handle
    return (
      <>
        <a
          className="font-semibold link link-primary no-underline hover:underline"
          onClick={(e) => {
            if (profileHandle) router.push('/' + profileHandle)
            e.stopPropagation()
          }}
        >
          {profileName}
        </a>

        <span
          className="ml-1 cursor-pointer"
          onClick={(e) => {
            if (profileHandle) router.push('/' + profileHandle)
            e.stopPropagation()
          }}
        >
          @{profileHandle}
        </span>
      </>
    )
  }
}

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
          {renderProfileImg(item)}
        </div>
        {mainPost ? (
          <span className="absolute h-full w-0.5 top-12 left-6 bg-base-300"></span>
        ) : (
          ''
        )}
      </div>
      <div className="flex flex-col flex-grow ml-4">
        <div className="flex">
          {renderProfileTitle(item, router)}

          {!quoted ? (
            <span className="ml-auto text-sm text-accent-content">
              {dayjs(item.createdAt).fromNow()}
            </span>
          ) : (
            ''
          )}
        </div>
        <div
          className={
            'mt-1 max-h-48 text-ellipsis overflow-hidden' +
            (quoted ? ' max-w-lg' : ' max-w-xl')
          }
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {item.metadata.content}
          </ReactMarkdown>
        </div>
        {!quoted ? (
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
              <CreateMirror item={item} itemMirroredBy={itemMirroredBy} />
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <CreateCollect item={item} />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
