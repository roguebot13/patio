import { ethers, utils } from 'ethers'
import omitDeep from 'omit-deep'
// This code will assume you are using MetaMask.
// It will also assume that you have already done all the connecting to metamask
// this is purely here to show you how the public API hooks together

export const getSigner = () => {
  if (typeof window === 'undefined') return null
  const ethersProvider = new ethers.providers.Web3Provider(window.ethereum)
  return ethersProvider.getSigner()
}

export const getAddressFromSigner = async () => {
  return await getSigner().getAddress()
}

export const signedTypeData = (domain, types, value) => {
  const signer = getSigner()
  return signer._signTypedData(
    omitDeep(domain, '__typename'),
    omitDeep(types, '__typename'),
    omitDeep(value, '__typename'),
  )
}

export const splitSignature = (signature) => {
  return utils.splitSignature(signature)
}

export const sendTx = (transaction) => {
  const signer = ethersProvider.getSigner()
  return signer.sendTransaction(transaction)
}

export const getAddress = async () => {
  if (typeof window === 'undefined') return null
  if (!window.ethereum) return null
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
