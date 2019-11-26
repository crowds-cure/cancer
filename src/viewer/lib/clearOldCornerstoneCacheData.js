import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as cornerstoneTools from 'cornerstone-tools';
import getImageIdsForSeries from './getImageIdsForSeries';

export default function clearOldCornerstoneCacheData(prefetchedCase) {
  if (!prefetchedCase) {
    // Purge the old image cache, we don't expect to ever load the same case again
    cornerstone.imageCache.purgeCache();

    // TODO: Check this. Not sure this is necessary, actually, since things should be decached anyway
    cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.purge();

    // Clear any old requests in the request pool
    cornerstoneTools.requestPoolManager.clearRequestStack('interaction');
    cornerstoneTools.requestPoolManager.clearRequestStack('prefetch');
  } else {
    const { imageCache } = cornerstone;
    const { seriesData } = prefetchedCase;
    const prefetchedImageIds = new Set(getImageIdsForSeries(seriesData));

    while (
      (imageCache.cachedImages.length) &&
      !prefetchedImageIds.has(imageCache.cachedImages[0].imageId)
    ) {
      const removedCachedImage = imageCache.cachedImages[0];
      imageCache.removeImageLoadObject(removedCachedImage.imageId);
    }
  }

  // Remove all tool data in the tool state manager
  cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState({});
}
