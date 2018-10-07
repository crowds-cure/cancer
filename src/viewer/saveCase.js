// Retrieve the tool state manager for this element
import ErrorModal from '../../legacy/src/errorModal/modal';
import getUsername from './getUsername.js';
import dataURItoBlob from './dataURItoBlob.js';

const toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;

function saveAttachment(response) {
  const dataURI = canvas.toDataURL();
  const canvas = document.querySelector('#cornerstoneViewport canvas');

  const imageBlob = dataURItoBlob(dataURI);

  return measurementsDB.putAttachment(
    response.id,
    'screenshot.png',
    response.rev,
    imageBlob,
    'image/png'
  );
}

async function saveCase() {
  const annotator = getUsername();

  // Dump all of its tool state into an Object
  const toolState = toolStateManager.saveToolState();

  // Get the stack tool data
  const stackData = cornerstoneTools.getToolState(this.element, 'stack');
  const stack = stackData.data[0];

  // Retrieve the length data from this Object
  let lengthData = [];
  Object.keys(toolState).forEach(imageId => {
    if (
      !toolState[imageId]['length'] ||
      !toolState[imageId]['length'].data.length
    ) {
      return;
    }

    lengthData.push({
      imageIndex: stack.imageIds.indexOf(imageId),
      data: toolState[imageId].length
    });
  });

  if (!lengthData.length) {
    // console.log('ErrorModal', ErrorModal);
    ErrorModal.show();
    this.$loadingText.text('');
    this.$overlay.removeClass('loading').addClass('invisible');
    return;
  }

  if (lengthData.length > 1) {
    throw new Error('Only one length measurement should be in the lengthData');
  }

  console.time('getUUID');
  return getUUID()
    .then(uuid => {
      console.timeEnd('getUUID');
      console.time('PUT to Measurement DB');
      const measurement = lengthData[0];
      const lengthMeasurement = measurement.data.data[0];

      cornerstoneTools.scrollToIndex(this.element, measurement.imageIndex);

      const doc = {
        _id: uuid,
        length: lengthMeasurement.length,
        start_x: lengthMeasurement.handles.start.x,
        start_y: lengthMeasurement.handles.start.y,
        end_x: lengthMeasurement.handles.end.x,
        end_y: lengthMeasurement.handles.end.y,
        windowWidth: lengthMeasurement.windowWidth,
        windowCenter: lengthMeasurement.windowCenter,
        scale: lengthMeasurement.scale,
        translation_x: lengthMeasurement.translation.x,
        translation_y: lengthMeasurement.translation.y,
        annotator,
        seriesUID: window.rsnaCrowdQuantSeriesUID,
        instanceUID:
          window.rsnaCrowdQuantCaseStudy.instanceUIDs[measurement.imageIndex],
        instanceURL:
          window.rsnaCrowdQuantCaseStudy.urls[measurement.imageIndex],
        sliceIndex: measurement.imageIndex,
        date: Math.floor(Date.now() / 1000),
        userAgent: navigator.userAgent
      };

      return measurementsDB.put(doc);
    })
    .then(saveAttachment);
}

export default saveCase;
