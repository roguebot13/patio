import Head from 'next/head'
import FileUploadUri from '../components/FileUploadUri'
import { CREATE_PROFILE } from '../gql/profile'
import apolloClient from '../apollo-client'
import { useEffect, useState } from 'react'
import { pollUntilIndexed } from '../helpers/pollUntilIndexed'

const createProfile = (request) => {
  return apolloClient.mutate({
    mutation: CREATE_PROFILE,
    variables: {
      request,
    },
  })
}

export default function CreateProfilePage() {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  return (
    <>
      <Head>
        <title>Create Profile - Patio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-between flex-shrink-0 px-8 py-4 border-b border-base-300">
        <h1 className="text-xl">Create Profile</h1>
      </div>
      <div className="flex-grow h-0 overflow-auto">
        <form
          className="p-8 flex flex-col gap-4"
          onSubmit={async (e) => {
            e.stopPropagation()
            e.preventDefault()
            setLoading(true)
            setErrorMessage(null)
            let followModuleIndex = e.target.elements.followModuleIndex.value
            const request = {
              handle: e.target.elements.handle.value,
              profilePictureUri: e.target.elements.profilePictureUri.value,
              followNFTURI: e.target.elements.followNFTURI.value,
              followModule: {
                emptyFollowModule: true,
              },
            }
            console.log(request)
            try {
              const { data, errors } = await createProfile(request)
              if (errors && errors[0]) {
                setErrorMessage(errors[0].message)
              }
              if (data && data.createProfile) {
                if (data.createProfile.txHash) {
                  const txRes = await pollUntilIndexed(
                    data.createProfile.txHash,
                  )
                  console.log(txRes)
                } else {
                  setErrorMessage(data.createProfile.reason)
                }
              } else {
                setErrorMessage('Unknown error')
              }
            } catch (e) {
              console.error(e)
              setErrorMessage(e.message)
            }
            setLoading(false)
          }}
        >
          <div className="form-control max-w-xs">
            <label className="label">
              <span className="label-text">Lens handle</span>
            </label>
            <input
              name="handle"
              required
              className="input input-bordered"
            ></input>
          </div>
          <FileUploadUri
            name="profilePictureUri"
            label="Profile picture url"
            avatar={true}
          />
          <FileUploadUri name="followNFTURI" label="Follow NFT url" />
          <div className="form-control max-w-md">
            <label className="label">
              <span className="label-text">Follow module</span>
            </label>
            <select
              name="followModuleIndex"
              className="select select-bordered w-full"
              defaultValue="1"
            >
              <option value="1">Empty Follow Module</option>
              <option value="2">Fee Follow Module</option>
            </select>
          </div>
          {errorMessage ? (
            <div className="alert alert-error mt-6">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{errorMessage}</span>
              </div>
            </div>
          ) : (
            ''
          )}
          <div className="form-control mt-6">
            <button
              type="submit"
              className={
                'btn btn-wide btn-primary' + (loading ? ' loading' : '')
              }
              disabled={loading}
            >
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
