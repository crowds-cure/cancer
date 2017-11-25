const $loadingImg = $('.login-wrapper .login-form button.submit .loading');
const $loginForm = $('.login-wrapper form');
const $loginWrapper = $('.login-wrapper');
const $viewWrapper = $('.viewer-wrapper');
const $overlay = $('.loading-overlay');

const Login = {
  $loadingImg,
  $loginForm,
  $loginWrapper,
  $viewWrapper,
  $overlay,
  username: undefined,
  logout() {
    this.username = undefined;
    this.$overlay.addClass('invisible');
    this.$loginWrapper.removeClass('invisible');
    this.$viewWrapper.addClass('invisible');
  }
};

export default Login;