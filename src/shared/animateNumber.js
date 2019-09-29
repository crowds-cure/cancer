import animate from './animate';

export default function animateNumber(
  element,
  context,
  propsKey,
  stateKey,
  duration = 1000
) {
  const oldValue = context.state[stateKey] || 0;
  const propsValue = context.props[propsKey] || 0;
  if (oldValue === propsValue) {
    return;
  }

  let updated = false;

  animate(duration, progress => {
    const diff = propsValue - oldValue;
    const result = oldValue + diff * progress;
    const newValue = Math.floor(result);

    const currentValue = parseInt(element.innerText, 10);

    if (currentValue === propsValue && !updated) {
      context.setState({ measurementsCount: propsValue });
      updated = true;
    } else if (newValue !== currentValue) {
      element.innerText = newValue.toLocaleString();
    }
  });
}
