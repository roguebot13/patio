import Link from 'next/link'
import { useRouter } from 'next/router'
import ConnectWallet from './ConnectWallet'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

export default function PageSelector({ active = 'home' }) {
  const router = useRouter()
  const currentProfile = useSelector((state) => state.profile)
  const currentTheme = useSelector((state) => state.theme)
  const dispatch = useDispatch()

  return (
    <div className="flex flex-col flex-shrink-0 w-64 py-8 pr-3">
      <div className="flex-grow">
        <ConnectWallet />
        <ul className="menu bg-base-100 mt-8">
          <li className={router.pathname === '/' ? 'bordered' : ''}>
            <Link href="/">
              <a className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Home</span>
              </a>
            </Link>
          </li>
          <li className={router.pathname === '/explore' ? 'bordered' : ''}>
            <Link href="/explore">
              <a className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Explore</span>
              </a>
            </Link>
          </li>
          {currentProfile?.handle ? (
            <>
              <li
                className={
                  router.pathname === '/[userId]' &&
                  router.query?.userId === currentProfile?.handle
                    ? 'bordered'
                    : ''
                }
              >
                <Link href={'/' + currentProfile?.handle}>
                  <a className="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Profile</span>
                  </a>
                </Link>
              </li>
              <li
                className={
                  router.pathname === '/edit-profile' ? 'bordered' : ''
                }
              >
                <Link href="/edit-profile">
                  <a className="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Settings</span>
                  </a>
                </Link>
              </li>
            </>
          ) : (
            ''
          )}
        </ul>
      </div>
      <div className="prose">
        <div>
          <svg
            viewBox="100 100 500 500"
            className="w-20 h-20"
            style={{ transform: 'scaleX(-1)' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="1">
              <path
                d="M447.464 520.52C444.663 520.52 441.862 518.84 440.183 516.04L334.903 335.159C332.664 331.238 333.781 326.199 337.703 323.96C341.625 321.722 346.664 322.839 348.902 326.761L453.622 508.201C455.861 512.123 454.743 517.162 450.822 519.4C450.263 520.517 448.583 520.517 447.466 520.517L447.464 520.52Z"
                fill="currentColor"
                fillRule="evenodd"
                opacity="1"
                stroke="none"
              />
              <path
                d="M274.984 222.6C272.183 222.6 269.382 220.92 267.703 218.12L253.144 192.921C250.905 188.999 252.022 183.96 255.944 181.722C259.866 179.483 264.905 180.6 267.143 184.522L281.702 209.721C283.941 213.643 282.823 218.682 278.902 220.92C277.784 222.041 276.663 222.6 274.984 222.6L274.984 222.6Z"
                fill="currentColor"
                fillRule="evenodd"
                opacity="1"
                stroke="none"
              />
              <path
                d="M408.824 323.96L407.144 323.96L406.585 323.96C404.347 323.401 402.664 322.28 401.546 320.601C368.503 269.081 322.023 231.562 276.666 219.801C273.307 218.68 271.065 216.441 270.506 212.519C269.948 209.16 271.627 205.801 274.428 204.121C302.428 187.883 334.908 179.48 366.826 179.48C422.267 179.48 474.346 203.558 509.626 245.558C511.306 247.238 512.427 249.48 512.427 251.718C512.427 256.199 508.505 260.117 504.028 260.117L502.907 260.117C485.548 257.878 468.188 261.796 453.067 270.195C435.145 280.836 421.708 297.636 416.106 317.797C415.544 321.722 412.184 323.961 408.825 323.961L408.824 323.96ZM300.744 210.28C339.385 225.96 376.904 257.319 406.024 298.202C414.422 280.843 427.864 266.28 444.665 256.202C456.985 249.483 470.427 245.003 484.427 243.882C453.068 214.202 411.068 197.402 366.827 197.402C344.425 196.84 322.026 201.32 300.745 210.281L300.744 210.28Z"
                fill="currentColor"
                fillRule="evenodd"
                opacity="1"
                stroke="none"
              />
              <path
                d="M193.224 440.44C189.302 440.44 186.505 438.202 185.384 434.838C154.583 349.717 188.743 255.078 267.146 209.158C269.947 207.479 273.865 207.479 276.665 209.717C279.466 211.955 280.587 215.319 279.466 218.678C267.146 263.479 276.107 322.278 304.107 376.598C305.228 378.278 305.228 380.52 304.666 382.758L304.666 383.317C303.545 387.797 299.064 390.036 294.588 388.918C274.428 383.879 253.147 386.68 235.229 397.317C220.108 406.278 208.35 419.157 201.627 435.395C199.385 438.199 196.584 440.438 193.225 440.438L193.224 440.44ZM258.744 234.36C204.424 275.243 179.787 344.68 195.467 410.2C203.307 399.001 213.947 389.481 226.268 382.2C243.069 372.681 262.666 368.2 282.268 369.321C261.545 323.958 253.147 275.798 258.745 234.361L258.744 234.36Z"
                fill="currentColor"
                fillRule="evenodd"
                opacity="1"
                stroke="none"
              />
              <path
                d="M296.264 388.36C292.904 388.36 290.104 386.68 288.983 383.879C259.303 326.199 249.784 262.36 263.221 213.639C263.779 211.401 265.459 209.718 267.142 208.6C267.701 208.6 274.424 204.678 274.982 204.12C276.662 202.999 279.463 202.44 281.142 202.999C330.423 215.319 380.263 255.64 415.542 310.519C417.222 313.32 417.222 317.238 415.542 320.038C413.304 322.839 409.941 323.96 406.582 323.398C386.422 318.359 365.141 321.718 347.223 331.796L341.621 335.155C323.699 345.233 310.82 362.034 304.66 382.194C303.539 385.554 300.738 387.796 297.379 388.355C296.828 388.359 296.828 388.359 296.265 388.359L296.264 388.36ZM278.346 222.04C268.268 261.802 274.986 311.642 295.705 359.8C304.103 343.562 316.986 330.679 332.666 321.159L338.267 317.8C353.947 308.839 371.869 304.359 390.345 304.921C359.544 262.921 319.224 232.12 280.025 220.921C279.467 220.917 278.904 221.475 278.346 222.038L278.346 222.04Z"
                fill="currentColor"
                fillRule="evenodd"
                opacity="1"
                stroke="none"
              />
              <path
                d="M517.464 520.52L182.584 520.52C178.103 520.52 174.185 516.598 174.185 512.122C174.185 507.641 178.107 503.723 182.584 503.723L517.464 503.723C521.944 503.723 525.862 507.645 525.862 512.122C525.866 516.602 521.948 520.52 517.468 520.52L517.464 520.52Z"
                fill="currentColor"
                fillRule="evenodd"
                opacity="1"
                stroke="none"
              />
            </g>
            <a href="https://thenounproject.com/icon/beach-umbrella-152369/">
              Created by Ema Dimitrova
            </a>
          </svg>
        </div>
        <h1 className="text-primary pl-2">Patio</h1>
        <div className="flex gap-2">
          <label className="swap swap-rotate btn btn-ghost btn-sm btn-square">
            <input
              type="checkbox"
              checked={currentTheme === 'bumblebee'}
              onChange={() => {
                dispatch({ type: 'TOGGLE_THEME' })
              }}
            />
            <svg
              className="swap-on fill-current w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
            <svg
              className="swap-off fill-current w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>

          <a
            className="btn btn-ghost btn-sm btn-square"
            href="https://github.com/roguebot13/patio"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
