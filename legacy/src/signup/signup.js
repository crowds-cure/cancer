import {adjectivesDB, animalsDB, annotatorsDB, annotatorsURL} from '../db/db';
import Viewer from '../viewer/viewer';
import Login from '../login/login';

class Signup {

  constructor () {

  }

  getRandomUsername () {
    let numOfAdjectives = 0;
    let numOfAnimals = 0;
    let name;

    return adjectivesDB.info().then((doc) => {
      numOfAdjectives = doc.doc_count;
      // console.log('numOfAdjectives', numOfAdjectives);
      const rand = Math.floor(numOfAdjectives*Math.random());
      return adjectivesDB.get(rand);
    }).then((doc) => {
      // console.log(doc.name);
      name = doc.name;
      return animalsDB.info();
    }).then((doc) => {
      numOfAnimals = doc.doc_count;
      // console.log('numOfAnimals', numOfAnimals);
      const rand = Math.floor(numOfAnimals*Math.random());
      return animalsDB.get(rand);
    }).then((doc) => {
      return name + `_${doc.name}`;
    }).catch((err) => {
      throw err;
    });
  }

  getRandomUsernames (num=0) {
    const names = [];
    console.log('num:', num);

    const next = () => {
      return this.getRandomUsername().then((name) => {
        let accept = true;
        names.forEach((n) => {
          if(n === name){
            accept = false;
          }
        });

        if(accept){
          return annotatorsDB.get(name).then((user) => {
            console.log('username', name, 'already exist in the database');

            return next();
          }).catch((err) => {
            names.push(name);

            if(names.length !== num){
              return next();
            }
          });
        }else{
          return next();
        }
      });
    }

    return next().then(() => {
      return names;
    });
  }

  createUser (id, data) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${annotatorURL}/${id}`,
        type: 'PUT',
        dataType: 'json',
        data: data,
        success: function(res){
          // $loadingImg.addClass('invisible');
          // $signupWrapper.addClass('invisible');
          // Viewer.initViewer();
          resolve(res);
        },
        error: function(err){
          console.log(err);
          reject(err);
        }
      });
    });
  }

  init () {
    console.log('Signup.init() is called');
    var $loading = $('.sign form button.submit loading');
    var $signup = $('.sign');
    var $overlay = $('.loading-overlay');

    $overlay.removeClass('invisible').addClass('loading');

    this.getRandomUsernames(4).then((names) => {
      // console.log('usernames:', names);
      $overlay.removeClass('loading').addClass('invisible');
      $signup.removeClass('invisible');

      $('#signup-name-select').append(`<option value=${names[0]}>${names[0]}</option>`);
      $('#signup-name-select').append(`<option value=${names[1]}>${names[1]}</option>`);
      $('#signup-name-select').append(`<option value=${names[2]}>${names[2]}</option>`);
      $('#signup-name-select').append(`<option value=${names[3]}>${names[3]}</option>`);
    });

    const radiologist = $('input[name="is-radiologist"]');
    $(radiologist).change(() => {
      const isChecked = radiologist.is(':checked');
      // console.log('isChecked:', isChecked);
      if(isChecked) {
        const isRadiologist = ($('input[name="is-radiologist"]:checked').val() === 'yes');
        // console.log('isRadiologist:', isRadiologist);
        if(isRadiologist){
          if(!$('.speciality').hasClass('invisible')){
            $('.speciality').addClass('invisible');
          }
          $('.years-of-experience').removeClass('invisible');
        }else{
          if(!$('.years-of-experience').hasClass('invisible')){
            $('.years-of-experience').addClass('invisible');
          }
          $('.speciality').removeClass('invisible');
        }
      }
    });


    // $('input[name="years-of-experience"]').focus(function() {
    //   console.log('years of exp');
    //   if(!$('.sign .error').hasClass('invisible')){
    //     $('.sign .error').text('');
    //     $('.sign .error').addClass('invisible');
    //   }
    // });

    $('.sign form').off('submit').on('submit', function (event) {
      event.preventDefault();

      $loading.removeClass('invisible');
      // $('.sign .error').addClass('invisible');

      const username = $('#signup-name-select option:selected').text();
      Login.username = username;
      // console.log('signup Login:', Login);
      // const username = $('input[name="username"]').val();
      // const password = $('input[name="password"]').val();
      // const confirmPassword = $('input[name="confirm-password"]').val();
      const isRadiologist = ($('input[name="is-radiologist"]:checked').val() === 'yes');
      // const isChecked = $('input:radio[name="is-radiologist"]').is(':checked');
      // const isRadiologist2 = $('#radiologist-no').val();
      let yearsOfExperience;
      let speciality;
      let anatomyChoices = [];

      if(isRadiologist){
        yearsOfExperience = $('#signup-years-of-experience option:selected').val();
      }else{
        speciality = $('#signup-speciality option:selected').val();
      }

      $("#anatomy-choices input:checkbox[name=anatomy-choice]:checked").each(function(){
          anatomyChoices.push($(this).val());
      });

      const email = $('#signup-email').val();
      console.log('email:', email);

      // if(isRadiologist && isNaN(yearsOfExperience)){
      //     $('.sign .error').removeClass('invisible');
      //     $('.sign .error').text('"Years of exprience" must be a number');
      //
      //     $('input[name="years-of-experience"]').val('');
      //
      //     $('#signup-button').blur();
      //
      //     $loadingImg.addClass('invisible');
      //
      //     return false;
      // }

      // var values = $(this).serializeArray();
      // console.log('values', values);

      // if(password !== confirmPassword){
      //   $('.sign .error').removeClass('invisible');
      //   $('.sign .error').text('Passwords don\'t match');
      //
      //   const password = $('#signup-password').val('');
      //   const confirmPassword = $('#signup-confirm-password').val('');
      //
      //   $('#signup-button').blur();
      //
      //   $loadingImg.addClass('invisible');
      //
      // }
      var createDate = Date.now();
      const data = {
        _id: username,
        username,
        // password,
        isRadiologist,
        anatomyChoices,
        createDate
      }
      window.localStorage.setItem('username', username);

      if(speciality){
        data.speciality = speciality;
      }

      if(yearsOfExperience){
        data.yearsOfExperience = yearsOfExperience;
      }

      if(email){
        data.email = email;
      }

      if (anatomyChoices && anatomyChoices.length > 0) {
        data.anatomyChoices = anatomyChoices;
      }

      annotatorsDB.put(data).then((res) => {
        Login.user = data;
        console.log('Login.user is: ', Login.user);
        $('#username-bottom-left').text(Login.username);
        $loading.addClass('invisible');
        $signup.addClass('invisible');

        Viewer.initViewer();
      });
    });
  }
}

export default Signup;
