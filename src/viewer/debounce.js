export default function (action, timeWindow) {
  let timeout;

  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => action.apply(this, arguments), timeWindow);
  };
}