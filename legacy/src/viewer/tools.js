import * as cornerstoneTools from 'cornerstone-tools';

import debounce from './debounce';

const tools = {
  pan: {
    mouse: cornerstoneTools.pan,
    touch: cornerstoneTools.panTouchDrag
  },
  wwwc: {
    mouse: cornerstoneTools.wwwc,
    touch: cornerstoneTools.wwwcTouchDrag
  },
  stackScroll: {
    mouse: cornerstoneTools.stackScroll,
    touch: cornerstoneTools.stackScrollTouchDrag
  },
  length: {
    mouse: cornerstoneTools.length,
    touch: cornerstoneTools.lengthTouch
  },
  zoom: {
    mouse: cornerstoneTools.zoom,
    touch: cornerstoneTools.zoomTouchDrag
  },
  stackScroll: {
    mouse: cornerstoneTools.stackScroll,
    touch: cornerstoneTools.stackScrollTouchDrag
  }
};

export default {
  active: undefined,
  toolsSelector: '.viewer-tools',
  $cornerstoneViewport: $('#cornerstoneViewport'),
  toggleTool(toolToActivate) {
    console.log(`toggleTool ${toolToActivate}`);
    if (!toolToActivate) {
      return;
    }

    const element = this.element;

    if (this.active) {
      const previousMouseTool = tools[this.active].mouse;
      const previousTouchTool = tools[this.active].touch;
      previousMouseTool.deactivate(element, 1);
      previousTouchTool.deactivate(element);
    }

    const mouseTool = tools[toolToActivate].mouse;
    const touchTool = tools[toolToActivate].touch;

    if (toolToActivate === 'pan') {
      // If the user has selected the pan tool, activate it for both left and middle
      // 3 means left mouse button and middle mouse button
      cornerstoneTools.pan.activate(element, 3);
      cornerstoneTools.zoom.activate(element, 4);
    } else if (toolToActivate === 'zoom') {
      // If the user has selected the zoom tool, activate it for both left and right
      // 5 means left mouse button and right mouse button
      cornerstoneTools.zoom.activate(element, 5);
      cornerstoneTools.pan.activate(element, 2);
    } else {
      // Otherwise, active the tool on left mouse, pan on middle, and zoom on right
      mouseTool.activate(element, 1);
      cornerstoneTools.pan.activate(element, 2);
      cornerstoneTools.zoom.activate(element, 4);
    }

    touchTool.activate(element);

    this.active = toolToActivate;

    // Set the element to focused, so we can properly handle keyboard events
    $(this.element).attr('tabindex', 0).focus();
  },

  initStackTool(imageIds) {
    const $slider = $('.imageSlider');
    const slider = $slider[0];
    const stack = {
      currentImageIdIndex: 0,
      imageIds: imageIds
    };

    // Init slider configurations
    slider.min = 0;
    slider.max = stack.imageIds.length - 1;
    slider.step = 1;
    slider.value = stack.currentImageIdIndex;

    const element = this.element;
    const slideTimeoutTime = 5;
    let slideTimeout;

    // Adding input listener
    function selectImage(event) {
      // Note that we throttle requests to prevent the
      // user's ultrafast scrolling from firing requests too quickly.
      clearTimeout(slideTimeout);
      slideTimeout = setTimeout(() => {
        const newImageIdIndex = parseInt(event.currentTarget.value, 10);
        cornerstoneTools.scrollToIndex(element, newImageIdIndex);
      }, slideTimeoutTime);
    }

    $slider.off('input', selectImage);
    $slider.on('input', selectImage);

    // Setting the slider size
    const height = this.$cornerstoneViewport.height() - 60;
    $slider.css('width', `${height}px`);

    const debounceWindowResizeHandler = debounce(() => {
      const height = this.$cornerstoneViewport.height() - 60;
      $slider.css('width', `${height}px`)
    }, 150);

    $(window).off('resize', debounceWindowResizeHandler);
    $(window).on('resize', debounceWindowResizeHandler);

    // Listening to viewport stack image change, so the slider is synced
    const cornerstoneStackScrollHandler = function () {
      // Update the slider value
      slider.value = stack.currentImageIdIndex;
    };

    this.$cornerstoneViewport[0].removeEventListener('cornerstonestackscroll', cornerstoneStackScrollHandler);
    this.$cornerstoneViewport[0].addEventListener('cornerstonestackscroll', cornerstoneStackScrollHandler);
  },

  toolClickHandler(event) {
    const $element = $(event.currentTarget);
    const tool = $element.attr('data-tool');

    $('.active').removeClass('active');

    this.toggleTool(tool);

    $element.addClass('active');
  },

  attachEvents() {
    // Extract which tool we are using and activating it
    $(this.toolsSelector).off('click', 'div[data-tool]', this.toolClickHandler.bind(this));
    $(this.toolsSelector).on('click', 'div[data-tool]', this.toolClickHandler.bind(this));

    // Limiting measurements to 1
    function handleMeasurementAdded (event) {
      // Only handle Length measurements
      const toolType = 'length';
      if (event.detail.toolType !== toolType) {
        return;
      }

      // Retrieve the current image
      const element = event.detail.element;
      const image = cornerstone.getImage(element);
      const viewport = cornerstone.getViewport(element);
      const currentImageId = image.imageId;

      // When a new measurement is added, retrieve the current tool state
      const toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;
      const toolState = toolStateManager.saveToolState();

      // Loop through all of the images (toolState is keyed by imageId)
      Object.keys(toolState).forEach(imageId => {
        // Delete all length measurements on images that are not the
        // current image
        if (imageId !== currentImageId) {
          delete toolState[imageId][toolType];
        }
      });

      // Retrieve all of the length measurements on the current image
      const lengthMeasurements = toolState[currentImageId][toolType].data;

      // If there is more than length measurement, remove the oldest one
      if (lengthMeasurements.length > 1) {
        lengthMeasurements.shift();
      }

      // Add some viewport details to the length measurement data
      lengthMeasurements[0].windowWidth = viewport.voi.windowWidth;
      lengthMeasurements[0].windowCenter = viewport.voi.windowCenter;
      lengthMeasurements[0].scale = viewport.scale;
      lengthMeasurements[0].translation = viewport.translation;

      // Re-save this data into the toolState object
      toolState[currentImageId][toolType].data = lengthMeasurements;

      // Restore toolState into the toolStateManager
      toolStateManager.restoreToolState(toolState);

      // Update the image
      cornerstone.updateImage(element);
    }

    this.element.removeEventListener('cornerstonetoolsmeasurementadded', handleMeasurementAdded);
    this.element.addEventListener('cornerstonetoolsmeasurementadded', handleMeasurementAdded);
  },

  initTools(imageIds) {
    // If a previously active tool exists, re-enable it.
    // If not, use wwwc
    const toolToActivate = this.active || 'wwwc';
    this.toggleTool(toolToActivate);

    // Remove the 'active' highlight from the other tools
    $(`${this.toolsSelector} .active`).removeClass('.active');

    // Add it to our desired tool
    $(`${this.toolsSelector} div[data-tool=${toolToActivate}]`).addClass('active');

    this.attachEvents();
  }
};
