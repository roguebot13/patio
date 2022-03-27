import Head from 'next/head'
import FileUploadUri from '../components/FileUploadUri'
import {
  updateProfile,
  createSetProfileImageUriTypedData,
  getProfile,
} from '../gql/profile'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { notify } from 'reapop'
import { enabledCurrencies } from '../gql/module'
import { pollUntilIndexed } from '../helpers/pollUntilIndexed'

export default function EditProfilePage() {
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [updatingPicture, setUpdatingPicture] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const currentProfile = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  if (!currentProfile?.id) {
    return (
      <>
        <Head>
          <title>Edit Profile - Patio</title>
          <link rel="icon" href="/favicon.png" />
        </Head>
        <div className="flex justify-between flex-shrink-0 px-8 py-4 border-b border-base-300">
          <h1 className="text-xl">Edit Profile</h1>
        </div>
        <div className="flex-grow h-0 overflow-auto">
          <div className="px-8 pt-8 text-center">
            Please create a profile first
          </div>
          <div className="p-8 text-center">
            <Link href="/create-profile">
              <a className="btn btn-wide btn-primary">Create Profile</a>
            </Link>
          </div>
        </div>
      </>
    )
  }
  // useEffect(async () => {
  //   const res = await enabledCurrencies()
  //   console.log('Currencies', res)
  // }, [])

  return (
    <>
      <Head>
        <title>Edit Profile - Patio</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="flex justify-between flex-shrink-0 px-8 py-4 border-b border-base-300">
        <h1 className="text-xl">Edit Profile</h1>
      </div>
      <div className="flex-grow h-0 overflow-auto">
        <div className="px-8 pt-8">
          <div className="font-semibold">{currentProfile?.name}</div>
          <div className="text-sm">@{currentProfile?.handle}</div>
        </div>
        <form
          className="p-8 flex items-end gap-4"
          onSubmit={async (e) => {
            e.stopPropagation()
            e.preventDefault()
            setUpdatingPicture(true)
            const request = {
              profileId: currentProfile.id,
              url: e.target.elements.url.value.trim(),
            }
            if (request.url === '') {
              request.url = null
            }
            console.log(request)

            // const { data, errors } = await createSetProfileImageUriTypedData(request)
            const result = await createSetProfileImageUriTypedData(request)
            const typedData =
              result.data.createSetProfileImageURITypedData.typedData

            const { signedTypeData, splitSignature } = await import(
              '../ethers-service'
            )
            const signature = await signedTypeData(
              typedData.domain,
              typedData.types,
              typedData.value,
            )
            const { v, r, s } = splitSignature(signature)
            const lensHub = (await import('../lens-hub')).lensHub
            const tx = await lensHub.setProfileImageURIWithSig({
              profileId: typedData.value.profileId,
              imageURI: typedData.value.imageURI,
              sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline,
              },
            })
            const res = await pollUntilIndexed(tx.hash)
            console.log(res)
            if (res && res.indexed) {
              const updatedProfile = await getProfile(currentProfile.handle)
              dispatch({
                type: 'UPDATE_LOCAL_PROFILE',
                payload: updatedProfile.data.profiles.items[0],
              })
              dispatch(notify('Profile image updated', 'info'))
            }
            setUpdatingPicture(false)
          }}
        >
          <FileUploadUri
            name="url"
            label="Profile picture url"
            avatar={true}
            defaultValue={currentProfile?.picture?.original.url}
          />
          <button
            type="submit"
            className={'btn btn-primary' + (updatingPicture ? ' loading' : '')}
            disabled={updatingPicture}
          >
            Update Picture
          </button>
        </form>
        <form
          className="p-8 flex flex-col gap-4"
          onSubmit={async (e) => {
            e.stopPropagation()
            e.preventDefault()
            setUpdatingProfile(true)
            setErrorMessage(null)
            const request = {
              profileId: currentProfile.id,
              name: e.target.elements.name.value.trim(),
              bio: e.target.elements.bio.value,
              location: e.target.elements.location.value.trim(),
              website: e.target.elements.website.value.trim(),
              twitterUrl: e.target.elements.twitterUrl.value.trim(),
              coverPicture: e.target.elements.coverPicture.value.trim(),
            }
            if (request.bio === '') {
              request.bio = null
            }
            if (request.location === '') {
              request.location = null
            }
            if (request.website === '') {
              request.website = null
            }
            if (request.twitterUrl === '') {
              request.twitterUrl = null
            }
            if (request.coverPicture === '') {
              request.coverPicture = null
            }
            console.log(request)
            try {
              const { data, errors } = await updateProfile(request)
              if (errors && errors[0]) {
                setErrorMessage(errors[0].message)
              }
              if (data && data.updateProfile) {
                const updatedProfile = await getProfile(currentProfile.handle)
                dispatch({
                  type: 'UPDATE_LOCAL_PROFILE',
                  payload: updatedProfile.data.profiles.items[0],
                })
                dispatch(notify('Profile updated', 'success'))
              } else {
                setErrorMessage('Unknown error')
              }
            } catch (e) {
              console.error(e)
              setErrorMessage(e.message)
            }
            setUpdatingProfile(false)
          }}
        >
          <div className="form-control max-w-xs">
            <label className="label">
              <span className="label-text">Profile name</span>
            </label>
            <input
              name="name"
              className="input input-bordered"
              defaultValue={currentProfile?.name || ''}
              required
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
              required
            ></textarea>
          </div>
          <div className="form-control max-w-xs">
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <input
              name="location"
              className="input input-bordered"
              defaultValue={currentProfile?.location || ''}
              required
            ></input>
          </div>
          <div className="form-control max-w-md">
            <label className="label">
              <span className="label-text">Website</span>
            </label>
            <input
              name="website"
              className="input input-bordered"
              defaultValue={currentProfile?.website || ''}
              required
            ></input>
          </div>
          <div className="form-control max-w-md">
            <label className="label">
              <span className="label-text">Twitter profile link</span>
            </label>
            <input
              name="twitterUrl"
              className="input input-bordered"
              defaultValue={currentProfile?.twitterUrl || ''}
              required
            ></input>
          </div>
          <FileUploadUri
            name="coverPicture"
            label="Cover picture url"
            defaultValue={currentProfile?.coverPicture?.original.url}
            required={true}
          />

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
                'btn btn-wide btn-primary' + (updatingProfile ? ' loading' : '')
              }
              disabled={updatingProfile}
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
