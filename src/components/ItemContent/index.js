import React from 'react'
import PropTypes from 'prop-types'

import { TextInput, Button } from '@contentful/forma-36-react-components';

import './itemcontent.css'

export default function ItemContent({imageEl, updateGrid, updateMargin, updateFullBleed, updateAnchor, updateObjectFit, itemIndex, imageIndex, onClickLinkExisting, deleteImage, setDistantFieldValue, sdk}) {

  let asset;

  if (imageEl.asset.id && imageEl.asset.url) {
    if (imageEl.asset.contentType && imageEl.asset.contentType.includes('video')) {

      asset = (<video width="320" height="240" controls>
        <source src={'https:' + imageEl.asset.url} type={imageEl.asset.contentType} />
        </video>)

    } else {

      asset = <img src={imageEl.asset.url} alt="" onLoad={()=>sdk.window.updateHeight()}/>

    }
  }

  const anchorValues = ['top', 'left', 'bottom', 'right', 'center', 'none']

  const objectFitValues = ['contain', 'cover', 'none']

  return (
    <div className="element__content">
      <div className="title">
        <h3>
          {imageEl.id}
        </h3>
        <Button
          className="hide"
          buttonType="negative"
          size="small"
          icon="Warning"
          onClick={()=>{deleteImage(itemIndex, imageIndex)}}>
          remove image
        </Button>
      </div>

      <div className="image">
        <h4>Image</h4> <br/>
        <div className="position__line">
          <div className="image__wrapper">
            {asset}
          </div>
          <div className="image__actions">
            <Button buttonType="muted" size="small" icon="Asset" onClick={(e) => onClickLinkExisting(itemIndex, imageIndex, e)}>link existing image</Button>
          </div>
        </div>
      </div>

      <div className="positions">
        <h4>Positions</h4>
        {imageEl.grid && Object.keys(imageEl.grid).map(pos =>
          <div className="position__line" key={pos}>
            <p>{pos}</p>
            <div className="position__wrapper">
              <span>x:</span> <TextInput
                type="number"
                value={imageEl.grid[pos].x}
                maxLength={1}
                onChange={(e) => updateGrid(pos, 'x', itemIndex, imageIndex, e)}/>
            </div>
            <div className="position__wrapper">
              <span>y:</span> <TextInput
                type="number"
                value={imageEl.grid[pos].y}
                maxLength={1}
                onChange={(e) => updateGrid(pos, 'y', itemIndex, imageIndex, e)}/>
            </div>
          </div>
        )}
        <div className="position__line">
          <p>margin</p>
          <div className="position__wrapper">
            <label htmlFor="fullBleed">FullBleed</label>
            <input
              type="checkbox"
              name="fullBleed"
              id="fullBleed"
              checked={imageEl.fullBleed}
              onChange={e=> updateFullBleed(itemIndex, imageIndex, e)}/>
          </div>
          { imageEl.margins && Object.keys(imageEl.margins).map(marginPos =>
            <div className="position__wrapper" key={marginPos}>
              <label htmlFor={marginPos}>{marginPos}</label>
              <input
                type="checkbox"
                name={marginPos}
                checked={imageEl.margins[marginPos]}
                onChange={(e) => updateMargin(marginPos, itemIndex, imageIndex, e)}
                id={marginPos}/>
            </div>
          )}
        </div>
        <div className="position__line">
          <p>anchor</p>
          <form>
            {anchorValues.map((anchor) =>
              <div className="position__wrapper" key={anchor}>
                <label htmlFor={anchor + '-an-' + imageIndex}>{anchor}</label>
                <input
                  type="radio"
                  name={anchor}
                  id={anchor + '-an-' + imageEl.id}
                  value={anchor}
                  checked={imageEl.anchor === anchor}
                  onChange={e => updateAnchor(itemIndex, imageIndex, e)}
                  />
              </div>
            )}
          </form>
        </div>
        <div className="position__line">
        <p>objectFit</p>
        <form>
          {objectFitValues.map((objectFit) =>
            <div className="position__wrapper" key={objectFit}>
              <label htmlFor={objectFit + '-of-' + imageIndex}>{objectFit}</label>
              {'none'==='none'}
              <input
                type="radio"
                name={objectFit}
                id={objectFit + '-of-' + imageEl.id}
                value={objectFit}
                checked={imageEl.objectFit === objectFit}
                onChange={e => updateObjectFit(itemIndex, imageIndex, e)}
                />
            </div>
          )}
        </form>
      </div>
      </div>

    </div>
  )
}

ItemContent.propTypes = {
  imageEl: PropTypes.object,
  updateGrid: PropTypes.func,
  updateMargin: PropTypes.func,
  updateFullBleed: PropTypes.func,
  updateAnchor: PropTypes.func,
  updateObjectFit: PropTypes.func,
  itemIndex: PropTypes.number,
  imageIndex: PropTypes.number,
  onClickLinkExisting: PropTypes.func,
  setDistantFieldValue: PropTypes.func,
  deleteImage: PropTypes.func,
}