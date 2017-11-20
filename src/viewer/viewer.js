import Files from './files';
import Tools from './tools';
import Commands from './commands';
import Menu from '../menu/menu';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.$ = $;
cornerstoneTools.external.$ = $;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstone.external.$ = $;

export default {
  $window: $(window),
  $viewer: $('.viewer-wrapper'),
  $overlay: $('.loading-overlay'),

  getNextCase() {
    this.$overlay.removeClass('invisible').addClass('loading');

    Files.getCaseImages().then((imageIds) => {
        cornerstone.loadImage(imageIds[0]).then((image) => {
            this.$overlay.removeClass('loading').addClass('invisible');

            // Set the default viewport parameters
            const viewport = cornerstone.getDefaultViewport(this.element, image);
            // e.g. lung window
            //viewport.voi.windowWidth = 1500;
            //viewport.voi.windowCenter = -300;

            cornerstone.displayImage(this.element, image, viewport);
            Tools.initTools(imageIds);
        });
    });
  },

  initViewer() {
    this.element = $('#cornerstoneViewport')[0];

    Menu.init();

    this.$viewer.removeClass('invisible');

    Tools.element = this.element;
    Commands.element = this.element;
    Menu.element = this.element;

    Commands.initCommands();

    // TODO: Debounce the call to cornerstone.resize so this doesn't fire
    // too often
    this.$window.on('resize', () => cornerstone.resize(this.element, true));

    cornerstone.enable(this.element);

    // currentSeriesIndex = 0;//a hack to get series in order
    this.getNextCase();
  }
}
