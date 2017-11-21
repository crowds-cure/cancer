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

cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

export default {
  $window: $(window),
  $viewer: $('.viewer-wrapper'),
  $overlay: $('.loading-overlay'),

  getNextCase() {
    this.$overlay.removeClass('invisible').addClass('loading');
    const enabledElement = cornerstone.getEnabledElement(this.element);

    Files.getCaseImages().then((imageIds) => {
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
    
    this.$window.on('resize', debounce(() => cornerstone.resize(this.element, true), 300));

    cornerstone.enable(this.element);

    // currentSeriesIndex = 0;//a hack to get series in order
    this.getNextCase();
  }
}
