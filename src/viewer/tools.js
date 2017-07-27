import Commands from './commands';

export default {
  active: '',
  toolsSelector: '.viewer-tools',
  deactivateActiveTool() {
    if (this.active) {
      this.deactivate(this.active);
      this.active = '';
    }
  },
  toggleTool(toolToActivate) {
    if (!toolToActivate) {
      return;
    }

    if (this.active) {
      this.deactivate(this.active);
    }

    cornerstoneTools[toolToActivate].enable(this.element);
    cornerstoneTools[toolToActivate].activate(this.element, 1);

    this.active = toolToActivate;
  },
  deactivate(tool) {
    cornerstoneTools[tool].disable(this.element);
    cornerstoneTools[tool].deactivate(this.element, 1);
  },
  initStackTool(imageIds) {
    const $thumb = $('.thumb');
    const stack = {
      currentImageIdIndex: 0,
      imageIds: imageIds
    };

    cornerstoneTools.addStackStateManager(this.element, ['stack']);
    cornerstoneTools.addToolState(this.element, 'stack', stack);
    cornerstoneTools.stackScrollWheel.activate(this.element);

    $thumb.css('width', (100/stack.imageIds.length) + '%');

    $(this.element).on('CornerstoneNewImage', function () {
      var currentIndex = stack.currentImageIdIndex;

      $thumb.css({
        'margin-left': ((100/stack.imageIds.length)*currentIndex) + '%'
      });
    });
  },
  attachEvents() {
    $(this.toolsSelector).on('click', 'a[data-tool]', event => {
      const $element = $(event.currentTarget);
      const tool = $element.attr('data-tool');

      $('.active').removeClass('active');

      this.toggleTool(tool);

      $element.addClass('active');
    });

    $('#conerstoneViewport').on('mousedown', () => {
      const lengths = cornerstoneTools.getToolState(this.element, 'length');

      if (lengths.data.length === 2) {
        lengths.data.shift();
        cornerstone.updateImage(this.element);
      }
    });
  },
  initTools(imageIds) {
    cornerstoneTools.mouseInput.enable(this.element);
    cornerstoneTools.pan.activate(this.element, 2);
    cornerstoneTools.zoom.activate(this.element, 4);
    cornerstoneTools.mouseWheelInput.enable(this.element);

    this.initStackTool(imageIds);

    // removing default context menu
    this.element.oncontextmenu = function (event) {
      event.preventDefault();

      return false;
    };

    this.attachEvents();
  }
};
