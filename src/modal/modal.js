import Login from '../login/login';

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
  }
}
