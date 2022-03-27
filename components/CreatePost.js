import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPostTypedData, createCommentTypedData } from '../gql/publication'
import { pollUntilIndexed } from '../helpers/pollUntilIndexed'
import { notify } from 'reapop'
import { prepareMetadata } from '../helpers/prepareMetadata'
import ipfs from '../ipfs-client'

const renderCollectModuleParams = (collectModule) => {
  switch (collectModule) {
    case 'emptyCollectModule':
    case 'revertCollectModule':
      return ''
    case 'feeCollectModule':
    case 'timedFeeCollectModule':
      return (
        <>
          <div className="form-control max-w-md">
            <div className="input-group">
              <span className="text-sm">Each for</span>
              <input
                type="number"
                className="input input-sm min-w-0 bg-base-300"
                placeholder="Amount"
              />
              <select
                className="select select-sm bg-base-300 pr-10 pl-4"
                defaultValue="0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"
              >
                <option value="0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889">
                  WMATIC
                </option>
                <option value="0x3C68CE8504087f89c640D02d133646d98e64ddd9">
                  WETH
                </option>
                <option value="0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e">
                  USDC
                </option>
                <option value="0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F">
                  DAI
                </option>
              </select>
            </div>
          </div>
          <div className="form-control max-w-sm">
            <div className="input-group">
              <span className="text-sm">Send to</span>
              <input
                type="text"
                className="input input-sm flex-grow bg-base-300"
                placeholder="Receipient address"
              />
            </div>
          </div>
          <div className="form-control max-w-sm">
            <div className="input-group">
              <span className="text-sm whitespace-nowrap">Referrer gets</span>
              <input
                type="number"
                className="input input-sm flex-grow min-w-0 bg-base-300"
                placeholder="Referral"
                defaultValue="0"
              />
              <span className="text-sm whitespace-nowrap">% Referral</span>
            </div>
          </div>
        </>
      )
    case 'limitedFeeCollectModule':
    case 'limitedTimedFeeCollectModule':
      return (
        <>
          <div className="form-control w-full max-w-sm">
            <div className="input-group ">
              <span className="text-sm">Max</span>
              <input
                type="number"
                className="input input-sm flex-grow bg-base-300"
                placeholder="Editions"
              />
            </div>
          </div>
          {renderCollectModuleParams('feeCollectModule')}
        </>
      )
  }
}

export default function CreatePost({
  commentMode = false,
  publicationId = null,
  onSuccess = () => {},
}) {
  const currentProfile = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const [creatingPost, setCreatingPost] = useState(false)
  const [advancedPost, setAdvancedPost] = useState(false)
  const [collectModule, setCollectModule] = useState('emptyCollectModule')

  // useEffect(async () => {
  //   const res = await pollUntilIndexed(
  //     '0x1dfa95afa9ebca3eba13ee53c8160bf04eaf5f90dbfb78b8a33d1c3706a5d788',
  //   )
  //   console.log(res)
  // })

  const uploadMetadata = async (metadata) => {
    let url = null
    try {
      const file = JSON.stringify(metadata)
      const res = await ipfs.add(file)
      url = 'https://ipfs.infura.io/ipfs/' + res.path
    } catch (e) {
      console.error(e)
      dispatch(notify(e.message, 'error'))
    }
    return url
  }

  const createPost = async (fieldValues) => {
    const metadata = prepareMetadata(fieldValues, advancedPost)
    console.log(metadata)
    if (!metadata) {
      dispatch(notify('Invalid Post', 'error'))
      return
    }
    setCreatingPost(true)
    const metadataUrl = await uploadMetadata(metadata)
    console.log(metadataUrl)
    let createPostRequest = {
      profileId: currentProfile?.id,
      contentURI: metadataUrl,
      collectModule: {
        emptyCollectModule: true,
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    }
    if (commentMode) {
      createPostRequest.publicationId = publicationId
    }

    try {
      let typedData
      if (commentMode) {
        const result = await createCommentTypedData(createPostRequest)
        typedData = result.data.createCommentTypedData.typedData
      } else {
        const result = await createPostTypedData(createPostRequest)
        typedData = result.data.createPostTypedData.typedData
      }

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
      let tx
      if (commentMode) {
        tx = await lensHub.commentWithSig({
          profileId: typedData.value.profileId,
          contentURI: typedData.value.contentURI,
          profileIdPointed: typedData.value.profileIdPointed,
          pubIdPointed: typedData.value.pubIdPointed,
          collectModule: typedData.value.collectModule,
          collectModuleData: typedData.value.collectModuleData,
          referenceModule: typedData.value.referenceModule,
          referenceModuleData: typedData.value.referenceModuleData,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        })
      } else {
        tx = await lensHub.postWithSig({
          profileId: typedData.value.profileId,
          contentURI: typedData.value.contentURI,
          collectModule: typedData.value.collectModule,
          collectModuleData: typedData.value.collectModuleData,
          referenceModule: typedData.value.referenceModule,
          referenceModuleData: typedData.value.referenceModuleData,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        })
      }

      const res = await pollUntilIndexed(tx.hash)
      console.log(res)
      if (res && res.indexed) {
        dispatch(
          notify('Created ' + (commentMode ? 'Comment' : 'Post'), 'success'),
        )
        if (commentMode && onSuccess) onSuccess()
      }
    } catch (e) {
      console.error(e)
      dispatch(notify(e.message, 'error'))
    }
    setCreatingPost(false)
  }

  return (
    <div
      className={
        'flex w-full' + (commentMode ? ' p-2' : ' p-8 border-b border-base-300')
      }
    >
      <div className="flex-shrink-0 avatar">
        <div className="w-12 h-12 bg-primary rounded-full">
          <img src={currentProfile?.picture?.original.url} />
        </div>
      </div>
      <form
        className="flex flex-col flex-grow ml-4 gap-2"
        onSubmit={(e) => {
          e.stopPropagation()
          e.preventDefault()
          createPost({
            name: e.target.elements.name?.value,
            description: e.target.elements.description?.value,
            content: e.target.elements.content.value,
            // imageUrl: e.target.elements.imageUrl.value,
            // imageMimeType:,
            // media:[],
            // animation_url,
          })
        }}
      >
        {advancedPost ? (
          <>
            <div className="form-control max-w-md">
              <label className="label">
                <span className="label-text">NFT Name</span>
              </label>
              <input name="name" className="input input-bordered"></input>
            </div>
            <div className="form-control max-w-md">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input
                name="description"
                className="input input-bordered"
              ></input>
            </div>
          </>
        ) : (
          ''
        )}
        <div className="form-control">
          {advancedPost ? (
            <label className="label">
              <span className="label-text">Content</span>
            </label>
          ) : (
            ''
          )}
          <textarea
            className="textarea textarea-bordered"
            name="content"
            rows="3"
            placeholder={advancedPost ? '' : "What's happening?"}
          ></textarea>
        </div>
        {advancedPost ? (
          <>
            <div className="form-control max-w-md">
              <label className="label">
                <span className="label-text">Pricing</span>
              </label>
              <select
                className="select select-bordered"
                value={collectModule}
                onChange={(e) => {
                  setCollectModule(e.target.value)
                }}
              >
                <option value="emptyCollectModule">
                  Anyone can collect freely
                </option>
                <option value="feeCollectModule">Fee based collectible</option>
                <option value="timedFeeCollectModule">
                  Fee based collectible for 24 hours
                </option>
                <option value="limitedFeeCollectModule">
                  Limited edition, fee based collectible
                </option>
                <option value="limitedTimedFeeCollectModule">
                  Limited edition, fee based collectible for 24 hours
                </option>
                <option value="revertCollectModule">Not collectibe</option>
              </select>
            </div>

            {renderCollectModuleParams(collectModule)}
          </>
        ) : (
          ''
        )}
        <div className="flex justify-between mt-2">
          <div className="flex gap-2">
            <select className="select select-sm select-ghost" defaultValue="1">
              <option value="1">Anyone can reply</option>
              <option value="2">Only followers</option>
            </select>
            <button className="btn btn-ghost btn-sm btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button className="btn btn-ghost btn-sm btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button className="btn btn-ghost btn-sm btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
          </div>
          <div className="flex gap-2">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text mr-2">NFT</span>
                <input
                  type="checkbox"
                  className="toggle toggle-sm"
                  checked={advancedPost}
                  onChange={() => {
                    setAdvancedPost(!advancedPost)
                  }}
                />
              </label>
            </div>
            <button
              className={
                'btn btn-primary btn-sm w-32' + (creatingPost ? ' loading' : '')
              }
              type="submit"
              disabled={creatingPost}
            >
              {commentMode ? 'Comment' : 'Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
