import Files from './files';
import Tools from './tools';
import Commands from './commands';
import Menu from '../menu/menu';
import debounce from './debounce';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.$ = $;
cornerstoneTools.external.$ = $;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstone.external.$ = $;

const config = {
  maxWebWorkers: navigator.hardwareConcurrency || 1,
  startWebWorkersOnDemand: true,
  webWorkerPath: 'node_modules/cornerstone-wado-image-loader/dist/cornerstoneWADOImageLoaderWebWorker.min.js',
  webWorkerTaskPaths: [],
  taskConfiguration: {
    decodeTask: {
      loadCodecsOnStartup: true,
      initializeCodecsOnStartup: false,
      codecsPath: 'cornerstoneWADOImageLoaderCodecs.min.js',
      usePDFJS: false,
      strict: false,
    }
  }
};

const IMAGE_LOADED_EVENT = 'cornerstoneimageloaded';

export default {
  $window: $(window),
  $viewer: $('.viewer-wrapper'),
  $overlay: $('.loading-overlay'),
  $loadingText: $('.loading-overlay .content .submit-text'),
  numImagesLoaded: 0,
  getNextCase() {
    // Purge the old image cache, we don't expect to ever load the same case again
    cornerstone.imageCache.purgeCache();

    // TODO: Check this. Not sure this is necessary, actually, since things should be decached anyway
    cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.purge();

    // Clear any old requests in the request pool
    cornerstoneTools.requestPoolManager.clearRequestStack('interaction');
    cornerstoneTools.requestPoolManager.clearRequestStack('prefetch');

    // TODO: Cancel all ongoing requests

    // Remove all tool data in the tool state manager
    cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState({});

    return new Promise((resolve, reject) => {
      const enabledElement = cornerstone.getEnabledElement(this.element);

      this.$loadingText.text('Retrieving case metadata...');
      Files.getCaseImages().then((imageIds) => {
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

    Menu.init();

    this.$viewer.removeClass('invisible');

    Tools.element = this.element;
    Commands.element = this.element;
    Menu.element = this.element;

    Commands.initCommands();

    const debounceCornerstoneResize = debounce(() => cornerstone.resize(this.element, true), 300);

    this.$window.off('resize', debounceCornerstoneResize);
    this.$window.on('resize', debounceCornerstoneResize);

    cornerstone.enable(this.element);

    // Listen for changes to the viewport so we can update the text overlays in the corner
    const bottomLeft = $('.viewport #mrbottomrightWWWC');
    function onImageRendered(e) {
        const viewport = e.detail.viewport;
        bottomLeft.text("WW/WC: " + Math.round(viewport.voi.windowWidth) + "/" + Math.round(viewport.voi.windowCenter));
    };

    this.element.removeEventListener('cornerstoneimagerendered', onImageRendered);
    this.element.addEventListener('cornerstoneimagerendered', onImageRendered);

    const bottomRight = $('.viewport #mrbottomrightImageIndex');
    function onStackScroll(e) {
      const element = e.target;
      const stack = cornerstoneTools.getToolState(element, 'stack');
      const stackData = stack.data[0];
      const imageIndex = stackData.currentImageIdIndex + 1;
      bottomRight.text(`Image: ${imageIndex}/${stackData.imageIds.length}`);
    };

    this.element.removeEventListener('cornerstonestackscroll', onStackScroll);
    this.element.addEventListener('cornerstonestackscroll', onStackScroll);

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
