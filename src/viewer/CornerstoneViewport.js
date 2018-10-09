import { Component } from 'react';
import React from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import './initCornerstone.js';
import debounce from './debounce.js';
import ImageScrollbar from './ImageScrollbar.js';
import ViewportOverlay from './ViewportOverlay.js';
import LoadingIndicator from '../shared/LoadingIndicator.js';
import './CornerstoneViewport.css';

const EVENT_RESIZE = 'resize';
const loadIndicatorDelay = 25;
const { loadHandlerManager } = cornerstoneTools;

class CornerstoneViewport extends Component {
  constructor(props) {
    super(props);

    const stack = props.viewportData.stack;

    // TODO: Allow viewport as a prop
    this.state = {
      stack,
      imageId: stack.imageIds[0],
      viewportHeight: '100%'
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

    this.isLoading = true;
    this.loadHandlerTimeout = null;
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

        cornerstoneTools.scrollToIndex(this.element, newImageIdIndex);
      }, slideTimeoutTime);
    };
  }

  render() {
    return (
      <>
        <div
          className="CornerstoneViewport viewportElement"
          onContextMenu={this.onContextMenu}
          ref={input => {
            this.element = input;
          }}
        >
          <canvas className="cornerstone-canvas" />

          {this.state.isLoading && <LoadingIndicator />}
          {this.displayScrollbar && (
            <ImageScrollbar
              onInputCallback={this.imageSliderOnInputCallback}
              max={this.state.stack.imageIds.length - 1}
              value={this.state.stack.currentImageIdIndex}
              height={this.state.viewportHeight}
            />
          )}

          <ViewportOverlay viewport={this.state.viewport} />
        </div>
      </>
    );
  }

  onContextMenu(event) {
    // Preventing the default behaviour for right-click is essential to
    // allow right-click tools to work.
    event.preventDefault();
  }

  onWindowResize() {
    console.log('onWindowResize');
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
    cornerstone.loadImage(this.state.imageId).then(image => {
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

      cornerstoneTools.mouseInput.enable(this.element);
      cornerstoneTools.touchInput.enable(this.element);
      cornerstoneTools.mouseWheelInput.enable(this.element);
      cornerstoneTools.keyboardInput.enable(this.element);

      /* For touch devices, by default we activate:
      - Pinch to zoom
      - Two-finger Pan
      - Three (or more) finger Stack Scroll
      */
      cornerstoneTools.zoomTouchPinch.activate(this.element);
      cornerstoneTools.panMultiTouch.activate(this.element);
      cornerstoneTools.panMultiTouch.setConfiguration({
        testPointers: eventData => eventData.numPointers === 2
      });
      cornerstoneTools.stackScrollMultiTouch.activate(this.element);

      // We also enable the Length tool so it is always visible
      cornerstoneTools.length.enable(this.element);

      cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button

      /* For mouse devices, by default we turn on:
      - Stack scrolling by mouse wheel
      - Stack scrolling by keyboard up / down arrow keys
      - Pan with middle click
      - Zoom with right click
      */
      cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
      cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
      cornerstoneTools.stackScrollWheel.activate(element);
      cornerstoneTools.stackScrollKeyboard.activate(element);

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
        this.onMeasurementAdded
      );

      cornerstone.events.addEventListener(
        cornerstone.EVENTS.IMAGE_LOADED,
        this.onImageLoaded
      );

      window.addEventListener(EVENT_RESIZE, this.onWindowResize);

      this.setState({
        viewportHeight: `${this.element.clientHeight - 20}px`
      });
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
      this.onMeasurementAdded
    );

    window.removeEventListener(EVENT_RESIZE, this.onWindowResize);

    cornerstone.disable(element);

    cornerstone.events.removeEventListener(
      cornerstone.EVENTS.IMAGE_LOADED,
      this.onImageLoaded
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const stackData = cornerstoneTools.getToolState(this.element, 'stack');
    let currentStack = stackData.data[0];

    // TODO: we should make something like setToolState by an ID
    if (!currentStack) {
      const stack = {
        currentImageIdIndex: this.state.stack.currentImageIdIndex,
        imageIds: this.state.stack.imageIds
      };

      cornerstoneTools.addToolState(this.element, 'stack', stack);
    } else {
      currentStack.currentImageIdIndex = this.state.stack.currentImageIdIndex;
      currentStack.imageIds = this.state.stack.imageIds;
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
    console.log(event.detail);
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
    clearTimeout(this.loadHandlerTimeout);
    this.loadHandlerTimeout = setTimeout(() => {
      this.isLoading = true;
    }, loadIndicatorDelay);
  }

  doneLoadingHandler() {
    clearTimeout(this.loadHandlerTimeout);
    this.isLoading = false;
  }

  onMeasurementAdded() {
    console.log('onMeasurementAdded');
    // TODO: Allow this to be set by props,
    // call enforceSingleMeasurement for standard cases
    // Allow this to be set on a case level
  }
}

export default CornerstoneViewport;
