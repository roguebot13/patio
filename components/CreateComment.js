import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CreatePost from './CreatePost'

export default function CreateComment({ item }) {
  const currentProfile = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  const [mirrorReqPending, setMirrorReqPending] = useState(false)
  const modalShowRef = useRef()

  return (
    <div>
      <label
        className={
          'btn btn-sm tooltip tooltip-bottom flex items-center btn-ghost'
        }
        data-tip="Comment"
        htmlFor={'comment-' + item.id}
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
      </label>
      <input
        type="checkbox"
        id={'comment-' + item.id}
        className="modal-toggle"
        ref={modalShowRef}
      />
      <label className="modal cursor-pointer" htmlFor={'comment-' + item.id}>
        <label
          className="modal-box relative"
          style={{ maxWidth: '100%', width: 680 }}
          htmlFor=""
        >
          <CreatePost
            commentMode={true}
            publicationId={item.id}
            onSuccess={() => {
              if (modalShowRef && modalShowRef.current) {
                modalShowRef.current.checked = false
              }
            }}
          />
        </label>
      </label>
    </div>
  )
}
