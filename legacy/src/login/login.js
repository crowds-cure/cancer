const $loadingImg = $('.login-wrapper .login-form button.submit .loading');
const $loginForm = $('.login-wrapper form');
const $loginWrapper = $('.login-wrapper');
const $homepage = $('#homepage');
const $signupWrapper = $('#signup-wrapper');
const $viewWrapper = $('.viewer-wrapper');
const $overlay = $('.loading-overlay');

const Login = {
  $loadingImg,
  $loginForm,
  $loginWrapper,
  $viewWrapper,
  $overlay,
  $homepage,
  $signupWrapper,
  username: undefined,
  logout() {
    this.username = undefined;
    this.$overlay.addClass('invisible');
    this.$homepage.removeClass('invisible');
    this.$signupWrapper.addClass('invisible');
    this.$viewWrapper.addClass('invisible');

    // Reset any body CSS imposed by the viewer
    $(document.body).css({
      position: 'relative',
      overflow: 'auto'
    });

    // Remove this username from localstorage
    window.localStorage.removeItem('username');
  }
};

export default Login;