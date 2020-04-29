import React from 'react'
import PropTypes from 'prop-types'

import { TextInput, Button } from '@contentful/forma-36-react-components';

import './itemcontent.css'

export default function ItemContent({imageEl, updateGrid, updateMargin, updateFullBleed, itemIndex, imageIndex, onClickLinkExisting, deleteImage, setDistantFieldValue, sdk}) {

  return (
    <div className="element__content">
      <div className="title">
        <h4>
          {imageEl.id}
        </h4>
        <Button
          className="hide"
          buttonType="negative"
          size="small"
          icon="Warning"
          onClick={()=>{deleteImage(itemIndex, imageIndex)}}>
          remove image
        </Button>
      </div>

      <div className="image" >
        <div className="image__wrapper">
          {
            (imageEl.asset.id && imageEl.asset.url) && <img src={imageEl.asset.url} alt="" onLoad={()=>sdk.window.updateHeight()}/>
          }
        </div>
        <div className="image__actions">
          <Button buttonType="muted" size="small" icon="Asset" onClick={(e) => onClickLinkExisting(itemIndex, imageIndex, e)}>link existing image</Button>
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
      </div>

    </div>
  )
}

ItemContent.propTypes = {
  imageEl: PropTypes.object,
  updateGrid: PropTypes.func,
  updateMargin: PropTypes.func,
  updateFullBleed: PropTypes.func,
  itemIndex: PropTypes.number,
  imageIndex: PropTypes.number,
  onClickLinkExisting: PropTypes.func,
  setDistantFieldValue: PropTypes.func,
  deleteImage: PropTypes.func,
}