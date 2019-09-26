// Source: https://github.com/bameyrick/js-easing-functions/blob/master/src/index.ts
function easeInOutSine(elapsed, duration) {
  return (-1 / 2) * (Math.cos((Math.PI * elapsed) / duration) - 1);
}

export default function animate(duration, callback) {
  const startTime = Date.now();
  let lastFramePerformed = false;

  function tick() {
    const elapsed = Date.now() - startTime;
    const progress = easeInOutSine(elapsed, duration);

    callback(progress);

    if (elapsed < duration) {
      requestAnimationFrame(tick);
    } else if (!lastFramePerformed) {
      lastFramePerformed = true;
      callback(1);
    }
  }

  tick();
}
