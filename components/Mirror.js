import Post from './Post'
import Link from 'next/link'

export default function Mirror({ item }) {
  return (
    <>
      <Link href={'/' + item.profile.handle}>
        <a className="link link-accent flex text-sm px-8 pt-2 no-underline items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
          <span>
            {item.profile.name ? item.profile.name : item.profile.handle}{' '}
            mirrored
          </span>
        </a>
      </Link>
      <Post item={item} />
    </>
  )
}
