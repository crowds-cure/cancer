export default {
  $hamburguerMenu: $('.humburguer-menu'),
  $menuWrapper: $('.menu-wrapper'),
  $overlay: $('.loading-overlay'),
  init() {
    this.$menu = $(this.menuSelector);

    this.$hamburguerMenu.on('click', (evt) => {
      this.$overlay.removeClass('invisible');
      this.$menuWrapper.addClass('opened');
    });
  }
}
