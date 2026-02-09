import React from 'react';
import PropTypes from 'prop-types';

import { TextInput } from '@contentful/forma-36-react-components';
import './grid-fields.css';

export default function GridFields({ updateGrid, pos, itemIndex, imageIndex, imageEl }) {
  return (
    <div className="grid-fields" key={pos}>
      <div className="position">
        <span>x:</span>{' '}
        <TextInput
          className="input"
          type="number"
          value={imageEl.grid[pos]?.x}
          maxLength={2}
          onChange={e => updateGrid(pos, 'x', itemIndex, imageIndex, e)}
        />
      </div>
      <div className="position">
        <span>y:</span>{' '}
        <TextInput
          className="input"
          type="number"
          value={imageEl.grid[pos]?.y}
          maxLength={2}
          onChange={e => updateGrid(pos, 'y', itemIndex, imageIndex, e)}
        />
      </div>
    </div>
  );
}

GridFields.propTypes = {
  updateGrid: PropTypes.func,
  pos: PropTypes.string,
  itemIndex: PropTypes.number,
  imageIndex: PropTypes.number,
  imageEl: PropTypes.object
};
