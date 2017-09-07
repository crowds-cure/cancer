import Files from './files';
import Tools from './tools';
import Commands from './commands';
import Menu from '../menu/menu';

export default {
  $window: $(window),
  $viewer: $('.viewer-wrapper'),
  $overlay: $('.loading-overlay'),

  getNextCase() {
    this.$overlay.removeClass('invisible').addClass('loading');

    Files.getCaseImages().then((imagesIds) => {
      console.log('test0');
      Tools.initTools(imagesIds);
      console.log('test1');
      Commands.initCommands();
      console.log('test2');

      cornerstone.loadImage(imagesIds[0]).then((image) => {
        console.log('test3');
        cornerstone.displayImage(this.$element, image);
        console.log('test4');

      });
    }).catch();
  },

  initViewer() {
    this.$element = $('#conerstoneViewport')[0];

    Menu.init();

    this.$viewer.removeClass('invisible');

    Tools.$element = this.$element;
    Commands.$element = this.$element;

    this.$window.on('resize', () => cornerstone.resize(this.$element, true));

    cornerstone.enable(this.$element);

    this.getNextCase();
  }
}
