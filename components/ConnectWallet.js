import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import apolloClient from '../apollo-client'
import { getAddress, signText } from '../ethers-service'
import parseJwt from '../helpers/parseJwt'

import {
  GET_CHALLENGE,
  AUTHENTICATION,
  REFRESH_AUTHENTICATION,
} from '../gql/login'
import SwitchProfile from './SwitchProfile'

const generateChallenge = (address) => {
  return apolloClient.query({
    query: GET_CHALLENGE,
    variables: {
      request: {
        address,
      },
    },
  })
}

const authenticate = (address, signature) => {
  return apolloClient.mutate({
    mutation: AUTHENTICATION,
    variables: {
      request: {
        address,
        signature,
      },
    },
  })
}

const reauthenticate = (refreshToken) => {
  return apolloClient.mutate({
    mutation: REFRESH_AUTHENTICATION,
    variables: {
      request: {
        refreshToken,
      },
    },
  })
}

export default function ConnectWallet() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [loading, setLoading] = useState(false)

  const storeTokens = (tokens) => {
    if (tokens) {
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      const accessExpiry = parseJwt(tokens.accessToken)['exp'] * 1000,
        refreshExpiry = parseJwt(tokens.refreshToken)['exp'] * 1000
      localStorage.setItem('accessExpiry', accessExpiry)
      localStorage.setItem('refreshExpiry', refreshExpiry)
      setWalletConnected(true)
    } else {
      //TODO: handle error in authentication
      setWalletConnected(false)
    }
  }

  const removeTokens = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessExpiry')
    localStorage.removeItem('refreshExpiry')
    localStorage.removeItem('currentProfile')
    setWalletConnected(false)
  }

  const refreshAccess = async () => {
    setLoading(true)
    const refreshToken = localStorage.getItem('refreshToken')
    const tokens = await reauthenticate(refreshToken)
    storeTokens(tokens?.data?.refresh)
    setLoading(false)
  }

  const login = async () => {
    setLoading(true)
    // we grab the address of the connected wallet
    try {
      const address = await getAddress()

      // we request a challenge from the server
      const challengeResponse = await generateChallenge(address)

      // sign the text with the wallet
      const signature = await signText(challengeResponse.data.challenge.text)

      const tokens = await authenticate(address, signature)
      storeTokens(tokens?.data?.authenticate)
    } catch (e) {
      console.error(e)
      setWalletConnected(false)
    }
    setLoading(false)
  }

  const logout = async () => {
    removeTokens()
  }

  const checkForExpiry = () => {
    const accessExpiry = Number(localStorage.getItem('accessExpiry'))
    const refreshExpiry = Number(localStorage.getItem('refreshExpiry'))
    if (dayjs(accessExpiry).isAfter(dayjs())) {
      console.log('accessToken valid')
      setTimeout(checkForExpiry, accessExpiry - dayjs().valueOf())
      setWalletConnected(true)
    } else if (
      dayjs(accessExpiry).isBefore(dayjs()) &&
      dayjs(refreshExpiry).isAfter(dayjs())
    ) {
      console.log('accessToken expired, refreshing..')
      refreshAccess()
    } else {
      console.log('refreshToken expried, login again..')
      login()
    }
  }

  useEffect(checkForExpiry, [])

  return (
    <div className="flex items-center justify-between pl-3">
      <SwitchProfile />
      {walletConnected ? (
        <button
          className={
            'btn btn-circle btn-sm btn-ghost' + (loading ? ' loading' : '')
          }
          onClick={logout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      ) : (
        <button
          className={'btn btn-primary' + (loading ? ' loading' : '')}
          onClick={login}
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}
