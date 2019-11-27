import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import './lib/initCornerstone.js';
import debounce from './lib/debounce.js';
import getAnnotationBoundingBox from './lib/getAnnotationBoundingBox.js';
import ImageScrollbar from './ImageScrollbar.js';
import ViewportOverlay from './ViewportOverlay.js';
import ToolContextMenu from './ToolContextMenu.js';
import LoadingIndicator from '../shared/LoadingIndicator.js';
import Labelling from '../labelling/labelling.js';
import './CornerstoneViewport.css';
import guid from './lib/guid.js';

import cloneDeep from 'lodash.clonedeep';
import getImageIdsForSeries from './lib/getImageIdsForSeries.js';

const EVENT_RESIZE = 'resize';
const loadIndicatorDelay = 45;
const { loadHandlerManager } = cornerstoneTools;

function setToolsPassive(tools) {
  tools.forEach(tool => {
    cornerstoneTools.setToolPassive(tool);
  });
}

function initializeTools(tools) {
  Array.from(tools).forEach(tool => {
    const apiTool = cornerstoneTools[`${tool.name}Tool`];
    if (apiTool) {
      let options;
      const { configuration } = tool;
      if (configuration) {
        options = { configuration };
      }

      cornerstoneTools.addTool(apiTool, options);
    } else {
      throw new Error(`Tool not found: ${tool.name}Tool`);
    }
  });
}

const scrollToIndex = cornerstoneTools.import('util/scrollToIndex');

class CornerstoneViewport extends Component {
  constructor(props) {
    super(props);

    const stack = props.viewportData.stack;

    // Get the number of cached images
    const { cachedImages } = cornerstone.imageCache;
    let numImagesLoaded = 0;
    const cachedImageIds = new Set(cachedImages.map(cache => cache.imageId));
    stack.imageIds.forEach(imageId => {
      if (cachedImageIds.has(imageId)) {
        numImagesLoaded++;
      }
    });

    const isLoading = numImagesLoaded / stack.imageIds.length < 0.1;

    // TODO: Allow viewport as a prop
    this.state = {
      stack,
      imageId: stack.imageIds[0],
      viewportHeight: '100%',
      isLoading,
      imageScrollbarValue: 0,
      numImagesLoaded,
      previousViewport: null,
      prefetchImages: !isLoading
    };

    this.displayScrollbar = stack.imageIds.length > 1;
    this.state.viewport = cornerstone.getDefaultViewport(null, undefined);

    this.updateLabelHandler = this.updateLabelHandler.bind(this);
    this.onImageRendered = this.onImageRendered.bind(this);
    this.onNewImage = this.onNewImage.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.startPrefetching = this.startPrefetching.bind(this);
    this.onStackScroll = this.onStackScroll.bind(this);
    this.startLoadingHandler = this.startLoadingHandler.bind(this);
    this.doneLoadingHandler = this.doneLoadingHandler.bind(this);
    this.onMouseClick = this.onMouseClick.bind(this);
    this.focusLesion = this.focusLesion.bind(this);
    this.onTouchPress = this.onTouchPress.bind(this);
    this.focusCurrentLesion = this.focusCurrentLesion.bind(this);
    this.toggleMagnification = this.toggleMagnification.bind(this);
    this.getZoomedLesionViewport = this.getZoomedLesionViewport.bind(this);
    this.updateScrollbarValue = this.updateScrollbarValue.bind(this);
    this.onMeasurementAddedOrRemoved = this.onMeasurementAddedOrRemoved.bind(
      this
    );
    this.onMeasurementModified = this.onMeasurementModified.bind(this);
    this.onCloseToolContextMenu = this.onCloseToolContextMenu.bind(this);
    this.imageSliderOnInputCallback = this.imageSliderOnInputCallback.bind(
      this
    );

    this.loadHandlerTimeout = 25;
    loadHandlerManager.setStartLoadHandler(this.startLoadingHandler);
    loadHandlerManager.setEndLoadHandler(this.doneLoadingHandler);

    this.debouncedResize = debounce(() => {
      cornerstone.resize(this.element, true);

      this.setState({
        viewportHeight: `${this.element.clientHeight - 50}px`
      });
    }, 300);

    this.slideTimeoutTime = 25;
    this.slideTimeout = null;
  }

  render() {
    const isLoading =
      this.state.isLoading ||
      this.state.numImagesLoaded / this.state.stack.imageIds.length < 0.1;

    return (
      <>
        <ToolContextMenu
          toolContextMenuData={this.state.toolContextMenuData}
          onClose={this.onCloseToolContextMenu}
        />
        <div
          className="CornerstoneViewport viewportElement"
          onContextMenu={this.onContextMenu}
          ref={input => {
            this.element = input;
          }}
        >
          {isLoading ? <LoadingIndicator /> : ''}
          <canvas className="cornerstone-canvas" />
          <ViewportOverlay
            stack={this.state.stack}
            viewport={this.state.viewport}
            imageId={this.state.imageId}
            numImagesLoaded={this.state.numImagesLoaded}
          />
        </div>
        {this.displayScrollbar && (
          <ImageScrollbar
            onInputCallback={this.imageSliderOnInputCallback}
            max={this.state.stack.imageIds.length - 1}
            value={this.state.imageScrollbarValue}
            height={this.state.viewportHeight}
          />
        )}
        {this.state.bidirectionalAddLabelShow && (
          <Labelling
            measurementData={this.bidirectional.measurementData}
            eventData={this.bidirectional.eventData}
            labellingDoneCallback={this.bidirectional.labellingDoneCallback}
            skipButton={this.bidirectional.skipButton}
            editDescription={this.bidirectional.editDescription}
          />
        )}
      </>
    );
  }

  bidirectionalToolLabellingCallback = (
    measurementData,
    eventData,
    doneCallback,
    options = {}
  ) => {
    const labellingDoneCallback = () => {
      this.hideExtraButtons();
      return doneCallback();
    };

    this.bidirectional = {
      measurementData,
      eventData,
      labellingDoneCallback,
      skipButton: options.skipButton,
      editDescription: options.editDescription
    };

    this.setState({
      bidirectionalAddLabelShow: true
    });
  };

  activateMeasurement(currentToolData) {
    const { globalImageIdSpecificToolStateManager } = cornerstoneTools;
    let measurementData = currentToolData;
    const toolState = globalImageIdSpecificToolStateManager.saveToolState();
    Object.keys(toolState).forEach(toolStateKey => {
      const imageState = toolState[toolStateKey];
      const toolData = imageState[currentToolData.toolType].data || [];
      toolData.forEach(data => {
        if (data._id === currentToolData._id) {
          data.active = true;
          measurementData = data;
        } else {
          data.active = false;
          data.activeTouch = false;
        }
      });
    });

    globalImageIdSpecificToolStateManager.restoreToolState(toolState);

    return measurementData;
  }

  updateLabelHandler(originElement) {
    const { currentLesion, toolData, displayLabelSelectTree } = this.props;
    let index = currentLesion >= 0 ? currentLesion - 1 : toolData.length - 1;
    const currentToolData = toolData[index];

    if (!currentToolData) {
      return;
    }

    if (!displayLabelSelectTree) {
      this.setState({ bidirectionalAddLabelShow: false });
      return;
    }

    const measurementData = this.activateMeasurement(currentToolData);
    if (measurementData) {
      const eventData = { currentPoints: {} };
      if (originElement) {
        const boundingRect = originElement.getBoundingClientRect();
        eventData.currentPoints.canvas = {
          x: boundingRect.left - 50,
          y: -20
        };
      } else {
        const { end } = measurementData.handles;
        const canvas = cornerstone.pixelToCanvas(this.element, end);
        eventData.currentPoints.canvas = canvas;
      }

      this.bidirectional = {
        measurementData,
        eventData,
        labellingDoneCallback: () => {
          cornerstone.updateImage(this.element);
          this.props.labelDoneCallback();
          this.hideExtraButtons();
        },
        skipButton: true,
        editDescription: false
      };

      this.hideExtraButtons();
      this.setState({ bidirectionalAddLabelShow: true });
    }
  }

  onContextMenu(event) {
    // Preventing the default behaviour for right-click is essential to
    // allow right-click tools to work.
    event.preventDefault();
  }

  onWindowResize() {
    this.debouncedResize();
  }

  onImageRendered() {
    const viewport = cornerstone.getViewport(this.element);

    this.setState({
      viewport
    });
  }

  onNewImage() {
    const image = cornerstone.getImage(this.element);

    this.setState({
      imageId: image.imageId
    });

    this.updateScrollbarValue();

    if (this.props.onNewImage) {
      this.props.onNewImage();
    }
  }

  componentDidMount() {
    const element = this.element;

    // Enable the DOM Element for use with Cornerstone
    cornerstone.enable(element);

    cornerstone.events.addEventListener(
      cornerstone.EVENTS.IMAGE_LOADED,
      this.onImageLoaded
    );

    cornerstone.events.addEventListener(
      cornerstone.EVENTS.IMAGE_LOAD_FAILED,
      this.onImageLoaded
    );

    // Load the first image in the stack
    cornerstone.loadAndCacheImage(this.state.imageId).then(image => {
      try {
        cornerstone.getEnabledElement(element);
      } catch (error) {
        // Handle cases where the user ends the session before the image is displayed.
        console.error(error);
        return;
      }

      // Set Soft Tissue preset for all images by default
      const viewport = cornerstone.getDefaultViewportForImage(element, image);
      viewport.voi = {
        windowWidth: 400,
        windowCenter: 40
      };

      // Display the first image
      cornerstone.displayImage(element, image, viewport);

      // Clear any previous tool state
      cornerstoneTools.clearToolState(this.element, 'stack');

      // Disable stack prefetch in case there are still queued requests
      cornerstoneTools.stackPrefetch.disable(this.element);

      // Add the stack tool state to the enabled element
      const stack = this.state.stack;
      cornerstoneTools.addStackStateManager(element, ['stack']);
      cornerstoneTools.addToolState(element, 'stack', stack);
      cornerstoneTools.stackPrefetch.enable(this.element);

      const tools = [
        {
          name: 'Bidirectional',
          configuration: {
            getMeasurementLocationCallback: this
              .bidirectionalToolLabellingCallback,
            shadow: true,
            drawHandlesOnHover: true
            // Uncomment to activate magnifying glass for bidirecitonal tool
            // touchMagnifySize: Math.floor(element.clientWidth / 2),
            // touchMagnificationLevel: 1
            // drawActiveTouchHandles: true
          }
        },
        { name: 'Wwwc' },
        {
          name: 'Zoom',
          configuration: {
            minScale: 0.3,
            maxScale: 25,
            preventZoomOutsideImage: true
          }
        },
        { name: 'Pan' },
        { name: 'StackScroll' },
        { name: 'PanMultiTouch' },
        { name: 'ZoomTouchPinch' },
        { name: 'StackScrollMouseWheel' },
        { name: 'StackScrollMultiTouch' }
      ];

      initializeTools(tools);

      this.setActiveTool(this.props.activeTool);

      /* For touch devices, by default we activate:
      - Pinch to zoom
      - Two-finger Pan
      - Three (or more) finger Stack Scroll
      */
      const touchOptions = {
        mouseButtonMask: 0,
        isTouchActive: true
      };
      cornerstoneTools.setToolActive('PanMultiTouch', touchOptions);
      cornerstoneTools.setToolActive('ZoomTouchPinch', touchOptions);
      cornerstoneTools.setToolActive('StackScrollMultiTouch', touchOptions);

      cornerstoneTools.stackPrefetch.setConfiguration({
        maxImagesToPrefetch: Infinity,
        preserveExistingPool: false,
        maxSimultaneousRequests: 6
      });

      /* For mouse devices, by default we turn on:
      - Stack scrolling by mouse wheel
      - Stack scrolling by keyboard up / down arrow keys
      - Pan with middle click
      - Zoom with right click
      */

      cornerstoneTools.setToolActive('StackScrollMouseWheel', {
        mouseButtonMask: 0,
        isTouchActive: true
      });

      element.addEventListener(
        cornerstone.EVENTS.IMAGE_RENDERED,
        this.onImageRendered
      );

      element.addEventListener(cornerstone.EVENTS.NEW_IMAGE, this.onNewImage);

      element.addEventListener(
        cornerstoneTools.EVENTS.STACK_SCROLL,
        this.onStackScroll
      );

      element.addEventListener(
        cornerstoneTools.EVENTS.MEASUREMENT_ADDED,
        this.onMeasurementAddedOrRemoved
      );

      element.addEventListener(
        cornerstoneTools.EVENTS.MEASUREMENT_REMOVED,
        this.onMeasurementAddedOrRemoved
      );

      element.addEventListener(
        cornerstoneTools.EVENTS.MEASUREMENT_MODIFIED,
        this.onMeasurementModified
      );

      element.addEventListener(
        cornerstoneTools.EVENTS.MOUSE_CLICK,
        this.onMouseClick
      );

      element.addEventListener(
        cornerstoneTools.EVENTS.TOUCH_PRESS,
        this.onTouchPress
      );

      window.addEventListener(EVENT_RESIZE, this.onWindowResize);

      this.setState({
        viewportHeight: `${this.element.clientHeight - 50}px`
      });

      this.doneLoadingHandler();
    });
  }

  componentWillUnmount() {
    this.stopPrefetching = true;

    const element = this.element;
    element.removeEventListener(
      cornerstone.EVENTS.IMAGE_RENDERED,
      this.onImageRendered
    );

    element.removeEventListener(cornerstone.EVENTS.NEW_IMAGE, this.onNewImage);

    element.removeEventListener(
      cornerstoneTools.EVENTS.STACK_SCROLL,
      this.onStackScroll
    );

    element.removeEventListener(
      cornerstoneTools.EVENTS.MEASUREMENT_ADDED,
      this.onMeasurementAddedOrRemoved
    );

    element.removeEventListener(
      cornerstoneTools.EVENTS.MEASUREMENT_REMOVED,
      this.onMeasurementAddedOrRemoved
    );

    element.removeEventListener(
      cornerstoneTools.EVENTS.MEASUREMENT_MODIFIED,
      this.onMeasurementModified
    );

    element.removeEventListener(
      cornerstoneTools.EVENTS.MOUSE_CLICK,
      this.onMouseClick
    );

    element.removeEventListener(
      cornerstoneTools.EVENTS.TOUCH_PRESS,
      this.onTouchPress
    );

    window.removeEventListener(EVENT_RESIZE, this.onWindowResize);

    cornerstone.disable(element);

    cornerstone.events.removeEventListener(
      cornerstone.EVENTS.IMAGE_LOADED,
      this.onImageLoaded
    );

    cornerstone.events.removeEventListener(
      cornerstone.EVENTS.IMAGE_LOAD_FAILED,
      this.onImageLoaded
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.prefetchedCase !== this.props.prefetchedCase) {
      this.setState({ prefetchImages: true });
      this.startPrefetching();
    }

    // TODO: Add a real object shallow comparison here?
    if (
      this.state.stack.imageIds[0] !== this.props.viewportData.stack.imageIds[0]
    ) {
      this.setState({
        stack: this.props.viewportData.stack
      });

      const stackData = cornerstoneTools.getToolState(this.element, 'stack');
      let currentStack = stackData && stackData.data[0];

      if (!currentStack) {
        currentStack = {
          currentImageIdIndex: this.state.stack.currentImageIdIndex,
          imageIds: this.state.stack.imageIds
        };

        cornerstoneTools.addStackStateManager(this.element, ['stack']);
        cornerstoneTools.addToolState(this.element, 'stack', currentStack);
      } else {
        // TODO: we should make something like setToolState by an ID
        currentStack.currentImageIdIndex = this.state.stack.currentImageIdIndex;
        currentStack.imageIds = this.state.stack.imageIds;
      }

      const imageId = currentStack.imageIds[currentStack.currentImageIdIndex];

      cornerstone.loadAndCacheImage(imageId).then(image => {
        try {
          cornerstone.getEnabledElement(this.element);
        } catch (error) {
          // Handle cases where the user ends the session before the image is displayed.
          console.error(error);
          return;
        }

        cornerstone.displayImage(this.element, image);

        cornerstoneTools.stackPrefetch.disable(this.element);
        cornerstoneTools.stackPrefetch.enable(this.element);
      });
    }

    if (this.props.activeTool !== prevProps.activeTool) {
      this.setActiveTool(this.props.activeTool);

      // TODO: Why do we need to do this in v3?
      cornerstoneTools.setToolActive('StackScrollMouseWheel', {
        mouseButtonMask: 0,
        isTouchActive: true
      });
    }

    const { labelSelectTreeOrigin, displayLabelSelectTree } = this.props;
    const currentLesionChanged =
      this.props.currentLesion !== prevProps.currentLesion;

    const currentDisplayLabel =
      displayLabelSelectTree !== prevProps.displayLabelSelectTree;

    if (currentLesionChanged || currentDisplayLabel) {
      this.updateLabelHandler(labelSelectTreeOrigin);
    }

    if (currentLesionChanged) {
      this.setState({ bidirectionalAddLabelShow: false });
    }

    const { magnificationActive } = this.props;
    const magnificationChanged =
      magnificationActive !== prevProps.magnificationActive;

    const shallFocus = this.props.currentLesionFocused && currentLesionChanged;

    if (magnificationChanged) {
      if (magnificationActive) {
        const currentViewport = cornerstone.getViewport(this.element);
        this.setState({
          previousViewport: {
            scale: currentViewport.scale,
            translation: {
              x: currentViewport.translation.x,
              y: currentViewport.translation.y
            }
          }
        });

        this.toggleMagnification(true);
        this.focusCurrentLesion();
      } else {
        this.toggleMagnification(false);
      }
    } else if (shallFocus) {
      this.focusCurrentLesion();
    }
  }

  toggleMagnification(magnificationActive) {
    const { element } = this;
    const currentViewport = cornerstone.getViewport(element);
    let newState = {};
    const { previousViewport } = this.state;
    if (magnificationActive) {
      // Store the current viewport for restoring it later
      newState.previousViewport = {
        scale: currentViewport.scale,
        translation: {
          x: currentViewport.translation.x,
          y: currentViewport.translation.y
        }
      };

      this.setState(newState);
    } else {
      if (
        previousViewport &&
        previousViewport.scale !== currentViewport.scale
      ) {
        const newViewport = Object.assign(currentViewport, previousViewport);
        cornerstone.setViewport(element, newViewport);
      } else {
        const img = cornerstone.getImage(element);
        const viewport = cornerstone.getDefaultViewportForImage(element, img);
        const newViewport = Object.assign(currentViewport, {
          scale: viewport.scale,
          translation: viewport.translation
        });
        cornerstone.setViewport(element, newViewport);
      }

      cornerstone.updateImage(element);
      newState.previousViewport = null;
      this.setState(newState);
    }
  }

  getZoomedLesionViewport() {
    const { toolData, currentLesion } = this.props;
    const measurementData = toolData[currentLesion - 1];
    const { element } = this;
    const viewport = cornerstone.getViewport(element);
    if (!measurementData) {
      return viewport;
    }

    const boundingBox = getAnnotationBoundingBox(measurementData.handles);
    if (!boundingBox) {
      return viewport;
    }

    // Calculate the new viewport translation and scale
    const image = cornerstone.getImage(element);
    const defaultViewport = cornerstone.getDefaultViewportForImage(
      element,
      image
    );
    const width = boundingBox.xEnd - boundingBox.xStart;
    const height = boundingBox.yEnd - boundingBox.yStart;

    if (!width || !height) {
      return viewport;
    }

    const xScale = image.width / width;
    const yScale = image.height / height;
    const newScale = xScale < yScale ? xScale : yScale;
    const imageMidX = image.width / 2;
    const imageMidY = image.height / 2;
    const annotationMidX = boundingBox.xStart + width / 2;
    const annotationMidY = boundingBox.yStart + height / 2;

    // Update the viewport translation and scale
    viewport.scale = defaultViewport.scale * newScale * 0.75;
    viewport.translation.x = imageMidX - annotationMidX;
    viewport.translation.y = imageMidY - annotationMidY;

    return viewport;
  }

  focusCurrentLesion() {
    const { element } = this;
    const { toolData, currentLesion } = this.props;
    const currentToolData = toolData[currentLesion - 1];

    if (currentToolData) {
      this.activateMeasurement(currentToolData);

      const { imageId } = currentToolData;
      let viewport = currentToolData.viewport;
      if (this.props.magnificationActive) {
        viewport = Object.assign({}, viewport, this.getZoomedLesionViewport());
      } else {
        viewport.translation.x = 0;
        viewport.translation.y = 0;
      }

      if (this.state.imageId === imageId) {
        cornerstone.setViewport(element, viewport);
        cornerstone.updateImage(element);
      } else {
        cornerstone.loadAndCacheImage(imageId).then(image => {
          try {
            cornerstone.getEnabledElement(element);
          } catch (error) {
            // Handle cases where the user ends the session before the image is displayed.
            console.error(error);
            return;
          }

          cornerstone.displayImage(element, image, viewport);
          this.setState({ imageId });
        });
      }
    } else {
      cornerstone.updateImage(element);
    }
  }

  setActiveTool = activeTool => {
    const leftMouseTools = ['Bidirectional', 'Wwwc', 'StackScroll'];

    setToolsPassive(leftMouseTools);

    // pan is the default tool for middle mouse button
    const isPanToolActive = activeTool === 'Pan';
    const panOptions = {
      mouseButtonMask: isPanToolActive ? [1, 4] : [4],
      isTouchActive: isPanToolActive
    };
    cornerstoneTools.setToolActive('Pan', panOptions);

    // zoom is the default tool for right mouse button
    const isZoomToolActive = activeTool === 'Zoom';
    const zoomOptions = {
      mouseButtonMask: isZoomToolActive ? [1, 2] : [2],
      isTouchActive: isZoomToolActive
    };
    cornerstoneTools.setToolActive('Zoom', zoomOptions);

    cornerstoneTools.setToolActive(activeTool, {
      mouseButtonMask: 1,
      isTouchActive: true
    });
  };

  onStackScroll(event) {
    const element = event.currentTarget;
    const stackData = cornerstoneTools.getToolState(element, 'stack');
    const stack = stackData.data[0];

    this.hideExtraButtons();

    this.setState({
      stack,
      imageScrollbarValue: stack.currentImageIdIndex
    });
  }

  updateScrollbarValue() {
    const { element } = this;
    const stackData = cornerstoneTools.getToolState(element, 'stack');
    const stack = stackData.data[0];
    const { imageIds } = stack;

    stack.currentImageIdIndex = imageIds.indexOf(this.state.imageId);
    if (stack.currentImageIdIndex === this.state.imageScrollbarValue) {
      return;
    }

    this.setState({
      stack,
      imageScrollbarValue: stack.currentImageIdIndex
    });

    this.hideExtraButtons();
  }

  startPrefetching() {
    if (!this.state.prefetchImages) {
      return;
    }

    const { numImagesLoaded } = this.state;
    const { viewportData } = this.props;
    const total = viewportData.stack.imageIds.length;
    if (numImagesLoaded !== total) {
      return;
    }

    this.setState({ prefetchImages: false });
    const { seriesData } = this.props.prefetchedCase;
    const imageIdsToPrefetch = getImageIdsForSeries(seriesData);
    const loadNext = () => {
      if (!imageIdsToPrefetch.length || this.stopPrefetching) {
        return;
      }

      const imageId = imageIdsToPrefetch.shift();
      cornerstone.loadAndCacheImage(imageId).then(loadNext, loadNext);
    };

    if (this.props.viewportData === viewportData) {
      loadNext();
    }
  }

  onImageLoaded() {
    const { numImagesLoaded } = this.state;
    const newValue = numImagesLoaded + 1;
    this.setState({ numImagesLoaded: newValue });
    this.startPrefetching();
  }

  startLoadingHandler() {
    //console.log('startLoadingHandler');
    clearTimeout(this.loadHandlerTimeout);
    this.loadHandlerTimeout = setTimeout(() => {
      this.setState({
        isLoading: true
      });
    }, loadIndicatorDelay);
  }

  doneLoadingHandler() {
    clearTimeout(this.loadHandlerTimeout);
    this.setState({
      isLoading: false
    });
  }

  onMeasurementAddedOrRemoved(event) {
    const { toolType, measurementData } = event.detail;

    // TODO: Pass in as prop?
    const toolsOfInterest = ['Bidirectional'];

    this.hideExtraButtons();

    if (toolsOfInterest.includes(toolType)) {
      const image = cornerstone.getImage(this.element);
      const viewport = cornerstone.getViewport(this.element);

      const type = {
        cornerstonetoolsmeasurementadded: 'added',
        cornerstonetoolsmeasurementremoved: 'removed'
      };
      const action = type[event.type];

      if (action === 'added') {
        measurementData._id = guid();
        measurementData.viewport = cloneDeep(viewport);
      }

      this.props.measurementsAddedOrRemoved(
        action,
        image.imageId,
        toolType,
        measurementData
      );
    }
  }

  onMeasurementModified(event) {
    const { toolData } = this.props;
    const { measurementData } = event.detail;
    if (!measurementData || measurementData.toolType !== 'Bidirectional') {
      return;
    }

    const data = toolData.find(m => m._id === measurementData._id);
    const currentLesion = toolData.indexOf(data) + 1;
    if (this.props.setCurrentLesion && currentLesion) {
      this.props.setCurrentLesion(currentLesion);
    }

    this.activateMeasurement(measurementData);
    if (measurementData.location) {
      this.hideExtraButtons();
    }
  }

  onMouseClick(event) {
    const { which } = event.detail.event;
    if (which === 1) {
      this.focusLesion(event);
    } else if (which === 3) {
      this.setState({
        toolContextMenuData: {
          eventData: event.detail,
          isTouchEvent: false
        }
      });
    }
  }

  focusLesion(event) {
    const { element } = this;
    const filter = tool => tool.name === 'Bidirectional';
    const toolInterface = cornerstoneTools.store.state.tools.find(filter);
    const coords = event.detail.currentPoints.canvas;
    this.props.toolData.every((measurementData, index) => {
      if (toolInterface.pointNearTool(element, measurementData, coords)) {
        measurementData.active = true;
        this.props.setCurrentLesion(index + 1);
        return false;
      }

      return true;
    });
  }

  onTouchPress(event) {
    this.setState({
      toolContextMenuData: {
        eventData: event.detail,
        isTouchEvent: true
      }
    });
  }

  onCloseToolContextMenu() {
    this.setState({
      toolContextMenuData: null
    });
  }

  imageSliderOnInputCallback(value) {
    this.setState({
      imageScrollbarValue: value
    });

    // Note that we throttle requests to prevent the
    // user's ultrafast scrolling from firing requests too quickly.
    //clearTimeout(this.slideTimeout);
    //this.slideTimeout = setTimeout(() => {
    scrollToIndex(this.element, value);
    //}, this.slideTimeoutTime);
  }

  hideExtraButtons = () => {
    if (this.state.bidirectionalAddLabelShow === true) {
      this.setState({
        bidirectionalAddLabelShow: false
      });
    }
    this.setState({
      toolContextMenuData: null
    });
  };
}

CornerstoneViewport.propTypes = {
  measurementsAddedOrRemoved: PropTypes.func.isRequired,
  measurementsChanged: PropTypes.func.isRequired,
  activeTool: PropTypes.string.isRequired,
  viewportData: PropTypes.object.isRequired,
  labelSelectTreeOrigin: PropTypes.object,
  displayLabelSelectTree: PropTypes.boolean,
  labelDoneCallback: PropTypes.func,
  currentLesionFocused: PropTypes.bool,
  magnificationActive: PropTypes.bool,
  setCurrentLesion: PropTypes.func
};

export default CornerstoneViewport;
