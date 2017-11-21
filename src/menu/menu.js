import Login from '../login/login';
import Modal from '../modal/modal';
import ErrorModal from '../errorModal/modal';
import Viewer from '../viewer/viewer';
import {measurementsDB, getUUID} from '../db/db';
import {username} from '../login/login';
//import moment from 'moment';
// TODO: Momentjs is 20% of the bundle.js size (100kb).
// This seems unnecessary since we are only using it to get UNIX timestamps
// in seconds which you can just do with Math.floor(Date.now() / 1000)

export default {
  $menuWrapper: $('.menu-wrapper'),
  $overlay: $('.loading-overlay'),

  submit() {
    this.closeMenu();
    this.$overlay.removeClass('invisible').addClass('submitting');

    const lengths = cornerstoneTools.getToolState(this.element, 'length');
    // console.log('lengths:', lengths);
    if(!lengths){
      // console.log('ErrorModal', ErrorModal);
      ErrorModal.show();
      this.$overlay.removeClass('submitting');
      return;
    }

    getUUID().then((uuid) => {
      const doc = {
        '_id': uuid,
        'length': lengths.data[0].length,
        'annotator': username,
        'date': Math.floor(Date.now() / 1000), //moment().unix(),
        'userAgent': navigator.userAgent
      };

      // console.log('doc:', doc);
      return measurementsDB.put(doc);
    }).then(() => {
      Modal.show();
      this.$overlay.removeClass('submitting');
    });
  },
  nextCase() {
    this.closeMenu();
    Viewer.getNextCase();
  },
  logout(){
    this.closeMenu();
    Login.logout();
  },
  closeMenu() {
    this.$overlay.addClass('invisible');
    this.$menuWrapper.removeClass('opened');

    setTimeout(() => {
      this.$menuWrapper.addClass('invisible');
    }, 1200);
  },
  init() {
    Modal.init();
    ErrorModal.init();

    this.$menuWrapper.on('click', 'a[data-menu]', (event) => {
      const $element = $(event.currentTarget);
      const menu = $element.attr('data-menu');

      event.preventDefault();

      if (menu) {
        this[menu]();
      }
    });

    this.$overlay.on('click', (event) => {
      if (this.$menuWrapper.hasClass('opened')) {
        this.closeMenu();
      }
    });
  }
}
