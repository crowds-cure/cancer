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
    const stack = cornerstoneTools.getToolState(this.$element, 'stack');
    // console.log('lengths:', lengths);
    if(!lengths || !stack){
      // console.log('ErrorModal', ErrorModal);
      ErrorModal.show();
      this.$overlay.removeClass('submitting');
      return;
    }

    // helper from https://stackoverflow.com/questions/12168909/blob-from-dataurl
    function dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(',')[1]);
      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      // create a view into the buffer
      var ia = new Uint8Array(ab);
      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], {type: mimeString});
      return blob;
    }

    getUUID().then((uuid) => {
      const sliceIndex = stack.data[0].currentImageIdIndex;
      const doc = {
        '_id': uuid,
        'length': lengths.data[0].length,
        'start_x':lengths.data[0].handles.start.x,
        'start_y':lengths.data[0].handles.start.y,
        'end_x':lengths.data[0].handles.end.x,
        'end_y':lengths.data[0].handles.end.y,
        'annotator': Login.username,
        'seriesUID': window.rsnaCrowdQuantSeriesUID,
        'instanceUID': window.rsnaCrowdQuantCaseStudy.instanceUIDs[sliceIndex],
        'instanceURL': window.rsnaCrowdQuantCaseStudy.urls[sliceIndex],
        'sliceIndex': sliceIndex,
        'date': moment().unix(),
        'userAgent': navigator.userAgent
      }
      return measurementsDB.put(doc);
    }).then((response) => {
      const canvas = document.querySelector('#conerstoneViewport canvas');
      const imageBlob = dataURItoBlob(canvas.toDataURL());
      return measurementsDB.putAttachment(response.id, 'screenshot.png', response.rev, imageBlob, 'image/png');
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
