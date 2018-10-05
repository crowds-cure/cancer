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
      const enabledElement = cornerstone.getEnabledElement(this.element);

      this.$loadingText.text('Retrieving case metadata...');
      Files.getCaseImages().then((brokenImageIds) => {
        const imageIds = brokenImageIds.map(imageId => {
          return imageId.replace('wadouris://', 'wadouri://');
        });

        this.$loadingText.text('Loading images...');
        console.time('Loading All Images');

        const loadingProgress = $('#loading-progress');
        let numImagesLoaded = 0;

        function handleImageLoaded() {
          numImagesLoaded += 1;
          const imagesLeft = imageIds.length - numImagesLoaded;
          loadingProgress.text(`${imagesLeft} images requested`);
          if (numImagesLoaded === imageIds.length) {
            console.timeEnd('Loading All Images');
            loadingProgress.text('');
          }
        }

        cornerstone.events.removeEventListener(IMAGE_LOADED_EVENT, handleImageLoaded);
        cornerstone.events.addEventListener(IMAGE_LOADED_EVENT, handleImageLoaded);

        Tools.initStackTool(imageIds);

        const bottomRight = $('.viewport #mrbottomright');
        const imageIndex = 1;
        bottomRight.text(`Image: ${imageIndex}/${imageIds.length}`);

        const currentViewport = cornerstone.getViewport(this.element);

        cornerstone.loadAndCacheImage(imageIds[0]).then((image) => {
          resolve();

          // Set the default viewport parameters
          // We need the new scale and translation parameters so the image fits properly
          const viewport = cornerstone.getDefaultViewport(enabledElement.canvas, image);
          // e.g. lung window
          //viewport.voi.windowWidth = 1500;
          //viewport.voi.windowCenter = -300;

          // Retain current window width and center
          if (currentViewport) {
            viewport.voi.windowWidth = currentViewport.voi.windowWidth;
            viewport.voi.windowCenter = currentViewport.voi.windowCenter;
          }

          cornerstone.displayImage(this.element, image, viewport);
          Tools.initTools(imageIds);

          this.$loadingText.text('');
        }, reject);
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

    const debounceCornerstoneResize = debounce(() => cornerstone.resize(this.element, true), 300);

    this.$window.off('resize', debounceCornerstoneResize);
    this.$window.on('resize', debounceCornerstoneResize);

    let loadHandlerTimeout;
    const loadIndicatorDelay = 25;
    const loadIndicator = $('#loadingIndicator');

    const startLoadingHandler = element => {
      clearTimeout(loadHandlerTimeout);
      loadHandlerTimeout = setTimeout(() => {
        loadIndicator.css('display', 'block');
      }, loadIndicatorDelay);
    };

    const doneLoadingHandler = element => {
      clearTimeout(loadHandlerTimeout);
      loadIndicator.css('display', 'none');
    };

    cornerstoneTools.loadHandlerManager.setStartLoadHandler(startLoadingHandler);
    cornerstoneTools.loadHandlerManager.setEndLoadHandler(doneLoadingHandler);

    // currentSeriesIndex = 0;//a hack to get series in order
    this.getNextCase().then(() => {
      this.$overlay.removeClass('loading').addClass('invisible');
    });
  }
}
