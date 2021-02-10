import {randomId} from './utils'
export const baseScene = () => ({
  type: 'scene',
  id: randomId(),
  title: '',
  content: [],
})

export const baseSceneItem = () => ({
    type: "image",
    id: `image-${randomId()}`,
    asset: {
      id: `asset-${randomId()}`,
      url: "",
      title: "",
      contentType: "",
      dimentions: {
        width: 0,
        height: 0
      },
      size: 0
    },
    grid: {
      desktopTl: {x: "0", y: "0"},
      desktopBr: {x: "0", y: "0"},
      mobileTl: {x: "0", y: "0"},
      mobileBr: {x: "0", y: "0"}
    },
    margins: {
      mTop: false,
      mLeft: false,
      mBottom: false,
      mRight: false
    },
    marginsMobile: {
      mTop: false,
      mLeft: false,
      mBottom: false,
      mRight: false
    },
    anchor: 'none',
    anchorMobile: 'none',
    objectFit: 'none',
    objectFitMobile: 'none',
    zIndex: "0",
    fullBleed: false,
    stampEffect: false,
    autoPlay: false,
})

const baseAsset = () => ({

})
