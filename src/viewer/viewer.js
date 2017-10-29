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

        // Seems like tools needs to be updated (not init'd) with new ids
        Tools.initTools(imagesIds);

        // Commands.initCommands();

        cornerstone.loadImage(imagesIds[0]).then((image) => {
            cornerstone.displayImage(this.$element, image);
        });
    }).catch();
  },

  initViewer() {
    this.$element = $('#conerstoneViewport')[0];

    Menu.init();

    this.$viewer.removeClass('invisible');

    Tools.$element = this.$element;
    Commands.$element = this.$element;
    Menu.$element = this.$element;

    Commands.initCommands();

    this.$window.on('resize', () => cornerstone.resize(this.$element, true));

    cornerstone.enable(this.$element);

    // currentSeriesIndex = 0;//a hack to get series in order
    this.getNextCase();
  }
}
