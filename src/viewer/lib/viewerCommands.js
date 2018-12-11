import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as dcmjs from 'dcmjs';
import saveAs from 'file-saver';

const scroll = cornerstoneTools.import('util/scroll');

const defaultWlPresets = {
  SoftTissue: {
    wc: 40,
    ww: 400
  },
  Lung: {
    wc: -600,
    ww: 1500
  },
  Liver: {
    wc: 90,
    ww: 150
  },
  Brain: {
    wc: 40,
    ww: 80
  }
};

function getActiveElement() {
  const enabledElements = cornerstone.getEnabledElements();
  if (!enabledElements || !enabledElements.length) {
    return;
  }

  const element = enabledElements[0].element;

  return element;
}

const viewerCommands = {
  setWL: function(element, windowWidth, windowCenter) {
    const viewport = cornerstone.getViewport(element);
    if (!viewport) {
      return;
    }

    viewport.voi.windowWidth = windowWidth;
    viewport.voi.windowCenter = windowCenter;

    cornerstone.updateImage(element);
  },

  setWLPreset: function(element, presetName) {
    const preset = defaultWlPresets[presetName];
    this.setWL(element, preset.ww, preset.wc);
  },

  setWLPresetLung: function(element = getActiveElement()) {
    this.setWLPreset(element, 'Lung');
  },

  setWLPresetLiver: function(element = getActiveElement()) {
    this.setWLPreset(element, 'Liver');
  },

  setWLPresetBrain: function(element = getActiveElement()) {
    this.setWLPreset(element, 'Brain');
  },

  setWLPresetSoftTissue: function(element = getActiveElement()) {
    this.setWLPreset(element, 'SoftTissue');
  },

  reset: function(element = getActiveElement()) {
    cornerstone.reset(element);
  },

  downloadDICOMStructuredReport: function(element = getActiveElement()) {
    debugger;
    console.log('downloadDICOMStructuredReport');
    console.log(cornerstoneTools.globalImageIdSpecificToolStateManager);
    const toolState = cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState();

    const { MeasurementReport } = dcmjs.adapters.Cornerstone;

    const report = MeasurementReport.generateReport(
      toolState,
      cornerstone.metaData
    );
    const reportBlob = dcmjs.data.datasetToBlob(report.dataset);
    console.log(reportBlob);
    saveAs(reportBlob, 'dicomSR.dcm');
  },

  scrollActiveElement: function(scrollAmount) {
    const element = getActiveElement();
    if (!element) {
      return;
    }

    scroll(element, scrollAmount);
  }
};

export default viewerCommands;
