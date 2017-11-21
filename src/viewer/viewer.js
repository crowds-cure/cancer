import Files from './files';
import Tools from './tools';
import Commands from './commands';
import Menu from '../menu/menu';

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
      codecsPath: 'cornerstoneWADOImageLoaderCodecs.js',
      usePDFJS: false,
      strict: false,
    }
  }
};

cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

const IMAGE_LOADED_EVENT = 'cornerstoneimageloaded';

export default {
  $window: $(window),
  $viewer: $('.viewer-wrapper'),
  $overlay: $('.loading-overlay'),
  numImagesLoaded: 0,
  getNextCase() {
    this.$overlay.removeClass('invisible').addClass('loading');
    const enabledElement = cornerstone.getEnabledElement(this.element);

    Files.getCaseImages().then((imageIds) => {
        console.time('Loading All Images');
        
        this.numImagesLoaded = 0;
        cornerstone.events.removeEventListener(IMAGE_LOADED_EVENT);
        cornerstone.events.addEventListener(IMAGE_LOADED_EVENT, e => {
          this.numImagesLoaded += 1;
          console.log(this.numImagesLoaded / imageIds.length * 100);
          if (this.numImagesLoaded === imageIds.length) {
            console.timeEnd('Loading All Images');
          }
        });

        cornerstone.loadImage(imageIds[0]).then((image) => {
            this.$overlay.removeClass('loading').addClass('invisible');

            // Set the default viewport parameters
            const viewport = cornerstone.getDefaultViewport(enabledElement.canvas, image);
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
