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
    var $loading = $('.signup-wrapper form button.submit img.loading');
    var $signup = $('.signup-wrapper');
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
          if(!$('#signup-speciality').hasClass('invisible')){
            $('#signup-speciality').addClass('invisible');
          }
          $('#signup-years-of-experience').removeClass('invisible');
        }else{
          if(!$('#signup-years-of-experience').hasClass('invisible')){
            $('#signup-years-of-experience').addClass('invisible');
          }
          $('#signup-speciality').removeClass('invisible');
        }
      }
    });


    // $('input[name="years-of-experience"]').focus(function() {
    //   console.log('years of exp');
    //   if(!$('.signup-wrapper .error').hasClass('invisible')){
    //     $('.signup-wrapper .error').text('');
    //     $('.signup-wrapper .error').addClass('invisible');
    //   }
    // });

    $('.signup-wrapper form').off('submit').on('submit', function (event) {
      event.preventDefault();

      $loading.removeClass('invisible');
      // $('.signup-wrapper .error').addClass('invisible');

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
      //     $('.signup-wrapper .error').removeClass('invisible');
      //     $('.signup-wrapper .error').text('"Years of exprience" must be a number');
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
      //   $('.signup-wrapper .error').removeClass('invisible');
      //   $('.signup-wrapper .error').text('Passwords don\'t match');
      //
      //   const password = $('#signup-password').val('');
      //   const confirmPassword = $('#signup-confirm-password').val('');
      //
      //   $('#signup-button').blur();
      //
      //   $loadingImg.addClass('invisible');
      //
      // }

      const data = {
        _id: username,
        username,
        // password,
        isRadiologist,
        anatomyChoices
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

      console.log('data:', data);
      annotatorsDB.put(data).then(() => {
        $loading.addClass('invisible');
        $signup.addClass('invisible');

        Viewer.initViewer();
      });

      // getUuid().then((id) => {
      //   console.log('id:', id);
      //   return createUser(id, data);
      // }).then((res) => {
      //   console.log('res:', res);
      // })

      //   // Mocking login
      //   setTimeout(function () {
      //     $loadingImg.addClass('invisible');
      //     $loginWrapper.addClass('invisible');
      //
      //     Viewer.initViewer();
      //   }, 1000);
      // });
      //
      // $('#open-signup-btn').click(function(event) {
      //   event.preventDefault();
      //   $loginWrapper.addClass('invisible');
      //
      //   Signup.initSignup();
    });
  }
}

export default Signup;
