// Retrieve the tool state manager for this element
import guid from './guid.js';
import getUsername from './getUsername.js';
import dataURItoBlob from './dataUriToBlob.js';
import { getDB } from '../../db.js';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

function saveAttachment(measurement, response) {
  const { newImageIdSpecificToolStateManager } = cornerstoneTools;
  const offScreenToolStateMgr = newImageIdSpecificToolStateManager();
  const measurementsDB = getDB('measurements');
  const element = document.createElement('div');
  element.id = `offscreen-renderer-${measurement.id}`;

  const { imageId, toolType } = measurement;
  const tool = {
    name: 'Bidirectional',
    configuration: { shadow: true, drawHandlesOnHover: true }
  };

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

    cornerstone.disable(element);

    offScreenToolStateMgr.restoreToolState({});

    measurementsDB.putAttachment(
      response.id,
      'screenshot.jpeg',
      response.rev,
      imageBlob,
      'image/jpeg'
    );
  }

  cornerstone.enable(element);
  cornerstoneTools.setElementToolStateManager(element, offScreenToolStateMgr);

  const apiTool = cornerstoneTools[`${tool.name}Tool`];
  cornerstoneTools.addToolForElement(element, apiTool, tool.configuration);

  function firstRender() {
    element.removeEventListener(cornerstone.EVENTS.IMAGE_RENDERED, firstRender);
    element.addEventListener(
      cornerstone.EVENTS.IMAGE_RENDERED,
      createScreenshot
    );

    cornerstoneTools.setToolEnabledForElement(element, toolType);
    cornerstone.updateImage(element);
  }

  cornerstone.loadAndCacheImage(imageId).then(image => {
    const enabledElement = cornerstone.getEnabledElement(element);
    const { canvas } = enabledElement;
    canvas.width = 512;
    canvas.height = 512;

    measurement.active = false;
    Object.keys(measurement.handles).forEach(handle => {
      measurement.handles[handle].active = false;
      measurement.handles[handle].highlight = false;
    });

    const toolState = {};
    toolState[imageId] = {};
    toolState[imageId][toolType] = {
      data: [measurement]
    };

    offScreenToolStateMgr.restoreToolState(toolState);

    const viewport = cornerstone.getDefaultViewportForImage(element, image);

    // TODO: Update Viewport whenever the measurement changes
    if (measurement.viewport.voi) {
      viewport.voi = Object.assign({}, measurement.viewport.voi);
    }

    element.addEventListener(cornerstone.EVENTS.IMAGE_RENDERED, firstRender);
    cornerstone.displayImage(element, image, viewport);
  });
}

// TODO: Add Feedback
async function saveMeasurementToDatabase(caseData, measurements, feedback) {
  const measurementsDB = getDB('measurements');
  const annotator = await getUsername();

  measurements.forEach(async measurement => {
    const doc = {
      _id: guid(),
      measurement,
      annotator,
      skip: false,
      feedback,
      caseData: caseData.data,
      date: Math.floor(Date.now() / 1000),
      userAgent: navigator.userAgent
    };

    const response = await measurementsDB.put(doc);

    saveAttachment(measurement, response);
  });
}

export default saveMeasurementToDatabase;
