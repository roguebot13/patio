import Head from 'next/head'
import FileUploadUri from '../components/FileUploadUri'
import { UPDATE_PROFILE } from '../gql/profile'
import apolloClient from '../apollo-client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const updateProfile = (request) => {
  return apolloClient.mutate({
    mutation: UPDATE_PROFILE,
    variables: {
      request,
    },
  })
}

export default function EditProfilePage() {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const currentProfile = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  return (
    <>
      <Head>
        <title>Edit Profile - Patio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-between flex-shrink-0 px-8 py-4 border-b border-base-300">
        <h1 className="text-xl">Edit Profile</h1>
      </div>
      <div className="flex-grow h-0 overflow-auto">
        <div className="flex px-8 pt-8">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full bg-primary">
              <img src={currentProfile?.picture?.original?.url} />
            </div>
          </div>
          <div className="ml-4">
            <div className="font-semibold">{currentProfile?.name}</div>
            <div>@{currentProfile?.handle}</div>
          </div>
        </div>
        <form
          className="p-8 flex flex-col gap-4"
          onSubmit={async (e) => {
            e.stopPropagation()
            e.preventDefault()
            setLoading(true)
            setErrorMessage(null)
            const request = {
              profileId: e.target.elements.profileId.value,
              name: e.target.elements.name.value,
              bio: e.target.elements.bio.value,
              location: e.target.elements.location.value,
              website: e.target.elements.website.value,
              twitterUrl: e.target.elements.twitterUrl.value,
              coverPicture: e.target.elements.coverPicture.value,
            }
            if (request.website === '') {
              request.website = null
            }
            if (request.twitterUrl === '') {
              request.twitterUrl = null
            }
            console.log(request)
            try {
              const { data, errors } = await updateProfile(request)
              if (errors && errors[0]) {
                setErrorMessage(errors[0].message)
              }
              if (data && data.updateProfile) {
                //TODO: Fetch profile data and save again
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
          <input
            name="profileId"
            className="input input-bordered"
            disabled
            hidden
            value={currentProfile?.id}
          ></input>
          <div className="form-control max-w-xs">
            <label className="label">
              <span className="label-text">Profile name</span>
            </label>
            <input
              name="name"
              className="input input-bordered"
              defaultValue={currentProfile?.name || ''}
            ></input>
          </div>
          <div className="form-control max-w-xs">
            <label className="label">
              <span className="label-text">Bio</span>
            </label>
            <textarea
              name="bio"
              className="textarea textarea-bordered"
              defaultValue={currentProfile?.bio || ''}
            ></textarea>
          </div>
          <div className="form-control max-w-xs">
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <input name="location" className="input input-bordered"></input>
          </div>
          <div className="form-control max-w-md">
            <label className="label">
              <span className="label-text">Website</span>
            </label>
            <input name="website" className="input input-bordered"></input>
          </div>
          <div className="form-control max-w-md">
            <label className="label">
              <span className="label-text">Twitter profile link</span>
            </label>
            <input name="twitterUrl" className="input input-bordered"></input>
          </div>
          <FileUploadUri name="coverPicture" label="Cover picture url" />

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
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
