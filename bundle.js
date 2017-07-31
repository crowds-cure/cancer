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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfYTQxYTU2MWYuanMiXSwibmFtZXMiOlsiJCIsIm9uIiwiZXZ0IiwicHJldmVudERlZmF1bHQiLCIkbG9hZGluZ0ltZyIsIiRsb2dpbkZvcm0iLCJyZW1vdmVDbGFzcyIsInNldFRpbWVvdXQiLCJhZGRDbGFzcyIsImluaXRWaWV3ZXIiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztBQUVBQSxFQUFFLHFCQUFGLEVBQXlCQyxFQUF6QixDQUE0QixRQUE1QixFQUFzQyxVQUFVQyxHQUFWLEVBQWU7QUFDbkRBLE1BQUlDLGNBQUo7O0FBRUEsTUFBTUMsY0FBY0osRUFBRSwrQ0FBRixDQUFwQjtBQUNBLE1BQU1LLGFBQWFMLEVBQUUsZ0JBQUYsQ0FBbkI7O0FBRUFJLGNBQVlFLFdBQVosQ0FBd0IsV0FBeEI7O0FBRUE7QUFDQUMsYUFBVyxZQUFZO0FBQ3JCSCxnQkFBWUksUUFBWixDQUFxQixXQUFyQjtBQUNBSCxlQUFXRyxRQUFYLENBQW9CLFdBQXBCOztBQUVBLHFCQUFPQyxVQUFQO0FBQ0QsR0FMRCxFQUtHLElBTEg7QUFNRCxDQWZEIiwiZmlsZSI6ImZha2VfYTQxYTU2MWYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlld2VyIGZyb20gJy4uL3ZpZXdlci92aWV3ZXInO1xuXG4kKCcubG9naW4td3JhcHBlciBmb3JtJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIChldnQpIHtcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgY29uc3QgJGxvYWRpbmdJbWcgPSAkKCcubG9naW4td3JhcHBlciBmb3JtIGJ1dHRvbi5zdWJtaXQgaW1nLmxvYWRpbmcnKTtcbiAgY29uc3QgJGxvZ2luRm9ybSA9ICQoJy5sb2dpbi13cmFwcGVyJyk7XG5cbiAgJGxvYWRpbmdJbWcucmVtb3ZlQ2xhc3MoJ2ludmlzaWJsZScpO1xuICBcbiAgLy8gTW9ja2luZyBsb2dpblxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAkbG9hZGluZ0ltZy5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG4gICAgJGxvZ2luRm9ybS5hZGRDbGFzcygnaW52aXNpYmxlJyk7IFxuXG4gICAgVmlld2VyLmluaXRWaWV3ZXIoKTtcbiAgfSwgMTAwMCk7XG59KTtcbiJdfQ==
},{"../viewer/viewer":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  commandSelector: '.viewer-tools',
  clearAll: function clearAll() {
    var enabledElemet = cornerstone.getEnabledElement(this.element);
    var viewport = cornerstone.getViewport(this.element);

    viewport.voi.windowWidth = enabledElemet.image.windowWidth;
    viewport.voi.windowCenter = enabledElemet.image.windowCenter;
    cornerstone.setViewport(this.element, viewport);

    cornerstoneTools.globalImageIdSpecificToolStateManager.clear(this.element);
    cornerstone.updateImage(this.element);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1hbmRzLmpzIl0sIm5hbWVzIjpbImNvbW1hbmRTZWxlY3RvciIsImNsZWFyQWxsIiwiZW5hYmxlZEVsZW1ldCIsImNvcm5lcnN0b25lIiwiZ2V0RW5hYmxlZEVsZW1lbnQiLCJlbGVtZW50Iiwidmlld3BvcnQiLCJnZXRWaWV3cG9ydCIsInZvaSIsIndpbmRvd1dpZHRoIiwiaW1hZ2UiLCJ3aW5kb3dDZW50ZXIiLCJzZXRWaWV3cG9ydCIsImNvcm5lcnN0b25lVG9vbHMiLCJnbG9iYWxJbWFnZUlkU3BlY2lmaWNUb29sU3RhdGVNYW5hZ2VyIiwiY2xlYXIiLCJ1cGRhdGVJbWFnZSIsImluaXRDb21tYW5kcyIsIiQiLCJvbiIsIiRlbGVtZW50IiwiZXZlbnQiLCJjdXJyZW50VGFyZ2V0IiwiJHdyYXBwZXIiLCJwYXJlbnQiLCJ0b29sIiwiYXR0ciIsImFkZENsYXNzIiwic2V0VGltZW91dCIsInJlbW92ZUNsYXNzIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFBZTtBQUNiQSxtQkFBaUIsZUFESjtBQUViQyxVQUZhLHNCQUVGO0FBQ1QsUUFBTUMsZ0JBQWdCQyxZQUFZQyxpQkFBWixDQUE4QixLQUFLQyxPQUFuQyxDQUF0QjtBQUNBLFFBQU1DLFdBQVdILFlBQVlJLFdBQVosQ0FBd0IsS0FBS0YsT0FBN0IsQ0FBakI7O0FBRUFDLGFBQVNFLEdBQVQsQ0FBYUMsV0FBYixHQUEyQlAsY0FBY1EsS0FBZCxDQUFvQkQsV0FBL0M7QUFDQUgsYUFBU0UsR0FBVCxDQUFhRyxZQUFiLEdBQTRCVCxjQUFjUSxLQUFkLENBQW9CQyxZQUFoRDtBQUNBUixnQkFBWVMsV0FBWixDQUF3QixLQUFLUCxPQUE3QixFQUFzQ0MsUUFBdEM7O0FBRUFPLHFCQUFpQkMscUNBQWpCLENBQXVEQyxLQUF2RCxDQUE2RCxLQUFLVixPQUFsRTtBQUNBRixnQkFBWWEsV0FBWixDQUF3QixLQUFLWCxPQUE3QjtBQUNELEdBWlk7QUFhYlksY0FiYSwwQkFhRTtBQUFBOztBQUNiQyxNQUFFLEtBQUtsQixlQUFQLEVBQXdCbUIsRUFBeEIsQ0FBMkIsT0FBM0IsRUFBb0MsaUJBQXBDLEVBQXVELGlCQUFTO0FBQzlELFVBQU1DLFdBQVdGLEVBQUVHLE1BQU1DLGFBQVIsQ0FBakI7QUFDQSxVQUFNQyxXQUFXSCxTQUFTSSxNQUFULEVBQWpCO0FBQ0EsVUFBTUMsT0FBT0wsU0FBU00sSUFBVCxDQUFjLGNBQWQsQ0FBYjs7QUFFQSxZQUFLRCxJQUFMOztBQUVBRixlQUFTSSxRQUFULENBQWtCLFFBQWxCOztBQUVBQyxpQkFBVyxZQUFXO0FBQ3BCTCxpQkFBU00sV0FBVCxDQUFxQixRQUFyQjtBQUNELE9BRkQsRUFFRyxHQUZIO0FBR0QsS0FaRDtBQWFEO0FBM0JZLEMiLCJmaWxlIjoiY29tbWFuZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gIGNvbW1hbmRTZWxlY3RvcjogJy52aWV3ZXItdG9vbHMnLFxuICBjbGVhckFsbCgpIHtcbiAgICBjb25zdCBlbmFibGVkRWxlbWV0ID0gY29ybmVyc3RvbmUuZ2V0RW5hYmxlZEVsZW1lbnQodGhpcy5lbGVtZW50KTtcbiAgICBjb25zdCB2aWV3cG9ydCA9IGNvcm5lcnN0b25lLmdldFZpZXdwb3J0KHRoaXMuZWxlbWVudCk7XG5cbiAgICB2aWV3cG9ydC52b2kud2luZG93V2lkdGggPSBlbmFibGVkRWxlbWV0LmltYWdlLndpbmRvd1dpZHRoO1xuICAgIHZpZXdwb3J0LnZvaS53aW5kb3dDZW50ZXIgPSBlbmFibGVkRWxlbWV0LmltYWdlLndpbmRvd0NlbnRlcjtcbiAgICBjb3JuZXJzdG9uZS5zZXRWaWV3cG9ydCh0aGlzLmVsZW1lbnQsIHZpZXdwb3J0KTtcblxuICAgIGNvcm5lcnN0b25lVG9vbHMuZ2xvYmFsSW1hZ2VJZFNwZWNpZmljVG9vbFN0YXRlTWFuYWdlci5jbGVhcih0aGlzLmVsZW1lbnQpO1xuICAgIGNvcm5lcnN0b25lLnVwZGF0ZUltYWdlKHRoaXMuZWxlbWVudCk7XG4gIH0sXG4gIGluaXRDb21tYW5kcygpIHtcbiAgICAkKHRoaXMuY29tbWFuZFNlbGVjdG9yKS5vbignY2xpY2snLCAnYVtkYXRhLWNvbW1hbmRdJywgZXZlbnQgPT4ge1xuICAgICAgY29uc3QgJGVsZW1lbnQgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgY29uc3QgJHdyYXBwZXIgPSAkZWxlbWVudC5wYXJlbnQoKTtcbiAgICAgIGNvbnN0IHRvb2wgPSAkZWxlbWVudC5hdHRyKCdkYXRhLWNvbW1hbmQnKTtcblxuICAgICAgdGhpc1t0b29sXSgpO1xuXG4gICAgICAkd3JhcHBlci5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICR3cmFwcGVyLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgIH0sIDMwMCk7XG4gICAgfSk7XG4gIH1cbn07XG4iXX0=
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mockUrl = 'http://localhost:4000/mock.json';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbm5lY3Rvci5qcyJdLCJuYW1lcyI6WyJtb2NrVXJsIiwiZ2V0Q2FzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3VjY2Vzc0hhbmRsZXIiLCJyZXNwb25zZSIsImVycm9ySGFuZGxlciIsImVycm9yIiwiY29uc29sZSIsIiQiLCJhamF4IiwidGhlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFNQSxVQUFVLGlDQUFoQjs7a0JBRWU7QUFDYkMsU0FEYSxxQkFDSDtBQUNSLFdBQU8sSUFBSUMsT0FBSixDQUFZLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQzVDLFVBQU1DLGlCQUFpQixTQUFqQkEsY0FBaUIsQ0FBQ0MsUUFBRCxFQUFjO0FBQ25DSCxnQkFBUUcsUUFBUjtBQUNELE9BRkQ7QUFHQSxVQUFNQyxlQUFlLFNBQWZBLFlBQWUsQ0FBQ0MsS0FBRCxFQUFXO0FBQzlCLFlBQUlBLEtBQUosRUFBVztBQUNUQyxrQkFBUUQsS0FBUixDQUFjQSxLQUFkO0FBQ0Q7O0FBRURKLGVBQU9JLEtBQVA7QUFDRCxPQU5EOztBQVFBRSxRQUFFQyxJQUFGLENBQU9YLE9BQVAsRUFBZ0JZLElBQWhCLENBQXFCUCxjQUFyQjtBQUNELEtBYk0sQ0FBUDtBQWNEO0FBaEJZLEMiLCJmaWxlIjoiY29ubmVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbW9ja1VybCA9ICdodHRwOi8vbG9jYWxob3N0OjQwMDAvbW9jay5qc29uJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXRDYXNlKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBjb25zdCBzdWNjZXNzSGFuZGxlciA9IChyZXNwb25zZSkgPT4ge1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBlcnJvckhhbmRsZXIgPSAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgfTtcblxuICAgICAgJC5hamF4KG1vY2tVcmwpLnRoZW4oc3VjY2Vzc0hhbmRsZXIpO1xuICAgIH0pO1xuICB9XG59O1xuIl19
},{}],4:[function(require,module,exports){
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

    return new Promise(function (resolve, reject) {
      _connector2.default.getCase().then(function (caseStudy) {
        if (caseStudy && caseStudy.urls) {
          Promise.all(caseStudy.urls.map(_this.getFile)).then(function (files) {
            resolve(files.map(cornerstoneWADOImageLoader.wadouri.fileManager.add));
          }).catch(reject);
        }
      }).catch(function (error) {
        reject(error);
      });
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGVzLmpzIl0sIm5hbWVzIjpbImdldEZpbGUiLCJ1cmwiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcXVlc3QiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJyZXNwb25zZVR5cGUiLCJvbmxvYWQiLCJvRXZlbnQiLCJhcnJheUJ1ZmZlciIsInJlc3BvbnNlIiwiQmxvYiIsInR5cGUiLCJlcnJvciIsInNlbmQiLCJnZXRDYXNlSW1hZ2VzIiwiZ2V0Q2FzZSIsInRoZW4iLCJjYXNlU3R1ZHkiLCJ1cmxzIiwiYWxsIiwibWFwIiwiZmlsZXMiLCJjb3JuZXJzdG9uZVdBRE9JbWFnZUxvYWRlciIsIndhZG91cmkiLCJmaWxlTWFuYWdlciIsImFkZCIsImNhdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7O2tCQUVlO0FBQ2JBLFNBRGEsbUJBQ0xDLEdBREssRUFDQTtBQUNYLFdBQU8sSUFBSUMsT0FBSixDQUFZLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQzVDLFVBQU1DLFVBQVUsSUFBSUMsY0FBSixFQUFoQjs7QUFFQUQsY0FBUUUsSUFBUixDQUFhLEtBQWIsRUFBb0JOLEdBQXBCLEVBQXlCLElBQXpCO0FBQ0FJLGNBQVFHLFlBQVIsR0FBdUIsYUFBdkI7O0FBRUFILGNBQVFJLE1BQVIsR0FBaUIsVUFBU0MsTUFBVCxFQUFpQjtBQUNoQyxZQUFNQyxjQUFjTixRQUFRTyxRQUE1QjtBQUNBLFlBQUlELFdBQUosRUFBaUI7QUFDZixjQUFJO0FBQ0ZSLG9CQUFRLElBQUlVLElBQUosQ0FBUyxDQUFDRixXQUFELENBQVQsRUFBd0IsRUFBRUcsTUFBTSxtQkFBUixFQUF4QixDQUFSO0FBQ0QsV0FGRCxDQUVFLE9BQU9DLEtBQVAsRUFBYztBQUNkWCxtQkFBT1csS0FBUDtBQUNEO0FBQ0Y7QUFDRixPQVREOztBQVdBVixjQUFRVyxJQUFSLENBQWEsSUFBYjtBQUNELEtBbEJNLENBQVA7QUFtQkQsR0FyQlk7QUFzQmJDLGVBdEJhLDJCQXNCRztBQUFBOztBQUNkLFdBQU8sSUFBSWYsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QywwQkFBVWMsT0FBVixHQUFvQkMsSUFBcEIsQ0FBeUIsVUFBQ0MsU0FBRCxFQUFlO0FBQ3RDLFlBQUlBLGFBQWFBLFVBQVVDLElBQTNCLEVBQWlDO0FBQy9CbkIsa0JBQVFvQixHQUFSLENBQVlGLFVBQVVDLElBQVYsQ0FBZUUsR0FBZixDQUFtQixNQUFLdkIsT0FBeEIsQ0FBWixFQUE4Q21CLElBQTlDLENBQW1ELFVBQVVLLEtBQVYsRUFBaUI7QUFDbEVyQixvQkFBUXFCLE1BQU1ELEdBQU4sQ0FBVUUsMkJBQTJCQyxPQUEzQixDQUFtQ0MsV0FBbkMsQ0FBK0NDLEdBQXpELENBQVI7QUFDRCxXQUZELEVBRUdDLEtBRkgsQ0FFU3pCLE1BRlQ7QUFHRDtBQUNGLE9BTkQsRUFNR3lCLEtBTkgsQ0FNUyxVQUFTZCxLQUFULEVBQWdCO0FBQ3ZCWCxlQUFPVyxLQUFQO0FBQ0QsT0FSRDtBQVNELEtBVk0sQ0FBUDtBQVdEO0FBbENZLEMiLCJmaWxlIjoiZmlsZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29ubmVjdG9yIGZyb20gJy4vY29ubmVjdG9yJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXRGaWxlKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcblxuICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbihvRXZlbnQpIHtcbiAgICAgICAgY29uc3QgYXJyYXlCdWZmZXIgPSByZXF1ZXN0LnJlc3BvbnNlO1xuICAgICAgICBpZiAoYXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzb2x2ZShuZXcgQmxvYihbYXJyYXlCdWZmZXJdLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9kaWNvbScgfSkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmVxdWVzdC5zZW5kKG51bGwpO1xuICAgIH0pO1xuICB9LFxuICBnZXRDYXNlSW1hZ2VzKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBDb25uZWN0b3IuZ2V0Q2FzZSgpLnRoZW4oKGNhc2VTdHVkeSkgPT4ge1xuICAgICAgICBpZiAoY2FzZVN0dWR5ICYmIGNhc2VTdHVkeS51cmxzKSB7XG4gICAgICAgICAgUHJvbWlzZS5hbGwoY2FzZVN0dWR5LnVybHMubWFwKHRoaXMuZ2V0RmlsZSkpLnRoZW4oZnVuY3Rpb24gKGZpbGVzKSB7XG4gICAgICAgICAgICByZXNvbHZlKGZpbGVzLm1hcChjb3JuZXJzdG9uZVdBRE9JbWFnZUxvYWRlci53YWRvdXJpLmZpbGVNYW5hZ2VyLmFkZCkpO1xuICAgICAgICAgIH0pLmNhdGNoKHJlamVjdCk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcbiJdfQ==
},{"./connector":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    if (this.active) {
      this.deactivate(this.active);
    }

    cornerstoneTools[toolToActivate].enable(this.element);
    cornerstoneTools[toolToActivate].activate(this.element, 1);

    this.active = toolToActivate;
  },
  deactivate: function deactivate(tool) {
    cornerstoneTools[tool].disable(this.element);
    cornerstoneTools[tool].deactivate(this.element, 1);
  },
  initStackTool: function initStackTool(imageIds) {
    var $thumb = $('.thumb');
    var stack = {
      currentImageIdIndex: 0,
      imageIds: imageIds
    };

    cornerstoneTools.addStackStateManager(this.element, ['stack']);
    cornerstoneTools.addToolState(this.element, 'stack', stack);
    cornerstoneTools.stackScrollWheel.activate(this.element);

    $thumb.css('width', 100 / stack.imageIds.length + '%');

    $(this.element).on('CornerstoneNewImage', function () {
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
      var lengths = cornerstoneTools.getToolState(_this.element, 'length');

      if (lengths && lengths.data.length === 2) {
        lengths.data.shift();
        cornerstone.updateImage(_this.element);
      }
    });
  },
  initTools: function initTools(imageIds) {
    cornerstoneTools.mouseInput.enable(this.element);
    cornerstoneTools.pan.activate(this.element, 2);
    cornerstoneTools.zoom.activate(this.element, 4);
    cornerstoneTools.mouseWheelInput.enable(this.element);

    this.initStackTool(imageIds);

    // removing default context menu
    this.element.oncontextmenu = function (event) {
      event.preventDefault();

      return false;
    };

    this.attachEvents();
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2xzLmpzIl0sIm5hbWVzIjpbImFjdGl2ZSIsInRvb2xzU2VsZWN0b3IiLCJkZWFjdGl2YXRlQWN0aXZlVG9vbCIsImRlYWN0aXZhdGUiLCJ0b2dnbGVUb29sIiwidG9vbFRvQWN0aXZhdGUiLCJjb3JuZXJzdG9uZVRvb2xzIiwiZW5hYmxlIiwiZWxlbWVudCIsImFjdGl2YXRlIiwidG9vbCIsImRpc2FibGUiLCJpbml0U3RhY2tUb29sIiwiaW1hZ2VJZHMiLCIkdGh1bWIiLCIkIiwic3RhY2siLCJjdXJyZW50SW1hZ2VJZEluZGV4IiwiYWRkU3RhY2tTdGF0ZU1hbmFnZXIiLCJhZGRUb29sU3RhdGUiLCJzdGFja1Njcm9sbFdoZWVsIiwiY3NzIiwibGVuZ3RoIiwib24iLCJjdXJyZW50SW5kZXgiLCJhdHRhY2hFdmVudHMiLCIkZWxlbWVudCIsImV2ZW50IiwiY3VycmVudFRhcmdldCIsImF0dHIiLCJyZW1vdmVDbGFzcyIsInBhcmVudCIsImFkZENsYXNzIiwibGVuZ3RocyIsImdldFRvb2xTdGF0ZSIsImRhdGEiLCJzaGlmdCIsImNvcm5lcnN0b25lIiwidXBkYXRlSW1hZ2UiLCJpbml0VG9vbHMiLCJtb3VzZUlucHV0IiwicGFuIiwiem9vbSIsIm1vdXNlV2hlZWxJbnB1dCIsIm9uY29udGV4dG1lbnUiLCJwcmV2ZW50RGVmYXVsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7OztrQkFFZTtBQUNiQSxVQUFRLEVBREs7QUFFYkMsaUJBQWUsZUFGRjtBQUdiQyxzQkFIYSxrQ0FHVTtBQUNyQixRQUFJLEtBQUtGLE1BQVQsRUFBaUI7QUFDZixXQUFLRyxVQUFMLENBQWdCLEtBQUtILE1BQXJCO0FBQ0EsV0FBS0EsTUFBTCxHQUFjLEVBQWQ7QUFDRDtBQUNGLEdBUlk7QUFTYkksWUFUYSxzQkFTRkMsY0FURSxFQVNjO0FBQ3pCLFFBQUksQ0FBQ0EsY0FBTCxFQUFxQjtBQUNuQjtBQUNEOztBQUVELFFBQUksS0FBS0wsTUFBVCxFQUFpQjtBQUNm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RUEsU0FBS0ksYUFBTCxDQUFtQkMsUUFBbkI7O0FBRUE7QUFDQSxTQUFLTCxPQUFMLENBQWFvQyxhQUFiLEdBQTZCLFVBQVVqQixLQUFWLEVBQWlCO0FBQzVDQSxZQUFNa0IsY0FBTjs7QUFFQSxhQUFPLEtBQVA7QUFDRCxLQUpEOztBQU1BLFNBQUtwQixZQUFMO0FBQ0Q7QUF2RlksQyIsImZpbGUiOiJ0b29scy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb21tYW5kcyBmcm9tICcuL2NvbW1hbmRzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhY3RpdmU6ICcnLFxuICB0b29sc1NlbGVjdG9yOiAnLnZpZXdlci10b29scycsXG4gIGRlYWN0aXZhdGVBY3RpdmVUb29sKCkge1xuICAgIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgICAgdGhpcy5kZWFjdGl2YXRlKHRoaXMuYWN0aXZlKTtcbiAgICAgIHRoaXMuYWN0aXZlID0gJyc7XG4gICAgfVxuICB9LFxuICB0b2dnbGVUb29sKHRvb2xUb0FjdGl2YXRlKSB7XG4gICAgaWYgKCF0b29sVG9BY3RpdmF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgICAgdGhpcy5kZWFjdGl2YXRlKHRoaXMuYWN0aXZlKTtcbiAgICB9XG5cbiAgICBjb3JuZXJzdG9uZVRvb2xzW3Rvb2xUb0FjdGl2YXRlXS5lbmFibGUodGhpcy5lbGVtZW50KTtcbiAgICBjb3JuZXJzdG9uZVRvb2xzW3Rvb2xUb0FjdGl2YXRlXS5hY3RpdmF0ZSh0aGlzLmVsZW1lbnQsIDEpO1xuXG4gICAgdGhpcy5hY3RpdmUgPSB0b29sVG9BY3RpdmF0ZTtcbiAgfSxcbiAgZGVhY3RpdmF0ZSh0b29sKSB7XG4gICAgY29ybmVyc3RvbmVUb29sc1t0b29sXS5kaXNhYmxlKHRoaXMuZWxlbWVudCk7XG4gICAgY29ybmVyc3RvbmVUb29sc1t0b29sXS5kZWFjdGl2YXRlKHRoaXMuZWxlbWVudCwgMSk7XG4gIH0sXG4gIGluaXRTdGFja1Rvb2woaW1hZ2VJZHMpIHtcbiAgICBjb25zdCAkdGh1bWIgPSAkKCcudGh1bWInKTtcbiAgICBjb25zdCBzdGFjayA9IHtcbiAgICAgIGN1cnJlbnRJbWFnZUlkSW5kZXg6IDAsXG4gICAgICBpbWFnZUlkczogaW1hZ2VJZHNcbiAgICB9O1xuXG4gICAgY29ybmVyc3RvbmVUb29scy5hZGRTdGFja1N0YXRlTWFuYWdlcih0aGlzLmVsZW1lbnQsIFsnc3RhY2snXSk7XG4gICAgY29ybmVyc3RvbmVUb29scy5hZGRUb29sU3RhdGUodGhpcy5lbGVtZW50LCAnc3RhY2snLCBzdGFjayk7XG4gICAgY29ybmVyc3RvbmVUb29scy5zdGFja1Njcm9sbFdoZWVsLmFjdGl2YXRlKHRoaXMuZWxlbWVudCk7XG5cbiAgICAkdGh1bWIuY3NzKCd3aWR0aCcsICgxMDAvc3RhY2suaW1hZ2VJZHMubGVuZ3RoKSArICclJyk7XG5cbiAgICAkKHRoaXMuZWxlbWVudCkub24oJ0Nvcm5lcnN0b25lTmV3SW1hZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY3VycmVudEluZGV4ID0gc3RhY2suY3VycmVudEltYWdlSWRJbmRleDtcblxuICAgICAgJHRodW1iLmNzcyh7XG4gICAgICAgICdtYXJnaW4tbGVmdCc6ICgoMTAwL3N0YWNrLmltYWdlSWRzLmxlbmd0aCkqY3VycmVudEluZGV4KSArICclJ1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIGF0dGFjaEV2ZW50cygpIHtcbiAgICAvLyBFeHRyYWN0IHdoaWNoIHRvb2wgd2UgYXJlIHVzaW5nIGFuZCBhY3RpdmF0aW5nIGl0XG4gICAgJCh0aGlzLnRvb2xzU2VsZWN0b3IpLm9uKCdjbGljaycsICdhW2RhdGEtdG9vbF0nLCBldmVudCA9PiB7XG4gICAgICBjb25zdCAkZWxlbWVudCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICBjb25zdCB0b29sID0gJGVsZW1lbnQuYXR0cignZGF0YS10b29sJyk7XG5cbiAgICAgICQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgIHRoaXMudG9nZ2xlVG9vbCh0b29sKTtcblxuICAgICAgJGVsZW1lbnQucGFyZW50KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH0pO1xuXG4gICAgLy8gTGltaXRpbmcgbWVhc3VyZW1lbnRzIHRvIDFcbiAgICAkKCcjY29uZXJzdG9uZVZpZXdwb3J0Jykub24oJ21vdXNlZG93bicsICgpID0+IHtcbiAgICAgIGNvbnN0IGxlbmd0aHMgPSBjb3JuZXJzdG9uZVRvb2xzLmdldFRvb2xTdGF0ZSh0aGlzLmVsZW1lbnQsICdsZW5ndGgnKTtcblxuICAgICAgaWYgKGxlbmd0aHMgJiYgbGVuZ3Rocy5kYXRhLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBsZW5ndGhzLmRhdGEuc2hpZnQoKTtcbiAgICAgICAgY29ybmVyc3RvbmUudXBkYXRlSW1hZ2UodGhpcy5lbGVtZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgaW5pdFRvb2xzKGltYWdlSWRzKSB7XG4gICAgY29ybmVyc3RvbmVUb29scy5tb3VzZUlucHV0LmVuYWJsZSh0aGlzLmVsZW1lbnQpO1xuICAgIGNvcm5lcnN0b25lVG9vbHMucGFuLmFjdGl2YXRlKHRoaXMuZWxlbWVudCwgMik7XG4gICAgY29ybmVyc3RvbmVUb29scy56b29tLmFjdGl2YXRlKHRoaXMuZWxlbWVudCwgNCk7XG4gICAgY29ybmVyc3RvbmVUb29scy5tb3VzZVdoZWVsSW5wdXQuZW5hYmxlKHRoaXMuZWxlbWVudCk7XG5cbiAgICB0aGlzLmluaXRTdGFja1Rvb2woaW1hZ2VJZHMpO1xuXG4gICAgLy8gcmVtb3ZpbmcgZGVmYXVsdCBjb250ZXh0IG1lbnVcbiAgICB0aGlzLmVsZW1lbnQub25jb250ZXh0bWVudSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICB0aGlzLmF0dGFjaEV2ZW50cygpO1xuICB9XG59O1xuIl19
},{"./commands":2}],6:[function(require,module,exports){
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  initViewer: function initViewer() {
    var $viewer = $('.viewer-wrapper');
    var element = $('#conerstoneViewport')[0];

    $viewer.removeClass('invisible');

    _tools2.default.element = element;
    _commands2.default.element = element;

    $(window).on('resize', function () {
      return cornerstone.resize(element, true);
    });

    cornerstone.enable(element);

    _files2.default.getCaseImages().then(function (imagesIds) {
      _tools2.default.initTools(imagesIds);
      _commands2.default.initCommands();

      cornerstone.loadImage(imagesIds[0]).then(function (image) {
        cornerstone.displayImage(element, image);
      });
    }).catch();
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdlci5qcyJdLCJuYW1lcyI6WyJpbml0Vmlld2VyIiwiJHZpZXdlciIsIiQiLCJlbGVtZW50IiwicmVtb3ZlQ2xhc3MiLCJ3aW5kb3ciLCJvbiIsImNvcm5lcnN0b25lIiwicmVzaXplIiwiZW5hYmxlIiwiZ2V0Q2FzZUltYWdlcyIsInRoZW4iLCJpbWFnZXNJZHMiLCJpbml0VG9vbHMiLCJpbml0Q29tbWFuZHMiLCJsb2FkSW1hZ2UiLCJpbWFnZSIsImRpc3BsYXlJbWFnZSIsImNhdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztrQkFFZTtBQUNiQSxZQURhLHdCQUNBO0FBQ1gsUUFBTUMsVUFBVUMsRUFBRSxpQkFBRixDQUFoQjtBQUNBLFFBQU1DLFVBQVVELEVBQUUscUJBQUYsRUFBeUIsQ0FBekIsQ0FBaEI7O0FBRUFELFlBQVFHLFdBQVIsQ0FBb0IsV0FBcEI7O0FBRUEsb0JBQU1ELE9BQU4sR0FBZ0JBLE9BQWhCO0FBQ0EsdUJBQVNBLE9BQVQsR0FBbUJBLE9BQW5COztBQUVBRCxNQUFFRyxNQUFGLEVBQVVDLEVBQVYsQ0FBYSxRQUFiLEVBQXVCO0FBQUEsYUFBTUMsWUFBWUMsTUFBWixDQUFtQkwsT0FBbkIsRUFBNEIsSUFBNUIsQ0FBTjtBQUFBLEtBQXZCOztBQUVBSSxnQkFBWUUsTUFBWixDQUFtQk4sT0FBbkI7O0FBRUEsb0JBQU1PLGFBQU4sR0FBc0JDLElBQXRCLENBQTJCLFVBQVVDLFNBQVYsRUFBcUI7QUFDOUMsc0JBQU1DLFNBQU4sQ0FBZ0JELFNBQWhCO0FBQ0EseUJBQVNFLFlBQVQ7O0FBRUFQLGtCQUFZUSxTQUFaLENBQXNCSCxVQUFVLENBQVYsQ0FBdEIsRUFBb0NELElBQXBDLENBQXlDLFVBQVNLLEtBQVQsRUFBZ0I7QUFDdkRULG9CQUFZVSxZQUFaLENBQXlCZCxPQUF6QixFQUFrQ2EsS0FBbEM7QUFDRCxPQUZEO0FBR0QsS0FQRCxFQU9HRSxLQVBIO0FBU0Q7QUF2QlksQyIsImZpbGUiOiJ2aWV3ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRmlsZXMgZnJvbSAnLi9maWxlcyc7XG5pbXBvcnQgVG9vbHMgZnJvbSAnLi90b29scyc7XG5pbXBvcnQgQ29tbWFuZHMgZnJvbSAnLi9jb21tYW5kcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdFZpZXdlcigpIHtcbiAgICBjb25zdCAkdmlld2VyID0gJCgnLnZpZXdlci13cmFwcGVyJyk7XG4gICAgY29uc3QgZWxlbWVudCA9ICQoJyNjb25lcnN0b25lVmlld3BvcnQnKVswXTtcblxuICAgICR2aWV3ZXIucmVtb3ZlQ2xhc3MoJ2ludmlzaWJsZScpO1xuXG4gICAgVG9vbHMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgQ29tbWFuZHMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsICgpID0+IGNvcm5lcnN0b25lLnJlc2l6ZShlbGVtZW50LCB0cnVlKSk7XG5cbiAgICBjb3JuZXJzdG9uZS5lbmFibGUoZWxlbWVudCk7XG5cbiAgICBGaWxlcy5nZXRDYXNlSW1hZ2VzKCkudGhlbihmdW5jdGlvbiAoaW1hZ2VzSWRzKSB7XG4gICAgICBUb29scy5pbml0VG9vbHMoaW1hZ2VzSWRzKTtcbiAgICAgIENvbW1hbmRzLmluaXRDb21tYW5kcygpO1xuXG4gICAgICBjb3JuZXJzdG9uZS5sb2FkSW1hZ2UoaW1hZ2VzSWRzWzBdKS50aGVuKGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIGNvcm5lcnN0b25lLmRpc3BsYXlJbWFnZShlbGVtZW50LCBpbWFnZSk7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaCgpO1xuXG4gIH1cbn1cbiJdfQ==
},{"./commands":2,"./files":4,"./tools":5}]},{},[1])