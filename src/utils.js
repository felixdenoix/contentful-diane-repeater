/* Takes an HTML5 file, encodes as Base64 data Url,
   returns a two element list of Base64 Url prefix and
   raw Base64 data.

   readFileAsUrl(file: HTMLFile): [string, string]
 */
export function readFileAsUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = function(e) {
      resolve(e.target.result.split(","))
    }

    reader.onerror = function(e) {
      reject(e.error)
    }

    reader.onabort = function(e) {
      reject(new Error("File aborted."))
    }

    reader.readAsDataURL(file)
  })
}

// getImageUrlFromDataTransfer(dataTransfer: DataTransfer): string?
export function getImageUrlFromDataTransfer(dataTransfer) {
  const html = dataTransfer.getData("text/html")
  if (!html) {
    return
  }

  const frag = document.createElement("main")
  frag.innerHTML = html

  const img = frag.querySelector("img")

  return (img && img.src) || null
}

// getAssetIdFromDataTransfer(dataTransfer: DataTransfer): string?
export function getAssetIdFromDataTransfer(dataTransfer) {
  const plain = dataTransfer.getData("text/plain")
  const match = plain.match(/spaces\/\w+\/assets\/(\w+)\/?$/)

  if (!match) {
    return
  }

  return match[1]
}

// getBase64FromDataTransfer(dataTransfer: DataTransfer): [base64Prefix, base64Data]
export function getBase64FromDataTransfer(dataTransfer) {
  const src = getImageUrlFromDataTransfer(dataTransfer)
  if (!/^data:image\/\w+;base64,/.test(src)) {
    return
  }

  const parts = src.split(",")

  return {
    prefix: parts[0],
    data: parts[1],
    type: src.split(/:|;/)[1]
  }
}

// isImageAsset(asset: AssetEntity, locale: string): boolean
export function isImageAsset(asset, locale) {
  return (
    asset.fields.file[locale] &&
    /^image\//.test(asset.fields.file[locale].contentType)
  )
}


export function  randomId() {
  const allowedChars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8','9','0','-']
  const max = allowedChars.length - 1
  let randomId = '_';
  for(let i=0; i < 9; i++) {
    const index = Math.ceil(Math.random()*max)
    randomId += allowedChars[Math.ceil(Math.random()*max)]
  }
  return randomId
}