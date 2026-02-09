import React from 'react';
import PropTypes from 'prop-types';
import './asset.css';

export default function Asset({ asset, sdk }) {
  if (asset.id && asset.url) {
    if (asset.contentType && asset.contentType.includes('video')) {
      return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video width="320" height="240" controls>
          <source src={'https:' + asset.url} type={asset.contentType} />
        </video>
      );
    } else {
      return <img src={asset.url + '?w=200'} alt="" onLoad={() => sdk.window.updateHeight()} />;
    }
  }
  return null;
}

Asset.propTypes = {
  asset: PropTypes.object,
  sdk: PropTypes.object
};
