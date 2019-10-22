export default function getAnnotationBoundingBox(handlesObject) {
  let xStart = Infinity;
  let yStart = Infinity;
  let xEnd = 0;
  let yEnd = 0;

  const handleKeys = Object.keys(handlesObject);

  if (!handleKeys.length) {
    return;
  }

  handleKeys.forEach(handleKey => {
    if (handleKey === 'textBox') {
      return;
    }

    const handle = handlesObject[handleKey];
    const handlesUndefined = handle.x === undefined || handle.y === undefined;
    if (handlesUndefined) {
      return;
    }

    xStart = Math.min(xStart, handle.x);
    yStart = Math.min(yStart, handle.y);
    xEnd = Math.max(xEnd, handle.x);
    yEnd = Math.max(yEnd, handle.y);
  });

  return {
    xStart,
    yStart,
    xEnd,
    yEnd
  };
}

// TODO: [layout] REMOVE
window.getAnnotationBoundingBox = getAnnotationBoundingBox;
