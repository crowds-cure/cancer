module.exports = {
  active: '',
  toolsSelector: '.viewer-tools',
  deactivateActiveTool: function () {
    if (this.active) {
      this.deactivate(this.active);
      this.active = '';
    }
  },
  toggleTool: function (toolToActivate) {
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
  deactivate: function (tool) {
    cornerstoneTools[tool].disable(this.element);
    cornerstoneTools[tool].deactivate(this.element, 1);
  },
  initStackTool: function (imageIds) {
    var $thumb = $('.thumb');
    var stack = {
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
  initTools: function (imageIds) {
    var self = this;

    cornerstoneTools.mouseInput.enable(this.element);
    cornerstoneTools.pan.activate(this.element, 2);
    cornerstoneTools.zoom.activate(this.element, 4);
    cornerstoneTools.mouseWheelInput.enable(this.element);

    this.initStackTool(imageIds);

    // removing default context menu
    this.element.oncontextmenu = function (evt) {
      evt.preventDefault();

      return false;
    };

    $(this.toolsSelector).on('click', 'a[data-tool]', function (evt) {
      $('.active').removeClass('active');

      var $element = $(this);
      var tool = $element.attr('data-tool');

      self.toggleTool(tool);

      $element.addClass('active');
    });
  }
};
