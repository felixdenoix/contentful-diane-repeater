import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';

import Asset from './Asset';
import GridFields from './GridFields';

import {
  TextInput,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@contentful/forma-36-react-components';

import './itemcontent.css';

// margins labels are coming from object - too lazy to refactor - sort to ensure consistent ui
const marginsOrder = ['mTop', 'mRight', 'mBottom', 'mLeft'];
function sortMargins(a, b) {
  return marginsOrder.indexOf(a) - marginsOrder.indexOf(b);
}

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
  deleteAsset,
  sdk
}) {
  const anchorValues = ['top', 'left', 'bottom', 'right', 'center', 'none'];
  const objectFitValues = ['contain', 'cover', 'none'];

  return (
    <div className="element__content">
      <div className="delete">
        <Button
          className="hide"
          buttonType="negative"
          size="medium"
          icon="Delete"
          onClick={() => deleteAsset(itemIndex, imageIndex)}
        />
      </div>

      <div className="image">
        <h4>
          Image (<code>id: {imageEl.id}</code>)
        </h4>{' '}
        <br />
        <div className="position__line">
          <div className="image__wrapper">
            <Asset asset={imageEl.asset} sdk={sdk} />
            {imageEl.asset.contentType && imageEl.asset.contentType.includes('video') && (
              <div className="position__wrapper">
                <label htmlFor={id + 'auto_play'}>
                  video autoPlay
                  <input
                    type="checkbox"
                    name="auto_play"
                    id={id + 'auto_play'}
                    checked={!!imageEl.autoPlay}
                    onChange={e => updateAutoPlay(itemIndex, imageIndex, e)}
                  />
                </label>
              </div>
            )}
          </div>
          <div className="image__actions">
            <Button
              buttonType="muted"
              size="small"
              icon="Asset"
              onClick={e => onClickLinkExisting(itemIndex, imageIndex, e)}>
              link asset
            </Button>
          </div>
        </div>
      </div>

      <div className="positions">
        <div className="line line-justified">
          <h4>Grid Positionning</h4>
          <label className="full-bleed">
            Cover (image fills the whole grid)
            <input
              type="checkbox"
              name="fullBleed"
              id={id + 'fullBleed'}
              checked={imageEl.fullBleed}
              onChange={e => updateFullBleed(itemIndex, imageIndex, e)}
            />
          </label>
        </div>

        {!imageEl.fullBleed && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="center">
                  top-left <code>▛</code>
                </TableCell>
                <TableCell align="center">
                  bottom-right <code>▟</code>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries({
                desktop: ['desktopTl', 'desktopBr'],
                mobile: ['mobileTl', 'mobileBr']
              }).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell align="center">{key}</TableCell>
                  {value.map(pos => (
                    <TableCell key={imageEl.id + pos}>
                      <GridFields
                        updateGrid={updateGrid}
                        pos={pos}
                        itemIndex={itemIndex}
                        imageIndex={imageIndex}
                        imageEl={imageEl}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="line">
          <label className="line z-input">
            <span className="inline">zIndex</span>
            <TextInput
              className="input inline"
              type="number"
              value={imageEl.zIndex}
              maxLength={2}
              onChange={e => updateZIndex(itemIndex, imageIndex, e)}
            />
          </label>
        </div>

        <hr />

        {imageEl.asset.contentType && imageEl.asset.contentType.includes('image') && (
          <Fragment>
            <div className="py-4">
              <h4 className="m-0">Animation</h4>
              <div className="position__line">
                <div className="position__wrapper">
                  <label>
                    Stamp effect
                    <input
                      type="checkbox"
                      name="stamp_effect"
                      id={id + 'stamp_effect'}
                      checked={imageEl.stampEffect}
                      onChange={e => updateStampEffect(itemIndex, imageIndex, e)}
                    />
                  </label>

                  {imageEl.stampEffect && imageEl.stampAsset && (
                    <img src={imageEl.stampAsset.url} alt="" />
                  )}

                  {imageEl.stampEffect && (
                    <Button
                      buttonType="muted"
                      size="small"
                      icon="Asset"
                      onClick={e => onClickLinkExistingStamp(itemIndex, imageIndex, e)}>
                      link stamp
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <hr />
          </Fragment>
        )}

        <div>
          <Collapsible
            trigger={<h4>Element Positionning</h4>}
            triggerClassName="collapsible-t"
            triggerOpenedClassName="collapsible-t__opened">
            <div className="desktop">
              <h5>Desktop</h5>
              <div className="position__line">
                <p>margin</p>
                {imageEl.margins &&
                  Object.keys(imageEl.margins)
                    .sort(sortMargins)
                    .map(marginPos => (
                      <div className="position__wrapper" key={'d-margin' + marginPos}>
                        <label>
                          {marginPos}
                          <input
                            type="checkbox"
                            name={marginPos}
                            checked={imageEl.margins[marginPos] && 'checked'}
                            onChange={e => updateMargin(marginPos, itemIndex, imageIndex, e)}
                            id={id + marginPos}
                          />
                        </label>
                      </div>
                    ))}
              </div>
              <div className="position__line">
                <p>anchor</p>
                {anchorValues.map(anchor => (
                  <div className="position__wrapper" key={'d-anchor' + anchor}>
                    <label>
                      {anchor}
                      <input
                        type="radio"
                        // Shared name for the whole group
                        name={`anchor-desktop-${id}-${imageIndex}`}
                        id={id + anchor + '-an-' + imageIndex}
                        value={anchor}
                        // Use a strict boolean
                        checked={imageEl.anchor === anchor}
                        onChange={e => updateAnchor(itemIndex, imageIndex, e)}
                      />
                    </label>
                  </div>
                ))}
              </div>
              <div className="position__line">
                <p>objectFit</p>
                {objectFitValues.map(objectFit => (
                  <div className="position__wrapper" key={'d-objectfit' + objectFit}>
                    <label>
                      {objectFit}
                      <input
                        type="radio"
                        // Shared name for this specific group
                        name={`objectFit-desktop-${id}-${imageIndex}`}
                        id={id + objectFit + '-of-' + imageIndex}
                        value={objectFit}
                        checked={imageEl.objectFit === objectFit}
                        onChange={e => updateObjectFit(itemIndex, imageIndex, e)}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <hr className="light" />
            <div className="mobile">
              <h5>Mobile</h5>
              <div className="position__line">
                <p>margin</p>
                {imageEl.margins &&
                  Object.keys(imageEl.margins)
                    .sort(sortMargins)
                    .map(marginPos => (
                      <div className="position__wrapper" key={'m-margin' + marginPos}>
                        <label>
                          {marginPos}
                          <input
                            type="checkbox"
                            id={id + marginPos}
                            name={marginPos}
                            checked={
                              imageEl.marginsMobile && imageEl.marginsMobile[marginPos] && 'checked'
                            }
                            onChange={e => updateMarginMobile(marginPos, itemIndex, imageIndex, e)}
                          />
                        </label>
                      </div>
                    ))}
              </div>
              <div className="position__line">
                <p>anchor</p>
                {anchorValues.map(anchor => (
                  <div className="position__wrapper" key={'m-anchor' + anchor}>
                    <label>
                      {anchor}
                      <input
                        type="radio"
                        // Unique name for the mobile group
                        name={`anchor-mobile-${id}-${imageIndex}`}
                        id={id + anchor + '-anm-' + imageIndex}
                        value={anchor}
                        checked={imageEl.anchorMobile === anchor}
                        onChange={e => updateAnchorMobile(itemIndex, imageIndex, e)}
                      />
                    </label>
                  </div>
                ))}
              </div>
              <div className="position__line">
                <p>objectFit</p>
                {objectFitValues.map(objectFit => (
                  <div className="position__wrapper" key={'m-objectfit' + objectFit}>
                    <label>
                      {objectFit}
                      <input
                        type="radio"
                        name={`objectfit-mobile-${id}-${imageIndex}`}
                        id={id + objectFit + '-ofm-' + imageIndex}
                        value={objectFit}
                        checked={imageEl.objectFitMobile === objectFit ? 'checked' : ''}
                        onChange={e => updateObjectFitMobile(itemIndex, imageIndex, e)}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}

ItemContent.propTypes = {
  id: PropTypes.string,
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
  deleteAsset: PropTypes.func,
  sdk: PropTypes.object
};
