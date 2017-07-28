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

setTimeout(function () {
  // $loadingImg.addClass('invisible');
  // $loginForm.addClass('invisible'); 

  _viewer2.default.initViewer();
}, 1000);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfOWFjYWUyOGEuanMiXSwibmFtZXMiOlsiJCIsIm9uIiwiZXZ0IiwicHJldmVudERlZmF1bHQiLCIkbG9hZGluZ0ltZyIsIiRsb2dpbkZvcm0iLCJyZW1vdmVDbGFzcyIsInNldFRpbWVvdXQiLCJhZGRDbGFzcyIsImluaXRWaWV3ZXIiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztBQUVBQSxFQUFFLHFCQUFGLEVBQXlCQyxFQUF6QixDQUE0QixRQUE1QixFQUFzQyxVQUFVQyxHQUFWLEVBQWU7QUFDbkRBLE1BQUlDLGNBQUo7O0FBRUEsTUFBTUMsY0FBY0osRUFBRSwrQ0FBRixDQUFwQjtBQUNBLE1BQU1LLGFBQWFMLEVBQUUsZ0JBQUYsQ0FBbkI7O0FBRUFJLGNBQVlFLFdBQVosQ0FBd0IsV0FBeEI7O0FBRUE7QUFDQUMsYUFBVyxZQUFZO0FBQ3JCSCxnQkFBWUksUUFBWixDQUFxQixXQUFyQjtBQUNBSCxlQUFXRyxRQUFYLENBQW9CLFdBQXBCOztBQUVBLHFCQUFPQyxVQUFQO0FBQ0QsR0FMRCxFQUtHLElBTEg7QUFNRCxDQWZEOztBQWlCQUYsV0FBVyxZQUFZO0FBQ25CO0FBQ0E7O0FBRUEsbUJBQU9FLFVBQVA7QUFDRCxDQUxILEVBS0ssSUFMTCIsImZpbGUiOiJmYWtlXzlhY2FlMjhhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXdlciBmcm9tICcuLi92aWV3ZXIvdmlld2VyJztcblxuJCgnLmxvZ2luLXdyYXBwZXIgZm9ybScpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIGNvbnN0ICRsb2FkaW5nSW1nID0gJCgnLmxvZ2luLXdyYXBwZXIgZm9ybSBidXR0b24uc3VibWl0IGltZy5sb2FkaW5nJyk7XG4gIGNvbnN0ICRsb2dpbkZvcm0gPSAkKCcubG9naW4td3JhcHBlcicpO1xuXG4gICRsb2FkaW5nSW1nLnJlbW92ZUNsYXNzKCdpbnZpc2libGUnKTtcbiAgXG4gIC8vIE1vY2tpbmcgbG9naW5cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgJGxvYWRpbmdJbWcuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xuICAgICRsb2dpbkZvcm0uYWRkQ2xhc3MoJ2ludmlzaWJsZScpOyBcblxuICAgIFZpZXdlci5pbml0Vmlld2VyKCk7XG4gIH0sIDEwMDApO1xufSk7XG5cbnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIC8vICRsb2FkaW5nSW1nLmFkZENsYXNzKCdpbnZpc2libGUnKTtcbiAgICAvLyAkbG9naW5Gb3JtLmFkZENsYXNzKCdpbnZpc2libGUnKTsgXG5cbiAgICBWaWV3ZXIuaW5pdFZpZXdlcigpO1xuICB9LCAxMDAwKTsiXX0=
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

    $(this.toolsSelector).on('click', 'a[data-tool]', function (event) {
      var $element = $(event.currentTarget);
      var tool = $element.attr('data-tool');

      $('.active').removeClass('active');

      _this.toggleTool(tool);

      $element.addClass('active');
    });

    $('#conerstoneViewport').on('mousedown', function () {
      var lengths = cornerstoneTools.getToolState(_this.element, 'length');

      if (lengths.data.length === 2) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2xzLmpzIl0sIm5hbWVzIjpbImFjdGl2ZSIsInRvb2xzU2VsZWN0b3IiLCJkZWFjdGl2YXRlQWN0aXZlVG9vbCIsImRlYWN0aXZhdGUiLCJ0b2dnbGVUb29sIiwidG9vbFRvQWN0aXZhdGUiLCJjb3JuZXJzdG9uZVRvb2xzIiwiZW5hYmxlIiwiZWxlbWVudCIsImFjdGl2YXRlIiwidG9vbCIsImRpc2FibGUiLCJpbml0U3RhY2tUb29sIiwiaW1hZ2VJZHMiLCIkdGh1bWIiLCIkIiwic3RhY2siLCJjdXJyZW50SW1hZ2VJZEluZGV4IiwiYWRkU3RhY2tTdGF0ZU1hbmFnZXIiLCJhZGRUb29sU3RhdGUiLCJzdGFja1Njcm9sbFdoZWVsIiwiY3NzIiwibGVuZ3RoIiwib24iLCJjdXJyZW50SW5kZXgiLCJhdHRhY2hFdmVudHMiLCIkZWxlbWVudCIsImV2ZW50IiwiY3VycmVudFRhcmdldCIsImF0dHIiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwibGVuZ3RocyIsImdldFRvb2xTdGF0ZSIsImRhdGEiLCJzaGlmdCIsImNvcm5lcnN0b25lIiwidXBkYXRlSW1hZ2UiLCJpbml0VG9vbHMiLCJtb3VzZUlucHV0IiwicGFuIiwiem9vbSIsIm1vdXNlV2hlZWxJbnB1dCIsIm9uY29udGV4dG1lbnUiLCJwcmV2ZW50RGVmYXVsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7OztrQkFFZTtBQUNiQSxVQUFRLEVBREs7QUFFYkMsaUJBQWUsZUFGRjtBQUdiQyxzQkFIYSxrQ0FHVTtBQUNyQixRQUFJLEtBQUtGLE1BQVQsRUFBaUI7QUFDZixXQUFLRyxVQUFMLENBQWdCLEtBQUtILE1BQXJCO0FBQ0EsV0FBS0EsTUFBTCxHQUFjLEVBQWQ7QUFDRDtBQUNGLEdBUlk7QUFTYkksWUFUYSxzQkFTRkMsY0FURSxFQVNjO0FBQ3pCLFFBQUksQ0FBQ0EsY0FBTCxFQUFxQjtBQUNuQjtBQUNEOztBQUVELFFBQUksS0FBS0wsTUFBVCxFQUFpQjtBQUNmLFdBQUtHLFVB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U0FBS0wsT0FBTCxDQUFhbUMsYUFBYixHQUE2QixVQUFVaEIsS0FBVixFQUFpQjtBQUM1Q0EsWUFBTWlCLGNBQU47O0FBRUEsYUFBTyxLQUFQO0FBQ0QsS0FKRDs7QUFNQSxTQUFLbkIsWUFBTDtBQUNEO0FBckZZLEMiLCJmaWxlIjoidG9vbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29tbWFuZHMgZnJvbSAnLi9jb21tYW5kcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZlOiAnJyxcbiAgdG9vbHNTZWxlY3RvcjogJy52aWV3ZXItdG9vbHMnLFxuICBkZWFjdGl2YXRlQWN0aXZlVG9vbCgpIHtcbiAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgIHRoaXMuZGVhY3RpdmF0ZSh0aGlzLmFjdGl2ZSk7XG4gICAgICB0aGlzLmFjdGl2ZSA9ICcnO1xuICAgIH1cbiAgfSxcbiAgdG9nZ2xlVG9vbCh0b29sVG9BY3RpdmF0ZSkge1xuICAgIGlmICghdG9vbFRvQWN0aXZhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgIHRoaXMuZGVhY3RpdmF0ZSh0aGlzLmFjdGl2ZSk7XG4gICAgfVxuXG4gICAgY29ybmVyc3RvbmVUb29sc1t0b29sVG9BY3RpdmF0ZV0uZW5hYmxlKHRoaXMuZWxlbWVudCk7XG4gICAgY29ybmVyc3RvbmVUb29sc1t0b29sVG9BY3RpdmF0ZV0uYWN0aXZhdGUodGhpcy5lbGVtZW50LCAxKTtcblxuICAgIHRoaXMuYWN0aXZlID0gdG9vbFRvQWN0aXZhdGU7XG4gIH0sXG4gIGRlYWN0aXZhdGUodG9vbCkge1xuICAgIGNvcm5lcnN0b25lVG9vbHNbdG9vbF0uZGlzYWJsZSh0aGlzLmVsZW1lbnQpO1xuICAgIGNvcm5lcnN0b25lVG9vbHNbdG9vbF0uZGVhY3RpdmF0ZSh0aGlzLmVsZW1lbnQsIDEpO1xuICB9LFxuICBpbml0U3RhY2tUb29sKGltYWdlSWRzKSB7XG4gICAgY29uc3QgJHRodW1iID0gJCgnLnRodW1iJyk7XG4gICAgY29uc3Qgc3RhY2sgPSB7XG4gICAgICBjdXJyZW50SW1hZ2VJZEluZGV4OiAwLFxuICAgICAgaW1hZ2VJZHM6IGltYWdlSWRzXG4gICAgfTtcblxuICAgIGNvcm5lcnN0b25lVG9vbHMuYWRkU3RhY2tTdGF0ZU1hbmFnZXIodGhpcy5lbGVtZW50LCBbJ3N0YWNrJ10pO1xuICAgIGNvcm5lcnN0b25lVG9vbHMuYWRkVG9vbFN0YXRlKHRoaXMuZWxlbWVudCwgJ3N0YWNrJywgc3RhY2spO1xuICAgIGNvcm5lcnN0b25lVG9vbHMuc3RhY2tTY3JvbGxXaGVlbC5hY3RpdmF0ZSh0aGlzLmVsZW1lbnQpO1xuXG4gICAgJHRodW1iLmNzcygnd2lkdGgnLCAoMTAwL3N0YWNrLmltYWdlSWRzLmxlbmd0aCkgKyAnJScpO1xuXG4gICAgJCh0aGlzLmVsZW1lbnQpLm9uKCdDb3JuZXJzdG9uZU5ld0ltYWdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IHN0YWNrLmN1cnJlbnRJbWFnZUlkSW5kZXg7XG5cbiAgICAgICR0aHVtYi5jc3Moe1xuICAgICAgICAnbWFyZ2luLWxlZnQnOiAoKDEwMC9zdGFjay5pbWFnZUlkcy5sZW5ndGgpKmN1cnJlbnRJbmRleCkgKyAnJSdcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBhdHRhY2hFdmVudHMoKSB7XG4gICAgJCh0aGlzLnRvb2xzU2VsZWN0b3IpLm9uKCdjbGljaycsICdhW2RhdGEtdG9vbF0nLCBldmVudCA9PiB7XG4gICAgICBjb25zdCAkZWxlbWVudCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICBjb25zdCB0b29sID0gJGVsZW1lbnQuYXR0cignZGF0YS10b29sJyk7XG5cbiAgICAgICQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgIHRoaXMudG9nZ2xlVG9vbCh0b29sKTtcblxuICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH0pO1xuXG4gICAgJCgnI2NvbmVyc3RvbmVWaWV3cG9ydCcpLm9uKCdtb3VzZWRvd24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBsZW5ndGhzID0gY29ybmVyc3RvbmVUb29scy5nZXRUb29sU3RhdGUodGhpcy5lbGVtZW50LCAnbGVuZ3RoJyk7XG5cbiAgICAgIGlmIChsZW5ndGhzLmRhdGEubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIGxlbmd0aHMuZGF0YS5zaGlmdCgpO1xuICAgICAgICBjb3JuZXJzdG9uZS51cGRhdGVJbWFnZSh0aGlzLmVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBpbml0VG9vbHMoaW1hZ2VJZHMpIHtcbiAgICBjb3JuZXJzdG9uZVRvb2xzLm1vdXNlSW5wdXQuZW5hYmxlKHRoaXMuZWxlbWVudCk7XG4gICAgY29ybmVyc3RvbmVUb29scy5wYW4uYWN0aXZhdGUodGhpcy5lbGVtZW50LCAyKTtcbiAgICBjb3JuZXJzdG9uZVRvb2xzLnpvb20uYWN0aXZhdGUodGhpcy5lbGVtZW50LCA0KTtcbiAgICBjb3JuZXJzdG9uZVRvb2xzLm1vdXNlV2hlZWxJbnB1dC5lbmFibGUodGhpcy5lbGVtZW50KTtcblxuICAgIHRoaXMuaW5pdFN0YWNrVG9vbChpbWFnZUlkcyk7XG5cbiAgICAvLyByZW1vdmluZyBkZWZhdWx0IGNvbnRleHQgbWVudVxuICAgIHRoaXMuZWxlbWVudC5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIHRoaXMuYXR0YWNoRXZlbnRzKCk7XG4gIH1cbn07XG4iXX0=
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