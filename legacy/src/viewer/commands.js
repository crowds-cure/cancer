import Menu from '../menu/menu.js';
import Viewer from '../viewer/viewer.js';
import ErrorModal from '../errorModal/modal.js';
import {measurementsDB, getUUID} from '../db/db.js';
import Login from '../login/login';

import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

const defaultWlPresets = {
    SoftTissue: {
        wc: 40,
        ww: 400
    },
    Lung: {
        wc: -600,
        ww: 1500
    },
    Liver: {
        wc: 90,
        ww: 150
    }
};



export default {
  isMenuOpened: false,
  commandSelector: '.viewer-tools',
  $overlay: $('.loading-overlay'),
  $loadingText: $('.loading-overlay .content .submit-text'),
  $commandMenu: $('.commands-wrapper'),
,

  setWL: function (windowWidth, windowCenter) {
    const viewport = cornerstone.getViewport(this.element);

    viewport.voi.windowWidth = windowWidth;
    viewport.voi.windowCenter = windowCenter;

    cornerstone.updateImage(this.element);
  },

  setWLPreset: function(presetName) {
    const preset = defaultWlPresets[presetName]
    this.setWL(preset.ww, preset.wc);
  },

  setWLPresetLung: function() {
    this.setWLPreset('Lung');
  },

  setWLPresetLiver: function() {
    this.setWLPreset('Liver');
  },

  setWLPresetSoftTissue: function() {
    this.setWLPreset('SoftTissue');
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

  logout() {
    Login.logout();
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
