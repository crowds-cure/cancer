import Viewer from '../viewer/viewer';
import Login from './login';
import Signup from '../signup/signup';
import {annotatorsDB} from '../db/db';

Login.$loginForm.off('submit').on('submit', function (evt) {
  evt.preventDefault();

  const $loginUsername = $('#login-username');
  const username = $loginUsername.val();
  if (username === '') {
    return;
  }

  Login.$loadingImg.removeClass('invisible');

  $loginUsername.val('');
  Login.username = username;
  console.log('username:', username);
  //console.log('Login Login:', Login);

  annotatorsDB.get(username).then((user) => {
    Login.user = user;
    console.log('Login.user is: ', Login.user);
    $('#username-bottom-left').text(Login.username);

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
