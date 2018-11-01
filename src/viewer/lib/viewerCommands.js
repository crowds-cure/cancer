import * as cornerstone from 'cornerstone-core';

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
  }
};

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

  setWLPresetLung: function(element) {
    this.setWLPreset(element, 'Lung');
  },

  setWLPresetLiver: function(element) {
    this.setWLPreset(element, 'Liver');
  },

  setWLPresetSoftTissue: function(element) {
    this.setWLPreset(element, 'SoftTissue');
  }
};

export default viewerCommands;
