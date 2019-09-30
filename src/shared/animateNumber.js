import animate from './animate';

export default function animateNumber(
  element,
  context,
  propsKeyOrValue,
  stateKey,
  duration = 1000,
  callback = () => {}
) {
  let propsValue = propsKeyOrValue;
  if (typeof propsValue === 'string') {
    propsValue = context.props[propsKeyOrValue] || 0;
  }

  const oldValue = context.state[stateKey] || 0;
  if (oldValue === propsValue) {
    return;
  }

  let updated = false;

  animate(duration, progress => {
    const diff = propsValue - oldValue;
    const result = oldValue + diff * progress;
    const newValue = Math.floor(result);

    const currentValue = parseInt(element.innerText, 10);

    if (newValue !== currentValue) {
      element.innerText = newValue.toLocaleString();
    }

    if (progress === 1 && !updated) {
      context.setState({ stateKey: propsValue });
      updated = true;
      callback();
    }
  });
}
