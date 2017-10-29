import Menu from '../menu/menu';
import Modal from '../modal/modal';
import ErrorModal from '../errorModal/modal';
import {measurementsDB, getUUID} from '../db/db';
import Login from '../login/login';
import moment from 'moment';

export default {
  commandSelector: '.viewer-tools',
  $overlay: $('.loading-overlay'),
  clearAll() {
    const enabledElemet = cornerstone.getEnabledElement(this.$element);
    const viewport = cornerstone.getViewport(this.$element);

    viewport.voi.windowWidth = enabledElemet.image.windowWidth;
    viewport.voi.windowCenter = enabledElemet.image.windowCenter;
    cornerstone.setViewport(this.$element, viewport);

    cornerstoneTools.globalImageIdSpecificToolStateManager.clear(this.$element);
    cornerstone.updateImage(this.$element);
  },

  save: function () {

    Menu.closeMenu();
    this.$overlay.removeClass('invisible').addClass('submitting');

    const lengths = cornerstoneTools.getToolState(this.$element, 'length');
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
        'annotator': Login.username,
        'seriesUID': window.rsnaCrowdQuantSeriesUID,
        'date': moment().unix(),
        'userAgent': navigator.userAgent
      }
      console.log('Login', Login);
      return measurementsDB.put(doc);
    }).then(() => {
      Modal.show();
      this.$overlay.removeClass('submitting');
    });

    // setTimeout(() => {
    //   Modal.show();
    //
    //    this.$overlay.removeClass('submitting');
    // }, 2000);
  },

  initCommands() {
    $(this.commandSelector).on('click', 'a[data-command]', event => {
      const $element = $(event.currentTarget);
      const $wrapper = $element.parent();
      const tool = $element.attr('data-command');

      this[tool]();

      $wrapper.addClass('active');

      setTimeout(function() {
        $wrapper.removeClass('active');
      }, 300);
    });
  }
};
