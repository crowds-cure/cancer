module.exports = {
  commandSelector: '.viewer-tools',
  clearAll: function () {
    var enabledElemet = cornerstone.getEnabledElement(this.element);
    var viewport = cornerstone.getViewport(this.element);

    viewport.voi.windowWidth = enabledElemet.image.windowWidth;
    viewport.voi.windowCenter = enabledElemet.image.windowCenter;
    cornerstone.setViewport(this.element, viewport);

    cornerstoneTools.globalImageIdSpecificToolStateManager.clear(this.element);
    cornerstone.updateImage(this.element);
  },
  initCommands: function () {
    var self = this;

    $(this.commandSelector).on('click', 'a[data-command]', function (evt) {
      var $element = $(this);
      var tool = $element.attr('data-command');

      self[tool]();

      $element.addClass('active');

      setTimeout(function() {
        $element.removeClass('active');
      }, 300);
    });
  }
};
