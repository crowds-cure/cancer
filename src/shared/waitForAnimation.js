export default function waitForAnimation(element, className = '') {
  return new Promise(resolve => {
    if (className) {
      element.classList.add(className);
    }

    const style = window.getComputedStyle(element, null);
    const hasAnimation =
      style && !!style.getPropertyValue('animation-duration');

    if (hasAnimation) {
      const animationCallback = event => {
        if (event.target !== element) {
          return;
        }

        element.removeEventListener('animationend', animationCallback);
        if (className) {
          element.classList.remove(className);
        }

        resolve();
      };

      element.addEventListener('animationend', animationCallback);
    } else {
      if (className) {
        element.classList.remove(className);
      }

      resolve();
    }
  });
}
