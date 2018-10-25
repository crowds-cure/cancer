import Login from '../login/login';
import Viewer from '../viewer/viewer';

export default {
  $modal: $('.modal'),
  $overlay: $('.loading-overlay'),
  logout() {
    this.$modal.removeClass('show');
    this.$overlay.addClass('invisible');

    Login.logout();
  },
  show() {
    this.$modal.addClass('show');
    this.$overlay.removeClass('invisible');
  },
  hide() {
    this.$modal.removeClass('show');
    this.$overlay.addClass('invisible');
  },
  init() {
    this.$modal.find('.logout').on('click', () => this.logout());
    this.$modal.find('.next-case').on('click', () => this.nextCase());
  }
}
