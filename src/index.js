import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import '@contentful/forma-36-react-components/dist/styles.css';

import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import arrayMove from 'array-move';

import { TextInput, Button } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';

import ItemContent from './components/ItemContent'
// import UploadView from './components/UploadView';
// import ProgressView from './components/ProgressView';
// import FileView from './components/FileView';

import {
  randomId,
  readFileAsUrl,
  findImageContentType,
  getImageUrlFromDataTransfer,
  getAssetIdFromDataTransfer,
  getBase64FromDataTransfer
} from './utils';

import './index.css';


const SortableList = SortableContainer( ({children}) =>
    <div className='scene__list'>
      {children}
    </div>);

const DragHandle = SortableHandle(({dragDisabled}) => <div className={`scene__handle ${dragDisabled && 'disabled'}`}><span>::</span></div>);

const SortableItem = SortableElement(({children}) =>
  <div className="scene__element">
    {children}
  </div>
);

class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  state = {
    preventSorting: true,
    value: this.props.sdk.field.getValue(this.findProperLocale()) || [],
    scenes: [
      // {
      //   "type": "scene",
      //   "id": "scene1",
      //   "content": [
      //       {
      //         "type": "image",
      //         "id": "image1-2",
      //         "asset": {
      //           "title": "image_de_gaston_HONHONHON.png"
      //           "id": "sdfsdfsdfsdfsdf",
      //           "url": "https://placehold.it/400x400"
      //         },
      //         grid: {
      //           "desktopTl": {x: "4", y: "4"},
      //           "desktopBr": {x: "6", y: "6"},
      //           "mobileTl": {x: "4", y: "4"},
      //           "mobileBr": {x: "6", y: "6"}
      //         }
      //       }
      //     ]
      // }
    ],
  };

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
  }

  componentDidUpdate() {
    this.props.sdk.window.updateHeight()
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

  onClickLinkExisting = async (itemIndex, imageIndex) => {
    const selectedAsset = await this.props.sdk.dialogs.selectSingleAsset({
      locale: this.props.sdk.field.locale
    });

    try {
      await this.setFieldLink(selectedAsset, itemIndex, imageIndex);
    } catch (err) {
      this.onError(err);
    }
  };

  onClickResize = () => {
    this.props.sdk.window.updateHeight()
  }

  async setFieldLink(asset, itemIndex, imageIndex) {

    const title = asset.fields.title[this.findProperLocale()]
    const url = asset.fields.file[this.findProperLocale()].url

    this.setState(({scenes}) => {
      scenes[itemIndex].content[imageIndex].asset = {
        id: asset.sys.id,
        title: title,
        url: url
      }
      return { scenes }
    })

    await this.setDistantFieldValue()

  }

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
    const stateHasChanged = JSON.stringify(this.state.value) !== JSON.stringify(this.state.scenes) // THIS IS ABSOLUTELY DISGUSTING, I KNOW.
    console.log('🐯 stateHasChanged', stateHasChanged)
    return stateHasChanged && this.props.sdk.field.setValue(this.state.scenes)
  }

  addScene = () => {
    this.setState(({scenes})=> ({
      scenes: [...scenes, {
        type: 'scene',
        id: randomId(),
        title: '',
        content: [],
      }]
    }))
  }

  deleteScene = (index) => {

    this.setState(({scenes}) => {
      scenes.splice(index, 1)
      return {scenes}
    })

  }

  removeSceneContent = (sceneIndex, contentIndex) => {

    this.setState(({scenes}) => {
      scenes[sceneIndex].content.splice(contentIndex, 1)
      return {scenes}
    })

  }

  addSceneContent = (index) => {

    this.setState(({scenes}) => {
      scenes[index].content.push({
        type: "image",
        id: `image-${randomId()}`,
        asset: {
          id: `asset-${randomId()}`,
          url: ""
        },
        grid: {
          desktopTl: {x: "0", y: "0"},
          desktopBr: {x: "0", y: "0"},
          mobileTl: {x: "0", y: "0"},
          mobileBr: {x: "0", y: "0"}
        },
        margins: {
          mTop: false,
          mLeft: false,
          mBottom: false,
          mRight: false
        },
        fullBleed: false
      })
      return {scenes}
    }, () => {
      console.log('🐯 after ADDSCENECONTENT', this.state.scenes[index].content)
    })

  }

  updateSceneTitle= (sceneIndex, e) => {
    const newVal = e.currentTarget.value

    this.setState(({scenes}) => {
      scenes[sceneIndex].title = newVal
      return {scenes}
    })
  }

  updateImageElGrid = (pos, axis, itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.value

    this.setState(({scenes}) => {
      scenes[itemIndex].content[imageIndex].grid[pos][axis] = newVal
      return {scenes}
    }, () => {
      console.log('🐯 grid updateed', this.state.scenes[itemIndex].content[imageIndex].grid[pos])
    })

  }

  updateImageElMargin = (pos, itemIndex, imageIndex, e) => {
    const newVal = e.target.checked
    console.log('🐯 c', this.state.scenes[itemIndex].content[imageIndex].margins)

    this.setState(({scenes})=> {
      scenes[itemIndex].content[imageIndex].margins[pos] = newVal
      return {scenes}
    }, () => {
      console.log('🐯 this.state.scenes[itemIndex].content[imageIndex].margins[pos]', this.state.scenes[itemIndex].content[imageIndex].margins)
    })

  }

  updateImageElFullBleed = (itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.checked

    this.setState(({scenes})=> {
      scenes[itemIndex].content[imageIndex].fullBleed = newVal
      return {scenes}
    })
  }

  render = () => {
    return (
      <Fragment>

        <SortableList
          addSceneContent={this.addSceneContent}

          onSortEnd={this.onSortEnd}
          shouldCancelStart={()=>(this.state.preventSorting)}
          useDragHandle={true}>

          {this.state.scenes.map((scene, index) =>
              <SortableItem
                key={`item-${scene.id}`}
                index={index}
                value={scene}
                addSceneContent={this.addSceneContent}>

                <DragHandle dragDisabled={this.state.preventSorting}/>

                <div className="page">
                  <div className="">
                    <div>id: {scene.id} </div>
                    <div>
                      <h3>
                        Title
                      </h3>
                      {
                        this.state.preventSorting
                        ? (
                          <TextInput
                            type="text"
                            value={scene.title}
                            onChange={(e) => this.updateSceneTitle(index, e)}
                            onBlur={() => this.setDistantFieldValue()}/>
                        )
                        : <h3>{scene.title}</h3>
                      }
                    </div>
                    { this.state.preventSorting && (
                      <div>
                        <h3>content:</h3>
                        { scene.content.map((el, imageIndex)=>
                          <ItemContent
                            imageEl={el}
                            key={el.id}
                            itemIndex={index}
                            imageIndex={imageIndex}
                            updateGrid={this.updateImageElGrid}
                            updateMargin={this.updateImageElMargin}
                            updateFullBleed={this.updateImageElFullBleed}
                            onClickLinkExisting={this.onClickLinkExisting}
                            deleteImage={this.removeSceneContent}
                            setDistantFieldValue={this.setDistantFieldValue}
                            sdk={this.props.sdk}/>
                        )}
                      </div>
                    )}
                    {this.state.preventSorting && (
                      <Button
                        className="add--image"
                        buttonType="muted"
                        size="small"
                        icon="Asset"
                        onClick={ (e) => this.addSceneContent(index, e) }>
                        Add image
                      </Button>
                    )}
                  </div>
                  <div className="delete">
                    <Button buttonType="negative" className="hide" icon="Warning" size="small" onClick={ () => this.deleteScene(index)}>delete scene</Button>
                  </div>
                </div>


              </SortableItem>
            )
          }

        </SortableList>

        <div className="control">

          <Button buttonType="muted" onClick={this.addScene}>Add scene 📸</Button>

          <Button buttonType="muted" onClick={this.toggleSorting}>Sorting is: {this.state.preventSorting ? 'disabled ❌': 'enabled 👍'} </Button>

          <Button buttonType="positive" onClick={this.setDistantFieldValue}>💾 SAVE 💾</Button>

        </div>
      </Fragment>
    );
  };
}



init(sdk => {
  ReactDOM.render(<App sdk={sdk} className="base" />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
