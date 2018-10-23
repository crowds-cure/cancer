import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

export default function clearAll() {
  // Remove all imageId-specific measurements associated with this element
  cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState({});

  // Reset the viewport parameters (i.e. VOI LUT, scale, translation)
  cornerstone.reset(this.element);
}
