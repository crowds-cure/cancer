import Files from './files';
import Tools from './tools';
import Commands from './commands';

export default {
  initViewer() {
    const $viewer = $('.viewer-wrapper');
    const element = $('#conerstoneViewport')[0];

    $viewer.removeClass('invisible');

    cornerstone.registerImageLoader('example', Files.getExampleImage);

    Tools.element = element;
    Commands.element = element;

    $(window).on('resize', () => cornerstone.resize(element, true));

    cornerstone.enable(element);

    Tools.initTools(Files.imagesIds);
    Commands.initCommands();

    cornerstone.loadImage(Files.imagesIds[0]).then(function(image) {
      cornerstone.displayImage(element, image);
    });
  }
}
