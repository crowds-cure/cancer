import writeScript from './writeScript';

// Check if browser is IE and add the polyfill scripts
if (navigator && /MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
  window.addEventListener('load', () => {
    // Fix SVG+USE issues by calling the SVG polyfill
    writeScript('js/svgxuse.min.js');
  });
}
