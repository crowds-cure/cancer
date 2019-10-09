import animate from './animate';

export default function animateNumber(
  element,
  valueTo,
  valueFrom = 0,
  duration = 1000,
  callback = () => {}
) {
  if (valueTo === valueFrom) {
    return;
  }

  let updated = false;

  animate(duration, progress => {
    const diff = valueTo - valueFrom;
    const result = valueFrom + diff * progress;
    const newValue = Math.floor(result);

    const currentValue = parseInt(element.innerText, 10);

    if (newValue !== currentValue) {
      element.innerText = newValue.toLocaleString();
    }

    if (progress === 1 && !updated) {
      updated = true;
      callback(valueTo);
    }
  });
}
