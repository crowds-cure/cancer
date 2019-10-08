function getDurationInMs(durationString) {
  if (typeof durationString !== 'string') {
    return 0;
  }

  const duration = parseFloat(durationString);
  if (durationString.indexOf('ms') >= 0) {
    return duration;
  } else {
    return duration * 1000;
  }
}

export default function waitForAnimation(element, className = '') {
  return new Promise(resolve => {
    if (className) {
      element.classList.add(className);
    }

    const style = window.getComputedStyle(element, null);
    const duration = style && style.getPropertyValue('animation-duration');
    const durationMs = getDurationInMs(duration);

    if (durationMs > 0) {
      const animationCallback = event => {
        if (event && event.target !== element) {
          return;
        }

        element.removeEventListener('animationend', animationCallback);
        if (className) {
          element.classList.remove(className);
        }

        clearTimeout(timeout);
        resolve();
      };

      const timeout = setTimeout(animationCallback, durationMs);
      element.addEventListener('animationend', animationCallback);
    } else {
      if (className) {
        element.classList.remove(className);
      }

      resolve();
    }
  });
}
