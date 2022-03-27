import { v4 as uuidv4 } from 'uuid'

const BaseMetadata = {
  /**
   * The metadata version.
   */
  version: '1.0.0',

  /**
   * The metadata lens_id can be anything but if your uploading to ipfs
   * you will want it to be random.. using uuid could be an option!
   */
  metadata_id: '',

  /**
   * A human-readable description of the item.
   */
  description: null,

  /**
   * The content of a publication. If this is blank `media` must be defined or its out of spec.
   */
  content: null,

  /**
   * This is the URL that will appear below the asset's image on OpenSea and others etc
   * and will allow users to leave OpenSea and view the item on the site.
   */
  // external_url: null,

  /**
   * Name of the item.
   */
  name: null,

  /**
   * These are the attributes for the item, which will show up on the OpenSea and others NFT trading websites on the 
  item.
   */
  attributes: [],

  /**
   * legacy to support OpenSea will store any NFT image here. URL
   */
  // image: null,

  /**
   * This is the mime type of image. This is used if you uploading more advanced cover images
   * as sometimes IPFS does not emit the content header so this solves the pr
   */
  // imageMimeType: null,

  /**
   * This is lens supported attached media items to the publication
   */
  // media: null,

  /**
   * Legacy for OpenSea and other providers
   * A URL to a multi-media attachment for the item. The file extensions GLTF, GLB, WEBM, MP4, M4V, OGV,
   * and OGG are supported, along with the audio-only extensions MP3, WAV, and OGA.
   * Animation_url also supports HTML pages, allowing you to build rich experiences and interactive NFTs using JavaScript canvas,
   * WebGL, and more. Scripts and relative paths within the HTML page are now supported. However, access to browser extensions is not supported.

   */
  // animation_url: null,

  /**
   * This is the appId the content belongs to
   */
  appId: 'patio-v1',
}

export const prepareMetadata = (fieldValues = {}, nft = false) => {
  if (fieldValues.content.trim() === '') return null

  let metadata = {
    ...BaseMetadata,
    metadata_id: uuidv4(),
    content: fieldValues.content,
    description: fieldValues.description,
    name: fieldValues.name,
  }

  if (!metadata.name) {
    if (nft) return null
    metadata.name = 'Post'
  } else if (metadata.name.trim() === '') {
    if (nft) return null
    metadata.name = 'Post'
  }

  if (!metadata.description) {
    if (nft) return null
  } else if (metadata.description.trim() === '') {
    if (nft) return null
  }

  return metadata
}

export const CollectModules = {
  emptyCollectModule: {
    name: 'EmptyCollectModule',
    getParams: () => ({
      emptyCollectModule: true,
    }),
  },
  revertCollectModule: {
    name: 'RevertCollectModule',
    getParams: () => ({
      revertCollectModule: true,
    }),
  },
  //   feeCollectModule: (amount) =>({
  //     "amount": {
  //                "currency": "0xD40282e050723Ae26Aeb0F77022dB14470f4e011",
  //                "value": "0.01"
  //              },
  //              "recipient": "0xEEA0C1f5ab0159dba749Dc0BAee462E5e293daaF",
  //              "referralFee": 10.5
  //   }),
  // limitedFeeCollectModule: {
  //             "collectLimit": "100000",
  //             "amount": {
  //                "currency": "0xD40282e050723Ae26Aeb0F77022dB14470f4e011",
  //                "value": "0.01"
  //              },
  //              "recipient": "0xEEA0C1f5ab0159dba749Dc0BAee462E5e293daaF",
  //              "referralFee": 10.5
  //   },
  //          limitedFeeCollectModule: {
  //             "collectLimit": "100000",
  //             "amount": {
  //                "currency": "0xD40282e050723Ae26Aeb0F77022dB14470f4e011",
  //                "value": "0.01"
  //              },
  //              "recipient": "0xEEA0C1f5ab0159dba749Dc0BAee462E5e293daaF",
  //              "referralFee": 10.5
  //   },
  //          timedFeeCollectModule: {
  //             "amount": {
  //                "currency": "0xD40282e050723Ae26Aeb0F77022dB14470f4e011",
  //                "value": "0.01"
  //              },
  //              "recipient": "0xEEA0C1f5ab0159dba749Dc0BAee462E5e293daaF",
  //              "referralFee": 10.5
  //          }
}

export const ModuleCurrencies = [
  {
    __typename: 'Erc20',
    name: 'Wrapped Matic',
    symbol: 'WMATIC',
    decimals: 18,
    address: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
  },
  {
    __typename: 'Erc20',
    name: 'WETH',
    symbol: 'WETH',
    decimals: 18,
    address: '0x3C68CE8504087f89c640D02d133646d98e64ddd9',
  },
  {
    __typename: 'Erc20',
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
    address: '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e',
  },
  {
    __typename: 'Erc20',
    name: 'DAI',
    symbol: 'DAI',
    decimals: 18,
    address: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
  },
]

// export const ReferenceModules = {
//   followerOnlyReferenceModule: {
//     name: 'FollowerOnlyReferenceModule',
//     getParams: () => ({ followerOnlyReferenceModule: true }),
//   },
// }
