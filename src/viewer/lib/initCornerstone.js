import * as dicomParser from 'dicom-parser';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as cornerstoneTools from 'cornerstone-tools';
import Hammer from 'hammerjs';
import getAuthorizationHeader from '../../openid-connect/getAuthorizationHeader.js';

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

const config = {
  maxWebWorkers: navigator.hardwareConcurrency || 1,
  startWebWorkersOnDemand: true,
  webWorkerPath: 'cornerstoneWADOImageLoaderWebWorker.min.js',
  webWorkerTaskPaths: [],
  taskConfiguration: {
    decodeTask: {
      loadCodecsOnStartup: true,
      initializeCodecsOnStartup: false,
      codecsPath: 'cornerstoneWADOImageLoaderCodecs.min.js',
      usePDFJS: false,
      strict: false
    }
  }
};

cornerstoneTools.init();

window.cornerstone = cornerstone;
window.cornerstoneTools = cornerstoneTools;

cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

cornerstoneWADOImageLoader.configure({
  beforeSend: function(xhr, imageId, headers) {
    //delete headers.accept;

    const header = getAuthorizationHeader();

    // JPEG2000 Lossless Image Compression
    //const accept = 'multipart/related; type="image/jp2"';
    //const accept = 'multipart/related; type="application/octet-stream"; transfer-syntax="1.2.840.10008.1.2.1"';

    //xhr.setRequestHeader('Accept', accept);
    xhr.setRequestHeader('Authorization', header.Authorization);
  }
});

// Set the tool font and font size
// context.font = "[style] [variant] [weight] [size]/[line height] [font family]";
const fontFamily =
  'WorkSans, Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif';
cornerstoneTools.textStyle.setFont('16px ' + fontFamily);

// Set the tool width
cornerstoneTools.toolStyle.setToolWidth(2);

// Set color for inactive tools
cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)');

// Set color for active tools
cornerstoneTools.toolColors.setActiveColor('rgb(0, 255, 0)');

function metaDataProvider(type, imageId) {
  const metaData = cornerstoneWADOImageLoader.wadors.metaDataManager.get(
    imageId
  );

  if (
    metaData[type] !== undefined &&
    metaData[type].Value !== undefined &&
    metaData[type].Value.length
  ) {
    return metaData[type].Value[0];
  }

  if (type === 'instance') {
    return metaData;
  }
}

cornerstone.metaData.addProvider(metaDataProvider);
