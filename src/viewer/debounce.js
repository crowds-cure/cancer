export default function (action, timeWindow) {
  var timeout;

  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => action.apply(this, arguments), timeWindow);
  };
}