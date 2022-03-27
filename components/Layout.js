import { useSelector } from 'react-redux'
import PageSelector from './PageSelector'

export default function Layout({ Component, pageProps }) {
  const currentTheme = useSelector((state) => state.theme)
  return (
    <div
      className="flex justify-center w-screen h-screen px-4 bg-base-100 text-base-content"
      data-theme={currentTheme}
    >
      <div className="flex w-full max-w-screen-lg">
        <PageSelector active="home" />
        <div className="flex flex-col flex-grow border-l border-r border-base-300">
          <Component {...pageProps} />
        </div>
      </div>
    </div>
  )
}
