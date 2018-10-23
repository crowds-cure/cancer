// Limiting measurements to 1
export default function enforceSingleMeasurement(event) {
  // Only handle Length measurements
  const toolType = 'length';
  if (event.detail.toolType !== toolType) {
    return;
  }

  // Retrieve the current image
  const element = event.detail.element;
  const image = cornerstone.getImage(element);
  const viewport = cornerstone.getViewport(element);
  const currentImageId = image.imageId;

  // When a new measurement is added, retrieve the current tool state
  const toolStateManager =
    cornerstoneTools.globalImageIdSpecificToolStateManager;
  const toolState = toolStateManager.saveToolState();

  // Loop through all of the images (toolState is keyed by imageId)
  Object.keys(toolState).forEach(imageId => {
    // Delete all length measurements on images that are not the
    // current image
    if (imageId !== currentImageId) {
      delete toolState[imageId][toolType];
    }
  });

  // Retrieve all of the length measurements on the current image
  const lengthMeasurements = toolState[currentImageId][toolType].data;

  // If there is more than length measurement, remove the oldest one
  if (lengthMeasurements.length > 1) {
    lengthMeasurements.shift();
  }

  // Add some viewport details to the length measurement data
  lengthMeasurements[0].windowWidth = viewport.voi.windowWidth;
  lengthMeasurements[0].windowCenter = viewport.voi.windowCenter;
  lengthMeasurements[0].scale = viewport.scale;
  lengthMeasurements[0].translation = viewport.translation;

  // Re-save this data into the toolState object
  toolState[currentImageId][toolType].data = lengthMeasurements;

  // Restore toolState into the toolStateManager
  toolStateManager.restoreToolState(toolState);

  // Update the image
  cornerstone.updateImage(element);
}
