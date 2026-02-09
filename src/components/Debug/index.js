import React from 'react';
import PropTypes from 'prop-types';
import './debug.css';
import { Button } from '@contentful/forma-36-react-components';

class Debug extends React.Component {
  static propTypes = {
    debugValue: PropTypes.array,
    debugInput: PropTypes.string,
    updateDebugInput: PropTypes.func,
    setScenesFromDebugInput: PropTypes.func
  };
  constructor(props) {
    super(props);

    this.scenesRef = React.createRef();
  }

  copyScenes = () => {
    this.scenesRef.current.select();
    document.execCommand('copy');
  };

  render = () => (
    <div className="debug">
      <div className="debug__scenes">
        <Button id="copy" icon="Copy" size="small" buttonType="muted" onClick={this.copyScenes}>
          copy
        </Button>
        <textarea
          ref={this.scenesRef}
          value={JSON.stringify(this.props.debugValue, null, 2)}
          readOnly
        />
      </div>

      <div className="debug__input">
        <div className="">update field</div>
        <div className="">
          <textarea value={this.props.debugInput} onChange={this.props.updateDebugInput} />
        </div>
        <div className="">
          <Button
            id="fix"
            buttonType="muted"
            size="small"
            onClick={this.props.setScenesFromDebugInput}>
            set scenes state
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Debug;
