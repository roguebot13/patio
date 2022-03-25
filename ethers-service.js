import { ethers } from 'ethers'

// This code will assume you are using MetaMask.
// It will also assume that you have already done all the connecting to metamask
// this is purely here to show you how the public API hooks together

export const getAddress = async () => {
  if (typeof window === 'undefined') return null
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  })
  return accounts[0]
}

export const signText = (text) => {
  if (typeof window === 'undefined') return null
  const ethersProvider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = ethersProvider.getSigner()
  return signer.signMessage(text)
}
