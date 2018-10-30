// Retrieve the tool state manager for this element
import guid from './guid.js';
import getUsername from './getUsername.js';
import dataURItoBlob from './dataUriToBlob.js';
import { getDB } from '../../db.js';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

function saveAttachment(measurement, response) {
  const measurementsDB = getDB('measurements');
  const element = document.createElement('offscreen-renderer');

  function createScreenshot(event) {
    // JPEG Image Quality
    const encoderOptions = 0.9;
    const { enabledElement } = event.detail;
    const { element, canvas } = enabledElement;
    const dataURI = canvas.toDataURL('image/jpeg', encoderOptions);
    const imageBlob = dataURItoBlob(dataURI);

    element.removeEventListener(
      cornerstone.EVENTS.IMAGE_RENDERED,
      createScreenshot
    );

    measurementsDB.putAttachment(
      response.id,
      'screenshot.jpeg',
      response.rev,
      imageBlob,
      'image/png'
    );
  }

  // TODO: double check that the tool is actually rendered in this
  // frame
  element.addEventListener(cornerstone.EVENTS.IMAGE_RENDERED, createScreenshot);

  cornerstone.loadAndCacheImage(measurement.imageId).then(image => {
    // TODO: Switch to Bidirectional
    cornerstoneTools.setToolEnabled('BidirectionalTool');

    cornerstone.displayImage(image, element);
  });
}

// TODO: Add Feedback
async function saveMeasurementToDatabase(caseData, measurements) {
  const measurementsDB = getDB('measurements');
  const annotator = await getUsername();

  const doc = {
    _id: guid(),
    measurements,
    annotator,
    skip: false,
    caseData: caseData.data,
    date: Math.floor(Date.now() / 1000),
    userAgent: navigator.userAgent
  };

  const response = await measurementsDB.put(doc);

  console.time('saveAttachment to Measurement DB');
  measurements.forEach(measurement => {
    saveAttachment(measurement, response);
  });

  console.timeEnd('saveAttachment to Measurement DB');
}

export default saveMeasurementToDatabase;
