(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _viewer = require('../viewer/viewer');

var _viewer2 = _interopRequireDefault(_viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$('.login-wrapper form').on('submit', function (evt) {
  evt.preventDefault();

  var $loadingImg = $('.login-wrapper form button.submit img.loading');
  var $loginForm = $('.login-wrapper');

  $loadingImg.removeClass('invisible');

  // Mocking login
  setTimeout(function () {
    $loadingImg.addClass('invisible');
    $loginForm.addClass('invisible');

    _viewer2.default.initViewer();
  }, 1000);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfMmRlMWQwOTkuanMiXSwibmFtZXMiOlsiJCIsIm9uIiwiZXZ0IiwicHJldmVudERlZmF1bHQiLCIkbG9hZGluZ0ltZyIsIiRsb2dpbkZvcm0iLCJyZW1vdmVDbGFzcyIsInNldFRpbWVvdXQiLCJhZGRDbGFzcyIsImluaXRWaWV3ZXIiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztBQUVBQSxFQUFFLHFCQUFGLEVBQXlCQyxFQUF6QixDQUE0QixRQUE1QixFQUFzQyxVQUFVQyxHQUFWLEVBQWU7QUFDbkRBLE1BQUlDLGNBQUo7O0FBRUEsTUFBTUMsY0FBY0osRUFBRSwrQ0FBRixDQUFwQjtBQUNBLE1BQU1LLGFBQWFMLEVBQUUsZ0JBQUYsQ0FBbkI7O0FBRUFJLGNBQVlFLFdBQVosQ0FBd0IsV0FBeEI7O0FBRUE7QUFDQUMsYUFBVyxZQUFZO0FBQ3JCSCxnQkFBWUksUUFBWixDQUFxQixXQUFyQjtBQUNBSCxlQUFXRyxRQUFYLENBQW9CLFdBQXBCOztBQUVBLHFCQUFPQyxVQUFQO0FBQ0QsR0FMRCxFQUtHLElBTEg7QUFNRCxDQWZEIiwiZmlsZSI6ImZha2VfMmRlMWQwOTkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlld2VyIGZyb20gJy4uL3ZpZXdlci92aWV3ZXInO1xuXG4kKCcubG9naW4td3JhcHBlciBmb3JtJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIChldnQpIHtcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgY29uc3QgJGxvYWRpbmdJbWcgPSAkKCcubG9naW4td3JhcHBlciBmb3JtIGJ1dHRvbi5zdWJtaXQgaW1nLmxvYWRpbmcnKTtcbiAgY29uc3QgJGxvZ2luRm9ybSA9ICQoJy5sb2dpbi13cmFwcGVyJyk7XG5cbiAgJGxvYWRpbmdJbWcucmVtb3ZlQ2xhc3MoJ2ludmlzaWJsZScpO1xuICBcbiAgLy8gTW9ja2luZyBsb2dpblxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAkbG9hZGluZ0ltZy5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG4gICAgJGxvZ2luRm9ybS5hZGRDbGFzcygnaW52aXNpYmxlJyk7IFxuXG4gICAgVmlld2VyLmluaXRWaWV3ZXIoKTtcbiAgfSwgMTAwMCk7XG59KTtcbiJdfQ==
},{"../viewer/viewer":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  $modal: $('.modal'),
  $overlay: $('.loading-overlay'),
  logout: function logout() {
    this.$modal.removeClass('show');
    this.$overlay.addClass('invisible');
    $('.login-wrapper').removeClass('invisible');
    $('.viewer-wrapper').addClass('invisible');
  },
  show: function show() {
    debugger;
    this.$modal.addClass('show');
    this.$overlay.removeClass('invisible');
  },
  hide: function hide() {
    this.$modal.removeClass('show');
    this.$overlay.addClass('invisible');
  },
  init: function init() {
    var _this = this;

    this.$modal.find('.logout').on('click', function () {
      return _this.logout();
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGFsLmpzIl0sIm5hbWVzIjpbIiRtb2RhbCIsIiQiLCIkb3ZlcmxheSIsImxvZ291dCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJzaG93IiwiaGlkZSIsImluaXQiLCJmaW5kIiwib24iXSwibWFwcGluZ3MiOiI7Ozs7O2tCQUFlO0FBQ2JBLFVBQVFDLEVBQUUsUUFBRixDQURLO0FBRWJDLFlBQVVELEVBQUUsa0JBQUYsQ0FGRztBQUdiRSxRQUhhLG9CQUdKO0FBQ1AsU0FBS0gsTUFBTCxDQUFZSSxXQUFaLENBQXdCLE1BQXhCO0FBQ0EsU0FBS0YsUUFBTCxDQUFjRyxRQUFkLENBQXVCLFdBQXZCO0FBQ0FKLE1BQUUsZ0JBQUYsRUFBb0JHLFdBQXBCLENBQWdDLFdBQWhDO0FBQ0FILE1BQUUsaUJBQUYsRUFBcUJJLFFBQXJCLENBQThCLFdBQTlCO0FBQ0QsR0FSWTtBQVNiQyxNQVRhLGtCQVNOO0FBQ0w7QUFDQSxTQUFLTixNQUFMLENBQVlLLFFBQVosQ0FBcUIsTUFBckI7QUFDQSxTQUFLSCxRQUFMLENBQWNFLFdBQWQsQ0FBMEIsV0FBMUI7QUFDRCxHQWJZO0FBY2JHLE1BZGEsa0JBY047QUFDTCxTQUFLUCxNQUFMLENBQVlJLFdBQVosQ0FBd0IsTUFBeEI7QUFDQSxTQUFLRixRQUFMLENBQWNHLFFBQWQsQ0FBdUIsV0FBdkI7QUFDRCxHQWpCWTtBQWtCYkcsTUFsQmEsa0JBa0JOO0FBQUE7O0FBQ0wsU0FBS1IsTUFBTCxDQUFZUyxJQUFaLENBQWlCLFNBQWpCLEVBQTRCQyxFQUE1QixDQUErQixPQUEvQixFQUF3QztBQUFBLGFBQU0sTUFBS1AsTUFBTCxFQUFOO0FBQUEsS0FBeEM7QUFDRDtBQXBCWSxDIiwiZmlsZSI6Im1vZGFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICAkbW9kYWw6ICQoJy5tb2RhbCcpLFxuICAkb3ZlcmxheTogJCgnLmxvYWRpbmctb3ZlcmxheScpLFxuICBsb2dvdXQoKSB7XG4gICAgdGhpcy4kbW9kYWwucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcbiAgICB0aGlzLiRvdmVybGF5LmFkZENsYXNzKCdpbnZpc2libGUnKTtcbiAgICAkKCcubG9naW4td3JhcHBlcicpLnJlbW92ZUNsYXNzKCdpbnZpc2libGUnKTtcbiAgICAkKCcudmlld2VyLXdyYXBwZXInKS5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG4gIH0sXG4gIHNob3coKSB7XG4gICAgZGVidWdnZXI7XG4gICAgdGhpcy4kbW9kYWwuYWRkQ2xhc3MoJ3Nob3cnKTtcbiAgICB0aGlzLiRvdmVybGF5LnJlbW92ZUNsYXNzKCdpbnZpc2libGUnKTtcbiAgfSxcbiAgaGlkZSgpIHtcbiAgICB0aGlzLiRtb2RhbC5yZW1vdmVDbGFzcygnc2hvdycpO1xuICAgIHRoaXMuJG92ZXJsYXkuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xuICB9LFxuICBpbml0KCkge1xuICAgIHRoaXMuJG1vZGFsLmZpbmQoJy5sb2dvdXQnKS5vbignY2xpY2snLCAoKSA9PiB0aGlzLmxvZ291dCgpKTtcbiAgfVxufVxuIl19
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  commandSelector: '.viewer-tools',
  clearAll: function clearAll() {
    var enabledElemet = cornerstone.getEnabledElement(this.$element);
    var viewport = cornerstone.getViewport(this.$element);

    viewport.voi.windowWidth = enabledElemet.image.windowWidth;
    viewport.voi.windowCenter = enabledElemet.image.windowCenter;
    cornerstone.setViewport(this.$element, viewport);

    cornerstoneTools.globalImageIdSpecificToolStateManager.clear(this.$element);
    cornerstone.updateImage(this.$element);
  },
  initCommands: function initCommands() {
    var _this = this;

    $(this.commandSelector).on('click', 'a[data-command]', function (event) {
      var $element = $(event.currentTarget);
      var $wrapper = $element.parent();
      var tool = $element.attr('data-command');

      _this[tool]();

      $wrapper.addClass('active');

      setTimeout(function () {
        $wrapper.removeClass('active');
      }, 300);
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1hbmRzLmpzIl0sIm5hbWVzIjpbImNvbW1hbmRTZWxlY3RvciIsImNsZWFyQWxsIiwiZW5hYmxlZEVsZW1ldCIsImNvcm5lcnN0b25lIiwiZ2V0RW5hYmxlZEVsZW1lbnQiLCIkZWxlbWVudCIsInZpZXdwb3J0IiwiZ2V0Vmlld3BvcnQiLCJ2b2kiLCJ3aW5kb3dXaWR0aCIsImltYWdlIiwid2luZG93Q2VudGVyIiwic2V0Vmlld3BvcnQiLCJjb3JuZXJzdG9uZVRvb2xzIiwiZ2xvYmFsSW1hZ2VJZFNwZWNpZmljVG9vbFN0YXRlTWFuYWdlciIsImNsZWFyIiwidXBkYXRlSW1hZ2UiLCJpbml0Q29tbWFuZHMiLCIkIiwib24iLCJldmVudCIsImN1cnJlbnRUYXJnZXQiLCIkd3JhcHBlciIsInBhcmVudCIsInRvb2wiLCJhdHRyIiwiYWRkQ2xhc3MiLCJzZXRUaW1lb3V0IiwicmVtb3ZlQ2xhc3MiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQUFlO0FBQ2JBLG1CQUFpQixlQURKO0FBRWJDLFVBRmEsc0JBRUY7QUFDVCxRQUFNQyxnQkFBZ0JDLFlBQVlDLGlCQUFaLENBQThCLEtBQUtDLFFBQW5DLENBQXRCO0FBQ0EsUUFBTUMsV0FBV0gsWUFBWUksV0FBWixDQUF3QixLQUFLRixRQUE3QixDQUFqQjs7QUFFQUMsYUFBU0UsR0FBVCxDQUFhQyxXQUFiLEdBQTJCUCxjQUFjUSxLQUFkLENBQW9CRCxXQUEvQztBQUNBSCxhQUFTRSxHQUFULENBQWFHLFlBQWIsR0FBNEJULGNBQWNRLEtBQWQsQ0FBb0JDLFlBQWhEO0FBQ0FSLGdCQUFZUyxXQUFaLENBQXdCLEtBQUtQLFFBQTdCLEVBQXVDQyxRQUF2Qzs7QUFFQU8scUJBQWlCQyxxQ0FBakIsQ0FBdURDLEtBQXZELENBQTZELEtBQUtWLFFBQWxFO0FBQ0FGLGdCQUFZYSxXQUFaLENBQXdCLEtBQUtYLFFBQTdCO0FBQ0QsR0FaWTtBQWFiWSxjQWJhLDBCQWFFO0FBQUE7O0FBQ2JDLE1BQUUsS0FBS2xCLGVBQVAsRUFBd0JtQixFQUF4QixDQUEyQixPQUEzQixFQUFvQyxpQkFBcEMsRUFBdUQsaUJBQVM7QUFDOUQsVUFBTWQsV0FBV2EsRUFBRUUsTUFBTUMsYUFBUixDQUFqQjtBQUNBLFVBQU1DLFdBQVdqQixTQUFTa0IsTUFBVCxFQUFqQjtBQUNBLFVBQU1DLE9BQU9uQixTQUFTb0IsSUFBVCxDQUFjLGNBQWQsQ0FBYjs7QUFFQSxZQUFLRCxJQUFMOztBQUVBRixlQUFTSSxRQUFULENBQWtCLFFBQWxCOztBQUVBQyxpQkFBVyxZQUFXO0FBQ3BCTCxpQkFBU00sV0FBVCxDQUFxQixRQUFyQjtBQUNELE9BRkQsRUFFRyxHQUZIO0FBR0QsS0FaRDtBQWFEO0FBM0JZLEMiLCJmaWxlIjoiY29tbWFuZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gIGNvbW1hbmRTZWxlY3RvcjogJy52aWV3ZXItdG9vbHMnLFxuICBjbGVhckFsbCgpIHtcbiAgICBjb25zdCBlbmFibGVkRWxlbWV0ID0gY29ybmVyc3RvbmUuZ2V0RW5hYmxlZEVsZW1lbnQodGhpcy4kZWxlbWVudCk7XG4gICAgY29uc3Qgdmlld3BvcnQgPSBjb3JuZXJzdG9uZS5nZXRWaWV3cG9ydCh0aGlzLiRlbGVtZW50KTtcblxuICAgIHZpZXdwb3J0LnZvaS53aW5kb3dXaWR0aCA9IGVuYWJsZWRFbGVtZXQuaW1hZ2Uud2luZG93V2lkdGg7XG4gICAgdmlld3BvcnQudm9pLndpbmRvd0NlbnRlciA9IGVuYWJsZWRFbGVtZXQuaW1hZ2Uud2luZG93Q2VudGVyO1xuICAgIGNvcm5lcnN0b25lLnNldFZpZXdwb3J0KHRoaXMuJGVsZW1lbnQsIHZpZXdwb3J0KTtcblxuICAgIGNvcm5lcnN0b25lVG9vbHMuZ2xvYmFsSW1hZ2VJZFNwZWNpZmljVG9vbFN0YXRlTWFuYWdlci5jbGVhcih0aGlzLiRlbGVtZW50KTtcbiAgICBjb3JuZXJzdG9uZS51cGRhdGVJbWFnZSh0aGlzLiRlbGVtZW50KTtcbiAgfSxcbiAgaW5pdENvbW1hbmRzKCkge1xuICAgICQodGhpcy5jb21tYW5kU2VsZWN0b3IpLm9uKCdjbGljaycsICdhW2RhdGEtY29tbWFuZF0nLCBldmVudCA9PiB7XG4gICAgICBjb25zdCAkZWxlbWVudCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICBjb25zdCAkd3JhcHBlciA9ICRlbGVtZW50LnBhcmVudCgpO1xuICAgICAgY29uc3QgdG9vbCA9ICRlbGVtZW50LmF0dHIoJ2RhdGEtY29tbWFuZCcpO1xuXG4gICAgICB0aGlzW3Rvb2xdKCk7XG5cbiAgICAgICR3cmFwcGVyLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJHdyYXBwZXIucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgfSwgMzAwKTtcbiAgICB9KTtcbiAgfVxufTtcbiJdfQ==
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mockUrl = 'http://7f6cb556.ngrok.io/mock.json';

exports.default = {
  getCase: function getCase() {
    return new Promise(function (resolve, reject) {
      var successHandler = function successHandler(response) {
        resolve(response);
      };
      var errorHandler = function errorHandler(error) {
        if (error) {
          console.error(error);
        }

        reject(error);
      };

      $.ajax(mockUrl).then(successHandler);
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbm5lY3Rvci5qcyJdLCJuYW1lcyI6WyJtb2NrVXJsIiwiZ2V0Q2FzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3VjY2Vzc0hhbmRsZXIiLCJyZXNwb25zZSIsImVycm9ySGFuZGxlciIsImVycm9yIiwiY29uc29sZSIsIiQiLCJhamF4IiwidGhlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFNQSxVQUFVLG9DQUFoQjs7a0JBRWU7QUFDYkMsU0FEYSxxQkFDSDtBQUNSLFdBQU8sSUFBSUMsT0FBSixDQUFZLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQzVDLFVBQU1DLGlCQUFpQixTQUFqQkEsY0FBaUIsQ0FBQ0MsUUFBRCxFQUFjO0FBQ25DSCxnQkFBUUcsUUFBUjtBQUNELE9BRkQ7QUFHQSxVQUFNQyxlQUFlLFNBQWZBLFlBQWUsQ0FBQ0MsS0FBRCxFQUFXO0FBQzlCLFlBQUlBLEtBQUosRUFBVztBQUNUQyxrQkFBUUQsS0FBUixDQUFjQSxLQUFkO0FBQ0Q7O0FBRURKLGVBQU9JLEtBQVA7QUFDRCxPQU5EOztBQVFBRSxRQUFFQyxJQUFGLENBQU9YLE9BQVAsRUFBZ0JZLElBQWhCLENBQXFCUCxjQUFyQjtBQUNELEtBYk0sQ0FBUDtBQWNEO0FBaEJZLEMiLCJmaWxlIjoiY29ubmVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbW9ja1VybCA9ICdodHRwOi8vN2Y2Y2I1NTYubmdyb2suaW8vbW9jay5qc29uJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXRDYXNlKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBjb25zdCBzdWNjZXNzSGFuZGxlciA9IChyZXNwb25zZSkgPT4ge1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBlcnJvckhhbmRsZXIgPSAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgfTtcblxuICAgICAgJC5hamF4KG1vY2tVcmwpLnRoZW4oc3VjY2Vzc0hhbmRsZXIpO1xuICAgIH0pO1xuICB9XG59O1xuIl19
},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _connector = require('./connector');

var _connector2 = _interopRequireDefault(_connector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  getFile: function getFile(url) {
    return new Promise(function (resolve, reject) {
      var request = new XMLHttpRequest();

      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      request.onload = function (oEvent) {
        var arrayBuffer = request.response;
        if (arrayBuffer) {
          try {
            resolve(new Blob([arrayBuffer], { type: 'application/dicom' }));
          } catch (error) {
            reject(error);
          }
        }
      };

      request.send(null);
    });
  },
  getCaseImages: function getCaseImages() {
    var _this = this;

    var $overlay = $('.loading-overlay');
    $overlay.addClass('loading');
    $overlay.removeClass('invisible');

    return new Promise(function (resolve, reject) {
      _connector2.default.getCase().then(function (caseStudy) {
        if (caseStudy && caseStudy.urls) {
          Promise.all(caseStudy.urls.map(_this.getFile)).then(function (files) {
            $overlay.addClass('invisible');
            $overlay.removeClass('loading');

            resolve(files.map(cornerstoneWADOImageLoader.wadouri.fileManager.add));
          }).catch(reject);
        }
      }).catch(function (error) {
        reject(error);
      });
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGVzLmpzIl0sIm5hbWVzIjpbImdldEZpbGUiLCJ1cmwiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcXVlc3QiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJyZXNwb25zZVR5cGUiLCJvbmxvYWQiLCJvRXZlbnQiLCJhcnJheUJ1ZmZlciIsInJlc3BvbnNlIiwiQmxvYiIsInR5cGUiLCJlcnJvciIsInNlbmQiLCJnZXRDYXNlSW1hZ2VzIiwiJG92ZXJsYXkiLCIkIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImdldENhc2UiLCJ0aGVuIiwiY2FzZVN0dWR5IiwidXJscyIsImFsbCIsIm1hcCIsImZpbGVzIiwiY29ybmVyc3RvbmVXQURPSW1hZ2VMb2FkZXIiLCJ3YWRvdXJpIiwiZmlsZU1hbmFnZXIiLCJhZGQiLCJjYXRjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7OztrQkFFZTtBQUNiQSxTQURhLG1CQUNMQyxHQURLLEVBQ0E7QUFDWCxXQUFPLElBQUlDLE9BQUosQ0FBWSxVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUM1QyxVQUFNQyxVQUFVLElBQUlDLGNBQUosRUFBaEI7O0FBRUFELGNBQVFFLElBQVIsQ0FBYSxLQUFiLEVBQW9CTixHQUFwQixFQUF5QixJQUF6QjtBQUNBSSxjQUFRRyxZQUFSLEdBQXVCLGFBQXZCOztBQUVBSCxjQUFRSSxNQUFSLEdBQWlCLFVBQVNDLE1BQVQsRUFBaUI7QUFDaEMsWUFBTUMsY0FBY04sUUFBUU8sUUFBNUI7QUFDQSxZQUFJRCxXQUFKLEVBQWlCO0FBQ2YsY0FBSTtBQUNGUixvQkFBUSxJQUFJVSxJQUFKLENBQVMsQ0FBQ0YsV0FBRCxDQUFULEVBQXdCLEVBQUVHLE1BQU0sbUJBQVIsRUFBeEIsQ0FBUjtBQUNELFdBRkQsQ0FFRSxPQUFPQyxLQUFQLEVBQWM7QUFDZFgsbUJBQU9XLEtBQVA7QUFDRDtBQUNGO0FBQ0YsT0FURDs7QUFXQVYsY0FBUVcsSUFBUixDQUFhLElBQWI7QUFDRCxLQWxCTSxDQUFQO0FBbUJELEdBckJZO0FBc0JiQyxlQXRCYSwyQkFzQkc7QUFBQTs7QUFDZCxRQUFNQyxXQUFXQyxFQUFFLGtCQUFGLENBQWpCO0FBQ0FELGFBQVNFLFFBQVQsQ0FBa0IsU0FBbEI7QUFDQUYsYUFBU0csV0FBVCxDQUFxQixXQUFyQjs7QUFFQSxXQUFPLElBQUluQixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLDBCQUFVa0IsT0FBVixHQUFvQkMsSUFBcEIsQ0FBeUIsVUFBQ0MsU0FBRCxFQUFlO0FBQ3RDLFlBQUlBLGFBQWFBLFVBQVVDLElBQTNCLEVBQWlDO0FBQy9CdkIsa0JBQVF3QixHQUFSLENBQVlGLFVBQVVDLElBQVYsQ0FBZUUsR0FBZixDQUFtQixNQUFLM0IsT0FBeEIsQ0FBWixFQUE4Q3VCLElBQTlDLENBQW1ELFVBQVVLLEtBQVYsRUFBaUI7QUFDbEVWLHFCQUFTRSxRQUFULENBQWtCLFdBQWxCO0FBQ0FGLHFCQUFTRyxXQUFULENBQXFCLFNBQXJCOztBQUVBbEIsb0JBQVF5QixNQUFNRCxHQUFOLENBQVVFLDJCQUEyQkMsT0FBM0IsQ0FBbUNDLFdBQW5DLENBQStDQyxHQUF6RCxDQUFSO0FBQ0QsV0FMRCxFQUtHQyxLQUxILENBS1M3QixNQUxUO0FBTUQ7QUFDRixPQVRELEVBU0c2QixLQVRILENBU1MsVUFBU2xCLEtBQVQsRUFBZ0I7QUFDdkJYLGVBQU9XLEtBQVA7QUFDRCxPQVhEO0FBWUQsS0FiTSxDQUFQO0FBY0Q7QUF6Q1ksQyIsImZpbGUiOiJmaWxlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb25uZWN0b3IgZnJvbSAnLi9jb25uZWN0b3InO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldEZpbGUodXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKG9FdmVudCkge1xuICAgICAgICBjb25zdCBhcnJheUJ1ZmZlciA9IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICAgIGlmIChhcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNvbHZlKG5ldyBCbG9iKFthcnJheUJ1ZmZlcl0sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL2RpY29tJyB9KSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0LnNlbmQobnVsbCk7XG4gICAgfSk7XG4gIH0sXG4gIGdldENhc2VJbWFnZXMoKSB7XG4gICAgY29uc3QgJG92ZXJsYXkgPSAkKCcubG9hZGluZy1vdmVybGF5Jyk7XG4gICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAkb3ZlcmxheS5yZW1vdmVDbGFzcygnaW52aXNpYmxlJyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgQ29ubmVjdG9yLmdldENhc2UoKS50aGVuKChjYXNlU3R1ZHkpID0+IHtcbiAgICAgICAgaWYgKGNhc2VTdHVkeSAmJiBjYXNlU3R1ZHkudXJscykge1xuICAgICAgICAgIFByb21pc2UuYWxsKGNhc2VTdHVkeS51cmxzLm1hcCh0aGlzLmdldEZpbGUpKS50aGVuKGZ1bmN0aW9uIChmaWxlcykge1xuICAgICAgICAgICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xuICAgICAgICAgICAgJG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgcmVzb2x2ZShmaWxlcy5tYXAoY29ybmVyc3RvbmVXQURPSW1hZ2VMb2FkZXIud2Fkb3VyaS5maWxlTWFuYWdlci5hZGQpKTtcbiAgICAgICAgICB9KS5jYXRjaChyZWplY3QpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn07XG4iXX0=
},{"./connector":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

exports.default = {
  active: '',
  toolsSelector: '.viewer-tools',
  deactivateActiveTool: function deactivateActiveTool() {
    if (this.active) {
      this.deactivate(this.active);
      this.active = '';
    }
  },
  toggleTool: function toggleTool(toolToActivate) {
    if (!toolToActivate) {
      return;
    }

    if (isMobile) {
      if (toolToActivate === 'length') {
        toolToActivate = toolToActivate + 'Touch';
      } else {
        toolToActivate = toolToActivate + 'TouchDrag';
      }
    }

    if (this.active) {
      this.deactivate(this.active);
    }

    cornerstoneTools[toolToActivate].enable(this.$element);
    cornerstoneTools[toolToActivate].activate(this.$element, 1);

    this.active = toolToActivate;
  },
  deactivate: function deactivate(tool) {
    cornerstoneTools[tool].disable(this.$element);
    cornerstoneTools[tool].deactivate(this.$element, 1);
  },
  initStackTool: function initStackTool(imageIds) {
    var $thumb = $('.thumb');
    var stack = {
      currentImageIdIndex: 0,
      imageIds: imageIds
    };

    cornerstoneTools.addStackStateManager(this.$element, ['stack']);
    cornerstoneTools.addToolState(this.$element, 'stack', stack);
    cornerstoneTools.stackScrollWheel.activate(this.$element);
    cornerstoneTools.stackScrollMultiTouch.activate(this.$element);

    $thumb.css('width', 100 / stack.imageIds.length + '%');

    $(this.$element).on('CornerstoneNewImage', function () {
      var currentIndex = stack.currentImageIdIndex;

      $thumb.css({
        'margin-left': 100 / stack.imageIds.length * currentIndex + '%'
      });
    });
  },
  attachEvents: function attachEvents() {
    var _this = this;

    // Extract which tool we are using and activating it
    $(this.toolsSelector).on('click', 'a[data-tool]', function (event) {
      var $element = $(event.currentTarget);
      var tool = $element.attr('data-tool');

      $('.active').removeClass('active');

      _this.toggleTool(tool);

      $element.parent().addClass('active');
    });

    // Limiting measurements to 1
    $('#conerstoneViewport').on('mousedown', function () {
      var lengths = cornerstoneTools.getToolState(_this.$element, 'length');

      if (lengths && lengths.data.length === 2) {
        lengths.data.shift();
        cornerstone.updateImage(_this.$element);
      }
    });
  },
  initTools: function initTools(imageIds) {
    cornerstoneTools.mouseInput.enable(this.$element);
    cornerstoneTools.touchInput.enable(this.$element);
    cornerstoneTools.mouseWheelInput.enable(this.$element);

    this.initStackTool(imageIds);

    // removing default context menu
    this.$element.oncontextmenu = function (event) {
      event.preventDefault();

      return false;
    };

    this.attachEvents();
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2xzLmpzIl0sIm5hbWVzIjpbImlzTW9iaWxlIiwidGVzdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImFjdGl2ZSIsInRvb2xzU2VsZWN0b3IiLCJkZWFjdGl2YXRlQWN0aXZlVG9vbCIsImRlYWN0aXZhdGUiLCJ0b2dnbGVUb29sIiwidG9vbFRvQWN0aXZhdGUiLCJjb3JuZXJzdG9uZVRvb2xzIiwiZW5hYmxlIiwiJGVsZW1lbnQiLCJhY3RpdmF0ZSIsInRvb2wiLCJkaXNhYmxlIiwiaW5pdFN0YWNrVG9vbCIsImltYWdlSWRzIiwiJHRodW1iIiwiJCIsInN0YWNrIiwiY3VycmVudEltYWdlSWRJbmRleCIsImFkZFN0YWNrU3RhdGVNYW5hZ2VyIiwiYWRkVG9vbFN0YXRlIiwic3RhY2tTY3JvbGxXaGVlbCIsInN0YWNrU2Nyb2xsTXVsdGlUb3VjaCIsImNzcyIsImxlbmd0aCIsIm9uIiwiY3VycmVudEluZGV4IiwiYXR0YWNoRXZlbnRzIiwiZXZlbnQiLCJjdXJyZW50VGFyZ2V0IiwiYXR0ciIsInJlbW92ZUNsYXNzIiwicGFyZW50IiwiYWRkQ2xhc3MiLCJsZW5ndGhzIiwiZ2V0VG9vbFN0YXRlIiwiZGF0YSIsInNoaWZ0IiwiY29ybmVyc3RvbmUiLCJ1cGRhdGVJbWFnZSIsImluaXRUb29scyIsIm1vdXNlSW5wdXQiLCJ0b3VjaElucHV0IiwibW91c2VXaGVlbElucHV0Iiwib25jb250ZXh0bWVudSIsInByZXZlbnREZWZhdWx0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTUEsV0FBVyw0QkFBNEJDLElBQTVCLENBQWlDQyxVQUFVQyxTQUEzQyxDQUFqQjs7a0JBRWU7QUFDYkMsVUFBUSxFQURLO0FBRWJDLGlCQUFlLGVBRkY7QUFHYkMsc0JBSGEsa0NBR1U7QUFDckIsUUFBSSxLQUFLRixNQUFULEVBQWlCO0FBQ2YsV0FBS0csVUFBTCxDQUFnQixLQUFLSCxNQUFyQjtBQUNBLFdBQUtBLE1BQUwsR0FBYyxFQUFkO0FB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UUQsR0EvRVk7QUFnRmIrQixXQWhGYSxxQkFnRkgxQixRQWhGRyxFQWdGTztBQUNsQlAscUJBQWlCa0MsVUFBakIsQ0FBNEJqQyxNQUE1QixDQUFtQyxLQUFLQyxRQUF4QztBQUNBRixxQkFBaUJtQyxVQUFqQixDQUE0QmxDLE1BQTVCLENBQW1DLEtBQUtDLFFBQXhDO0FBQ0FGLHFCQUFpQm9DLGVBQWpCLENBQWlDbkMsTUFBakMsQ0FBd0MsS0FBS0MsUUFBN0M7O0FBRUEsU0FBS0ksYUFBTCxDQUFtQkMsUUFBbkI7O0FBRUE7QUFDQSxTQUFLTCxRQUFMLENBQWNtQyxhQUFkLEdBQThCLFVBQVVoQixLQUFWLEVBQWlCO0FBQzdDQSxZQUFNaUIsY0FBTjs7QUFFQSxhQUFPLEtBQVA7QUFDRCxLQUpEOztBQU1BLFNBQUtsQixZQUFMO0FBQ0Q7QUEvRlksQyIsImZpbGUiOiJ0b29scy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb21tYW5kcyBmcm9tICcuL2NvbW1hbmRzJztcblxuY29uc3QgaXNNb2JpbGUgPSAvaVBob25lfGlQYWR8aVBvZHxBbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhY3RpdmU6ICcnLFxuICB0b29sc1NlbGVjdG9yOiAnLnZpZXdlci10b29scycsXG4gIGRlYWN0aXZhdGVBY3RpdmVUb29sKCkge1xuICAgIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgICAgdGhpcy5kZWFjdGl2YXRlKHRoaXMuYWN0aXZlKTtcbiAgICAgIHRoaXMuYWN0aXZlID0gJyc7XG4gICAgfVxuICB9LFxuICB0b2dnbGVUb29sKHRvb2xUb0FjdGl2YXRlKSB7XG4gICAgaWYgKCF0b29sVG9BY3RpdmF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc01vYmlsZSkge1xuICAgICAgaWYgKHRvb2xUb0FjdGl2YXRlID09PSAnbGVuZ3RoJykge1xuICAgICAgICB0b29sVG9BY3RpdmF0ZSA9IGAke3Rvb2xUb0FjdGl2YXRlfVRvdWNoYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvb2xUb0FjdGl2YXRlID0gYCR7dG9vbFRvQWN0aXZhdGV9VG91Y2hEcmFnYDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgIHRoaXMuZGVhY3RpdmF0ZSh0aGlzLmFjdGl2ZSk7XG4gICAgfVxuXG4gICAgY29ybmVyc3RvbmVUb29sc1t0b29sVG9BY3RpdmF0ZV0uZW5hYmxlKHRoaXMuJGVsZW1lbnQpO1xuICAgIGNvcm5lcnN0b25lVG9vbHNbdG9vbFRvQWN0aXZhdGVdLmFjdGl2YXRlKHRoaXMuJGVsZW1lbnQsIDEpO1xuXG4gICAgdGhpcy5hY3RpdmUgPSB0b29sVG9BY3RpdmF0ZTtcbiAgfSxcbiAgZGVhY3RpdmF0ZSh0b29sKSB7XG4gICAgY29ybmVyc3RvbmVUb29sc1t0b29sXS5kaXNhYmxlKHRoaXMuJGVsZW1lbnQpO1xuICAgIGNvcm5lcnN0b25lVG9vbHNbdG9vbF0uZGVhY3RpdmF0ZSh0aGlzLiRlbGVtZW50LCAxKTtcbiAgfSxcbiAgaW5pdFN0YWNrVG9vbChpbWFnZUlkcykge1xuICAgIGNvbnN0ICR0aHVtYiA9ICQoJy50aHVtYicpO1xuICAgIGNvbnN0IHN0YWNrID0ge1xuICAgICAgY3VycmVudEltYWdlSWRJbmRleDogMCxcbiAgICAgIGltYWdlSWRzOiBpbWFnZUlkc1xuICAgIH07XG5cbiAgICBjb3JuZXJzdG9uZVRvb2xzLmFkZFN0YWNrU3RhdGVNYW5hZ2VyKHRoaXMuJGVsZW1lbnQsIFsnc3RhY2snXSk7XG4gICAgY29ybmVyc3RvbmVUb29scy5hZGRUb29sU3RhdGUodGhpcy4kZWxlbWVudCwgJ3N0YWNrJywgc3RhY2spO1xuICAgIGNvcm5lcnN0b25lVG9vbHMuc3RhY2tTY3JvbGxXaGVlbC5hY3RpdmF0ZSh0aGlzLiRlbGVtZW50KTtcbiAgICBjb3JuZXJzdG9uZVRvb2xzLnN0YWNrU2Nyb2xsTXVsdGlUb3VjaC5hY3RpdmF0ZSh0aGlzLiRlbGVtZW50KTtcblxuICAgICR0aHVtYi5jc3MoJ3dpZHRoJywgKDEwMC9zdGFjay5pbWFnZUlkcy5sZW5ndGgpICsgJyUnKTtcblxuICAgICQodGhpcy4kZWxlbWVudCkub24oJ0Nvcm5lcnN0b25lTmV3SW1hZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY3VycmVudEluZGV4ID0gc3RhY2suY3VycmVudEltYWdlSWRJbmRleDtcblxuICAgICAgJHRodW1iLmNzcyh7XG4gICAgICAgICdtYXJnaW4tbGVmdCc6ICgoMTAwL3N0YWNrLmltYWdlSWRzLmxlbmd0aCkqY3VycmVudEluZGV4KSArICclJ1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIGF0dGFjaEV2ZW50cygpIHtcbiAgICAvLyBFeHRyYWN0IHdoaWNoIHRvb2wgd2UgYXJlIHVzaW5nIGFuZCBhY3RpdmF0aW5nIGl0XG4gICAgJCh0aGlzLnRvb2xzU2VsZWN0b3IpLm9uKCdjbGljaycsICdhW2RhdGEtdG9vbF0nLCBldmVudCA9PiB7XG4gICAgICBjb25zdCAkZWxlbWVudCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICBjb25zdCB0b29sID0gJGVsZW1lbnQuYXR0cignZGF0YS10b29sJyk7XG5cbiAgICAgICQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgIHRoaXMudG9nZ2xlVG9vbCh0b29sKTtcblxuICAgICAgJGVsZW1lbnQucGFyZW50KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH0pO1xuXG4gICAgLy8gTGltaXRpbmcgbWVhc3VyZW1lbnRzIHRvIDFcbiAgICAkKCcjY29uZXJzdG9uZVZpZXdwb3J0Jykub24oJ21vdXNlZG93bicsICgpID0+IHtcbiAgICAgIGNvbnN0IGxlbmd0aHMgPSBjb3JuZXJzdG9uZVRvb2xzLmdldFRvb2xTdGF0ZSh0aGlzLiRlbGVtZW50LCAnbGVuZ3RoJyk7XG5cbiAgICAgIGlmIChsZW5ndGhzICYmIGxlbmd0aHMuZGF0YS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgbGVuZ3Rocy5kYXRhLnNoaWZ0KCk7XG4gICAgICAgIGNvcm5lcnN0b25lLnVwZGF0ZUltYWdlKHRoaXMuJGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBpbml0VG9vbHMoaW1hZ2VJZHMpIHtcbiAgICBjb3JuZXJzdG9uZVRvb2xzLm1vdXNlSW5wdXQuZW5hYmxlKHRoaXMuJGVsZW1lbnQpO1xuICAgIGNvcm5lcnN0b25lVG9vbHMudG91Y2hJbnB1dC5lbmFibGUodGhpcy4kZWxlbWVudCk7XG4gICAgY29ybmVyc3RvbmVUb29scy5tb3VzZVdoZWVsSW5wdXQuZW5hYmxlKHRoaXMuJGVsZW1lbnQpO1xuXG4gICAgdGhpcy5pbml0U3RhY2tUb29sKGltYWdlSWRzKTtcblxuICAgIC8vIHJlbW92aW5nIGRlZmF1bHQgY29udGV4dCBtZW51XG4gICAgdGhpcy4kZWxlbWVudC5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIHRoaXMuYXR0YWNoRXZlbnRzKCk7XG4gIH1cbn07XG4iXX0=
},{"./commands":3}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _files = require('./files');

var _files2 = _interopRequireDefault(_files);

var _tools = require('./tools');

var _tools2 = _interopRequireDefault(_tools);

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _modal = require('../modal/modal');

var _modal2 = _interopRequireDefault(_modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  submit: function submit() {
    $('.loading-overlay').removeClass('invisible').addClass('submitting');

    setTimeout(function () {
      _modal2.default.show();

      $('.loading-overlay').removeClass('submitting');
    }, 2000);
  },
  initViewer: function initViewer() {
    var _this = this;

    var $window = $(window);
    var $submit = $('.viewer-actions button.submit');
    var $viewer = $('.viewer-wrapper');
    var $element = $('#conerstoneViewport')[0];

    _modal2.default.init();

    $viewer.removeClass('invisible');

    _tools2.default.$element = $element;
    _commands2.default.$element = $element;

    $window.on('resize', function () {
      return cornerstone.resize($element, true);
    });
    $submit.on('click', function () {
      return _this.submit();
    });

    cornerstone.enable($element);

    _files2.default.getCaseImages().then(function (imagesIds) {
      _tools2.default.initTools(imagesIds);
      _commands2.default.initCommands();

      cornerstone.loadImage(imagesIds[0]).then(function (image) {
        cornerstone.displayImage($element, image);
      });
    }).catch();
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdlci5qcyJdLCJuYW1lcyI6WyJzdWJtaXQiLCIkIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsInNldFRpbWVvdXQiLCJzaG93IiwiaW5pdFZpZXdlciIsIiR3aW5kb3ciLCJ3aW5kb3ciLCIkc3VibWl0IiwiJHZpZXdlciIsIiRlbGVtZW50IiwiaW5pdCIsIm9uIiwiY29ybmVyc3RvbmUiLCJyZXNpemUiLCJlbmFibGUiLCJnZXRDYXNlSW1hZ2VzIiwidGhlbiIsImltYWdlc0lkcyIsImluaXRUb29scyIsImluaXRDb21tYW5kcyIsImxvYWRJbWFnZSIsImltYWdlIiwiZGlzcGxheUltYWdlIiwiY2F0Y2giXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7a0JBRWU7QUFDYkEsUUFEYSxvQkFDSjtBQUNQQyxNQUFFLGtCQUFGLEVBQXNCQyxXQUF0QixDQUFrQyxXQUFsQyxFQUErQ0MsUUFBL0MsQ0FBd0QsWUFBeEQ7O0FBRUFDLGVBQVcsWUFBWTtBQUNyQixzQkFBTUMsSUFBTjs7QUFFQUosUUFBRSxrQkFBRixFQUFzQkMsV0FBdEIsQ0FBa0MsWUFBbEM7QUFDRCxLQUpELEVBSUcsSUFKSDtBQUtELEdBVFk7QUFVYkksWUFWYSx3QkFVQTtBQUFBOztBQUNYLFFBQU1DLFVBQVVOLEVBQUVPLE1BQUYsQ0FBaEI7QUFDQSxRQUFNQyxVQUFVUixFQUFFLCtCQUFGLENBQWhCO0FBQ0EsUUFBTVMsVUFBVVQsRUFBRSxpQkFBRixDQUFoQjtBQUNBLFFBQU1VLFdBQVdWLEVBQUUscUJBQUYsRUFBeUIsQ0FBekIsQ0FBakI7O0FBRUEsb0JBQU1XLElBQU47O0FBRUFGLFlBQVFSLFdBQVIsQ0FBb0IsV0FBcEI7O0FBRUEsb0JBQU1TLFFBQU4sR0FBaUJBLFFBQWpCO0FBQ0EsdUJBQVNBLFFBQVQsR0FBb0JBLFFBQXBCOztBQUVBSixZQUFRTSxFQUFSLENBQVcsUUFBWCxFQUFxQjtBQUFBLGFBQU1DLFlBQVlDLE1BQVosQ0FBbUJKLFFBQW5CLEVBQTZCLElBQTdCLENBQU47QUFBQSxLQUFyQjtBQUNBRixZQUFRSSxFQUFSLENBQVcsT0FBWCxFQUFvQjtBQUFBLGFBQU0sTUFBS2IsTUFBTCxFQUFOO0FBQUEsS0FBcEI7O0FBRUFjLGdCQUFZRSxNQUFaLENBQW1CTCxRQUFuQjs7QUFFQSxvQkFBTU0sYUFBTixHQUFzQkMsSUFBdEIsQ0FBMkIsVUFBVUMsU0FBVixFQUFxQjtBQUM5QyxzQkFBTUMsU0FBTixDQUFnQkQsU0FBaEI7QUFDQSx5QkFBU0UsWUFBVDs7QUFFQVAsa0JBQVlRLFNBQVosQ0FBc0JILFVBQVUsQ0FBVixDQUF0QixFQUFvQ0QsSUFBcEMsQ0FBeUMsVUFBU0ssS0FBVCxFQUFnQjtBQUN2RFQsb0JBQVlVLFlBQVosQ0FBeUJiLFFBQXpCLEVBQW1DWSxLQUFuQztBQUNELE9BRkQ7QUFHRCxLQVBELEVBT0dFLEtBUEg7QUFRRDtBQXBDWSxDIiwiZmlsZSI6InZpZXdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBGaWxlcyBmcm9tICcuL2ZpbGVzJztcbmltcG9ydCBUb29scyBmcm9tICcuL3Rvb2xzJztcbmltcG9ydCBDb21tYW5kcyBmcm9tICcuL2NvbW1hbmRzJztcbmltcG9ydCBNb2RhbCBmcm9tICcuLi9tb2RhbC9tb2RhbCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc3VibWl0KCkge1xuICAgICQoJy5sb2FkaW5nLW92ZXJsYXknKS5yZW1vdmVDbGFzcygnaW52aXNpYmxlJykuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgTW9kYWwuc2hvdygpO1xuXG4gICAgICAkKCcubG9hZGluZy1vdmVybGF5JykucmVtb3ZlQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcbiAgICB9LCAyMDAwKTtcbiAgfSxcbiAgaW5pdFZpZXdlcigpIHtcbiAgICBjb25zdCAkd2luZG93ID0gJCh3aW5kb3cpO1xuICAgIGNvbnN0ICRzdWJtaXQgPSAkKCcudmlld2VyLWFjdGlvbnMgYnV0dG9uLnN1Ym1pdCcpO1xuICAgIGNvbnN0ICR2aWV3ZXIgPSAkKCcudmlld2VyLXdyYXBwZXInKTtcbiAgICBjb25zdCAkZWxlbWVudCA9ICQoJyNjb25lcnN0b25lVmlld3BvcnQnKVswXTtcblxuICAgIE1vZGFsLmluaXQoKTtcblxuICAgICR2aWV3ZXIucmVtb3ZlQ2xhc3MoJ2ludmlzaWJsZScpO1xuXG4gICAgVG9vbHMuJGVsZW1lbnQgPSAkZWxlbWVudDtcbiAgICBDb21tYW5kcy4kZWxlbWVudCA9ICRlbGVtZW50O1xuXG4gICAgJHdpbmRvdy5vbigncmVzaXplJywgKCkgPT4gY29ybmVyc3RvbmUucmVzaXplKCRlbGVtZW50LCB0cnVlKSk7XG4gICAgJHN1Ym1pdC5vbignY2xpY2snLCAoKSA9PiB0aGlzLnN1Ym1pdCgpKTtcblxuICAgIGNvcm5lcnN0b25lLmVuYWJsZSgkZWxlbWVudCk7XG5cbiAgICBGaWxlcy5nZXRDYXNlSW1hZ2VzKCkudGhlbihmdW5jdGlvbiAoaW1hZ2VzSWRzKSB7XG4gICAgICBUb29scy5pbml0VG9vbHMoaW1hZ2VzSWRzKTtcbiAgICAgIENvbW1hbmRzLmluaXRDb21tYW5kcygpO1xuXG4gICAgICBjb3JuZXJzdG9uZS5sb2FkSW1hZ2UoaW1hZ2VzSWRzWzBdKS50aGVuKGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIGNvcm5lcnN0b25lLmRpc3BsYXlJbWFnZSgkZWxlbWVudCwgaW1hZ2UpO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKTtcbiAgfVxufVxuIl19
},{"../modal/modal":2,"./commands":3,"./files":5,"./tools":6}]},{},[1])