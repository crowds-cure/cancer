export default {
  commandSelector: '.viewer-tools',
  clearAll() {
    const enabledElemet = cornerstone.getEnabledElement(this.element);
    const viewport = cornerstone.getViewport(this.element);

    viewport.voi.windowWidth = enabledElemet.image.windowWidth;
    viewport.voi.windowCenter = enabledElemet.image.windowCenter;
    cornerstone.setViewport(this.element, viewport);

    cornerstoneTools.globalImageIdSpecificToolStateManager.clear(this.element);
    cornerstone.updateImage(this.element);
  },
  initCommands() {
    $(this.commandSelector).on('click', 'a[data-command]', event => {
      const $element = $(event.currentTarget);
      const tool = $element.attr('data-command');

      this[tool]();

      $element.addClass('active');

      setTimeout(function() {
        $element.removeClass('active');
      }, 300);
    });
  }
};
