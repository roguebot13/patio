import Link from 'next/link'

export default function PageSelector({ active = 'home' }) {
  return (
    <div className="flex flex-col flex-shrink-0 w-48 py-4 pr-3">
      <ul className="menu bg-base-100">
        <li className={active === 'home' ? 'bordered' : ''}>
          <Link href="/home">
            <a>Home</a>
          </Link>
        </li>
        <li className={active === 'explore' ? 'bordered' : ''}>
          <Link href="/explore">
            <a>Explore</a>
          </Link>
        </li>
      </ul>
      <a
        className="flex px-3 py-2 mt-2 mt-auto text-lg rounded-sm font-medium hover:bg-gray-200"
        href="#"
      >
        <span className="flex-shrink-0 w-10 h-10 bg-gray-400 rounded-full"></span>
        <div className="flex flex-col ml-2">
          <span className="mt-1 text-sm font-semibold leading-none">
            Username
          </span>
          <span className="mt-1 text-xs leading-none">@username</span>
        </div>
      </a>
    </div>
  )
}
