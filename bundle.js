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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfNGZkODdhNzcuanMiXSwibmFtZXMiOlsiJCIsIm9uIiwiZXZ0IiwicHJldmVudERlZmF1bHQiLCIkbG9hZGluZ0ltZyIsIiRsb2dpbkZvcm0iLCJyZW1vdmVDbGFzcyIsInNldFRpbWVvdXQiLCJhZGRDbGFzcyIsImluaXRWaWV3ZXIiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztBQUVBQSxFQUFFLHFCQUFGLEVBQXlCQyxFQUF6QixDQUE0QixRQUE1QixFQUFzQyxVQUFVQyxHQUFWLEVBQWU7QUFDbkRBLE1BQUlDLGNBQUo7O0FBRUEsTUFBTUMsY0FBY0osRUFBRSwrQ0FBRixDQUFwQjtBQUNBLE1BQU1LLGFBQWFMLEVBQUUsZ0JBQUYsQ0FBbkI7O0FBRUFJLGNBQVlFLFdBQVosQ0FBd0IsV0FBeEI7O0FBRUE7QUFDQUMsYUFBVyxZQUFZO0FBQ3JCSCxnQkFBWUksUUFBWixDQUFxQixXQUFyQjtBQUNBSCxlQUFXRyxRQUFYLENBQW9CLFdBQXBCOztBQUVBLHFCQUFPQyxVQUFQO0FBQ0QsR0FMRCxFQUtHLElBTEg7QUFNRCxDQWZEIiwiZmlsZSI6ImZha2VfNGZkODdhNzcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlld2VyIGZyb20gJy4uL3ZpZXdlci92aWV3ZXInO1xuXG4kKCcubG9naW4td3JhcHBlciBmb3JtJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIChldnQpIHtcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgY29uc3QgJGxvYWRpbmdJbWcgPSAkKCcubG9naW4td3JhcHBlciBmb3JtIGJ1dHRvbi5zdWJtaXQgaW1nLmxvYWRpbmcnKTtcbiAgY29uc3QgJGxvZ2luRm9ybSA9ICQoJy5sb2dpbi13cmFwcGVyJyk7XG5cbiAgJGxvYWRpbmdJbWcucmVtb3ZlQ2xhc3MoJ2ludmlzaWJsZScpO1xuICBcbiAgLy8gTW9ja2luZyBsb2dpblxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAkbG9hZGluZ0ltZy5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG4gICAgJGxvZ2luRm9ybS5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG5cbiAgICBWaWV3ZXIuaW5pdFZpZXdlcigpO1xuICB9LCAxMDAwKTtcbn0pO1xuIl19
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
      var tool = $element.attr('data-command');

      _this[tool]();

      $element.addClass('active');

      setTimeout(function () {
        $element.removeClass('active');
      }, 300);
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1hbmRzLmpzIl0sIm5hbWVzIjpbImNvbW1hbmRTZWxlY3RvciIsImNsZWFyQWxsIiwiZW5hYmxlZEVsZW1ldCIsImNvcm5lcnN0b25lIiwiZ2V0RW5hYmxlZEVsZW1lbnQiLCJlbGVtZW50Iiwidmlld3BvcnQiLCJnZXRWaWV3cG9ydCIsInZvaSIsIndpbmRvd1dpZHRoIiwiaW1hZ2UiLCJ3aW5kb3dDZW50ZXIiLCJzZXRWaWV3cG9ydCIsImNvcm5lcnN0b25lVG9vbHMiLCJnbG9iYWxJbWFnZUlkU3BlY2lmaWNUb29sU3RhdGVNYW5hZ2VyIiwiY2xlYXIiLCJ1cGRhdGVJbWFnZSIsImluaXRDb21tYW5kcyIsIiQiLCJvbiIsIiRlbGVtZW50IiwiZXZlbnQiLCJjdXJyZW50VGFyZ2V0IiwidG9vbCIsImF0dHIiLCJhZGRDbGFzcyIsInNldFRpbWVvdXQiLCJyZW1vdmVDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBQWU7QUFDYkEsbUJBQWlCLGVBREo7QUFFYkMsVUFGYSxzQkFFRjtBQUNULFFBQU1DLGdCQUFnQkMsWUFBWUMsaUJBQVosQ0FBOEIsS0FBS0MsT0FBbkMsQ0FBdEI7QUFDQSxRQUFNQyxXQUFXSCxZQUFZSSxXQUFaLENBQXdCLEtBQUtGLE9BQTdCLENBQWpCOztBQUVBQyxhQUFTRSxHQUFULENBQWFDLFdBQWIsR0FBMkJQLGNBQWNRLEtBQWQsQ0FBb0JELFdBQS9DO0FBQ0FILGFBQVNFLEdBQVQsQ0FBYUcsWUFBYixHQUE0QlQsY0FBY1EsS0FBZCxDQUFvQkMsWUFBaEQ7QUFDQVIsZ0JBQVlTLFdBQVosQ0FBd0IsS0FBS1AsT0FBN0IsRUFBc0NDLFFBQXRDOztBQUVBTyxxQkFBaUJDLHFDQUFqQixDQUF1REMsS0FBdkQsQ0FBNkQsS0FBS1YsT0FBbEU7QUFDQUYsZ0JBQVlhLFdBQVosQ0FBd0IsS0FBS1gsT0FBN0I7QUFDRCxHQVpZO0FBYWJZLGNBYmEsMEJBYUU7QUFBQTs7QUFDYkMsTUFBRSxLQUFLbEIsZUFBUCxFQUF3Qm1CLEVBQXhCLENBQTJCLE9BQTNCLEVBQW9DLGlCQUFwQyxFQUF1RCxpQkFBUztBQUM5RCxVQUFNQyxXQUFXRixFQUFFRyxNQUFNQyxhQUFSLENBQWpCO0FBQ0EsVUFBTUMsT0FBT0gsU0FBU0ksSUFBVCxDQUFjLGNBQWQsQ0FBYjs7QUFFQSxZQUFLRCxJQUFMOztBQUVBSCxlQUFTSyxRQUFULENBQWtCLFFBQWxCOztBQUVBQyxpQkFBVyxZQUFXO0FBQ3BCTixpQkFBU08sV0FBVCxDQUFxQixRQUFyQjtBQUNELE9BRkQsRUFFRyxHQUZIO0FBR0QsS0FYRDtBQVlEO0FBMUJZLEMiLCJmaWxlIjoiY29tbWFuZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gIGNvbW1hbmRTZWxlY3RvcjogJy52aWV3ZXItdG9vbHMnLFxuICBjbGVhckFsbCgpIHtcbiAgICBjb25zdCBlbmFibGVkRWxlbWV0ID0gY29ybmVyc3RvbmUuZ2V0RW5hYmxlZEVsZW1lbnQodGhpcy5lbGVtZW50KTtcbiAgICBjb25zdCB2aWV3cG9ydCA9IGNvcm5lcnN0b25lLmdldFZpZXdwb3J0KHRoaXMuZWxlbWVudCk7XG5cbiAgICB2aWV3cG9ydC52b2kud2luZG93V2lkdGggPSBlbmFibGVkRWxlbWV0LmltYWdlLndpbmRvd1dpZHRoO1xuICAgIHZpZXdwb3J0LnZvaS53aW5kb3dDZW50ZXIgPSBlbmFibGVkRWxlbWV0LmltYWdlLndpbmRvd0NlbnRlcjtcbiAgICBjb3JuZXJzdG9uZS5zZXRWaWV3cG9ydCh0aGlzLmVsZW1lbnQsIHZpZXdwb3J0KTtcblxuICAgIGNvcm5lcnN0b25lVG9vbHMuZ2xvYmFsSW1hZ2VJZFNwZWNpZmljVG9vbFN0YXRlTWFuYWdlci5jbGVhcih0aGlzLmVsZW1lbnQpO1xuICAgIGNvcm5lcnN0b25lLnVwZGF0ZUltYWdlKHRoaXMuZWxlbWVudCk7XG4gIH0sXG4gIGluaXRDb21tYW5kcygpIHtcbiAgICAkKHRoaXMuY29tbWFuZFNlbGVjdG9yKS5vbignY2xpY2snLCAnYVtkYXRhLWNvbW1hbmRdJywgZXZlbnQgPT4ge1xuICAgICAgY29uc3QgJGVsZW1lbnQgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgY29uc3QgdG9vbCA9ICRlbGVtZW50LmF0dHIoJ2RhdGEtY29tbWFuZCcpO1xuXG4gICAgICB0aGlzW3Rvb2xdKCk7XG5cbiAgICAgICRlbGVtZW50LmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgfSwgMzAwKTtcbiAgICB9KTtcbiAgfVxufTtcbiJdfQ==
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
  initTools: function initTools(imageIds) {
    var _this = this;

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

    $(this.toolsSelector).on('click', 'a[data-tool]', function (event) {
      var $element = $(event.currentTarget);
      var tool = $element.attr('data-tool');

      $('.active').removeClass('active');

      _this.toggleTool(tool);

      $element.addClass('active');
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2xzLmpzIl0sIm5hbWVzIjpbImFjdGl2ZSIsInRvb2xzU2VsZWN0b3IiLCJkZWFjdGl2YXRlQWN0aXZlVG9vbCIsImRlYWN0aXZhdGUiLCJ0b2dnbGVUb29sIiwidG9vbFRvQWN0aXZhdGUiLCJjb3JuZXJzdG9uZVRvb2xzIiwiZW5hYmxlIiwiZWxlbWVudCIsImFjdGl2YXRlIiwidG9vbCIsImRpc2FibGUiLCJpbml0U3RhY2tUb29sIiwiaW1hZ2VJZHMiLCIkdGh1bWIiLCIkIiwic3RhY2siLCJjdXJyZW50SW1hZ2VJZEluZGV4IiwiYWRkU3RhY2tTdGF0ZU1hbmFnZXIiLCJhZGRUb29sU3RhdGUiLCJzdGFja1Njcm9sbFdoZWVsIiwiY3NzIiwibGVuZ3RoIiwib24iLCJjdXJyZW50SW5kZXgiLCJpbml0VG9vbHMiLCJtb3VzZUlucHV0IiwicGFuIiwiem9vbSIsIm1vdXNlV2hlZWxJbnB1dCIsIm9uY29udGV4dG1lbnUiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiJGVsZW1lbnQiLCJjdXJyZW50VGFyZ2V0IiwiYXR0ciIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQUFlO0FBQ2JBLFVBQVEsRUFESztBQUViQyxpQkFBZSxlQUZGO0FBR2JDLHNCQUhhLGtDQUdVO0FBQ3JCLFFBQUksS0FBS0YsTUFBVCxFQUFpQjtBQUNmLFdBQUtHLFVBQUwsQ0FBZ0IsS0FBS0gsTUFBckI7QUFDQSxXQUFLQSxNQUFMLEdBQWMsRUFBZDtBQUNEO0FBQ0YsR0FSWTtBQVNiSSxZQVRhLHNCQVNGQyxjQVRFLEVBU2M7QUFDekIsUUFBSSxDQUFDQSxjQUFMLEVBQXFCO0FBQ25CO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLTCxNQUFULEVBQWlCO0FBQ2YsV0FBS0csVUFBTCxDQUFnQixLQUFLSCxNQUFyQjtBQUNEOztBQUVETSxxQkFBaUJELGNBQWpCLEVBQWlDRSxNQUFqQyxDQUF3QyxLQUFLQyxPQUE3QztBQUNBRixxQkFBaUJELGNBQWpCLEVBQWlDSSxRQUFqQyxDQUEwQyxLQUFLRCxPQUEvQyxFQUF3RCxDQUF4RDs7QUFFQSxTQUFLUixNQUFMLEdBQWNLLGNBQWQ7QUFDRCxHQXRCWTtBQXVCYkYsWUF2QmEsc0JBdUJGTyxJQXZCRSxFQXVCSTtBQUNmSixxQkFBaUJJLElBQWpCLEVBQXVCQyxPQUF2QixDQUErQixLQUFLSCxPQUFwQztBQUNBRixxQkFBaUJJLElBQWpCLEVBQXVCUCxVQUF2QixDQUFrQyxLQUFLSyxPQUF2QyxFQUFnRCxDQUFoRDtBQUNELEdBMUJZO0FBMkJiSSxlQTNCYSx5QkEyQkNDLFFBM0JELEVBMkJXO0FBQ3RCLFFBQU1DLFNBQVNDLEVBQUUsUUFBRixDQUFmO0FBQ0EsUUFBTUMsUUFBUTtBQUNaQywyQkFBcUIsQ0FEVDtBQUVaSixnQkFBVUE7QUFGRSxLQUFkOztBQUtBUCxxQkFBaUJZLG9CQUFqQixDQUFzQyxLQUFLVixPQUEzQyxFQUFvRCxDQUFDLE9BQUQsQ0FBcEQ7QUFDQUYscUJBQWlCYSxZQUFqQixDQUE4QixLQUFLWCxPQUFuQyxFQUE0QyxPQUE1QyxFQUFxRFEsS0FBckQ7QUFDQVYscUJBQWlCYyxnQkFBakIsQ0FBa0NYLFFBQWxDLENBQTJDLEtBQUtELE9BQWhEOztBQUVBTSxXQUFPTyxHQUFQLENBQVcsT0FBWCxFQUFxQixNQUFJTCxNQUFNSCxRQUFOLENBQWVTLE1BQXBCLEdBQThCLEdBQWxEOztBQUVBUCxNQUFFLEtBQUtQLE9BQVAsRUFBZ0JlLEVBQWhCLENBQW1CLHFCQUFuQixFQUEwQyxZQUFZO0FBQ3BELFVBQUlDLGVBQWVSLE1BQU1DLG1CQUF6Qjs7QUFFQUgsYUFBT08sR0FBUCxDQUFXO0FBQ1QsdUJBQWlCLE1BQUlMLE1BQU1ILFFBQU4sQ0FBZVMsTUFBcEIsR0FBNEJFLFlBQTdCLEdBQTZDO0FBRG5ELE9BQVg7QUFHRCxLQU5EO0FBT0QsR0EvQ1k7QUFnRGJDLFdBaERhLHFCQWdESFosUUFoREcsRUFnRE87QUFBQTs7QUFDbEJQLHFCQUFpQm9CLFVBQWpCLENBQTRCbkIsTUFBNUIsQ0FBbUMsS0FBS0MsT0FBeEM7QUFDQUYscUJBQWlCcUIsR0FBakIsQ0FBcUJsQixRQUFyQixDQUE4QixLQUFLRCxPQUFuQyxFQUE0QyxDQUE1QztBQUNBRixxQkFBaUJzQixJQUFqQixDQUFzQm5CLFFBQXRCLENBQStCLEtBQUtELE9BQXBDLEVBQTZDLENBQTdDO0FBQ0FGLHFCQUFpQnVCLGVBQWpCLENBQWlDdEIsTUFBakMsQ0FBd0MsS0FBS0MsT0FBN0M7O0FBRUEsU0FBS0ksYUFBTCxDQUFtQkMsUUFBbkI7O0FBRUE7QUFDQSxTQUFLTCxPQUFMLENBQWFzQixhQUFiLEdBQTZCLFVBQVVDLEtBQVYsRUFBaUI7QUFDNUNBLFlBQU1DLGNBQU47O0FBRUEsYUFBTyxLQUFQO0FBQ0QsS0FKRDs7QUFNQWpCLE1BQUUsS0FBS2QsYUFBUCxFQUFzQnNCLEVBQXRCLENBQXlCLE9BQXpCLEVBQWtDLGNBQWxDLEVBQWtELGlCQUFTO0FBQ3pELFVBQU1VLFdBQVdsQixFQUFFZ0IsTUFBTUcsYUFBUixDQUFqQjtBQUNBLFVBQU14QixPQUFPdUIsU0FBU0UsSUFBVCxDQUFjLFdBQWQsQ0FBYjs7QUFFQXBCLFFBQUUsU0FBRixFQUFhcUIsV0FBYixDQUF5QixRQUF6Qjs7QUFFQSxZQUFLaEMsVUFBTCxDQUFnQk0sSUFBaEI7O0FBRUF1QixlQUFTSSxRQUFULENBQWtCLFFBQWxCO0FBQ0QsS0FURDtBQVVEO0FBekVZLEMiLCJmaWxlIjoidG9vbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2ZTogJycsXG4gIHRvb2xzU2VsZWN0b3I6ICcudmlld2VyLXRvb2xzJyxcbiAgZGVhY3RpdmF0ZUFjdGl2ZVRvb2woKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICB0aGlzLmRlYWN0aXZhdGUodGhpcy5hY3RpdmUpO1xuICAgICAgdGhpcy5hY3RpdmUgPSAnJztcbiAgICB9XG4gIH0sXG4gIHRvZ2dsZVRvb2wodG9vbFRvQWN0aXZhdGUpIHtcbiAgICBpZiAoIXRvb2xUb0FjdGl2YXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICB0aGlzLmRlYWN0aXZhdGUodGhpcy5hY3RpdmUpO1xuICAgIH1cblxuICAgIGNvcm5lcnN0b25lVG9vbHNbdG9vbFRvQWN0aXZhdGVdLmVuYWJsZSh0aGlzLmVsZW1lbnQpO1xuICAgIGNvcm5lcnN0b25lVG9vbHNbdG9vbFRvQWN0aXZhdGVdLmFjdGl2YXRlKHRoaXMuZWxlbWVudCwgMSk7XG5cbiAgICB0aGlzLmFjdGl2ZSA9IHRvb2xUb0FjdGl2YXRlO1xuICB9LFxuICBkZWFjdGl2YXRlKHRvb2wpIHtcbiAgICBjb3JuZXJzdG9uZVRvb2xzW3Rvb2xdLmRpc2FibGUodGhpcy5lbGVtZW50KTtcbiAgICBjb3JuZXJzdG9uZVRvb2xzW3Rvb2xdLmRlYWN0aXZhdGUodGhpcy5lbGVtZW50LCAxKTtcbiAgfSxcbiAgaW5pdFN0YWNrVG9vbChpbWFnZUlkcykge1xuICAgIGNvbnN0ICR0aHVtYiA9ICQoJy50aHVtYicpO1xuICAgIGNvbnN0IHN0YWNrID0ge1xuICAgICAgY3VycmVudEltYWdlSWRJbmRleDogMCxcbiAgICAgIGltYWdlSWRzOiBpbWFnZUlkc1xuICAgIH07XG5cbiAgICBjb3JuZXJzdG9uZVRvb2xzLmFkZFN0YWNrU3RhdGVNYW5hZ2VyKHRoaXMuZWxlbWVudCwgWydzdGFjayddKTtcbiAgICBjb3JuZXJzdG9uZVRvb2xzLmFkZFRvb2xTdGF0ZSh0aGlzLmVsZW1lbnQsICdzdGFjaycsIHN0YWNrKTtcbiAgICBjb3JuZXJzdG9uZVRvb2xzLnN0YWNrU2Nyb2xsV2hlZWwuYWN0aXZhdGUodGhpcy5lbGVtZW50KTtcblxuICAgICR0aHVtYi5jc3MoJ3dpZHRoJywgKDEwMC9zdGFjay5pbWFnZUlkcy5sZW5ndGgpICsgJyUnKTtcblxuICAgICQodGhpcy5lbGVtZW50KS5vbignQ29ybmVyc3RvbmVOZXdJbWFnZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjdXJyZW50SW5kZXggPSBzdGFjay5jdXJyZW50SW1hZ2VJZEluZGV4O1xuXG4gICAgICAkdGh1bWIuY3NzKHtcbiAgICAgICAgJ21hcmdpbi1sZWZ0JzogKCgxMDAvc3RhY2suaW1hZ2VJZHMubGVuZ3RoKSpjdXJyZW50SW5kZXgpICsgJyUnXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgaW5pdFRvb2xzKGltYWdlSWRzKSB7XG4gICAgY29ybmVyc3RvbmVUb29scy5tb3VzZUlucHV0LmVuYWJsZSh0aGlzLmVsZW1lbnQpO1xuICAgIGNvcm5lcnN0b25lVG9vbHMucGFuLmFjdGl2YXRlKHRoaXMuZWxlbWVudCwgMik7XG4gICAgY29ybmVyc3RvbmVUb29scy56b29tLmFjdGl2YXRlKHRoaXMuZWxlbWVudCwgNCk7XG4gICAgY29ybmVyc3RvbmVUb29scy5tb3VzZVdoZWVsSW5wdXQuZW5hYmxlKHRoaXMuZWxlbWVudCk7XG5cbiAgICB0aGlzLmluaXRTdGFja1Rvb2woaW1hZ2VJZHMpO1xuXG4gICAgLy8gcmVtb3ZpbmcgZGVmYXVsdCBjb250ZXh0IG1lbnVcbiAgICB0aGlzLmVsZW1lbnQub25jb250ZXh0bWVudSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAkKHRoaXMudG9vbHNTZWxlY3Rvcikub24oJ2NsaWNrJywgJ2FbZGF0YS10b29sXScsIGV2ZW50ID0+IHtcbiAgICAgIGNvbnN0ICRlbGVtZW50ID0gJChldmVudC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIGNvbnN0IHRvb2wgPSAkZWxlbWVudC5hdHRyKCdkYXRhLXRvb2wnKTtcblxuICAgICAgJCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgdGhpcy50b2dnbGVUb29sKHRvb2wpO1xuXG4gICAgICAkZWxlbWVudC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgfSk7XG4gIH1cbn07XG4iXX0=
},{}],6:[function(require,module,exports){
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