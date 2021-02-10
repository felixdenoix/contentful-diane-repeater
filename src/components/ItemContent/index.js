import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { TextInput, Button } from '@contentful/forma-36-react-components';

import './itemcontent.css'

// TODO: add autoplay option!

export default function ItemContent({
  id,
  imageEl,
  updateGrid,
  updateMargin,
  updateMarginMobile,
  updateFullBleed,
  updateZIndex,
  updateAnchor,
  updateAnchorMobile,
  updateObjectFit,
  updateObjectFitMobile,
  updateStampEffect,
  onClickLinkExistingStamp,
  updateAutoPlay,
  itemIndex,
  imageIndex,
  onClickLinkExisting,
  deleteImage,
  sdk
}) {

  let asset;

  if (imageEl.asset.id && imageEl.asset.url) {
    if (imageEl.asset.contentType && imageEl.asset.contentType.includes('video')) {

      asset = (<video width="320" height="240" controls>
        <source src={'https:' + imageEl.asset.url} type={imageEl.asset.contentType} />
        </video>)

    } else {

      asset = <img src={imageEl.asset.url + '?w=200'} alt="" onLoad={()=>sdk.window.updateHeight()}/>

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
          remove
        </Button>
      </div>

      <div className="image">
        <h4>Image</h4> <br/>
        <div className="position__line">
          <div className="image__wrapper">
            {asset}
            {
              imageEl.asset.contentType && imageEl.asset.contentType.includes('video') &&
              <form>
                <div className="position__wrapper">
                  <label htmlFor={id + "auto_play"}>
                    video autoPlay
                    <input
                      type="checkbox"
                      name="auto_play"
                      id={id + "auto_play"}
                      checked={imageEl.autoPlay}
                      onChange={e=> updateAutoPlay(itemIndex, imageIndex, e)}
                      />
                  </label>
                </div>
              </form>
            }
          </div>
          <div className="image__actions">
            <Button buttonType="muted" size="small" icon="Asset" onClick={(e) => onClickLinkExisting(itemIndex, imageIndex, e)}>link existing image</Button>
          </div>
        </div>
      </div>

      <div className="positions">
        <h4>Display</h4>
        {
          // imageEl.grid && Object.keys(imageEl.grid).map(pos =>
          imageEl.grid && ['desktopTl', 'desktopBr', 'mobileTl', 'mobileBr'].map(pos =>
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
        <hr/>
        <div className="position__line">
          <p>zIndex</p>
          <div className="position__wrapper">
            <TextInput
              type="number"
              value={imageEl.zIndex}
              maxLength={1}
              onChange={(e) => updateZIndex(itemIndex, imageIndex, e)}/>
          </div>
        </div>
        <hr/>
        <div className="position__line">
          <p>Affichage</p>
          <div className="position__wrapper">
            <label>
              FullBleed
              <input
                type="checkbox"
                name="fullBleed"
                id={id + "fullBleed"}
                checked={imageEl.fullBleed}
                onChange={e=> updateFullBleed(itemIndex, imageIndex, e)}/>
            </label>
          </div>
        </div>
        {
          (imageEl.asset.contentType && imageEl.asset.contentType.includes('image')) &&
          <Fragment>
            <hr/>
            <div className="position__line">
              <p>Animation</p>
              <form>
                <div className="position__wrapper">
                  <label>
                    stampEffect
                    <input
                      type="checkbox"
                      name="stamp_effect"
                      id={id + "stamp_effect"}
                      checked={imageEl.stampEffect}
                      onChange={e=> updateStampEffect(itemIndex, imageIndex, e)}
                      />
                  </label>


                  {imageEl.stampEffect && imageEl.stampAsset && <img src={imageEl.stampAsset.url} alt="" onLoad={()=>sdk.window.updateHeight()}/> }


                  {
                    imageEl.stampEffect &&
                    <Button buttonType="muted" size="small" icon="Asset" onClick={(e) => onClickLinkExistingStamp(itemIndex, imageIndex, e)}>link stamp image</Button>
                  }

                </div>
              </form>
            </div>
          </Fragment>
        }
        <hr/>

        <div className="desktop">

          <h5>Desktop</h5>
          <div className="position__line">
            <p>margin</p>
            { imageEl.margins && Object.keys(imageEl.margins).map(marginPos =>
              <div className="position__wrapper" key={marginPos}>
                <label>
                  {marginPos}
                  <input
                    type="checkbox"
                    name={marginPos}
                    checked={imageEl.margins[marginPos]}
                    onChange={(e) => updateMargin(marginPos, itemIndex, imageIndex, e)}
                    id={id + marginPos}/>
                </label>
              </div>
            )}
          </div>
          <div className="position__line">
            <p>anchor</p>
            <form>
              {anchorValues.map((anchor) =>
                <div className="position__wrapper" key={anchor}>
                  <label>
                    {anchor}
                    <input
                      type="radio"
                      name={anchor}
                      id={id + anchor + '-an-' + imageIndex}
                      value={anchor}
                      checked={imageEl.anchor === anchor}
                      onChange={e => updateAnchor(itemIndex, imageIndex, e)}
                      />
                  </label>
                </div>
              )}
            </form>
          </div>
          <div className="position__line">
            <p>objectFit</p>
            <form>
              {objectFitValues.map((objectFit) =>
                <div className="position__wrapper" key={objectFit}>
                  <label>
                    {objectFit}
                    <input
                      type="radio"
                      name={objectFit}
                      id={id + objectFit + '-of-' + imageIndex}
                      value={objectFit}
                      checked={imageEl.objectFit === objectFit}
                      onChange={e => updateObjectFit(itemIndex, imageIndex, e)}
                      />
                  </label>
                </div>
              )}
            </form>
          </div>
        </div>

        <hr/>

        <div className="mobile">

          <h5>Mobile</h5>
          <div className="position__line">
            <p>margin</p>
            { imageEl.margins && Object.keys(imageEl.margins).map(marginPos =>
              <div className="position__wrapper" key={marginPos}>
                <label>
                  {marginPos}
                  <input
                    type="checkbox"
                    id={id + marginPos}
                    name={marginPos}
                    checked={imageEl.marginsMobile && imageEl.marginsMobile[marginPos]}
                    onChange={(e) => updateMarginMobile(marginPos, itemIndex, imageIndex, e)}
                    />
                </label>
              </div>
            )}
          </div>
          <div className="position__line">
            <p>anchor</p>
            <form>
              {anchorValues.map((anchor) =>
                <div className="position__wrapper" key={anchor}>
                  <label>
                    {anchor}
                    <input
                      type="radio"
                      name={anchor}
                      id={id + anchor + '-anm-' + imageIndex}
                      value={anchor}
                      checked={imageEl.anchorMobile === anchor}
                      onChange={e => updateAnchorMobile(itemIndex, imageIndex, e)}
                      />
                  </label>
                </div>
              )}
            </form>
          </div>
          <div className="position__line">
            <p>objectFit</p>
            <form>
              {objectFitValues.map((objectFit) =>
                <div className="position__wrapper" key={objectFit}>
                  <label>
                    {objectFit}
                    <input
                      type="radio"
                      name={objectFit}
                      id={id + objectFit + '-ofm-' + imageIndex}
                      value={objectFit}
                      checked={imageEl.objectFitMobile === objectFit}
                      onChange={e => updateObjectFitMobile(itemIndex, imageIndex, e)}
                      />
                  </label>
                </div>
              )}
            </form>
          </div>

        </div>

      </div>

    </div>
  )
}

ItemContent.propTypes = {
  imageEl: PropTypes.object,
  updateGrid: PropTypes.func,
  updateMargin: PropTypes.func,
  updateMarginMobile: PropTypes.func,
  updateFullBleed: PropTypes.func,
  updateZIndex: PropTypes.func,
  updateAnchor: PropTypes.func,
  updateAnchorMobile: PropTypes.func,
  updateAutoPlay: PropTypes.func,
  updateObjectFit: PropTypes.func,
  updateObjectFitMobile: PropTypes.func,
  updateStampEffect: PropTypes.func,
  onClickLinkExistingStamp: PropTypes.func,
  itemIndex: PropTypes.number,
  imageIndex: PropTypes.number,
  onClickLinkExisting: PropTypes.func,
  deleteImage: PropTypes.func,
  sdk: PropTypes.object
}