import * as cornerstoneTools from 'cornerstone-tools';

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
