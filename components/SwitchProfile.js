import apolloClient from '../apollo-client'
import parseJwt from '../helpers/parseJwt'
import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { GET_PROFILE_BY_OWNER } from '../gql/profile'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'

const getConnectedAddress = () => {
  try {
    const accessParams = parseJwt(localStorage.getItem('accessToken'))
    return accessParams.id
  } catch (e) {
    console.error(e)
  }
  return null
}

export default function SwitchProfile({ address }) {
  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_PROFILE_BY_OWNER,
    {
      variables: {
        address: address ? address : getConnectedAddress(),
        cursor: '{}',
      },
    },
  )
  useEffect(refetch, [address])

  const dispatch = useDispatch()
  const currentProfile = useSelector((state) => state.profile)

  const setCurrentProfile = (profile) => {
    dispatch({ type: 'UPDATE_LOCAL_PROFILE', payload: profile })
  }

  if (loading) {
    return (
      <div className="text-center">
        <a className="btn btn-ghost loading">Loading...</a>
      </div>
    )
  }

  if (error) {
    console.error(error)
    return null
  }

  const items = data.profiles.items

  return (
    <div className="dropdown">
      <div tabIndex="0" className="flex cursor-pointer">
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
      <ul
        tabIndex="0"
        className="dropdown-content menu menu-compact bg-base-300 w-48 rounded-lg mt-2"
      >
        {items.map((item) => (
          <li>
            <a
              className="flex"
              onClick={() => {
                setCurrentProfile(item)
              }}
            >
              <div className="avatar flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary">
                  <img src={item.picture?.original?.url} />
                </div>
              </div>
              <div className="ml-4">
                <div className="font-semibold">{item.name}</div>
                <div>@{item.handle}</div>
              </div>
            </a>
          </li>
        ))}
        {data.profiles.pageInfo.next ? (
          <li>
            <a
              className="btn btn-primary"
              onClick={() => {
                fetchMore({
                  variables: {
                    address: address ? address : getConnectedAddress(),
                    cursor: data.profiles.pageInfo.next,
                  },
                })
              }}
            >
              Load More
            </a>
          </li>
        ) : (
          ''
        )}
      </ul>
    </div>
  )
}
