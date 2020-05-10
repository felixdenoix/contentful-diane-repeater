import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import '@contentful/forma-36-react-components/dist/styles.css';

import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import arrayMove from 'array-move';

import { TextInput, Button } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import ItemContent from './components/ItemContent'
import ErrorBoundary from './components/ErrorBoundary'

import scenesSchema from './model'

import {
  randomId,
} from './utils';

import './index.css';
import Collapsible from 'react-collapsible';


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

  constructor(props) {
    super(props)

    const fieldValue = this.props.sdk.field.getValue(this.findProperLocale()) || []
    const fixedValue = this.fixScenes(fieldValue)

    this.state = {
      preventSorting: true,
      value: {...fixedValue},
      debug: false,
      scenes: {...fixedValue},
    }

    this.scenesRef = React.createRef();
  }

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
    this.setState({ scenes: this.isIterable(value) ? [...this.fixScenes(value)] : [] });
  };

  isIterable = object => {
    return !!object && typeof object[Symbol.iterator] === 'function'
  }

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
    const {url, contentType} = asset.fields.file[this.findProperLocale()]

    this.setState(({scenes}) => {
      scenes[itemIndex].content[imageIndex].asset = {
        id: asset.sys.id,
        title: title,
        url: url,
        contentType: contentType
      }
      return { scenes }
    }, async () => {

      await this.setDistantFieldValue()

    })
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
    }))
  }

  setDistantFieldValue = () => {
    const stateHasChanged = JSON.stringify(this.state.value) !== JSON.stringify(this.state.scenes) // THIS IS ABSOLUTELY DISGUSTING, I KNOW.
    console.log('🐯 stateHasChanged', stateHasChanged)
    return this.props.sdk.field.setValue(this.state.scenes).then((data)=> {
      this.setState({scenes: [...data], value: [...data]})
      console.log('🚀 REMOTE UPDATED')
    })
  }

  setDebug = () => {
    this.setState(({debug}) => ({debug: !debug}))
  }

  addScene = () => {
    this.setState(({scenes})=> ({
      scenes: [...scenes, baseScene()]
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

      const newSceneContent = baseSceneItem()

      scenes[index].content.push(newSceneContent)

      return {scenes}

    }, () => {

      console.log('🐯 after ADDSCENECONTENT', this.state.scenes[index].content)

    })

  }

  udpateDebugInput = (e) => {
    const newVal = e.target.value
    this.setState({debugInput: newVal})
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
      console.log('🐯 grid updateed STATE', this.state.scenes[itemIndex].content[imageIndex].grid[pos])
      console.log('🐯 grid updateed VALUE', this.state.value[itemIndex].content[imageIndex].grid[pos])
    })
  }

  updateImageElMargin = (pos, itemIndex, imageIndex, e) => {
    const newVal = e.target.checked

    this.setState(({scenes})=> {
      scenes[itemIndex].content[imageIndex].margins[pos] = newVal
      return {scenes}
    })
  }

  updateImageElMarginMobile = (pos, itemIndex, imageIndex, e) => {
    const newVal = e.target.checked

    this.setState(({scenes})=> {
      scenes[itemIndex].content[imageIndex].marginsMobile[pos] = newVal
      return {scenes}
    })
  }

  updateImageElFullBleed = (itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.checked

    this.setState(({scenes})=> {
      scenes[itemIndex].content[imageIndex].fullBleed = newVal
      return {scenes}
    })
  }

  updateImageElStampEffect = (itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.checked

    this.setState(({scenes}) => {
      scenes[itemIndex].content[imageIndex].stampEffect = newVal
      return {scenes}
    })
  }

  updateImageElZIndex = (itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.value

    this.setState(({scenes})=> {
      scenes[itemIndex].content[imageIndex].zIndex = newVal
      return {scenes}
    })
  }

  updateImageElAnchor = (itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.value

    this.setState(({scenes}) => {
      scenes[itemIndex].content[imageIndex].anchor = newVal
      return {scenes}
    })
  }

  updateImageElMobileAnchor = (itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.value

    this.setState(({scenes}) => {
      scenes[itemIndex].content[imageIndex].anchorMobile = newVal
      return {scenes}
    })
  }

  updateImageElObjectFit = (itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.value

    this.setState(({scenes}) => {
      scenes[itemIndex].content[imageIndex].objectFit = newVal
      return {scenes}
    })
  }

  updateImageElObjectFitMobile = (itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.value

    this.setState(({scenes}) => {
      scenes[itemIndex].content[imageIndex].objectFitMobile = newVal
      return {scenes}
    })
  }

  fixScenes = (scenes) => {

    console.log('🐯 fixing the scenes !')

    return scenes.reduce((newScenes, scene) => {

      const newScene = {...baseScene(), ...scene}

      const newSceneContent = scene.content.map(el => {
        return {...baseSceneItem(), ...el}
      })

      newScene.content = newSceneContent

      newScenes.push(newScene)

      return newScenes

    }, [])

  }

  setScenesFromDebugInput = () => {
    try {

      const newVal = JSON.parse(this.state.debugInput)

      // add fields that might be missing from input with default values
      const fixedNewVal = this.fixScenes(newVal)

      const {error, value} = scenesSchema.validate(fixedNewVal)

      if (error) {

        console.log('🐯 error validating debug input object', error)
        console.log('🐯 value', value)
        return

      } else {

        this.setState({scenes: [...value], debugInput: ''}, async () => {
          await this.setDistantFieldValue()
          .then(() => {
            console.log('🐯 sucessfully set scenes manually')
          })
        })

      }

    } catch (err) {

      console.log('🐯 error parsing debug input', err)

    }
  }

  copyScenes = () => {
    this.scenesRef.current.select();
    document.execCommand("copy");
  }

  render = () => {
    return (
      <div className="base">

        <div className="control">

          <Button buttonType="muted" onClick={this.setDebug}>Debug <span role="img">🐱</span></Button>

          <Button buttonType="muted" onClick={this.addScene}>Add scene <span role="img">📸</span></Button>

          <Button buttonType="muted" onClick={this.toggleSorting}>Sorting is: {this.state.preventSorting ? 'disabled ❌': 'enabled 👍'} </Button>

          <Button buttonType="positive" onClick={this.setDistantFieldValue}><span role="img">💾</span> SAVE <span role="img">💾</span></Button>

        </div>

        {this.state.debug && <div className="debug">

          <div className="debug__scenes">
            <Button id="copy" icon="Copy" size="small" buttonType="muted" onClick={this.copyScenes}>copy</Button>
            <textarea ref={this.scenesRef} value={JSON.stringify(this.state.scenes, null, 2)} readOnly/>
          </div>

          <div className="debug__input">
            <div className="">
              update field
            </div>
            <div className="">
              <textarea value={this.state.debugInput} onChange={this.udpateDebugInput} />
            </div>
            <div className="">
              <Button id="fix" buttonType="muted" size="small" onClick={this.setScenesFromDebugInput}>set scenes state</Button>
            </div>
          </div>

        </div>}

        <ErrorBoundary>

          <SortableList
            addSceneContent={this.addSceneContent}
            onSortEnd={this.onSortEnd}
            shouldCancelStart={()=>(this.state.preventSorting)}
            useDragHandle={true}>

            {this.state.scenes.length > 0 && this.state.scenes.map((scene, index) =>
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
                      <h2>
                        titre:
                      </h2>
                      { this.state.preventSorting
                        ? (<TextInput
                            type="text"
                            value={scene.title}
                            onChange={(e) => this.updateSceneTitle(index, e)}
                            />)
                        : <h3>{scene.title}</h3>
                      }
                    </div>
                    { this.state.preventSorting && (
                      <div>
                        <h2>contenu:</h2>
                        { scene.content.length > 0 && scene.content.map((el, imageIndex)=>
                          <Collapsible
                            key={el.id}
                            trigger={el.asset.title || el.id}
                            triggerClassName="collapsible-t"
                            triggerOpenedClassName="collapsible-t__opened"
                            >
                            <ItemContent
                              imageEl={el}
                              key={el.id}
                              itemIndex={index}
                              imageIndex={imageIndex}
                              updateGrid={this.updateImageElGrid}
                              updateMargin={this.updateImageElMargin}
                              updateMarginMobile={this.updateImageElMarginMobile}
                              updateFullBleed={this.updateImageElFullBleed}
                              updateZIndex={this.updateImageElZIndex}
                              updateAnchor={this.updateImageElAnchor}
                              updateAnchorMobile={this.updateImageElMobileAnchor}
                              updateObjectFit={this.updateImageElObjectFit}
                              updateObjectFitMobile={this.updateImageElObjectFitMobile}
                              updateStampEffect={this.updateImageElStampEffect}
                              onClickLinkExisting={this.onClickLinkExisting}
                              deleteImage={this.removeSceneContent}
                              setDistantFieldValue={this.setDistantFieldValue}
                              sdk={this.props.sdk}/>
                          </Collapsible>
                        )}
                      </div>
                    )}

                    {this.state.preventSorting && (<Button
                      className="add--image"
                      buttonType="muted"
                      size="small"
                      icon="Asset"
                      onClick={ (e) => this.addSceneContent(index, e) }>
                      Add image
                    </Button>)}

                  </div>
                  <div className="delete">
                    <Button buttonType="negative" className="hide" icon="Warning" size="small" onClick={ () => this.deleteScene(index)}>delete scene</Button>
                  </div>
                </div>

              </SortableItem>)}

          </SortableList>

        </ErrorBoundary>

        {
          this.state.scenes.length > 0 && <div className="control">

            <Button buttonType="muted" onClick={this.setDebug}>Debug <span role="img">🐱</span></Button>

            <Button buttonType="muted" onClick={this.addScene}>Add scene <span role="img">📸</span></Button>

            <Button buttonType="muted" onClick={this.toggleSorting}>Sorting is: {this.state.preventSorting ? 'disabled ❌': 'enabled 👍'} </Button>

            <Button buttonType="positive" onClick={this.setDistantFieldValue}><span role="img">💾</span> SAVE <span role="img">💾</span></Button>

          </div>
        }

      </div>
    );
  };
}



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

const baseScene = () => ({
  type: 'scene',
  id: randomId(),
  title: '',
  content: [],
})

const baseSceneItem = () => ({
    type: "image",
    id: `image-${randomId()}`,
    asset: {
      id: `asset-${randomId()}`,
      url: "",
      title: "",
      contentType: ""
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
    marginsMobile: {
      mTop: false,
      mLeft: false,
      mBottom: false,
      mRight: false
    },
    anchor: 'none',
    anchorMobile: 'none',
    objectFit: 'none',
    objectFitMobile: 'none',
    zIndex: "0",
    fullBleed: false,
    stampEffect: false
})