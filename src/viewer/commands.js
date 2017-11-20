import Menu from '../menu/menu';
import Modal from '../modal/modal';
import ErrorModal from '../errorModal/modal';
import {measurementsDB, getUUID} from '../db/db';
import Login from '../login/login';
import moment from 'moment';

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

export default {
  commandSelector: '.viewer-tools',
  $overlay: $('.loading-overlay'),

  clearAll() {
    // Remove all measurements associated with this element
    cornerstoneTools.clearToolState(this.element, 'length');

    // Reset the viewport parameters (i.e. VOI LUT, scale, translation)
    cornerstone.reset(this.element);
  },

  skip: function() {

      const stack = cornerstoneTools.getToolState(this.$element, 'stack');
      getUUID().then((uuid) => {
        const sliceIndex = stack.data[0].currentImageIdIndex;
        const doc = {
          '_id': uuid,
          'skip': true,
          'annotator': Login.username,
          'seriesUID': window.rsnaCrowdQuantSeriesUID,
          'instanceUID': window.rsnaCrowdQuantCaseStudy.instanceUIDs[sliceIndex],
          'instanceURL': window.rsnaCrowdQuantCaseStudy.urls[sliceIndex],
          'sliceIndex': sliceIndex,
          'date': moment().unix(),
          'userAgent': navigator.userAgent
        }
        return measurementsDB.put(doc);
      })

    Modal.nextCase();
  },

  save: function () {

    Menu.closeMenu();
    this.$overlay.removeClass('invisible').addClass('submitting');

    // Retrieve the tool state manager for this element
    const toolStateManager = cornerstoneTools.getElementToolStateManager(this.element);

    // Dump all of its tool state into an Object
    const toolState = toolStateManager.saveToolState();

    // Get the stack tool data
    const stackData = cornerstoneTools.getToolState(this.element, 'stack');
    const stack = stackData.data[0];

    // Retrieve the length data from this Object
    const lengthData = Object.keys(toolState).map(imageId => {
      return {
        imageIndex: stack.imageIds.indexOf(imageId),
        data: toolState[imageId].length
      }
    });

    if(!lengthData.length){
      // console.log('ErrorModal', ErrorModal);
      ErrorModal.show();
      this.$overlay.removeClass('submitting');
      return;
    }

    getUUID().then((uuid) => {
      console.log(lengthData);
      const measurement = lengthData[0];

      const doc = {
        '_id': uuid,
        'length': measurement.data.length,
        'start_x': measurement.data.handles.start.x,
        'start_y': measurement.data.handles.start.y,
        'end_x': measurement.data.handles.end.x,
        'end_y': measurement.data.handles.end.y,
        'annotator': Login.username,
        'seriesUID': window.rsnaCrowdQuantSeriesUID,
        'instanceUID': window.rsnaCrowdQuantCaseStudy.instanceUIDs[measurement.imageIndex],
        'instanceURL': window.rsnaCrowdQuantCaseStudy.urls[measurement.imageIndex],
        'sliceIndex': measurement.imageIndex,
        'date': moment().unix(),
        'userAgent': navigator.userAgent
      };

      return measurementsDB.put(doc);
    }).then((response) => {
      const canvas = document.querySelector('#cornerstoneViewport canvas');
      const imageBlob = dataURItoBlob(canvas.toDataURL());
      return measurementsDB.putAttachment(response.id, 'screenshot.png', response.rev, imageBlob, 'image/png');
    }).then(() => {
      Modal.show();
      this.$overlay.removeClass('submitting');
    });
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
