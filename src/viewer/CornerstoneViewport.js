import { Component } from 'react';
import React from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import './initCornerstone.js';

const EVENT_RESIZE = 'resize';

const stack = {
  imageIds: [
    'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032225.15.dcm',
    'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032227.21.dcm',
    'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.3.dcm'
  ],
  currentImageIdIndex: 0
};

const divStyle = {
  width: '512px',
  height: '512px',
  position: 'relative',
  color: 'white'
};

const bottomLeftStyle = {
  bottom: '5px',
  left: '5px',
  position: 'absolute',
  color: 'white'
};

const bottomRightStyle = {
  bottom: '5px',
  right: '5px',
  position: 'absolute',
  color: 'white'
};

class CornerstoneViewport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stack, //: props.stack,
      imageId: stack.imageIds[0]
    };

    this.state.viewport = cornerstone.getDefaultViewport(null, undefined);

    this.onImageRendered = this.onImageRendered.bind(this);
    this.onNewImage = this.onNewImage.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  render() {
    return (
      <>
        <div
          className="CornerstoneViewport viewportElement"
          onContextMenu={this.onContextMenu}
          style={divStyle}
          ref={input => {
            this.element = input;
          }}
        >
          <canvas className="cornerstone-canvas" />
          <div style={bottomLeftStyle}>Zoom: {this.state.viewport.scale}</div>
          <div style={bottomRightStyle}>
            WW/WC: {this.state.viewport.voi.windowWidth} /{' '}
            {this.state.viewport.voi.windowCenter}
          </div>
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
    cornerstone.resize(this.element);
  }

  onImageRendered() {
    const viewport = cornerstone.getViewport(this.element);
    console.log(viewport);

    this.setState({
      viewport
    });

    console.log(this.state.viewport);
  }

  onNewImage() {
    const enabledElement = cornerstone.getEnabledElement(this.element);

    this.setState({
      imageId: enabledElement.image.imageId
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
        'cornerstoneimagerendered',
        this.onImageRendered
      );

      element.addEventListener(cornerstone.EVENTS.NEW_IMAGE, this.onNewImage);
      element.addEventListener(
        cornerstoneTools.EVENTS.STACK_SCROLL,
        this.onStackScroll
      );
      window.addEventListener(EVENT_RESIZE, this.onWindowResize);
    });
  }

  componentWillUnmount() {
    const element = this.element;
    element.removeEventListener(
      'cornerstoneimagerendered',
      this.onImageRendered
    );

    element.removeEventListener(cornerstone.EVENTS.NEW_IMAGE, this.onNewImage);
    element.removeEventListener(
      cornerstoneTools.EVENTS.STACK_SCROLL,
      this.onStackScroll
    );
    window.removeEventListener(EVENT_RESIZE, this.onWindowResize);

    cornerstone.disable(element);
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
    const stack = cornerstoneTools.getToolState(element, 'stack');
    const stackData = stack.data[0];
    const imageIndex = stackData.currentImageIdIndex + 1;

    // TODO: put this on-screen somewhere?
    console.log(`Image: ${imageIndex}/${stackData.imageIds.length}`);
  }
}

export default CornerstoneViewport;
