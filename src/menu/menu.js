import Login from '../login/login';
import Modal from '../modal/modal';

export default {
  $hamburguerMenu: $('.humburguer-menu'),
  $menuWrapper: $('.menu-wrapper'),
  $overlay: $('.loading-overlay'),
  submit() {
    this.closeMenu();
    this.$overlay.removeClass('invisible').addClass('submitting');

    setTimeout(() => {
      Modal.show();

      this.$overlay.removeClass('submitting');
    }, 2000);
  },
  logout(){
    this.closeMenu();
    Login.logout();
  },
  closeMenu() {
    this.$overlay.addClass('invisible');
    this.$menuWrapper.removeClass('opened');
  },
  init() {
    Modal.init();

    this.$hamburguerMenu.on('click', (event) => {
      event.preventDefault();

      this.$overlay.removeClass('invisible');
      this.$menuWrapper.addClass('opened');
    });

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
        this.$menuWrapper.removeClass('opened');
        this.$overlay.addClass('invisible');
      }
    });
  }
}
