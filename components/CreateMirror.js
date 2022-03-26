import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { pollUntilIndexed } from '../helpers/pollUntilIndexed'
import { notify } from 'reapop'
import { createMirrorTypedData } from '../gql/publication'

export default function CreateMirror({ item, itemMirroredBy }) {
  const currentProfile = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const [
    followerOnlyReferenceModule,
    setFollowerOnlyReferenceModule,
  ] = useState(false)
  const [mirrorReqPending, setMirrorReqPending] = useState(false)
  const modalShowRef = useRef()

  const createMirror = async () => {
    // hard coded to make the code example clear
    setMirrorReqPending(true)

    const createMirrorRequest = {
      profileId: currentProfile.id,
      publicationId: item.id,
      referenceModule: {
        followerOnlyReferenceModule,
      },
    }
    try {
      const result = await createMirrorTypedData(createMirrorRequest)
      const typedData = result.data.createMirrorTypedData.typedData

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
      const tx = await lensHub.mirrorWithSig({
        profileId: typedData.value.profileId,
        profileIdPointed: typedData.value.profileIdPointed,
        pubIdPointed: typedData.value.pubIdPointed,
        referenceModule: typedData.value.referenceModule,
        referenceModuleData: typedData.value.referenceModuleData,
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
        dispatch(notify('Mirrored ' + item.__typename, 'success'))
        if (modalShowRef && modalShowRef.current) {
          modalShowRef.current.checked = false
        }
      }
    } catch (e) {
      console.error(e)
    }
    setMirrorReqPending(false)
  }

  return (
    <div>
      <label
        className={
          'btn btn-sm tooltip tooltip-bottom flex items-center' +
          (currentProfile.id === itemMirroredBy ? ' btn-accent' : ' btn-ghost')
        }
        data-tip="Mirror"
        htmlFor={'mirror-' + item.id}
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
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
          />
        </svg>
        <span>{item.stats.totalAmountOfMirrors}</span>
      </label>
      <input
        type="checkbox"
        id={'mirror-' + item.id}
        className="modal-toggle"
        ref={modalShowRef}
      />
      <label className="modal cursor-pointer" htmlFor={'mirror-' + item.id}>
        <label className="modal-box relative" htmlFor="">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Allow only followers to mirror</span>
              <input
                type="checkbox"
                className="toggle"
                checked={followerOnlyReferenceModule}
                onChange={() =>
                  setFollowerOnlyReferenceModule(!followerOnlyReferenceModule)
                }
              />
            </label>
          </div>
          <div className="modal-action">
            <label htmlFor={'mirror-' + item.id} className="btn btn-ghost">
              Cancel
            </label>
            <button
              className={
                'btn btn-primary' + (mirrorReqPending ? ' loading' : '')
              }
              disabled={mirrorReqPending}
              onClick={createMirror}
            >
              Mirror
            </button>
          </div>
        </label>
      </label>
    </div>
  )
}
