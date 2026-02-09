import React from 'react';
import PropTypes from 'prop-types';

import { Button, Icon, ToggleButton, Spinner } from '@contentful/forma-36-react-components';

export default function Toolbar({
  toggleDebug,
  sortingActive,
  toggleSorting,
  addScene,
  save,
  saving
}) {
  return (
    <div className="control">
      <Button buttonType="muted" onClick={toggleDebug}>
        Debug <span role="img">🐱</span>
      </Button>

      <ToggleButton
        className="toggle-button"
        icon="Workflows"
        onToggle={toggleSorting}
        isActive={sortingActive}>
        Sort
      </ToggleButton>

      <Button buttonType="muted" onClick={addScene}>
        Add scene <span role="img">📸</span>
      </Button>

      <Button buttonType="positive" onClick={save}>
        <span role="img">💾</span> {saving && <Spinner />} SAVE <span role="img">💾</span>
      </Button>
    </div>
  );
}

Toolbar.propTypes = {
  toggleDebug: PropTypes.func,
  sortingActive: PropTypes.bool,
  toggleSorting: PropTypes.func,
  addScene: PropTypes.func,
  save: PropTypes.func,
  saving: PropTypes.bool
};
