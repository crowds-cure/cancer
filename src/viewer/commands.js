import Menu from '../menu/menu';
import Modal from '../modal/modal';
import ErrorModal from '../errorModal/modal';
import {measurementsDB, getUUID} from '../db/db';
import Login from '../login/login';
//import moment from 'moment';
// TODO: Seems like overkill to pull in momentjs

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
    // Remove all imageId-specific measurements associated with this element
    cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState({});

    // Reset the viewport parameters (i.e. VOI LUT, scale, translation)
    cornerstone.reset(this.element);
  },

  skip: function() {
    const stack = cornerstoneTools.getToolState(this.element, 'stack');

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
        'date': Math.floor(Date.now() / 1000),
        'userAgent': navigator.userAgent
      }
      return measurementsDB.put(doc);
    });

    Modal.nextCase();
  },

  save: function () {
    Menu.closeMenu();
    this.$overlay.removeClass('invisible').addClass('submitting');

    // Retrieve the tool state manager for this element
    const toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;

    // Dump all of its tool state into an Object
    const toolState = toolStateManager.saveToolState();

    // Get the stack tool data
    const stackData = cornerstoneTools.getToolState(this.element, 'stack');
    const stack = stackData.data[0];

    // Retrieve the length data from this Object
    let lengthData = [];
    Object.keys(toolState).forEach(imageId => {
      if (!toolState[imageId]['length'] || !toolState[imageId]['length'].data.length) {
        return;
      }

      lengthData.push({
        imageIndex: stack.imageIds.indexOf(imageId),
        data: toolState[imageId].length
      });
    });

    if (!lengthData.length){
      // console.log('ErrorModal', ErrorModal);
      ErrorModal.show();
      this.$overlay.removeClass('submitting');
      return;
    }

    if (lengthData.length > 1) {
      throw new Error('Only one length measurement should be in the lengthData');
    }

    getUUID().then((uuid) => {
      const measurement = lengthData[0];
      const lengthMeasurement = measurement.data.data[0];

      cornerstoneTools.scrollToIndex(this.element, measurement.imageIndex);

      const doc = {
        '_id': uuid,
        'length': lengthMeasurement.length,
        'start_x': lengthMeasurement.handles.start.x,
        'start_y': lengthMeasurement.handles.start.y,
        'end_x': lengthMeasurement.handles.end.x,
        'end_y': lengthMeasurement.handles.end.y,
        'annotator': Login.username,
        'seriesUID': window.rsnaCrowdQuantSeriesUID,
        'instanceUID': window.rsnaCrowdQuantCaseStudy.instanceUIDs[measurement.imageIndex],
        'instanceURL': window.rsnaCrowdQuantCaseStudy.urls[measurement.imageIndex],
        'sliceIndex': measurement.imageIndex,
        'date': Math.floor(Date.now() / 1000), //moment().unix(),
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
