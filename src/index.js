import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import '@contentful/forma-36-react-components/dist/styles.css';
import { Icon } from '@contentful/forma-36-react-components';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import { TextInput, Button, Spinner } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import ItemContent from './components/ItemContent';
import ErrorBoundary from './components/ErrorBoundary';

import scenesSchema from './model';
import { baseScene, baseSceneItem } from './baseItems';

import './index.css';
import Collapsible from 'react-collapsible';

const SortableList = SortableContainer(({ children }) => (
  <div className="scene__list">{children}</div>
));

const DragHandle = SortableHandle(({ dragDisabled }) => (
  <div className={`scene__handle ${dragDisabled && 'disabled'}`}>
    <span>::</span>
  </div>
));

const SortableItem = SortableElement(({ children }) => <div className="scene">{children}</div>);

const CollapsibleAsset = ({ asset }) => {
  if (asset.id && asset.url) {
    if (asset.contentType && asset.contentType.includes('video')) {
      return (
        <span className="collapsible__asset">
          <Icon icon="Asset" height="30" width="30" color="primary" className="inline" />
        </span>
      );
    } else {
      return (
        <span className="collapsible__asset">
          <img src={asset.url + '?w=30&h=30'} alt="" className="inline" />
        </span>
      );
    }
  }
};

class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  // TODO: permettre clic sur label !!

  constructor(props) {
    super(props);

    const fieldValue = this.props.sdk.field.getValue(this.findProperLocale()) || [];
    const fixedValue = this.fixScenes(fieldValue);

    console.log('🐯 this.props.sdk', this.props.sdk);

    console.log('fixed value ', fixedValue);

    this.state = {
      preventSorting: true,
      value: [...fixedValue], // fixedValue is expected to be an array, so spread into an array
      debug: false,
      scenes: [...fixedValue], // fixedValue is expected to be an array, so spread into an array
      saving: false
    };

    this.scenesRef = React.createRef();
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
  }

  componentDidUpdate() {
    this.props.sdk.window.updateHeight();
  }

  componentWillUnmount() {
    this.detachExternalChangeHandler();
  }

  onExternalChange = value => {
    this.setState({ scenes: this.isIterable(value) ? [...this.fixScenes(value)] : [] });
  };

  isIterable = object => {
    return !!object && typeof object[Symbol.iterator] === 'function';
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ scenes }) => ({
      scenes: arrayMove(scenes, oldIndex, newIndex)
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

  onClickLinkExistingStamp = async (itemIndex, imageIndex) => {
    const selectedAsset = await this.props.sdk.dialogs.selectSingleAsset({
      locale: this.props.sdk.field.locale
    });

    try {
      await this.setFieldLinkStamp(selectedAsset, itemIndex, imageIndex);
    } catch (err) {
      this.onError(err);
    }
  };

  onClickResize = () => {
    this.props.sdk.window.updateHeight();
  };

  async setFieldLink(asset, itemIndex, imageIndex) {
    const title = asset.fields.title[this.findProperLocale()];
    const {
      url,
      contentType,
      details: { image: imageDimentions, size }
    } = asset.fields.file[this.findProperLocale()];

    this.setState(
      ({ scenes }) => {
        scenes[itemIndex].content[imageIndex].asset = {
          id: asset.sys.id,
          title: title,
          url: url,
          contentType: contentType,
          dimentions: imageDimentions || { width: 0, height: 0 },
          size
        };
        return { scenes };
      },
      async () => {
        await this.setDistantFieldValue();
      }
    );
  }

  async setFieldLinkStamp(asset, itemIndex, imageIndex) {
    const title = asset.fields.title[this.findProperLocale()];
    const {
      url,
      contentType,
      details: { image: imageDimentions, size }
    } = asset.fields.file[this.findProperLocale()];

    this.setState(
      ({ scenes }) => {
        scenes[itemIndex].content[imageIndex].stampAsset = {
          id: asset.sys.id,
          title: title,
          url: url,
          contentType: contentType,
          dimentions: imageDimentions || { width: 0, height: 0 },
          size
        };
        return { scenes };
      },
      async () => {
        await this.setDistantFieldValue();
      }
    );
  }

  findProperLocale() {
    if (this.props.sdk.entry.fields[this.props.sdk.field.id].type === 'Link') {
      return this.props.sdk.locales.default;
    }

    return this.props.sdk.field.locale;
  }

  toggleSorting = () => {
    this.setState(({ preventSorting }) => ({
      preventSorting: !preventSorting
    }));
  };

  setDistantFieldValue = () => {
    this.setState({ saving: true });
    const stateHasChanged = JSON.stringify(this.state.value) !== JSON.stringify(this.state.scenes); // THIS IS ABSOLUTELY DISGUSTING, I KNOW.
    console.log('🐯 stateHasChanged', stateHasChanged);
    return this.props.sdk.field.setValue(this.state.scenes).then(data => {
      this.setState({ scenes: [...data], value: [...data] });
      console.log('🚀 REMOTE UPDATED');
      this.setState({ saving: false });
    });
  };

  setDebug = () => {
    this.setState(({ debug }) => ({ debug: !debug }));
  };

  addScene = () => {
    this.setState(({ scenes }) => ({
      scenes: [...scenes, baseScene()]
    }));
  };

  deleteScene = index => {
    this.setState(({ scenes }) => {
      scenes.splice(index, 1);
      return { scenes };
    });
  };

  removeSceneContent = (sceneIndex, contentIndex) => {
    this.setState(({ scenes }) => {
      scenes[sceneIndex].content.splice(contentIndex, 1);
      return { scenes };
    });
  };

  addSceneContent = index => {
    this.setState(
      ({ scenes }) => {
        const newSceneContent = baseSceneItem();

        scenes[index].content.push(newSceneContent);

        return { scenes };
      },
      () => {
        console.log('🐯 after ADDSCENECONTENT', this.state.scenes[index].content);
      }
    );
  };

  // Helper to immutably update a deeply nested property in an object or array
  // path is an array of keys/indices
  updateDeep = (obj, path, value) => {
    if (path.length === 0) {
      return value;
    }

    const [head, ...rest] = path;
    const newObj = Array.isArray(obj) ? [...obj] : { ...obj };

    if (rest.length === 0) {
      newObj[head] = value;
    } else {
      if (typeof newObj[head] === 'object' && newObj[head] !== null) {
        newObj[head] = this.updateDeep(newObj[head], rest, value);
      } else {
        // If the path leads to a non-object or null, and there are more steps,
        // we need to initialize the path. This assumes we are creating objects/arrays.
        // For example, if path is ['a', 'b'] and obj.a is undefined, we make obj.a = {}.
        newObj[head] = this.updateDeep(typeof rest[0] === 'number' ? [] : {}, rest, value);
      }
    }
    return newObj;
  };

  // Generic handler for updating scene properties
  handleSceneUpdate = (sceneIndex, propertyPath, newValue, callback = () => {}) => {
    this.setState(
      prevState => {
        const newScenes = prevState.scenes.map((scene, index) => {
          if (index === sceneIndex) {
            return this.updateDeep(scene, propertyPath, newValue);
          }
          return scene;
        });
        return { scenes: newScenes };
      },
      async () => {
        await this.setDistantFieldValue();
        callback();
      }
    );
  };

  udpateDebugInput = e => {
    const newVal = e.target.value;
    this.setState({ debugInput: newVal });
  };

  updateSceneTitle = (sceneIndex, e) => {
    const newVal = e.currentTarget.value;
    this.handleSceneUpdate(sceneIndex, ['title'], newVal);
  };

  updateImageElGrid = (pos, axis, itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.value;
    this.handleSceneUpdate(itemIndex, ['content', imageIndex, 'grid', pos, axis], newVal, () => {
      console.log(
        '🐯 grid updateed STATE',
        this.state.scenes[itemIndex].content[imageIndex].grid[pos]
      );
      console.log(
        '🐯 grid updateed VALUE',
        this.state.value[itemIndex].content[imageIndex].grid[pos]
      );
    });
  };

  updateImageElMargin = (pos, itemIndex, imageIndex, e) => {
    const newVal = e.target.checked;
    this.handleSceneUpdate(itemIndex, ['content', imageIndex, 'margins', pos], newVal);
  };

  updateImageElMarginMobile = (pos, itemIndex, imageIndex, e) => {
    const newVal = e.target.checked;
    this.handleSceneUpdate(itemIndex, ['content', imageIndex, 'marginsMobile', pos], newVal);
  };

  updateImageElFullBleed = (itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.checked;
    this.handleSceneUpdate(itemIndex, ['content', imageIndex, 'fullBleed'], newVal);
  };

  updateImageElStampEffect = (itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.checked;
    this.handleSceneUpdate(itemIndex, ['content', imageIndex, 'stampEffect'], newVal, () => {
      // Specific logic for deleting stampAsset if stampEffect is turned off
      if (!newVal) {
        this.setState(
          prevState => {
            const newScenes = [...prevState.scenes];
            delete newScenes[itemIndex].content[imageIndex].stampAsset;

            // const updatedScene = { ...newScenes[itemIndex] };
            // const updatedContent = [...updatedScene.content];
            // const updatedImageEl = { ...updatedContent[imageIndex] };
            // delete updatedImageEl.stampAsset;
            // updatedContent[imageIndex] = updatedImageEl;
            // updatedScene.content = updatedContent;
            // newScenes[itemIndex] = updatedScene;
            return { scenes: newScenes };
          },
          async () => {
            await this.setDistantFieldValue();
          }
        );
      }
    });
  };

  updateImageElAutoPlay = (itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.checked;
    this.handleSceneUpdate(itemIndex, ['content', imageIndex, 'autoPlay'], newVal);
  };

  updateImageElZIndex = (itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.value;
    this.handleSceneUpdate(itemIndex, ['content', imageIndex, 'zIndex'], newVal);
  };

  updateImageElAnchor = (itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.value;
    this.handleSceneUpdate(itemIndex, ['content', imageIndex, 'anchor'], newVal);
  };

  updateImageElMobileAnchor = (itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.value;
    this.handleSceneUpdate(itemIndex, ['content', imageIndex, 'anchorMobile'], newVal);
  };

  updateImageElObjectFit = (itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.value;
    this.handleSceneUpdate(itemIndex, ['content', imageIndex, 'objectFit'], newVal);
  };

  updateImageElObjectFitMobile = (itemIndex, imageIndex, e) => {
    const newVal = e.currentTarget.value;
    this.handleSceneUpdate(itemIndex, ['content', imageIndex, 'objectFitMobile'], newVal);
  };

  fixScenes = scenes => {
    console.log('🐯 fixing the scenes !');
    // const assetNeedingUpdate = []

    scenes.reduce((newScenes, scene) => {
      const newScene = { ...baseScene(), ...scene };

      const newSceneContent = scene.content.map(el => {
        const fixedSceneContent = { ...baseSceneItem() };

        fixedSceneContent.asset = {
          ...fixedSceneContent.asset,
          ...el.asset
        };
        fixedSceneContent.grid = {
          ...fixedSceneContent.grid,
          ...el.grid
        };
        fixedSceneContent.margins = {
          ...fixedSceneContent.margins,
          ...el.margins
        };
        fixedSceneContent.marginsMobile = {
          ...fixedSceneContent.marginsMobile,
          ...el.marginsMobile
        };

        return fixedSceneContent;
      });

      newScene.content = newSceneContent;

      newScenes.push(newScene);

      return newScenes;
    }, []);

    // TODO FOR AUTO FIX
    // if (assetNeedingUpdate.length > 0) {
    //   console.log('🐯 assetNeedingUpdate', assetNeedingUpdate)
    //   this.props.sdk.space.getAssets({}).then(console.log)
    //     // console.log('🐯 fixedSceneContent.asset.id', fixedSceneContent.asset.id)
    //     // const asset = await this.props.sdk.space.getAsset(fixedSceneContent.asset.id)
    //     // const {details: {image: imageDimentions, size}} = asset.fields.file[this.findProperLocale()]
    //     // fixedSceneContent.asset.size = size;
    //     // fixedSceneContent.asset.dimentions = imageDimentions;
    // }

    return scenes;
  };

  setScenesFromDebugInput = () => {
    try {
      const newVal = JSON.parse(this.state.debugInput);

      // add fields that might be missing from input with default values
      const fixedNewVal = this.fixScenes(newVal);

      const { error, value } = scenesSchema.validate(fixedNewVal);

      if (error) {
        console.log('🐯 error validating debug input object', error);
        console.log('🐯 value', value);
        return;
      } else {
        this.setState({ scenes: [...value], debugInput: '' }, async () => {
          await this.setDistantFieldValue().then(() => {
            console.log('🐯 sucessfully set scenes manually');
          });
        });
      }
    } catch (err) {
      console.log('🐯 error parsing debug input', err);
    }
  };

  copyScenes = () => {
    this.scenesRef.current.select();
    document.execCommand('copy');
  };

  render = () => {
    return (
      <div className="base">
        <div className="control">
          <Button buttonType="muted" onClick={this.setDebug}>
            Debug <span role="img">🐱</span>
          </Button>

          <Button buttonType="muted" onClick={this.toggleSorting}>
            Sorting is: {this.state.preventSorting ? 'disabled ❌' : 'enabled 👍'}{' '}
          </Button>

          <Button buttonType="positive" onClick={this.setDistantFieldValue}>
            <span role="img">💾</span> {this.state.saving && <Spinner />} SAVE{' '}
            <span role="img">💾</span>
          </Button>
        </div>

        {this.state.debug && (
          <div className="debug">
            <div className="debug__scenes">
              <Button
                id="copy"
                icon="Copy"
                size="small"
                buttonType="muted"
                onClick={this.copyScenes}>
                copy
              </Button>
              <textarea
                ref={this.scenesRef}
                value={JSON.stringify(this.state.scenes, null, 2)}
                readOnly
              />
            </div>

            <div className="debug__input">
              <div className="">update field</div>
              <div className="">
                <textarea value={this.state.debugInput} onChange={this.udpateDebugInput} />
              </div>
              <div className="">
                <Button
                  id="fix"
                  buttonType="muted"
                  size="small"
                  onClick={this.setScenesFromDebugInput}>
                  set scenes state
                </Button>
              </div>
            </div>
          </div>
        )}

        <ErrorBoundary>
          <SortableList
            addSceneContent={this.addSceneContent}
            onSortEnd={this.onSortEnd}
            shouldCancelStart={() => this.state.preventSorting}
            useDragHandle={true}>
            {this.state.scenes.length > 0 &&
              this.state.scenes.map((scene, index) => (
                <SortableItem
                  key={`item-${scene.id}`}
                  index={index}
                  value={scene}
                  addSceneContent={this.addSceneContent}>
                  <DragHandle dragDisabled={this.state.preventSorting} />

                  <div className="scene__wrapper">
                    <div className="scene__content">
                      <div className="scene__idx">Scene {index + 1} </div>
                      <div className="scene__title">
                        <h3 className="inline">titre:</h3>
                        {this.state.preventSorting ? (
                          <TextInput
                            className="inline"
                            type="text"
                            value={scene.title}
                            onChange={e => this.updateSceneTitle(index, e)}
                          />
                        ) : (
                          <h3>{scene.title}</h3>
                        )}
                      </div>
                      {this.state.preventSorting && (
                        <div>
                          <h3>contenu:</h3>
                          {scene.content.length > 0 &&
                            scene.content.map((el, imageIndex) => (
                              <Collapsible
                                key={el.id}
                                trigger={
                                  <>
                                    <CollapsibleAsset asset={el.asset} />
                                    <span>{el.asset.title || el.id}</span>
                                  </>
                                }
                                triggerClassName="collapsible-t"
                                triggerOpenedClassName="collapsible-t__opened">
                                <ItemContent
                                  imageEl={el}
                                  key={el.id}
                                  id={el.id}
                                  itemIndex={index}
                                  imageIndex={imageIndex}
                                  updateGrid={this.updateImageElGrid}
                                  updateMargin={this.updateImageElMargin}
                                  updateMarginMobile={this.updateImageElMarginMobile}
                                  updateFullBleed={this.updateImageElFullBleed}
                                  updateZIndex={this.updateImageElZIndex}
                                  updateAnchor={this.updateImageElAnchor}
                                  updateAutoPlay={this.updateImageElAutoPlay}
                                  updateAnchorMobile={this.updateImageElMobileAnchor}
                                  updateObjectFit={this.updateImageElObjectFit}
                                  updateObjectFitMobile={this.updateImageElObjectFitMobile}
                                  updateStampEffect={this.updateImageElStampEffect}
                                  onClickLinkExistingStamp={this.onClickLinkExistingStamp}
                                  onClickLinkExisting={this.onClickLinkExisting}
                                  deleteImage={this.removeSceneContent}
                                  setDistantFieldValue={this.setDistantFieldValue}
                                  sdk={this.props.sdk}
                                />
                              </Collapsible>
                            ))}
                        </div>
                      )}

                      {this.state.preventSorting && (
                        <Button
                          className="add--image"
                          buttonType="muted"
                          size="small"
                          icon="Asset"
                          onClick={e => this.addSceneContent(index, e)}>
                          Add image
                        </Button>
                      )}
                    </div>
                    <div className="scene__actions delete">
                      <Button
                        buttonType="negative"
                        className="hide"
                        icon="Delete"
                        size="small"
                        onClick={() => this.deleteScene(index)}
                      />
                    </div>
                  </div>
                </SortableItem>
              ))}
          </SortableList>
        </ErrorBoundary>

        {this.state.scenes.length > 0 && (
          <div className="control">
            <Button buttonType="muted" onClick={this.setDebug}>
              Debug <span role="img">🐱</span>
            </Button>

            <Button buttonType="muted" onClick={this.addScene}>
              Add scene <span role="img">📸</span>
            </Button>

            <Button buttonType="muted" onClick={this.toggleSorting}>
              Sorting is: {this.state.preventSorting ? 'disabled ❌' : 'enabled 👍'}{' '}
            </Button>

            <Button buttonType="positive" onClick={this.setDistantFieldValue}>
              <span role="img">💾</span> SAVE <span role="img">💾</span>
            </Button>
          </div>
        )}
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
