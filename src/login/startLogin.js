import Viewer from '../viewer/viewer';
import Login from './login';
import Signup from '../signup/signup';
import {annotatorsDB} from '../db/db';

Login.$loginForm.off('submit').on('submit', function (evt) {
  evt.preventDefault();

  Login.$loadingImg.removeClass('invisible');
  const $loginUsername = $('#login-username');
  const username = $loginUsername.val();
  $loginUsername.val('');
  Login.username = username;
  console.log('username:', username);
  console.log('Login Login:', Login);

  annotatorsDB.get(username).then((user) => {
    console.log('username', username, 'exist');
    window.localStorage.setItem('username', username);
    Login.$loadingImg.addClass('invisible');
    Login.$loginWrapper.addClass('invisible');

    Viewer.initViewer();
  }).catch((err) => {
    const loginError = $('#login-error');
    loginError.text(`Username ${username} is not found. Try another username or sign up for a new account`)
    loginError.removeClass('invisible');
    Login.$loadingImg.addClass('invisible');
  });
});

$('#open-signup-btn-new').off('click').click(function(event) {
  event.preventDefault();

  Login.$loginWrapper.addClass('invisible');

  new Signup().init();
});

$(document.body).css({
  position: 'relative',
  overflow: 'auto'
});