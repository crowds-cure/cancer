import getUsername from './getUsername.js';

export default function skipCase() {
  const stack = cornerstoneTools.getToolState(this.element, 'stack');

  const sliceIndex = stack.data[0].currentImageIdIndex;
  const annotator = getUsername();

  getUUID().then(uuid => {
    const doc = {
      _id: uuid,
      skip: true,
      annotator,
      seriesUID: window.rsnaCrowdQuantSeriesUID,
      instanceUID: window.rsnaCrowdQuantCaseStudy.instanceUIDs[sliceIndex],
      instanceURL: window.rsnaCrowdQuantCaseStudy.urls[sliceIndex],
      sliceIndex,
      date: Math.floor(Date.now() / 1000),
      userAgent: navigator.userAgent
    };

    return measurementsDB.put(doc);
  });
}
