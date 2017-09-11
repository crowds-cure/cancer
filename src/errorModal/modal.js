import Login from '../login/login';
import Viewer from '../viewer/viewer';

export default {
  $modal: $('.error-modal'),
  $overlay: $('.loading-overlay'),
  logout() {
    this.$modal.removeClass('show');
    this.$overlay.addClass('invisible');

    Login.logout();
  },
  nextCase() {
    this.hide();

    Viewer.getNextCase();
  },
  show() {
    console.log('inside show');
    
    this.$modal.addClass('show');
    this.$overlay.removeClass('invisible');
  },
  hide() {
    this.$modal.removeClass('show');
    this.$overlay.addClass('invisible');
  },
  init() {
    this.$modal.find('.ok').on('click', () => this.hide());
    // this.$modal.find('.next-case').on('click', () => this.nextCase());
  }
}
