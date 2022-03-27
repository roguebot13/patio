import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import apolloClient from '../apollo-client'
import parseJwt from '../helpers/parseJwt'
import { useDispatch } from 'react-redux'
import { notify } from 'reapop'
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
  const dispatch = useDispatch()

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
    const { getAddress, signText } = await import('../ethers-service')
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
      dispatch(notify(e.message, 'error'))
      setWalletConnected(false)
    }
    setLoading(false)
  }

  const logout = async () => {
    dispatch({ type: 'REMOVE_LOCAL_PROFILE' })
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
      <SwitchProfile logout={logout} />
      {walletConnected ? (
        <div>
          {loading ? (
            <button
              className="btn btn-ghost btn-square loading"
              disabled
            ></button>
          ) : (
            ''
          )}
        </div>
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
