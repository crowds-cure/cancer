import Viewer from '../viewer/viewer';
import Login from './login';
import Signup from '../signup/signup';
import {annotatorsDB} from '../db/db';

$('.login-wrapper form').off('submit').on('submit', function (evt) {
  evt.preventDefault();

  Login.$loadingImg.removeClass('invisible');
  const username = $('#login-username').val();
  $('#login-username').val('');
  Login.username = username;
  console.log('username:', username);
  console.log('Login Login:', Login);

  annotatorsDB.get(username).then((user) => {
    console.log('username', username, 'exist');
    window.localStorage.setItem('username', username);
    Login.$loadingImg.addClass('invisible');
    Login.$loginForm.addClass('invisible');

    Viewer.initViewer();
  }).catch((err) => {
    $('#login-error').text(`Username ${username} is not found. Try another username or sign up for a new account`)
    $('#login-error').removeClass('invisible');
    Login.$loadingImg.addClass('invisible');
  });

  // Mocking login
  // setTimeout(function () {
  //   $loadingImg.addClass('invisible');
  //   $loginForm.addClass('invisible');
  //
  //   Viewer.initViewer();
  // }, 1000);
});

$('#open-signup-btn-new').off('click').click(function(event) {
  event.preventDefault();

  Login.$loginWrapper.addClass('invisible');

  new Signup().init();
  // console.log('sighnup is called');
  // Signup.init();
});


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
