import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import './lib/initCornerstone.js';
import debounce from './lib/debounce.js';
import ImageScrollbar from './ImageScrollbar.js';
import ViewportOverlay from './ViewportOverlay.js';
import ToolContextMenu from './ToolContextMenu.js';
import LoadingIndicator from '../shared/LoadingIndicator.js';
import './CornerstoneViewport.css';
import guid from './lib/guid.js';

const EVENT_RESIZE = 'resize';
const loadIndicatorDelay = 25;
const { loadHandlerManager } = cornerstoneTools;

function setToolsPassive(tools) {
  tools.forEach(tool => {
    cornerstoneTools.setToolPassive(tool.name);
  });
}

function initializeTools(tools) {
  Array.from(tools).forEach(toolName => {
    const apiTool = cornerstoneTools[`${toolName}Tool`];
    if (apiTool) {
      cornerstoneTools.addTool(apiTool);
    } else {
      throw new Error(`Tool not found: ${toolName}Tool`);
    }
  });
}

const scrollToIndex = cornerstoneTools.import('util/scrollToIndex');

class CornerstoneViewport extends Component {
  constructor(props) {
    super(props);

    const stack = props.viewportData.stack;

    // TODO: Allow viewport as a prop
    this.state = {
      stack,
      imageId: stack.imageIds[0],
      viewportHeight: '100%',
      isLoading: true
    };

    this.displayScrollbar = stack.imageIds.length > 1;
    this.state.viewport = cornerstone.getDefaultViewport(null, undefined);

    this.onImageRendered = this.onImageRendered.bind(this);
    this.onNewImage = this.onNewImage.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.onStackScroll = this.onStackScroll.bind(this);
    this.startLoadingHandler = this.startLoadingHandler.bind(this);
    this.doneLoadingHandler = this.doneLoadingHandler.bind(this);
    this.onMouseClick = this.onMouseClick.bind(this);
    this.onTouchPress = this.onTouchPress.bind(this);
    this.onMeasurementAddedOrRemoved = this.onMeasurementAddedOrRemoved.bind(
      this
    );
    this.onCloseToolContextMenu = this.onCloseToolContextMenu.bind(this);

    this.loadHandlerTimeout = 25;
    loadHandlerManager.setStartLoadHandler(this.startLoadingHandler);
    loadHandlerManager.setEndLoadHandler(this.doneLoadingHandler);

    this.debouncedResize = debounce(() => {
      cornerstone.resize(this.element, true);

      this.setState({
        viewportHeight: `${this.element.clientHeight - 20}px`
      });
    }, 300);

    const slideTimeoutTime = 5;
    this.slideTimeout = null;

    // Adding input listener
    this.imageSliderOnInputCallback = value => {
      // Note that we throttle requests to prevent the
      // user's ultrafast scrolling from firing requests too quickly.
      clearTimeout(this.slideTimeout);
      this.slideTimeout = setTimeout(() => {
        const newImageIdIndex = parseInt(value, 10);

        // TODO: This doesn't seem to be exported in Tools V3
        scrollToIndex(this.element, newImageIdIndex);
      }, slideTimeoutTime);
    };
  }

  render() {
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
          {this.state.isLoading ? <LoadingIndicator /> : ''}
          <canvas className="cornerstone-canvas" />
          <ViewportOverlay
            stack={this.state.stack}
            viewport={this.state.viewport}
            imageId={this.state.imageId}
          />
        </div>
        {this.displayScrollbar && (
          <ImageScrollbar
            onInputCallback={this.imageSliderOnInputCallback}
            max={this.state.stack.imageIds.length - 1}
            value={this.state.stack.currentImageIdIndex}
            height={this.state.viewportHeight}
          />
        )}
      </>
    );
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
  }

  componentDidMount() {
    const element = this.element;

    // Enable the DOM Element for use with Cornerstone
    cornerstone.enable(element);

    // Load the first image in the stack
    cornerstone.loadAndCacheImage(this.state.imageId).then(image => {
      try {
        cornerstone.getEnabledElement(element);
      } catch (error) {
        // Handle cases where the user ends the session before the image is displayed.
        console.error(error);
        return;
      }

      // Display the first image
      cornerstone.displayImage(element, image);

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
        'Bidirectional',
        'Wwwc',
        'Zoom',
        'Pan',
        'StackScroll',
        'PanMultiTouch',
        'ZoomTouchPinch',
        'StackScrollMouseWheel',
        'StackScrollMultiTouch'
      ];

      initializeTools(tools);

      cornerstoneTools.setToolActive(this.props.activeTool, {
        mouseButtonMask: 1,
        isTouchActive: true
      });

      /* For touch devices, by default we activate:
      - Pinch to zoom
      - Two-finger Pan
      - Three (or more) finger Stack Scroll
      */
      cornerstoneTools.setToolActive('PanMultiTouch', {
        mouseButtonMask: 0,
        isTouchActive: true
      });
      cornerstoneTools.setToolActive('ZoomTouchPinch', {
        mouseButtonMask: 0,
        isTouchActive: true
      });

      cornerstoneTools.setToolActive('StackScrollMultiTouch', {
        mouseButtonMask: 0,
        isTouchActive: true
      });

      cornerstoneTools.stackPrefetch.setConfiguration({
        maxImagesToPrefetch: Infinity,
        preserveExistingPool: false,
        maxSimultaneousRequests: 20
      });

      /* For mouse devices, by default we turn on:
      - Stack scrolling by mouse wheel
      - Stack scrolling by keyboard up / down arrow keys
      - Pan with middle click
      - Zoom with right click
      */

      // pan is the default tool for middle mouse button
      cornerstoneTools.setToolActive('Pan', {
        mouseButtonMask: 4,
        isTouchActive: false
      });

      // zoom is the default tool for right mouse button
      cornerstoneTools.setToolActive('Zoom', {
        mouseButtonMask: 2,
        isTouchActive: false
      });

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
        cornerstoneTools.EVENTS.MOUSE_CLICK,
        this.onMouseClick
      );

      element.addEventListener(
        cornerstoneTools.EVENTS.TOUCH_PRESS,
        this.onTouchPress
      );

      cornerstone.events.addEventListener(
        cornerstone.EVENTS.IMAGE_LOADED,
        this.onImageLoaded
      );

      window.addEventListener(EVENT_RESIZE, this.onWindowResize);

      this.setState({
        viewportHeight: `${this.element.clientHeight - 20}px`
      });

      this.doneLoadingHandler();
    });
  }

  componentWillUnmount() {
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
  }

  componentDidUpdate(prevProps) {
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
      const leftMouseTools = [
        'Bidirectional',
        'Wwwc',
        'Zoom',
        'Pan',
        'StackScroll'
      ];

      setToolsPassive(leftMouseTools);

      cornerstoneTools.setToolActive(this.props.activeTool, {
        mouseButtonMask: 1,
        isTouchActive: true
      });

      // TODO: Why do we need to do this in v3?
      cornerstoneTools.setToolActive('StackScrollMouseWheel', {
        mouseButtonMask: 0,
        isTouchActive: true
      });
    }

    if (this.props.currentLesion !== prevProps.currentLesion) {
      const currentToolData = this.props.toolData[this.props.currentLesion - 1];
      if (currentToolData) {
        const { imageId } = currentToolData;
        const toolState = cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState();
        const toolData = toolState[imageId][currentToolData.toolType].data;

        toolData.forEach(data => {
          if (data._id === currentToolData._id) {
            data.active = true;
          } else {
            data.active = false;
          }
        });

        cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState(
          toolState
        );

        if (this.state.imageId === imageId) {
          cornerstone.updateImage(this.element);
        } else {
          cornerstone.loadAndCacheImage(imageId).then(image => {
            try {
              cornerstone.getEnabledElement(this.element);
            } catch (error) {
              // Handle cases where the user ends the session before the image is displayed.
              console.error(error);
              return;
            }

            cornerstone.displayImage(this.element, image);

            this.setState({
              imageId
            });
          });
        }
      } else {
        cornerstone.updateImage(this.element);
      }
    }
  }

  onStackScroll(event) {
    const element = event.currentTarget;
    const stackData = cornerstoneTools.getToolState(element, 'stack');
    const stack = stackData.data[0];
    const imageIndex = stack.currentImageIdIndex + 1;

    // TODO: put this on-screen somewhere?
    console.log(`Image: ${imageIndex}/${stack.imageIds.length}`);

    this.setState({
      stack
    });
  }

  onImageLoaded(event) {
    //console.log(event.detail);
    //const loadingProgress = $('#loading-progress');
    //this.numImagesLoaded += 1;
    //const imagesLeft = imageIds.length - numImagesLoaded;
    /*loadingProgress.text(`${imagesLeft} images requested`);
    if (numImagesLoaded === imageIds.length) {
      console.timeEnd('Loading All Images');
      loadingProgress.text('');
    }*/
  }

  startLoadingHandler() {
    console.log('startLoadingHandler');
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

    measurementData._id = guid();

    // TODO: Pass in as prop?
    const toolsOfInterest = ['Bidirectional'];

    if (toolsOfInterest.includes(toolType)) {
      const image = cornerstone.getImage(this.element);

      const type = {
        cornerstonetoolsmeasurementadded: 'added',
        cornerstonetoolsmeasurementremoved: 'removed'
      };
      const action = type[event.type];

      this.props.measurementsChanged(
        action,
        image.imageId,
        toolType,
        measurementData
      );
    }
  }

  onMouseClick(event) {
    if (event.detail.event.which === 3) {
      this.setState({
        toolContextMenuData: {
          eventData: event.detail,
          isTouchEvent: false
        }
      });
    }
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
}

CornerstoneViewport.propTypes = {
  measurementsChanged: PropTypes.func.isRequired,
  activeTool: PropTypes.string.isRequired,
  viewportData: PropTypes.object.isRequired
};

export default CornerstoneViewport;
