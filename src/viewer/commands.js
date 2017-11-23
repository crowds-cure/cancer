import Menu from '../menu/menu.js';
import Viewer from '../viewer/viewer.js';
import ErrorModal from '../errorModal/modal.js';
import {measurementsDB, getUUID} from '../db/db.js';
import Login from '../login/login';

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
  isMenuOpened: false,
  commandSelector: '.viewer-tools',
  $overlay: $('.loading-overlay'),
  $loadingText: $('.loading-overlay .content .submit-text'),
  $commandMenu: $('.commands-wrapper'),

  clearAll() {
    // Remove all imageId-specific measurements associated with this element
    cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState({});

    // Reset the viewport parameters (i.e. VOI LUT, scale, translation)
    cornerstone.reset(this.element);
  },

  skip: function() {
    this.$overlay.removeClass('invisible').addClass('loading');

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
      };
      return measurementsDB.put(doc);
    });

    Viewer.getNextCase().then(() => {
      this.$overlay.removeClass('loading').addClass('invisible');
    });
  },

  setWL: function (windowWidth, windowCenter) {
    const enabledElement = cornerstone.getEnabledElement(this.element);
    const viewport = enabledElement.viewport;

    viewport.voi.windowWidth = windowWidth;
    viewport.voi.windowCenter = windowCenter;

    cornerstone.updateImage(this.element);
  },

  setLungWL: function() {
    this.setWL(1600, -600);
  },

  setLiverWL: function() {
    this.setWL(150, 30);
  },

  toggleMoreMenu: function () {
    if (this.isMenuOpened) {
      this.$commandMenu.removeClass('open');
      setTimeout(() => {
        this.$commandMenu.removeClass('border');
      }, 1100);
    } else {
      this.$commandMenu.addClass('open border');
    }

    this.isMenuOpened = !this.isMenuOpened;
  },

  save: function () {
    this.$overlay.removeClass('invisible').addClass('loading');
    this.$loadingText.text('Submitting your measurement...');

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
      this.$loadingText.text('');
      this.$overlay.removeClass('loading').addClass('invisible');
      return;
    }

    if (lengthData.length > 1) {
      throw new Error('Only one length measurement should be in the lengthData');
    }

    const savingPromise = new Promise((resolve, reject) => {
      console.time('getUUID');
      getUUID().then((uuid) => {
        console.timeEnd('getUUID');
        console.time('PUT to Measurement DB');
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
          'date': Math.floor(Date.now() / 1000),
          'userAgent': navigator.userAgent
        };

        return measurementsDB.put(doc);
      }).then((response) => {
        console.timeEnd('PUT to Measurement DB');
        console.time('PUT putAttachment');
        const canvas = document.querySelector('#cornerstoneViewport canvas');
        const imageBlob = dataURItoBlob(canvas.toDataURL());
        return measurementsDB.putAttachment(response.id, 'screenshot.png', response.rev, imageBlob, 'image/png');
      }).then(() => {
        console.timeEnd('PUT putAttachment');
        resolve();
      }).catch((error) => {
        reject(error)
      });
    });

    Viewer.getNextCase().then(() => {
      this.$loadingText.text('');
      this.$overlay.removeClass('loading').addClass('invisible');
    });

    return savingPromise;
  },

  initCommands() {
    $(this.commandSelector).off('click');
    $(this.commandSelector).on('click', 'div[data-command]', event => {
      event.preventDefault();
      event.stopPropagation();

      const $element = $(event.currentTarget);
      const tool = $element.attr('data-command');

      this[tool]();

      $element.addClass('active');

      setTimeout(function() {
        $element.removeClass('active');
      }, 300);
    });

    $(document).off('click');
    $(document).on('click', event => {
      if (this.isMenuOpened) {
        this.toggleMoreMenu();
      }
    });
  }
};
