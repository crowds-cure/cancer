import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

export default function getImageIdsForSeries(seriesData) {
  if (!seriesData || !seriesData.length) {
    return [];
  }

  let seriesInstances = seriesData[0];

  // Broken in IE?
  if (typeof seriesInstances === 'string') {
    seriesInstances = JSON.parse(seriesInstances);
  }

  let imageIds = seriesInstances.map(instance => {
    // TODO: use this
    //const numberOfFrames = instance['00280008'].Value;

    instance['7FE00010'].BulkDataURI = instance[
      '7FE00010'
    ].BulkDataURI.replace('http://', 'https://');

    const imageId =
      'wadors:' + instance['7FE00010'].BulkDataURI + '/frames/1';

    const instanceLowerCaseKeys = {};
    Object.keys(instance).forEach(key => {
      instanceLowerCaseKeys[key.toLowerCase()] = instance[key];
    });

    cornerstoneWADOImageLoader.wadors.metaDataManager.add(
      imageId,
      instanceLowerCaseKeys
    );

    return imageId;
  });

  imageIds = imageIds.sort((a, b) => {
    const instanceA = cornerstone.metaData.get('instance', a);
    const instanceB = cornerstone.metaData.get('instance', b);
    const instanceNumberA = instanceA['00200013'].Value[0];
    const instanceNumberB = instanceB['00200013'].Value[0];

    return instanceNumberA - instanceNumberB;
  });

  return imageIds;
}
