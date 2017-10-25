import Viewer from '../viewer/viewer';
import Signup from '../signup/signup';

const $loadingImg = $('.login-wrapper form button.submit img.loading');
const $loginForm = $('.login-wrapper');
const $loginWrapper = $('.login-wrapper');
const $viewWrapper = $('.viewer-wrapper');
const $overlay = $('.loading-overlay');
// let username;

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
}

export default Login;

//  {
//   $loginWrapper,
//   $viewWrapper,
//   $overlay,
//   username,
//   logout() {
//     this.$overlay.addClass('invisible');
//     this.$loginWrapper.removeClass('invisible');
//     this.$viewerWrapper.addClass('invisible');
//   }
// }
