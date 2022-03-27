import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { pollUntilIndexed } from '../helpers/pollUntilIndexed'
import { notify } from 'reapop'
import { createCollectTypedData } from '../gql/module'
import dayjs from 'dayjs'

const renderCollectModuleDetails = (item, overrideType) => {
  const type = overrideType ? overrideType : item.collectModule.type
  switch (type) {
    case 'FeeCollectModule':
      return (
        <>
          <div>
            Price:{' '}
            {item.collectModule.amount.value +
              ' ' +
              item.collectModule.amount.asset.symbol}
          </div>
        </>
      )
    case 'LimitedFeeCollectModule':
      return (
        <>
          <div>
            Only{' '}
            {item.collectModule.collectLimit - item.stats.totalAmountOfCollects}{' '}
            left
          </div>
          {renderCollectModuleDetails(item, 'FeeCollectModule')}
        </>
      )
    case 'LimitedTimedFeeCollectModule':
      return (
        <>
          <div>
            Collectible expires in {dayjs(item.createdAt).add(1, 'd').fromNow()}{' '}
            !
          </div>
          {renderCollectModuleDetails(item, 'LimitedFeeCollectModule')}
        </>
      )
    case 'TimedFeeCollectModule':
      return (
        <>
          <div>
            Collectible expires in {dayjs(item.createdAt).add(1, 'd').fromNow()}{' '}
            !
          </div>
          {renderCollectModuleDetails(item, 'FeeCollectModule')}
        </>
      )
    case 'EmptyCollectModule':
      return <div>This collectible is Free !</div>
    case 'RevertCollectModule':
      return <div>The owner has disabled collecting</div>
  }
}

export default function CreateCollect({ item }) {
  const currentProfile = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const [
    followerOnlyReferenceModule,
    setFollowerOnlyReferenceModule,
  ] = useState(false)
  const [collectReqPending, setCollectReqPending] = useState(false)
  const modalShowRef = useRef()

  const createCollect = async () => {
    // hard coded to make the code example clear
    setCollectReqPending(true)

    const createCollectRequest = {
      publicationId: item.id,
    }
    try {
      const result = await createCollectTypedData(createCollectRequest)
      const typedData = result.data.createCollectTypedData.typedData

      const {
        signedTypeData,
        splitSignature,
        getAddressFromSigner,
      } = await import('../ethers-service')
      const signature = await signedTypeData(
        typedData.domain,
        typedData.types,
        typedData.value,
      )
      const { v, r, s } = splitSignature(signature)

      const lensHub = (await import('../lens-hub')).lensHub
      const tx = await lensHub.collectWithSig({
        collector: await getAddressFromSigner(),
        profileId: typedData.value.profileId,
        pubId: typedData.value.pubId,
        data: typedData.value.data,
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
        dispatch(notify('Collected ' + item.__typename, 'success'))
        if (modalShowRef && modalShowRef.current) {
          modalShowRef.current.checked = false
        }
      }
    } catch (e) {
      console.error(e)
      dispatch(notify(e.message, 'error'))
    }
    setCollectReqPending(false)
  }

  return (
    <div>
      <label
        className={
          'btn btn-sm tooltip tooltip-bottom flex items-center' +
          (currentProfile.id === item.collectedBy?.defaultProfile?.id
            ? ' btn-accent'
            : ' btn-ghost')
        }
        data-tip="Collect"
        htmlFor={'collect-' + item.id}
        disabled={item.collectModule?.type === 'RevertCollectModule'}
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
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
        <span>{item.stats.totalAmountOfCollects}</span>
      </label>
      <input
        type="checkbox"
        id={'collect-' + item.id}
        className="modal-toggle"
        ref={modalShowRef}
      />
      <label className="modal cursor-pointer" htmlFor={'collect-' + item.id}>
        <label className="modal-box relative max-w-sm" htmlFor="">
          <div className="">{renderCollectModuleDetails(item)}</div>
          <div className="modal-action">
            <button
              className={
                'btn btn-primary btn-sm w-32' +
                (collectReqPending ? ' loading' : '')
              }
              disabled={collectReqPending}
              onClick={createCollect}
            >
              Collect
            </button>
          </div>
        </label>
      </label>
    </div>
  )
}
