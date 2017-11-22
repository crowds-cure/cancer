import Login from '../login/login';
import Modal from '../modal/modal';
import ErrorModal from '../errorModal/modal';
import Viewer from '../viewer/viewer';
import {measurementsDB, getUUID} from '../db/db';
import {username} from '../login/login';

export default {
  $menuWrapper: $('.menu-wrapper'),
  $overlay: $('.loading-overlay'),

  submit() {
    this.closeMenu();
    Commands.save();
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
