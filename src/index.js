import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import '@contentful/forma-36-react-components/dist/styles.css';

import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import arrayMove from 'array-move';

import { Spinner, TextInput } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';

import UploadView from './components/UploadView';
import ProgressView from './components/ProgressView';
import FileView from './components/FileView';

import {
  randomId,
  readFileAsUrl,
  findImageContentType,
  getImageUrlFromDataTransfer,
  getAssetIdFromDataTransfer,
  getBase64FromDataTransfer
} from './utils';

import './index.css';

class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  state = {
    preventSorting: true,
    value: this.props.sdk.field.getValue(this.findProperLocale()) || [],
    scenes: [{
      "type": "scene",
      "id": "scene1",
      "content": [{
          "type": "image",
          "id": "image1-1",
          "asset": {
            "id": "sdlfqiuhsdlfih",
            "url": "http://placehold.it/400x400"
          },
          positions: {
            "desktopTl": {x: "1", y: "1"},
            "desktopBr": {x: "3", y: "3"},
            "mobileTl": {x: "1", y: "1"},
            "mobileBr": {x: "3", y: "3"}
          }
        },
        {
          "type": "image",
          "id": "image1-2",
          "asset": {
            "id": "sdfsdfsdfsdfsdf",
            "url": "http://placehold.it/400x400"
          },
          positions: {
            "desktopTl": {x: "4", y: "4"},
            "desktopBr": {x: "6", y: "6"},
            "mobileTl": {x: "4", y: "4"},
            "mobileBr": {x: "6", y: "6"}
          }
        }
      ]
    },
    {
      "type": "scene",
      "id": "scene2",
      "content": [{
        "type": "image",
        "id": "image2-1",
        "asset": {
          "id": "sdfdfghdrthhhju",
          "url": "http://placehold.it/400x400"
        },
        positions: {
          "desktopTl": {x: "3", y: "3"},
          "desktopBr": {x: "3", y: "3"},
          "mobileTl": {x: "3", y: "3"},
          "mobileBr": {x: "3", y: "3"}
        }
      }]
    }],
  };

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
  }

  componentWillUnmount() {
    this.detachExternalChangeHandler();
  }

  onExternalChange = value => {
    console.log('🐯 onExternalCHneaferf')

    this.setState({ value: value || [], scenes: value || [] });
  };

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({scenes}) => ({
      scenes: arrayMove(scenes, oldIndex, newIndex),
    }));
  };

  findProperLocale() {
    if (this.props.sdk.entry.fields[this.props.sdk.field.id].type === 'Link') {
      return this.props.sdk.locales.default;
    }

    return this.props.sdk.field.locale;
  }

  toggleSorting = () => {
    this.setState(({preventSorting}) => ({
      preventSorting: !preventSorting
    }), ()=> console.log(this.state.preventSorting))
  }

  setDistantFieldValue = () => {
    this.props.sdk.field.setValue(this.state.scenes)
  }

  addPage = () => {
    this.setState(({scenes})=> ({
      scenes: [...scenes, {
        type: 'scene',
        id: randomId(),
        content: []
      }]
    }))
  }

  addSceneContent = (index) => {

    this.setState(({scenes}) => {
      scenes[index].content.push({
        "type": "image",
        "id": `image-${randomId()}`,
        "asset": {
          "id": `asset-${randomId()}`,
          "url": ""
        },
        positions: {
          "desktopTl": {x: "0", y: "0"},
          "desktopBr": {x: "0", y: "0"},
          "mobileTl": {x: "0", y: "0"},
          "mobileBr": {x: "0", y: "0"}
        }
      })
      return {scenes}
    }, ()=> {console.log('🐯 this.state.scenes[index].content after ADDSCENECONTENT', this.state.scenes[index].content)})

    console.log('🐯 scene to add content', index)
  }

  updateImageElPosition = (pos, axis, itemIndex, imageIndex, e) => {
    e.preventDefault();

    const newVal = e.currentTarget.value

    // if (newVal > 3) return

    this.setState(({scenes}) => {
      scenes[itemIndex].content[imageIndex].positions[pos][axis] = newVal
      return {scenes}
    }, () => {
      console.log('🐯 updated', this.state.scenes[itemIndex].content[imageIndex].positions[pos])
    })

  }


  render = () => {
    return (
      <Fragment>
        preventSorting: {this.state.preventSorting ? 'true': 'false'}
        <pre>
          {JSON.stringify(this.state.value, null, 2)}
        </pre>

        <SortableList
          items={this.state.scenes}
          addSceneContent={this.addSceneContent}
          sortingPrevented={this.state.preventSorting}

          updatePosition={this.updateImageElPosition}
          onSortEnd={this.onSortEnd}
          shouldCancelStart={()=>(this.state.preventSorting)}
          useDragHandle={true}/>

        <div className="control">
          <button onClick={this.addPage}>Add page</button>

          <button onClick={this.toggleSorting}>Sorting is: {this.state.preventSorting ? 'disabled': 'enabled'} </button>

          <button onClick={this.setDistantFieldValue}>SetFieldValue</button>
        </div>
      </Fragment>
    );
  };
}


const SortableList = SortableContainer(({items, addSceneContent, sortingPrevented, updatePosition}) => {
  return (
    <div className='scene__list' style={{'border': '1px solid black'}}>

      {items.map((value, index) => (
        <div className="coucou" key={`item-${value.id}`}>
          <SortableItem
            key={`item-${value.id}`}
            index={index}
            itemIndex={index}
            value={value}
            addSceneContent={addSceneContent}
            sortingPrevented={sortingPrevented}
            updatePosition={updatePosition}/>
          <button onClick={ (e) => { return addSceneContent(index, e) }}>Add content</button>
        </div>

      ))}
    </div>
  );
});

const DragHandle = SortableHandle(() => <span>::</span>);

const SortableItem = SortableElement(({value, itemIndex, addSceneContent, sortingPrevented, updatePosition}) =>
  <div className="scene__element" style={{'border': '1px solid red', display: 'flex', flexDirection: 'row',}}>
    <DragHandle/>
    <div className="content">
      <div>id: {value.id} </div>
      <div>itemIndex: {itemIndex}</div>
      <span>{JSON.stringify(addSceneContent)}</span>
      {
          sortingPrevented ? (
            <div>
              <span>content:</span>
              {
                value.content.map((el, imageIndex)=>
                  <ItemContent
                    imageEl={el}
                    key={el.id}
                    itemIndex={itemIndex}
                    imageIndex={imageIndex}
                    updatePosition={updatePosition}/>
                )
              }
            </div>
          ) : <div>saaaalur</div>
      }
    </div>
  </div>
);

const ItemContent = ({imageEl, updatePosition, itemIndex, imageIndex}) => (
  <div className="element__content" style={{border: '1px solid green'}}>
    {imageEl.id}
    {imageEl.type}

    <div className="image" style={{border: '1px solid purple'}}>
      image handling :
      {
        (imageEl.asset.id && imageEl.asset.url) ? 'has image' : 'has no image'
      }
    </div>

    <div className="positions">
      {Object.keys(imageEl.positions).map(pos =>
        <div key={pos} style={{display: 'flex', flexDirection: 'row'}}>
          <p>position: {pos}</p>
          <div>
            x: <TextInput
              type="text"
              value={imageEl.positions[pos].x}
              maxLength={3}
              onChange={(e) => updatePosition(pos, 'x', itemIndex, imageIndex, e)}/>
          </div>
          <div className="">
            y: <TextInput
              type="text"
              value={imageEl.positions[pos].y}
              maxLength={3}
              onChange={(e) => updatePosition(pos, 'y', itemIndex, imageIndex, e)}/>
          </div>
        </div>
      )}
    </div>

  </div>
);

const ItemImage = ({url, onClickLinkExisting}) => (

)


init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
