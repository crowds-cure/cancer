import Files from './files';
import Tools from './tools';
import Commands from './commands';
import Modal from '../modal/modal';

export default {
  submit() {
    $('.loading-overlay').removeClass('invisible').addClass('submitting');

    setTimeout(function () {
      Modal.show();

      $('.loading-overlay').removeClass('submitting');
    }, 2000);
  },
  initViewer() {
    const $window = $(window);
    const $submit = $('.viewer-actions button.submit');
    const $viewer = $('.viewer-wrapper');
    const $element = $('#conerstoneViewport')[0];

    Modal.init();

    $viewer.removeClass('invisible');

    Tools.$element = $element;
    Commands.$element = $element;

    $window.on('resize', () => cornerstone.resize($element, true));
    $submit.on('click', () => this.submit());

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
