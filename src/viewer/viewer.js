import Files from './files';
import Tools from './tools';
import Commands from './commands';
import Menu from '../menu/menu';

export default {
  initViewer() {
    const $window = $(window);
    const $viewer = $('.viewer-wrapper');
    const $element = $('#conerstoneViewport')[0];

    Menu.init();

    $viewer.removeClass('invisible');

    Tools.$element = $element;
    Commands.$element = $element;

    $window.on('resize', () => cornerstone.resize($element, true));

    cornerstone.enable($element);

    Files.getCaseImages().then(function (imagesIds) {
      Tools.initTools(imagesIds);
      Commands.initCommands();

      cornerstone.loadImage(imagesIds[0]).then(function(image) {
        cornerstone.displayImage($element, image);
      });
    }).catch();
  }
}
