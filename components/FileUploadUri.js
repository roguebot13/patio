import { useState } from 'react'
import ipfs from '../ipfs-client'

export default function FileUploadUri({
  name = '',
  label = null,
  avatar = false,
}) {
  const [uploading, setUploading] = useState(false)
  const [uri, setUri] = useState('')

  return (
    <div className="form-control max-w-md">
      {label ? (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      ) : (
        ''
      )}
      {uri ? (
        avatar ? (
          <div className="flex-shrink-0 avatar mb-2">
            <div className="w-12 h-12 rounded-full bg-primary">
              <img src={uri} />
            </div>
          </div>
        ) : (
          <img
            className="object-fit max-w-md border-base-300 border rounded-md mb-2"
            src={uri}
          />
        )
      ) : (
        ''
      )}
      <div className="input-group">
        <input
          name={name}
          type="url"
          className="input input-bordered flex-grow"
          value={uri}
          onChange={(e) => {
            setUri(e.target.value)
          }}
        ></input>
        <button
          className={
            'btn btn-secondary btn-square relative' +
            (uploading ? ' loading' : '')
          }
          disabled={uploading}
        >
          <input
            type="file"
            className="opacity-0 cursor-pointer absolute w-full h-full left-0 top-0"
            accept="image/*"
            onChange={async (e) => {
              setUploading(true)
              try {
                const file = e.target.files[0]
                console.log(file)
                const res = await ipfs.add(file)
                console.log(res)
                setUri('https://ipfs.infura.io/ipfs/' + res.path)
              } catch (e) {
                console.error(e)
              }
              setUploading(false)
            }}
          ></input>
          {!uploading ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          ) : (
            ''
          )}
        </button>
      </div>
    </div>
  )
}
