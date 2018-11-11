/* jshint -W060 */
//import absoluteUrl from './absoluteUrl';

export default function(fileName, callback) {
  const script = document.createElement('script');
  script.src = fileName;
  script.onload = () => {
    if (typeof callback === 'function') {
      callback(script);
    }
  };

  document.body.appendChild(script);
}
