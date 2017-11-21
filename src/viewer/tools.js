const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default {
  active: undefined,
  toolsSelector: '.viewer-tools',
  $cornerstoneViewport: $('#cornerstoneViewport'),
  deactivateActiveTool() {
    if (this.active) {
      this.deactivate(this.active);
      this.active = undefined;
    }
  },

  toggleTool(toolToActivate) {
    if (!toolToActivate) {
      return;
    }

    if (isMobile) {
      if (toolToActivate === 'length') {
        toolToActivate = `${toolToActivate}Touch`;
      } else {
        toolToActivate = `${toolToActivate}TouchDrag`;
      }
    }

    if (this.active) {
      this.deactivate(this.active);
    }

    cornerstoneTools[toolToActivate].activate(this.element, 1);

    this.active = toolToActivate;
  },

  deactivate(tool) {
    cornerstoneTools[tool].deactivate(this.element, 1);
  },

  initStackTool(imageIds) {
    const stack = {
      currentImageIdIndex: 0,
      imageIds: imageIds
    };

    // Clear any previous tool state
    cornerstoneTools.clearToolState(this.element, 'stack');

    // Disable stack prefetch in case there are still queued requests
    cornerstoneTools.stackPrefetch.disable(this.element);

    cornerstoneTools.addStackStateManager(this.element, ['stack']);
    cornerstoneTools.addToolState(this.element, 'stack', stack);
    cornerstoneTools.stackPrefetch.enable(this.element);


    // TODO: Replace this with an HTML5 Range Input
    const $thumb = $('.thumb');
    $thumb.css('height', `${(100/stack.imageIds.length)}%`);
    $(this.element).on('CornerstoneNewImage', function () {
      var currentIndex = stack.currentImageIdIndex;

      $thumb.css({
        'margin-top': `${($thumb.height()*(currentIndex))}px`
      });
    });
  },

  initInteractionTools() {
    /*
    For touch devices, by default we activate:
    - Pinch to zoom
    - Two-finger Pan
    - Three (or more) finger Stack Scroll

    We also enable the Length tool so it is always visible
     */
    cornerstoneTools.zoomTouchPinch.activate(this.element);
    cornerstoneTools.panMultiTouch.activate(this.element);
    cornerstoneTools.stackScrollMultiTouch.activate(this.element);
    cornerstoneTools.length.enable(this.element);

    /* For mouse devices, by default we turn on:
    - Stack scrolling by mouse wheel
    - Stack scrolling by keyboard up / down arrow keys
    - Pan with middle click
    - Zoom with right click
     */
    cornerstoneTools.stackScrollWheel.activate(this.element);
    cornerstoneTools.stackScrollKeyboard.activate(this.element);
    cornerstoneTools.pan.activate(this.element, 2);
    cornerstoneTools.zoom.activate(this.element, 4);


    /*
    Set the tool color
     */
    cornerstoneTools.toolColors.setActiveColor('greenyellow');
    cornerstoneTools.toolColors.setToolColor('white');
  },

  attachEvents() {
    // Extract which tool we are using and activating it
    $(this.toolsSelector).on('click', 'a[data-tool]', event => {
      const $element = $(event.currentTarget);

      const tool = $element.attr('data-tool');

      $('.active').removeClass('active');

      this.toggleTool(tool);

      $element.parent().addClass('active');
    });

    // Limiting measurements to 1
    const handleMeasurementAdded = (event) => {
      // Only handle Length measurements
      const toolType = 'length';
      if (event.detail.toolType !== toolType) {
        return;
      }

      // Retrieve the current image
      const image = cornerstone.getImage(event.detail.element);
      const currentImageId = image.imageId;

      // When a new measurement is added, retrieve the current tool state
      const toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;
      const toolState = toolStateManager.saveToolState();

      // Loop through all of the images (toolState is keyed by imageId)
      let allLengths = [];
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

        // Re-save this data into the toolState object
        toolState[currentImageId][toolType].data = lengthMeasurements;
      }

      // Restore toolState into the toolStateManager
      toolStateManager.restoreToolState(toolState);

      // Update the image
      cornerstone.updateImage(this.element);
    };

    this.element.removeEventListener('cornerstonetoolsmeasurementadded', handleMeasurementAdded);
    this.element.addEventListener('cornerstonetoolsmeasurementadded', handleMeasurementAdded);
  },

  initTools(imageIds) {
    // Clear all old tool data
    cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState({});

    cornerstoneTools.mouseInput.enable(this.element);
    cornerstoneTools.touchInput.enable(this.element);
    cornerstoneTools.mouseWheelInput.enable(this.element);
    cornerstoneTools.keyboardInput.enable(this.element);

    this.initStackTool(imageIds);

    // Set the element to focused, so we can properly handle keyboard events
    $(this.element).attr("tabindex", 0).focus();

    this.initInteractionTools();

    // removing default context menu
    this.element.oncontextmenu = function (event) {
      event.preventDefault();

      return false;
    };

    this.attachEvents();
  }
};
