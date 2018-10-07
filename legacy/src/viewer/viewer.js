import Files from './files.js';
import Tools from './tools.js';
import Commands from './commands.js';
import Menu from '../menu/menu.js';
import debounce from './debounce.js';

const IMAGE_LOADED_EVENT = 'cornerstoneimageloaded';

export default {
  $window: $(window),
  $viewer: $('.viewer-wrapper'),
  $overlay: $('.loading-overlay'),
  $loadingText: $('.loading-overlay .content .submit-text'),
  numImagesLoaded: 0,
  getNextCase() {
    return new Promise((resolve, reject) => {
      this.$loadingText.text('Retrieving case metadata...');
      Files.getCaseImages().then((brokenImageIds) => {
        const imageIds = brokenImageIds.map(imageId => {
          return imageId.replace('wadouris://', 'wadouri://');
        });



        Tools.initStackTool(imageIds);

        const bottomRight = $('.viewport #mrbottomright');
        const imageIndex = 1;
        bottomRight.text(`Image: ${imageIndex}/${imageIds.length}`);
      }, reject);
    });
  },

  initViewer() {
    this.$overlay.removeClass('invisible').addClass('loading');
    this.$loadingText.text('Initializing Viewer');
    this.element = $('#cornerstoneViewport')[0];

    $(document.body).css({
      position: 'fixed',
      overflow: 'hidden'
    });

    Menu.init();

    this.$viewer.removeClass('invisible');

    Tools.element = this.element;
    Commands.element = this.element;
    Menu.element = this.element;

    Commands.initCommands();

    // currentSeriesIndex = 0;//a hack to get series in order
    this.getNextCase().then(() => {
      this.$overlay.removeClass('loading').addClass('invisible');
    });
  }
}
