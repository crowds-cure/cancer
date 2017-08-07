import Viewer from '../viewer/viewer';

$('.login-wrapper form').on('submit', function (evt) {
  evt.preventDefault();

  const $loadingImg = $('.login-wrapper form button.submit img.loading');
  const $loginForm = $('.login-wrapper');

  $loadingImg.removeClass('invisible');
  
  // Mocking login
  setTimeout(function () {
    $loadingImg.addClass('invisible');
    $loginForm.addClass('invisible'); 

    Viewer.initViewer();
  }, 1000);
});

export default {
  $loginWrapper: $('.login-wrapper'),
  $viewWrapper: $('.viewer-wrapper'),
  $overlay: $('.loading-overlay'),
  logout() {
    this.$overlay.addClass('invisible');
    this.$loginWrapper.removeClass('invisible');
    this.$viewerWrapper.addClass('invisible');
  }
}
