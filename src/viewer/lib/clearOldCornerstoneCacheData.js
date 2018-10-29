import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as cornerstoneTools from 'cornerstone-tools';

export default function clearOldCornerstoneCacheData() {
  console.warn('clearOldCornerstoneCacheData');
  // Purge the old image cache, we don't expect to ever load the same case again
  cornerstone.imageCache.purgeCache();

  // TODO: Check this. Not sure this is necessary, actually, since things should be decached anyway
  cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.purge();

  // Clear any old requests in the request pool
  cornerstoneTools.requestPoolManager.clearRequestStack('interaction');
  cornerstoneTools.requestPoolManager.clearRequestStack('prefetch');

  // Remove all tool data in the tool state manager
  cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState({});
}
