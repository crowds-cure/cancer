(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = argsArray;

function argsArray(fun) {
  return function () {
    var len = arguments.length;
    if (len) {
      var args = [];
      var i = -1;
      while (++i < len) {
        args[i] = arguments[i];
      }
      return fun.call(this, args);
    } else {
      return fun.call(this, []);
    }
  };
}
},{}],2:[function(require,module,exports){
(function (process){
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window && typeof window.process !== 'undefined' && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document && 'WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window && window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

}).call(this,require("b55mWE"))
},{"./debug":3,"b55mWE":5}],3:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":9}],4:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],5:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],6:[function(require,module,exports){
(function (global){
'use strict';
var Mutation = global.MutationObserver || global.WebKitMutationObserver;

var scheduleDrain;

{
  if (Mutation) {
    var called = 0;
    var observer = new Mutation(nextTick);
    var element = global.document.createTextNode('');
    observer.observe(element, {
      characterData: true
    });
    scheduleDrain = function () {
      element.data = (called = ++called % 2);
    };
  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
    var channel = new global.MessageChannel();
    channel.port1.onmessage = nextTick;
    scheduleDrain = function () {
      channel.port2.postMessage(0);
    };
  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
    scheduleDrain = function () {

      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var scriptEl = global.document.createElement('script');
      scriptEl.onreadystatechange = function () {
        nextTick();

        scriptEl.onreadystatechange = null;
        scriptEl.parentNode.removeChild(scriptEl);
        scriptEl = null;
      };
      global.document.documentElement.appendChild(scriptEl);
    };
  } else {
    scheduleDrain = function () {
      setTimeout(nextTick, 0);
    };
  }
}

var draining;
var queue = [];
//named nextTick for less confusing stack traces
function nextTick() {
  draining = true;
  var i, oldQueue;
  var len = queue.length;
  while (len) {
    oldQueue = queue;
    queue = [];
    i = -1;
    while (++i < len) {
      oldQueue[i]();
    }
    len = queue.length;
  }
  draining = false;
}

module.exports = immediate;
function immediate(task) {
  if (queue.push(task) === 1 && !draining) {
    scheduleDrain();
  }
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],8:[function(require,module,exports){
'use strict';
var immediate = require('immediate');

/* istanbul ignore next */
function INTERNAL() {}

var handlers = {};

var REJECTED = ['REJECTED'];
var FULFILLED = ['FULFILLED'];
var PENDING = ['PENDING'];

module.exports = Promise;

function Promise(resolver) {
  if (typeof resolver !== 'function') {
    throw new TypeError('resolver must be a function');
  }
  this.state = PENDING;
  this.queue = [];
  this.outcome = void 0;
  if (resolver !== INTERNAL) {
    safelyResolveThenable(this, resolver);
  }
}

Promise.prototype["catch"] = function (onRejected) {
  return this.then(null, onRejected);
};
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
    typeof onRejected !== 'function' && this.state === REJECTED) {
    return this;
  }
  var promise = new this.constructor(INTERNAL);
  if (this.state !== PENDING) {
    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
    unwrap(promise, resolver, this.outcome);
  } else {
    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
  }

  return promise;
};
function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise;
  if (typeof onFulfilled === 'function') {
    this.onFulfilled = onFulfilled;
    this.callFulfilled = this.otherCallFulfilled;
  }
  if (typeof onRejected === 'function') {
    this.onRejected = onRejected;
    this.callRejected = this.otherCallRejected;
  }
}
QueueItem.prototype.callFulfilled = function (value) {
  handlers.resolve(this.promise, value);
};
QueueItem.prototype.otherCallFulfilled = function (value) {
  unwrap(this.promise, this.onFulfilled, value);
};
QueueItem.prototype.callRejected = function (value) {
  handlers.reject(this.promise, value);
};
QueueItem.prototype.otherCallRejected = function (value) {
  unwrap(this.promise, this.onRejected, value);
};

function unwrap(promise, func, value) {
  immediate(function () {
    var returnValue;
    try {
      returnValue = func(value);
    } catch (e) {
      return handlers.reject(promise, e);
    }
    if (returnValue === promise) {
      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
    } else {
      handlers.resolve(promise, returnValue);
    }
  });
}

handlers.resolve = function (self, value) {
  var result = tryCatch(getThen, value);
  if (result.status === 'error') {
    return handlers.reject(self, result.value);
  }
  var thenable = result.value;

  if (thenable) {
    safelyResolveThenable(self, thenable);
  } else {
    self.state = FULFILLED;
    self.outcome = value;
    var i = -1;
    var len = self.queue.length;
    while (++i < len) {
      self.queue[i].callFulfilled(value);
    }
  }
  return self;
};
handlers.reject = function (self, error) {
  self.state = REJECTED;
  self.outcome = error;
  var i = -1;
  var len = self.queue.length;
  while (++i < len) {
    self.queue[i].callRejected(error);
  }
  return self;
};

function getThen(obj) {
  // Make sure we only access the accessor once as required by the spec
  var then = obj && obj.then;
  if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
    return function appyThen() {
      then.apply(obj, arguments);
    };
  }
}

function safelyResolveThenable(self, thenable) {
  // Either fulfill, reject or reject with error
  var called = false;
  function onError(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.reject(self, value);
  }

  function onSuccess(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.resolve(self, value);
  }

  function tryToUnwrap() {
    thenable(onSuccess, onError);
  }

  var result = tryCatch(tryToUnwrap);
  if (result.status === 'error') {
    onError(result.value);
  }
}

function tryCatch(func, value) {
  var out = {};
  try {
    out.value = func(value);
    out.status = 'success';
  } catch (e) {
    out.status = 'error';
    out.value = e;
  }
  return out;
}

Promise.resolve = resolve;
function resolve(value) {
  if (value instanceof this) {
    return value;
  }
  return handlers.resolve(new this(INTERNAL), value);
}

Promise.reject = reject;
function reject(reason) {
  var promise = new this(INTERNAL);
  return handlers.reject(promise, reason);
}

Promise.all = all;
function all(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var values = new Array(len);
  var resolved = 0;
  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    allResolver(iterable[i], i);
  }
  return promise;
  function allResolver(value, i) {
    self.resolve(value).then(resolveFromAll, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
    function resolveFromAll(outValue) {
      values[i] = outValue;
      if (++resolved === len && !called) {
        called = true;
        handlers.resolve(promise, values);
      }
    }
  }
}

Promise.race = race;
function race(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    resolver(iterable[i]);
  }
  return promise;
  function resolver(value) {
    self.resolve(value).then(function (response) {
      if (!called) {
        called = true;
        handlers.resolve(promise, response);
      }
    }, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
  }
}

},{"immediate":6}],9:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000
var m = s * 60
var h = m * 60
var d = h * 24
var y = d * 365.25

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {}
  var type = typeof val
  if (type === 'string' && val.length > 0) {
    return parse(val)
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ?
			fmtLong(val) :
			fmtShort(val)
  }
  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val))
}

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str)
  if (str.length > 10000) {
    return
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str)
  if (!match) {
    return
  }
  var n = parseFloat(match[1])
  var type = (match[2] || 'ms').toLowerCase()
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y
    case 'days':
    case 'day':
    case 'd':
      return n * d
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n
    default:
      return undefined
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd'
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h'
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm'
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's'
  }
  return ms + 'ms'
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms'
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name
  }
  return Math.ceil(ms / n) + ' ' + name + 's'
}

},{}],10:[function(require,module,exports){
(function (global){
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var uuidV4 = _interopDefault(require('uuid'));
var lie = _interopDefault(require('lie'));
var getArguments = _interopDefault(require('argsarray'));
var events = require('events');
var inherits = _interopDefault(require('inherits'));
var nextTick = _interopDefault(require('immediate'));
var debug = _interopDefault(require('debug'));
var Md5 = _interopDefault(require('spark-md5'));
var vuvuzela = _interopDefault(require('vuvuzela'));

/* istanbul ignore next */
var PouchPromise$1 = typeof Promise === 'function' ? Promise : lie;

function isBinaryObject(object) {
  return (typeof ArrayBuffer !== 'undefined' && object instanceof ArrayBuffer) ||
    (typeof Blob !== 'undefined' && object instanceof Blob);
}

function cloneArrayBuffer(buff) {
  if (typeof buff.slice === 'function') {
    return buff.slice(0);
  }
  // IE10-11 slice() polyfill
  var target = new ArrayBuffer(buff.byteLength);
  var targetArray = new Uint8Array(target);
  var sourceArray = new Uint8Array(buff);
  targetArray.set(sourceArray);
  return target;
}

function cloneBinaryObject(object) {
  if (object instanceof ArrayBuffer) {
    return cloneArrayBuffer(object);
  }
  var size = object.size;
  var type = object.type;
  // Blob
  if (typeof object.slice === 'function') {
    return object.slice(0, size, type);
  }
  // PhantomJS slice() replacement
  return object.webkitSlice(0, size, type);
}

// most of this is borrowed from lodash.isPlainObject:
// https://github.com/fis-components/lodash.isplainobject/
// blob/29c358140a74f252aeb08c9eb28bef86f2217d4a/index.js

var funcToString = Function.prototype.toString;
var objectCtorString = funcToString.call(Object);

function isPlainObject(value) {
  var proto = Object.getPrototypeOf(value);
  /* istanbul ignore if */
  if (proto === null) { // not sure when this happens, but I guess it can
    return true;
  }
  var Ctor = proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

function clone(object) {
  var newObject;
  var i;
  var len;

  if (!object || typeof object !== 'object') {
    return object;
  }

  if (Array.isArray(object)) {
    newObject = [];
    for (i = 0, len = object.length; i < len; i++) {
      newObject[i] = clone(object[i]);
    }
    return newObject;
  }

  // special case: to avoid inconsistencies between IndexedDB
  // and other backends, we automatically stringify Dates
  if (object instanceof Date) {
    return object.toISOString();
  }

  if (isBinaryObject(object)) {
    return cloneBinaryObject(object);
  }

  if (!isPlainObject(object)) {
    return object; // don't clone objects like Workers
  }

  newObject = {};
  for (i in object) {
    /* istanbul ignore else */
    if (Object.prototype.hasOwnProperty.call(object, i)) {
      var value = clone(object[i]);
      if (typeof value !== 'undefined') {
        newObject[i] = value;
      }
    }
  }
  return newObject;
}

function once(fun) {
  var called = false;
  return getArguments(function (args) {
    /* istanbul ignore if */
    if (called) {
      // this is a smoke test and should never actually happen
      throw new Error('once called more than once');
    } else {
      called = true;
      fun.apply(this, args);
    }
  });
}

function toPromise(func) {
  //create the function we will be returning
  return getArguments(function (args) {
    // Clone arguments
    args = clone(args);
    var self = this;
    // if the last argument is a function, assume its a callback
    var usedCB = (typeof args[args.length - 1] === 'function') ? args.pop() : false;
    var promise = new PouchPromise$1(function (fulfill, reject) {
      var resp;
      try {
        var callback = once(function (err, mesg) {
          if (err) {
            reject(err);
          } else {
            fulfill(mesg);
          }
        });
        // create a callback for this invocation
        // apply the function in the orig context
        args.push(callback);
        resp = func.apply(self, args);
        if (resp && typeof resp.then === 'function') {
          fulfill(resp);
        }
      } catch (e) {
        reject(e);
      }
    });
    // if there is a callback, call it back
    if (usedCB) {
      promise.then(function (result) {
        usedCB(null, result);
      }, usedCB);
    }
    return promise;
  });
}

function logApiCall(self, name, args) {
  /* istanbul ignore if */
  if (self.constructor.listeners('debug').length) {
    var logArgs = ['api', self.name, name];
    for (var i = 0; i < args.length - 1; i++) {
      logArgs.push(args[i]);
    }
    self.constructor.emit('debug', logArgs);

    // override the callback itself to log the response
    var origCallback = args[args.length - 1];
    args[args.length - 1] = function (err, res) {
      var responseArgs = ['api', self.name, name];
      responseArgs = responseArgs.concat(
        err ? ['error', err] : ['success', res]
      );
      self.constructor.emit('debug', responseArgs);
      origCallback(err, res);
    };
  }
}

function adapterFun(name, callback) {
  return toPromise(getArguments(function (args) {
    if (this._closed) {
      return PouchPromise$1.reject(new Error('database is closed'));
    }
    if (this._destroyed) {
      return PouchPromise$1.reject(new Error('database is destroyed'));
    }
    var self = this;
    logApiCall(self, name, args);
    if (!this.taskqueue.isReady) {
      return new PouchPromise$1(function (fulfill, reject) {
        self.taskqueue.addTask(function (failed) {
          if (failed) {
            reject(failed);
          } else {
            fulfill(self[name].apply(self, args));
          }
        });
      });
    }
    return callback.apply(this, args);
  }));
}

function mangle(key) {
  return '$' + key;
}
function unmangle(key) {
  return key.substring(1);
}
function Map$1() {
  this._store = {};
}
Map$1.prototype.get = function (key) {
  var mangled = mangle(key);
  return this._store[mangled];
};
Map$1.prototype.set = function (key, value) {
  var mangled = mangle(key);
  this._store[mangled] = value;
  return true;
};
Map$1.prototype.has = function (key) {
  var mangled = mangle(key);
  return mangled in this._store;
};
Map$1.prototype.delete = function (key) {
  var mangled = mangle(key);
  var res = mangled in this._store;
  delete this._store[mangled];
  return res;
};
Map$1.prototype.forEach = function (cb) {
  var keys = Object.keys(this._store);
  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i];
    var value = this._store[key];
    key = unmangle(key);
    cb(value, key);
  }
};
Object.defineProperty(Map$1.prototype, 'size', {
  get: function () {
    return Object.keys(this._store).length;
  }
});

function Set$1(array) {
  this._store = new Map$1();

  // init with an array
  if (array && Array.isArray(array)) {
    for (var i = 0, len = array.length; i < len; i++) {
      this.add(array[i]);
    }
  }
}
Set$1.prototype.add = function (key) {
  return this._store.set(key, true);
};
Set$1.prototype.has = function (key) {
  return this._store.has(key);
};
Set$1.prototype.forEach = function (cb) {
  this._store.forEach(function (value, key) {
    cb(key);
  });
};
Object.defineProperty(Set$1.prototype, 'size', {
  get: function () {
    return this._store.size;
  }
});

/* global Map,Set,Symbol */
// Based on https://kangax.github.io/compat-table/es6/ we can sniff out
// incomplete Map/Set implementations which would otherwise cause our tests to fail.
// Notably they fail in IE11 and iOS 8.4, which this prevents.
function supportsMapAndSet() {
  if (typeof Symbol === 'undefined' || typeof Map === 'undefined' || typeof Set === 'undefined') {
    return false;
  }
  var prop = Object.getOwnPropertyDescriptor(Map, Symbol.species);
  return prop && 'get' in prop && Map[Symbol.species] === Map;
}

// based on https://github.com/montagejs/collections
/* global Map,Set */

var ExportedSet;
var ExportedMap;

{
  if (supportsMapAndSet()) { // prefer built-in Map/Set
    ExportedSet = Set;
    ExportedMap = Map;
  } else { // fall back to our polyfill
    ExportedSet = Set$1;
    ExportedMap = Map$1;
  }
}

// like underscore/lodash _.pick()
function pick(obj, arr) {
  var res = {};
  for (var i = 0, len = arr.length; i < len; i++) {
    var prop = arr[i];
    if (prop in obj) {
      res[prop] = obj[prop];
    }
  }
  return res;
}

// Most browsers throttle concurrent requests at 6, so it's silly
// to shim _bulk_get by trying to launch potentially hundreds of requests
// and then letting the majority time out. We can handle this ourselves.
var MAX_NUM_CONCURRENT_REQUESTS = 6;

function identityFunction(x) {
  return x;
}

function formatResultForOpenRevsGet(result) {
  return [{
    ok: result
  }];
}

// shim for P/CouchDB adapters that don't directly implement _bulk_get
function bulkGet(db, opts, callback) {
  var requests = opts.docs;

  // consolidate into one request per doc if possible
  var requestsById = new ExportedMap();
  requests.forEach(function (request) {
    if (requestsById.has(request.id)) {
      requestsById.get(request.id).push(request);
    } else {
      requestsById.set(request.id, [request]);
    }
  });

  var numDocs = requestsById.size;
  var numDone = 0;
  var perDocResults = new Array(numDocs);

  function collapseResultsAndFinish() {
    var results = [];
    perDocResults.forEach(function (res) {
      res.docs.forEach(function (info) {
        results.push({
          id: res.id,
          docs: [info]
        });
      });
    });
    callback(null, {results: results});
  }

  function checkDone() {
    if (++numDone === numDocs) {
      collapseResultsAndFinish();
    }
  }

  function gotResult(docIndex, id, docs) {
    perDocResults[docIndex] = {id: id, docs: docs};
    checkDone();
  }

  var allRequests = [];
  requestsById.forEach(function (value, key) {
    allRequests.push(key);
  });

  var i = 0;

  function nextBatch() {

    if (i >= allRequests.length) {
      return;
    }

    var upTo = Math.min(i + MAX_NUM_CONCURRENT_REQUESTS, allRequests.length);
    var batch = allRequests.slice(i, upTo);
    processBatch(batch, i);
    i += batch.length;
  }

  function processBatch(batch, offset) {
    batch.forEach(function (docId, j) {
      var docIdx = offset + j;
      var docRequests = requestsById.get(docId);

      // just use the first request as the "template"
      // TODO: The _bulk_get API allows for more subtle use cases than this,
      // but for now it is unlikely that there will be a mix of different
      // "atts_since" or "attachments" in the same request, since it's just
      // replicate.js that is using this for the moment.
      // Also, atts_since is aspirational, since we don't support it yet.
      var docOpts = pick(docRequests[0], ['atts_since', 'attachments']);
      docOpts.open_revs = docRequests.map(function (request) {
        // rev is optional, open_revs disallowed
        return request.rev;
      });

      // remove falsey / undefined revisions
      docOpts.open_revs = docOpts.open_revs.filter(identityFunction);

      var formatResult = identityFunction;

      if (docOpts.open_revs.length === 0) {
        delete docOpts.open_revs;

        // when fetching only the "winning" leaf,
        // transform the result so it looks like an open_revs
        // request
        formatResult = formatResultForOpenRevsGet;
      }

      // globally-supplied options
      ['revs', 'attachments', 'binary', 'ajax', 'latest'].forEach(function (param) {
        if (param in opts) {
          docOpts[param] = opts[param];
        }
      });
      db.get(docId, docOpts, function (err, res) {
        var result;
        /* istanbul ignore if */
        if (err) {
          result = [{error: err}];
        } else {
          result = formatResult(res);
        }
        gotResult(docIdx, docId, result);
        nextBatch();
      });
    });
  }

  nextBatch();

}

function isChromeApp() {
  return (typeof chrome !== "undefined" &&
    typeof chrome.storage !== "undefined" &&
    typeof chrome.storage.local !== "undefined");
}

var hasLocal;

if (isChromeApp()) {
  hasLocal = false;
} else {
  try {
    localStorage.setItem('_pouch_check_localstorage', 1);
    hasLocal = !!localStorage.getItem('_pouch_check_localstorage');
  } catch (e) {
    hasLocal = false;
  }
}

function hasLocalStorage() {
  return hasLocal;
}

// Custom nextTick() shim for browsers. In node, this will just be process.nextTick(). We
// avoid using process.nextTick() directly because the polyfill is very large and we don't
// need all of it (see: https://github.com/defunctzombie/node-process).
// "immediate" 3.0.8 is used by lie, and it's a smaller version of the latest "immediate"
// package, so it's the one we use.
// When we use nextTick() in our codebase, we only care about not releasing Zalgo
// (see: http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony).
// Microtask vs macrotask doesn't matter to us. So we're free to use the fastest
// (least latency) option, which is "immediate" due to use of microtasks.
// All of our nextTicks are isolated to this one function so we can easily swap out one
// implementation for another.

inherits(Changes, events.EventEmitter);

/* istanbul ignore next */
function attachBrowserEvents(self) {
  if (isChromeApp()) {
    chrome.storage.onChanged.addListener(function (e) {
      // make sure it's event addressed to us
      if (e.db_name != null) {
        //object only has oldValue, newValue members
        self.emit(e.dbName.newValue);
      }
    });
  } else if (hasLocalStorage()) {
    if (typeof addEventListener !== 'undefined') {
      addEventListener("storage", function (e) {
        self.emit(e.key);
      });
    } else { // old IE
      window.attachEvent("storage", function (e) {
        self.emit(e.key);
      });
    }
  }
}

function Changes() {
  events.EventEmitter.call(this);
  this._listeners = {};

  attachBrowserEvents(this);
}
Changes.prototype.addListener = function (dbName, id, db, opts) {
  /* istanbul ignore if */
  if (this._listeners[id]) {
    return;
  }
  var self = this;
  var inprogress = false;
  function eventFunction() {
    /* istanbul ignore if */
    if (!self._listeners[id]) {
      return;
    }
    if (inprogress) {
      inprogress = 'waiting';
      return;
    }
    inprogress = true;
    var changesOpts = pick(opts, [
      'style', 'include_docs', 'attachments', 'conflicts', 'filter',
      'doc_ids', 'view', 'since', 'query_params', 'binary'
    ]);

    /* istanbul ignore next */
    function onError() {
      inprogress = false;
    }

    db.changes(changesOpts).on('change', function (c) {
      if (c.seq > opts.since && !opts.cancelled) {
        opts.since = c.seq;
        opts.onChange(c);
      }
    }).on('complete', function () {
      if (inprogress === 'waiting') {
        nextTick(eventFunction);
      }
      inprogress = false;
    }).on('error', onError);
  }
  this._listeners[id] = eventFunction;
  this.on(dbName, eventFunction);
};

Changes.prototype.removeListener = function (dbName, id) {
  /* istanbul ignore if */
  if (!(id in this._listeners)) {
    return;
  }
  events.EventEmitter.prototype.removeListener.call(this, dbName,
    this._listeners[id]);
  delete this._listeners[id];
};


/* istanbul ignore next */
Changes.prototype.notifyLocalWindows = function (dbName) {
  //do a useless change on a storage thing
  //in order to get other windows's listeners to activate
  if (isChromeApp()) {
    chrome.storage.local.set({dbName: dbName});
  } else if (hasLocalStorage()) {
    localStorage[dbName] = (localStorage[dbName] === "a") ? "b" : "a";
  }
};

Changes.prototype.notify = function (dbName) {
  this.emit(dbName);
  this.notifyLocalWindows(dbName);
};

function guardedConsole(method) {
  /* istanbul ignore else */
  if (console !== 'undefined' && method in console) {
    var args = Array.prototype.slice.call(arguments, 1);
    console[method].apply(console, args);
  }
}

function randomNumber(min, max) {
  var maxTimeout = 600000; // Hard-coded default of 10 minutes
  min = parseInt(min, 10) || 0;
  max = parseInt(max, 10);
  if (max !== max || max <= min) {
    max = (min || 1) << 1; //doubling
  } else {
    max = max + 1;
  }
  // In order to not exceed maxTimeout, pick a random value between half of maxTimeout and maxTimeout
  if (max > maxTimeout) {
    min = maxTimeout >> 1; // divide by two
    max = maxTimeout;
  }
  var ratio = Math.random();
  var range = max - min;

  return ~~(range * ratio + min); // ~~ coerces to an int, but fast.
}

function defaultBackOff(min) {
  var max = 0;
  if (!min) {
    max = 2000;
  }
  return randomNumber(min, max);
}

// designed to give info to browser users, who are disturbed
// when they see http errors in the console
function explainError(status, str) {
  guardedConsole('info', 'The above ' + status + ' is totally normal. ' + str);
}

var assign;
{
  if (typeof Object.assign === 'function') {
    assign = Object.assign;
  } else {
    // lite Object.assign polyfill based on
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    assign = function (target) {
      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    };
  }
}

var $inject_Object_assign = assign;

inherits(PouchError, Error);

function PouchError(status, error, reason) {
  Error.call(this, reason);
  this.status = status;
  this.name = error;
  this.message = reason;
  this.error = true;
}

PouchError.prototype.toString = function () {
  return JSON.stringify({
    status: this.status,
    name: this.name,
    message: this.message,
    reason: this.reason
  });
};

var UNAUTHORIZED = new PouchError(401, 'unauthorized', "Name or password is incorrect.");
var MISSING_BULK_DOCS = new PouchError(400, 'bad_request', "Missing JSON list of 'docs'");
var MISSING_DOC = new PouchError(404, 'not_found', 'missing');
var REV_CONFLICT = new PouchError(409, 'conflict', 'Document update conflict');
var INVALID_ID = new PouchError(400, 'bad_request', '_id field must contain a string');
var MISSING_ID = new PouchError(412, 'missing_id', '_id is required for puts');
var RESERVED_ID = new PouchError(400, 'bad_request', 'Only reserved document ids may start with underscore.');
var NOT_OPEN = new PouchError(412, 'precondition_failed', 'Database not open');
var UNKNOWN_ERROR = new PouchError(500, 'unknown_error', 'Database encountered an unknown error');
var BAD_ARG = new PouchError(500, 'badarg', 'Some query argument is invalid');
var INVALID_REQUEST = new PouchError(400, 'invalid_request', 'Request was invalid');
var QUERY_PARSE_ERROR = new PouchError(400, 'query_parse_error', 'Some query parameter is invalid');
var DOC_VALIDATION = new PouchError(500, 'doc_validation', 'Bad special document member');
var BAD_REQUEST = new PouchError(400, 'bad_request', 'Something wrong with the request');
var NOT_AN_OBJECT = new PouchError(400, 'bad_request', 'Document must be a JSON object');
var DB_MISSING = new PouchError(404, 'not_found', 'Database not found');
var IDB_ERROR = new PouchError(500, 'indexed_db_went_bad', 'unknown');
var WSQ_ERROR = new PouchError(500, 'web_sql_went_bad', 'unknown');
var LDB_ERROR = new PouchError(500, 'levelDB_went_went_bad', 'unknown');
var FORBIDDEN = new PouchError(403, 'forbidden', 'Forbidden by design doc validate_doc_update function');
var INVALID_REV = new PouchError(400, 'bad_request', 'Invalid rev format');
var FILE_EXISTS = new PouchError(412, 'file_exists', 'The database could not be created, the file already exists.');
var MISSING_STUB = new PouchError(412, 'missing_stub', 'A pre-existing attachment stub wasn\'t found');
var INVALID_URL = new PouchError(413, 'invalid_url', 'Provided URL is invalid');

function createError(error, reason) {
  function CustomPouchError(reason) {
    // inherit error properties from our parent error manually
    // so as to allow proper JSON parsing.
    /* jshint ignore:start */
    for (var p in error) {
      if (typeof error[p] !== 'function') {
        this[p] = error[p];
      }
    }
    /* jshint ignore:end */
    if (reason !== undefined) {
      this.reason = reason;
    }
  }
  CustomPouchError.prototype = PouchError.prototype;
  return new CustomPouchError(reason);
}

function generateErrorFromResponse(err) {

  if (typeof err !== 'object') {
    var data = err;
    err = UNKNOWN_ERROR;
    err.data = data;
  }

  if ('error' in err && err.error === 'conflict') {
    err.name = 'conflict';
    err.status = 409;
  }

  if (!('name' in err)) {
    err.name = err.error || 'unknown';
  }

  if (!('status' in err)) {
    err.status = 500;
  }

  if (!('message' in err)) {
    err.message = err.message || err.reason;
  }

  return err;
}

function tryFilter(filter, doc, req) {
  try {
    return !filter(doc, req);
  } catch (err) {
    var msg = 'Filter function threw: ' + err.toString();
    return createError(BAD_REQUEST, msg);
  }
}

function filterChange(opts) {
  var req = {};
  var hasFilter = opts.filter && typeof opts.filter === 'function';
  req.query = opts.query_params;

  return function filter(change) {
    if (!change.doc) {
      // CSG sends events on the changes feed that don't have documents,
      // this hack makes a whole lot of existing code robust.
      change.doc = {};
    }

    var filterReturn = hasFilter && tryFilter(opts.filter, change.doc, req);

    if (typeof filterReturn === 'object') {
      return filterReturn;
    }

    if (filterReturn) {
      return false;
    }

    if (!opts.include_docs) {
      delete change.doc;
    } else if (!opts.attachments) {
      for (var att in change.doc._attachments) {
        /* istanbul ignore else */
        if (change.doc._attachments.hasOwnProperty(att)) {
          change.doc._attachments[att].stub = true;
        }
      }
    }
    return true;
  };
}

function flatten(arrs) {
  var res = [];
  for (var i = 0, len = arrs.length; i < len; i++) {
    res = res.concat(arrs[i]);
  }
  return res;
}

// shim for Function.prototype.name,
// for browsers that don't support it like IE

/* istanbul ignore next */
function f() {}

var hasName = f.name;
var res;

// We dont run coverage in IE
/* istanbul ignore else */
if (hasName) {
  res = function (fun) {
    return fun.name;
  };
} else {
  res = function (fun) {
    return fun.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
  };
}

// Determine id an ID is valid
//   - invalid IDs begin with an underescore that does not begin '_design' or
//     '_local'
//   - any other string value is a valid id
// Returns the specific error object for each case
function invalidIdError(id) {
  var err;
  if (!id) {
    err = createError(MISSING_ID);
  } else if (typeof id !== 'string') {
    err = createError(INVALID_ID);
  } else if (/^_/.test(id) && !(/^_(design|local)/).test(id)) {
    err = createError(RESERVED_ID);
  }
  if (err) {
    throw err;
  }
}

// Checks if a PouchDB object is "remote" or not. This is
// designed to opt-in to certain optimizations, such as
// avoiding checks for "dependentDbs" and other things that
// we know only apply to local databases. In general, "remote"
// should be true for the http adapter, and for third-party
// adapters with similar expensive boundaries to cross for
// every API call, such as socket-pouch and worker-pouch.
// Previously, this was handled via db.type() === 'http'
// which is now deprecated.

function isRemote(db) {
  if (typeof db._remote === 'boolean') {
    return db._remote;
  }
  /* istanbul ignore next */
  if (typeof db.type === 'function') {
    guardedConsole('warn',
      'db.type() is deprecated and will be removed in ' +
      'a future version of PouchDB');
    return db.type() === 'http';
  }
  /* istanbul ignore next */
  return false;
}

function listenerCount(ee, type) {
  return 'listenerCount' in ee ? ee.listenerCount(type) :
                                 events.EventEmitter.listenerCount(ee, type);
}

function parseDesignDocFunctionName(s) {
  if (!s) {
    return null;
  }
  var parts = s.split('/');
  if (parts.length === 2) {
    return parts;
  }
  if (parts.length === 1) {
    return [s, s];
  }
  return null;
}

function normalizeDesignDocFunctionName(s) {
  var normalized = parseDesignDocFunctionName(s);
  return normalized ? normalized.join('/') : null;
}

// originally parseUri 1.2.2, now patched by us
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
var keys = ["source", "protocol", "authority", "userInfo", "user", "password",
    "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
var qName ="queryKey";
var qParser = /(?:^|&)([^&=]*)=?([^&]*)/g;

// use the "loose" parser
/* eslint maxlen: 0, no-useless-escape: 0 */
var parser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

function parseUri(str) {
  var m = parser.exec(str);
  var uri = {};
  var i = 14;

  while (i--) {
    var key = keys[i];
    var value = m[i] || "";
    var encoded = ['user', 'password'].indexOf(key) !== -1;
    uri[key] = encoded ? decodeURIComponent(value) : value;
  }

  uri[qName] = {};
  uri[keys[12]].replace(qParser, function ($0, $1, $2) {
    if ($1) {
      uri[qName][$1] = $2;
    }
  });

  return uri;
}

// Based on https://github.com/alexdavid/scope-eval v0.0.3
// (source: https://unpkg.com/scope-eval@0.0.3/scope_eval.js)
// This is basically just a wrapper around new Function()

function scopeEval(source, scope) {
  var keys = [];
  var values = [];
  for (var key in scope) {
    if (scope.hasOwnProperty(key)) {
      keys.push(key);
      values.push(scope[key]);
    }
  }
  keys.push(source);
  return Function.apply(null, keys).apply(null, values);
}

// this is essentially the "update sugar" function from daleharvey/pouchdb#1388
// the diffFun tells us what delta to apply to the doc.  it either returns
// the doc, or false if it doesn't need to do an update after all
function upsert(db, docId, diffFun) {
  return new PouchPromise$1(function (fulfill, reject) {
    db.get(docId, function (err, doc) {
      if (err) {
        /* istanbul ignore next */
        if (err.status !== 404) {
          return reject(err);
        }
        doc = {};
      }

      // the user might change the _rev, so save it for posterity
      var docRev = doc._rev;
      var newDoc = diffFun(doc);

      if (!newDoc) {
        // if the diffFun returns falsy, we short-circuit as
        // an optimization
        return fulfill({updated: false, rev: docRev});
      }

      // users aren't allowed to modify these values,
      // so reset them here
      newDoc._id = docId;
      newDoc._rev = docRev;
      fulfill(tryAndPut(db, newDoc, diffFun));
    });
  });
}

function tryAndPut(db, doc, diffFun) {
  return db.put(doc).then(function (res) {
    return {
      updated: true,
      rev: res.rev
    };
  }, function (err) {
    /* istanbul ignore next */
    if (err.status !== 409) {
      throw err;
    }
    return upsert(db, doc._id, diffFun);
  });
}

function rev() {
  return uuidV4.v4().replace(/-/g, '').toLowerCase();
}

var uuid = uuidV4.v4;

// We fetch all leafs of the revision tree, and sort them based on tree length
// and whether they were deleted, undeleted documents with the longest revision
// tree (most edits) win
// The final sort algorithm is slightly documented in a sidebar here:
// http://guide.couchdb.org/draft/conflicts.html
function winningRev(metadata) {
  var winningId;
  var winningPos;
  var winningDeleted;
  var toVisit = metadata.rev_tree.slice();
  var node;
  while ((node = toVisit.pop())) {
    var tree = node.ids;
    var branches = tree[2];
    var pos = node.pos;
    if (branches.length) { // non-leaf
      for (var i = 0, len = branches.length; i < len; i++) {
        toVisit.push({pos: pos + 1, ids: branches[i]});
      }
      continue;
    }
    var deleted = !!tree[1].deleted;
    var id = tree[0];
    // sort by deleted, then pos, then id
    if (!winningId || (winningDeleted !== deleted ? winningDeleted :
        winningPos !== pos ? winningPos < pos : winningId < id)) {
      winningId = id;
      winningPos = pos;
      winningDeleted = deleted;
    }
  }

  return winningPos + '-' + winningId;
}

// Pretty much all below can be combined into a higher order function to
// traverse revisions
// The return value from the callback will be passed as context to all
// children of that node
function traverseRevTree(revs, callback) {
  var toVisit = revs.slice();

  var node;
  while ((node = toVisit.pop())) {
    var pos = node.pos;
    var tree = node.ids;
    var branches = tree[2];
    var newCtx =
      callback(branches.length === 0, pos, tree[0], node.ctx, tree[1]);
    for (var i = 0, len = branches.length; i < len; i++) {
      toVisit.push({pos: pos + 1, ids: branches[i], ctx: newCtx});
    }
  }
}

function sortByPos(a, b) {
  return a.pos - b.pos;
}

function collectLeaves(revs) {
  var leaves = [];
  traverseRevTree(revs, function (isLeaf, pos, id, acc, opts) {
    if (isLeaf) {
      leaves.push({rev: pos + "-" + id, pos: pos, opts: opts});
    }
  });
  leaves.sort(sortByPos).reverse();
  for (var i = 0, len = leaves.length; i < len; i++) {
    delete leaves[i].pos;
  }
  return leaves;
}

// returns revs of all conflicts that is leaves such that
// 1. are not deleted and
// 2. are different than winning revision
function collectConflicts(metadata) {
  var win = winningRev(metadata);
  var leaves = collectLeaves(metadata.rev_tree);
  var conflicts = [];
  for (var i = 0, len = leaves.length; i < len; i++) {
    var leaf = leaves[i];
    if (leaf.rev !== win && !leaf.opts.deleted) {
      conflicts.push(leaf.rev);
    }
  }
  return conflicts;
}

// compact a tree by marking its non-leafs as missing,
// and return a list of revs to delete
function compactTree(metadata) {
  var revs = [];
  traverseRevTree(metadata.rev_tree, function (isLeaf, pos,
                                               revHash, ctx, opts) {
    if (opts.status === 'available' && !isLeaf) {
      revs.push(pos + '-' + revHash);
      opts.status = 'missing';
    }
  });
  return revs;
}

// build up a list of all the paths to the leafs in this revision tree
function rootToLeaf(revs) {
  var paths = [];
  var toVisit = revs.slice();
  var node;
  while ((node = toVisit.pop())) {
    var pos = node.pos;
    var tree = node.ids;
    var id = tree[0];
    var opts = tree[1];
    var branches = tree[2];
    var isLeaf = branches.length === 0;

    var history = node.history ? node.history.slice() : [];
    history.push({id: id, opts: opts});
    if (isLeaf) {
      paths.push({pos: (pos + 1 - history.length), ids: history});
    }
    for (var i = 0, len = branches.length; i < len; i++) {
      toVisit.push({pos: pos + 1, ids: branches[i], history: history});
    }
  }
  return paths.reverse();
}

// for a better overview of what this is doing, read:
// https://github.com/apache/couchdb-couch/blob/master/src/couch_key_tree.erl
//
// But for a quick intro, CouchDB uses a revision tree to store a documents
// history, A -> B -> C, when a document has conflicts, that is a branch in the
// tree, A -> (B1 | B2 -> C), We store these as a nested array in the format
//
// KeyTree = [Path ... ]
// Path = {pos: position_from_root, ids: Tree}
// Tree = [Key, Opts, [Tree, ...]], in particular single node: [Key, []]

function sortByPos$1(a, b) {
  return a.pos - b.pos;
}

// classic binary search
function binarySearch(arr, item, comparator) {
  var low = 0;
  var high = arr.length;
  var mid;
  while (low < high) {
    mid = (low + high) >>> 1;
    if (comparator(arr[mid], item) < 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

// assuming the arr is sorted, insert the item in the proper place
function insertSorted(arr, item, comparator) {
  var idx = binarySearch(arr, item, comparator);
  arr.splice(idx, 0, item);
}

// Turn a path as a flat array into a tree with a single branch.
// If any should be stemmed from the beginning of the array, that's passed
// in as the second argument
function pathToTree(path, numStemmed) {
  var root;
  var leaf;
  for (var i = numStemmed, len = path.length; i < len; i++) {
    var node = path[i];
    var currentLeaf = [node.id, node.opts, []];
    if (leaf) {
      leaf[2].push(currentLeaf);
      leaf = currentLeaf;
    } else {
      root = leaf = currentLeaf;
    }
  }
  return root;
}

// compare the IDs of two trees
function compareTree(a, b) {
  return a[0] < b[0] ? -1 : 1;
}

// Merge two trees together
// The roots of tree1 and tree2 must be the same revision
function mergeTree(in_tree1, in_tree2) {
  var queue = [{tree1: in_tree1, tree2: in_tree2}];
  var conflicts = false;
  while (queue.length > 0) {
    var item = queue.pop();
    var tree1 = item.tree1;
    var tree2 = item.tree2;

    if (tree1[1].status || tree2[1].status) {
      tree1[1].status =
        (tree1[1].status ===  'available' ||
        tree2[1].status === 'available') ? 'available' : 'missing';
    }

    for (var i = 0; i < tree2[2].length; i++) {
      if (!tree1[2][0]) {
        conflicts = 'new_leaf';
        tree1[2][0] = tree2[2][i];
        continue;
      }

      var merged = false;
      for (var j = 0; j < tree1[2].length; j++) {
        if (tree1[2][j][0] === tree2[2][i][0]) {
          queue.push({tree1: tree1[2][j], tree2: tree2[2][i]});
          merged = true;
        }
      }
      if (!merged) {
        conflicts = 'new_branch';
        insertSorted(tree1[2], tree2[2][i], compareTree);
      }
    }
  }
  return {conflicts: conflicts, tree: in_tree1};
}

function doMerge(tree, path, dontExpand) {
  var restree = [];
  var conflicts = false;
  var merged = false;
  var res;

  if (!tree.length) {
    return {tree: [path], conflicts: 'new_leaf'};
  }

  for (var i = 0, len = tree.length; i < len; i++) {
    var branch = tree[i];
    if (branch.pos === path.pos && branch.ids[0] === path.ids[0]) {
      // Paths start at the same position and have the same root, so they need
      // merged
      res = mergeTree(branch.ids, path.ids);
      restree.push({pos: branch.pos, ids: res.tree});
      conflicts = conflicts || res.conflicts;
      merged = true;
    } else if (dontExpand !== true) {
      // The paths start at a different position, take the earliest path and
      // traverse up until it as at the same point from root as the path we
      // want to merge.  If the keys match we return the longer path with the
      // other merged After stemming we dont want to expand the trees

      var t1 = branch.pos < path.pos ? branch : path;
      var t2 = branch.pos < path.pos ? path : branch;
      var diff = t2.pos - t1.pos;

      var candidateParents = [];

      var trees = [];
      trees.push({ids: t1.ids, diff: diff, parent: null, parentIdx: null});
      while (trees.length > 0) {
        var item = trees.pop();
        if (item.diff === 0) {
          if (item.ids[0] === t2.ids[0]) {
            candidateParents.push(item);
          }
          continue;
        }
        var elements = item.ids[2];
        for (var j = 0, elementsLen = elements.length; j < elementsLen; j++) {
          trees.push({
            ids: elements[j],
            diff: item.diff - 1,
            parent: item.ids,
            parentIdx: j
          });
        }
      }

      var el = candidateParents[0];

      if (!el) {
        restree.push(branch);
      } else {
        res = mergeTree(el.ids, t2.ids);
        el.parent[2][el.parentIdx] = res.tree;
        restree.push({pos: t1.pos, ids: t1.ids});
        conflicts = conflicts || res.conflicts;
        merged = true;
      }
    } else {
      restree.push(branch);
    }
  }

  // We didnt find
  if (!merged) {
    restree.push(path);
  }

  restree.sort(sortByPos$1);

  return {
    tree: restree,
    conflicts: conflicts || 'internal_node'
  };
}

// To ensure we dont grow the revision tree infinitely, we stem old revisions
function stem(tree, depth) {
  // First we break out the tree into a complete list of root to leaf paths
  var paths = rootToLeaf(tree);
  var stemmedRevs;

  var result;
  for (var i = 0, len = paths.length; i < len; i++) {
    // Then for each path, we cut off the start of the path based on the
    // `depth` to stem to, and generate a new set of flat trees
    var path = paths[i];
    var stemmed = path.ids;
    var node;
    if (stemmed.length > depth) {
      // only do the stemming work if we actually need to stem
      if (!stemmedRevs) {
        stemmedRevs = {}; // avoid allocating this object unnecessarily
      }
      var numStemmed = stemmed.length - depth;
      node = {
        pos: path.pos + numStemmed,
        ids: pathToTree(stemmed, numStemmed)
      };

      for (var s = 0; s < numStemmed; s++) {
        var rev = (path.pos + s) + '-' + stemmed[s].id;
        stemmedRevs[rev] = true;
      }
    } else { // no need to actually stem
      node = {
        pos: path.pos,
        ids: pathToTree(stemmed, 0)
      };
    }

    // Then we remerge all those flat trees together, ensuring that we dont
    // connect trees that would go beyond the depth limit
    if (result) {
      result = doMerge(result, node, true).tree;
    } else {
      result = [node];
    }
  }

  // this is memory-heavy per Chrome profiler, avoid unless we actually stemmed
  if (stemmedRevs) {
    traverseRevTree(result, function (isLeaf, pos, revHash) {
      // some revisions may have been removed in a branch but not in another
      delete stemmedRevs[pos + '-' + revHash];
    });
  }

  return {
    tree: result,
    revs: stemmedRevs ? Object.keys(stemmedRevs) : []
  };
}

function merge(tree, path, depth) {
  var newTree = doMerge(tree, path);
  var stemmed = stem(newTree.tree, depth);
  return {
    tree: stemmed.tree,
    stemmedRevs: stemmed.revs,
    conflicts: newTree.conflicts
  };
}

// return true if a rev exists in the rev tree, false otherwise
function revExists(revs, rev) {
  var toVisit = revs.slice();
  var splitRev = rev.split('-');
  var targetPos = parseInt(splitRev[0], 10);
  var targetId = splitRev[1];

  var node;
  while ((node = toVisit.pop())) {
    if (node.pos === targetPos && node.ids[0] === targetId) {
      return true;
    }
    var branches = node.ids[2];
    for (var i = 0, len = branches.length; i < len; i++) {
      toVisit.push({pos: node.pos + 1, ids: branches[i]});
    }
  }
  return false;
}

function getTrees(node) {
  return node.ids;
}

// check if a specific revision of a doc has been deleted
//  - metadata: the metadata object from the doc store
//  - rev: (optional) the revision to check. defaults to winning revision
function isDeleted(metadata, rev) {
  if (!rev) {
    rev = winningRev(metadata);
  }
  var id = rev.substring(rev.indexOf('-') + 1);
  var toVisit = metadata.rev_tree.map(getTrees);

  var tree;
  while ((tree = toVisit.pop())) {
    if (tree[0] === id) {
      return !!tree[1].deleted;
    }
    toVisit = toVisit.concat(tree[2]);
  }
}

function isLocalId(id) {
  return (/^_local/).test(id);
}

// returns the current leaf node for a given revision
function latest(rev, metadata) {
  var toVisit = metadata.rev_tree.slice();
  var node;
  while ((node = toVisit.pop())) {
    var pos = node.pos;
    var tree = node.ids;
    var id = tree[0];
    var opts = tree[1];
    var branches = tree[2];
    var isLeaf = branches.length === 0;

    var history = node.history ? node.history.slice() : [];
    history.push({id: id, pos: pos, opts: opts});

    if (isLeaf) {
      for (var i = 0, len = history.length; i < len; i++) {
        var historyNode = history[i];
        var historyRev = historyNode.pos + '-' + historyNode.id;

        if (historyRev === rev) {
          // return the rev of this leaf
          return pos + '-' + id;
        }
      }
    }

    for (var j = 0, l = branches.length; j < l; j++) {
      toVisit.push({pos: pos + 1, ids: branches[j], history: history});
    }
  }

  /* istanbul ignore next */
  throw new Error('Unable to resolve latest revision for id ' + metadata.id + ', rev ' + rev);
}

inherits(Changes$2, events.EventEmitter);

function tryCatchInChangeListener(self, change) {
  // isolate try/catches to avoid V8 deoptimizations
  try {
    self.emit('change', change);
  } catch (e) {
    guardedConsole('error', 'Error in .on("change", function):', e);
  }
}

function Changes$2(db, opts, callback) {
  events.EventEmitter.call(this);
  var self = this;
  this.db = db;
  opts = opts ? clone(opts) : {};
  var complete = opts.complete = once(function (err, resp) {
    if (err) {
      if (listenerCount(self, 'error') > 0) {
        self.emit('error', err);
      }
    } else {
      self.emit('complete', resp);
    }
    self.removeAllListeners();
    db.removeListener('destroyed', onDestroy);
  });
  if (callback) {
    self.on('complete', function (resp) {
      callback(null, resp);
    });
    self.on('error', callback);
  }
  function onDestroy() {
    self.cancel();
  }
  db.once('destroyed', onDestroy);

  opts.onChange = function (change) {
    /* istanbul ignore if */
    if (self.isCancelled) {
      return;
    }
    tryCatchInChangeListener(self, change);
  };

  var promise = new PouchPromise$1(function (fulfill, reject) {
    opts.complete = function (err, res) {
      if (err) {
        reject(err);
      } else {
        fulfill(res);
      }
    };
  });
  self.once('cancel', function () {
    db.removeListener('destroyed', onDestroy);
    opts.complete(null, {status: 'cancelled'});
  });
  this.then = promise.then.bind(promise);
  this['catch'] = promise['catch'].bind(promise);
  this.then(function (result) {
    complete(null, result);
  }, complete);



  if (!db.taskqueue.isReady) {
    db.taskqueue.addTask(function (failed) {
      if (failed) {
        opts.complete(failed);
      } else if (self.isCancelled) {
        self.emit('cancel');
      } else {
        self.validateChanges(opts);
      }
    });
  } else {
    self.validateChanges(opts);
  }
}
Changes$2.prototype.cancel = function () {
  this.isCancelled = true;
  if (this.db.taskqueue.isReady) {
    this.emit('cancel');
  }
};
function processChange(doc, metadata, opts) {
  var changeList = [{rev: doc._rev}];
  if (opts.style === 'all_docs') {
    changeList = collectLeaves(metadata.rev_tree)
    .map(function (x) { return {rev: x.rev}; });
  }
  var change = {
    id: metadata.id,
    changes: changeList,
    doc: doc
  };

  if (isDeleted(metadata, doc._rev)) {
    change.deleted = true;
  }
  if (opts.conflicts) {
    change.doc._conflicts = collectConflicts(metadata);
    if (!change.doc._conflicts.length) {
      delete change.doc._conflicts;
    }
  }
  return change;
}

Changes$2.prototype.validateChanges = function (opts) {
  var callback = opts.complete;
  var self = this;

  /* istanbul ignore else */
  if (PouchDB$5._changesFilterPlugin) {
    PouchDB$5._changesFilterPlugin.validate(opts, function (err) {
      if (err) {
        return callback(err);
      }
      self.doChanges(opts);
    });
  } else {
    self.doChanges(opts);
  }
};

Changes$2.prototype.doChanges = function (opts) {
  var self = this;
  var callback = opts.complete;

  opts = clone(opts);
  if ('live' in opts && !('continuous' in opts)) {
    opts.continuous = opts.live;
  }
  opts.processChange = processChange;

  if (opts.since === 'latest') {
    opts.since = 'now';
  }
  if (!opts.since) {
    opts.since = 0;
  }
  if (opts.since === 'now') {
    this.db.info().then(function (info) {
      /* istanbul ignore if */
      if (self.isCancelled) {
        callback(null, {status: 'cancelled'});
        return;
      }
      opts.since = info.update_seq;
      self.doChanges(opts);
    }, callback);
    return;
  }

  /* istanbul ignore else */
  if (PouchDB$5._changesFilterPlugin) {
    PouchDB$5._changesFilterPlugin.normalize(opts);
    if (PouchDB$5._changesFilterPlugin.shouldFilter(this, opts)) {
      return PouchDB$5._changesFilterPlugin.filter(this, opts);
    }
  } else {
    ['doc_ids', 'filter', 'selector', 'view'].forEach(function (key) {
      if (key in opts) {
        guardedConsole('warn',
          'The "' + key + '" option was passed in to changes/replicate, ' +
          'but pouchdb-changes-filter plugin is not installed, so it ' +
          'was ignored. Please install the plugin to enable filtering.'
        );
      }
    });
  }

  if (!('descending' in opts)) {
    opts.descending = false;
  }

  // 0 and 1 should return 1 document
  opts.limit = opts.limit === 0 ? 1 : opts.limit;
  opts.complete = callback;
  var newPromise = this.db._changes(opts);
  /* istanbul ignore else */
  if (newPromise && typeof newPromise.cancel === 'function') {
    var cancel = self.cancel;
    self.cancel = getArguments(function (args) {
      newPromise.cancel();
      cancel.apply(this, args);
    });
  }
};

/*
 * A generic pouch adapter
 */

function compare(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

// Wrapper for functions that call the bulkdocs api with a single doc,
// if the first result is an error, return an error
function yankError(callback, docId) {
  return function (err, results) {
    if (err || (results[0] && results[0].error)) {
      err = err || results[0];
      err.docId = docId;
      callback(err);
    } else {
      callback(null, results.length ? results[0]  : results);
    }
  };
}

// clean docs given to us by the user
function cleanDocs(docs) {
  for (var i = 0; i < docs.length; i++) {
    var doc = docs[i];
    if (doc._deleted) {
      delete doc._attachments; // ignore atts for deleted docs
    } else if (doc._attachments) {
      // filter out extraneous keys from _attachments
      var atts = Object.keys(doc._attachments);
      for (var j = 0; j < atts.length; j++) {
        var att = atts[j];
        doc._attachments[att] = pick(doc._attachments[att],
          ['data', 'digest', 'content_type', 'length', 'revpos', 'stub']);
      }
    }
  }
}

// compare two docs, first by _id then by _rev
function compareByIdThenRev(a, b) {
  var idCompare = compare(a._id, b._id);
  if (idCompare !== 0) {
    return idCompare;
  }
  var aStart = a._revisions ? a._revisions.start : 0;
  var bStart = b._revisions ? b._revisions.start : 0;
  return compare(aStart, bStart);
}

// for every node in a revision tree computes its distance from the closest
// leaf
function computeHeight(revs) {
  var height = {};
  var edges = [];
  traverseRevTree(revs, function (isLeaf, pos, id, prnt) {
    var rev$$1 = pos + "-" + id;
    if (isLeaf) {
      height[rev$$1] = 0;
    }
    if (prnt !== undefined) {
      edges.push({from: prnt, to: rev$$1});
    }
    return rev$$1;
  });

  edges.reverse();
  edges.forEach(function (edge) {
    if (height[edge.from] === undefined) {
      height[edge.from] = 1 + height[edge.to];
    } else {
      height[edge.from] = Math.min(height[edge.from], 1 + height[edge.to]);
    }
  });
  return height;
}

function allDocsKeysQuery(api, opts, callback) {
  var keys =  ('limit' in opts) ?
      opts.keys.slice(opts.skip, opts.limit + opts.skip) :
      (opts.skip > 0) ? opts.keys.slice(opts.skip) : opts.keys;
  if (opts.descending) {
    keys.reverse();
  }
  if (!keys.length) {
    return api._allDocs({limit: 0}, callback);
  }
  var finalResults = {
    offset: opts.skip
  };
  return PouchPromise$1.all(keys.map(function (key) {
    var subOpts = $inject_Object_assign({key: key, deleted: 'ok'}, opts);
    ['limit', 'skip', 'keys'].forEach(function (optKey) {
      delete subOpts[optKey];
    });
    return new PouchPromise$1(function (resolve, reject) {
      api._allDocs(subOpts, function (err, res) {
        /* istanbul ignore if */
        if (err) {
          return reject(err);
        }
        finalResults.total_rows = res.total_rows;
        resolve(res.rows[0] || {key: key, error: 'not_found'});
      });
    });
  })).then(function (results) {
    finalResults.rows = results;
    return finalResults;
  });
}

// all compaction is done in a queue, to avoid attaching
// too many listeners at once
function doNextCompaction(self) {
  var task = self._compactionQueue[0];
  var opts = task.opts;
  var callback = task.callback;
  self.get('_local/compaction').catch(function () {
    return false;
  }).then(function (doc) {
    if (doc && doc.last_seq) {
      opts.last_seq = doc.last_seq;
    }
    self._compact(opts, function (err, res) {
      /* istanbul ignore if */
      if (err) {
        callback(err);
      } else {
        callback(null, res);
      }
      nextTick(function () {
        self._compactionQueue.shift();
        if (self._compactionQueue.length) {
          doNextCompaction(self);
        }
      });
    });
  });
}

function attachmentNameError(name) {
  if (name.charAt(0) === '_') {
    return name + ' is not a valid attachment name, attachment ' +
      'names cannot start with \'_\'';
  }
  return false;
}

inherits(AbstractPouchDB, events.EventEmitter);

function AbstractPouchDB() {
  events.EventEmitter.call(this);
}

AbstractPouchDB.prototype.post =
  adapterFun('post', function (doc, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  if (typeof doc !== 'object' || Array.isArray(doc)) {
    return callback(createError(NOT_AN_OBJECT));
  }
  this.bulkDocs({docs: [doc]}, opts, yankError(callback, doc._id));
});

AbstractPouchDB.prototype.put = adapterFun('put', function (doc, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  if (typeof doc !== 'object' || Array.isArray(doc)) {
    return cb(createError(NOT_AN_OBJECT));
  }
  invalidIdError(doc._id);
  if (isLocalId(doc._id) && typeof this._putLocal === 'function') {
    if (doc._deleted) {
      return this._removeLocal(doc, cb);
    } else {
      return this._putLocal(doc, cb);
    }
  }
  var self = this;
  if (opts.force && doc._rev) {
    transformForceOptionToNewEditsOption();
    putDoc(function (err) {
      var result = err ? null : {ok: true, id: doc._id, rev: doc._rev};
      cb(err, result);
    });
  } else {
    putDoc(cb);
  }

  function transformForceOptionToNewEditsOption() {
    var parts = doc._rev.split('-');
    var oldRevId = parts[1];
    var oldRevNum = parseInt(parts[0], 10);

    var newRevNum = oldRevNum + 1;
    var newRevId = rev();

    doc._revisions = {
      start: newRevNum,
      ids: [newRevId, oldRevId]
    };
    doc._rev = newRevNum + '-' + newRevId;
    opts.new_edits = false;
  }
  function putDoc(next) {
    if (typeof self._put === 'function' && opts.new_edits !== false) {
      self._put(doc, opts, next);
    } else {
      self.bulkDocs({docs: [doc]}, opts, yankError(next, doc._id));
    }
  }
});

AbstractPouchDB.prototype.putAttachment =
  adapterFun('putAttachment', function (docId, attachmentId, rev$$1,
                                              blob, type) {
  var api = this;
  if (typeof type === 'function') {
    type = blob;
    blob = rev$$1;
    rev$$1 = null;
  }
  // Lets fix in https://github.com/pouchdb/pouchdb/issues/3267
  /* istanbul ignore if */
  if (typeof type === 'undefined') {
    type = blob;
    blob = rev$$1;
    rev$$1 = null;
  }
  if (!type) {
    guardedConsole('warn', 'Attachment', attachmentId, 'on document', docId, 'is missing content_type');
  }

  function createAttachment(doc) {
    var prevrevpos = '_rev' in doc ? parseInt(doc._rev, 10) : 0;
    doc._attachments = doc._attachments || {};
    doc._attachments[attachmentId] = {
      content_type: type,
      data: blob,
      revpos: ++prevrevpos
    };
    return api.put(doc);
  }

  return api.get(docId).then(function (doc) {
    if (doc._rev !== rev$$1) {
      throw createError(REV_CONFLICT);
    }

    return createAttachment(doc);
  }, function (err) {
     // create new doc
    /* istanbul ignore else */
    if (err.reason === MISSING_DOC.message) {
      return createAttachment({_id: docId});
    } else {
      throw err;
    }
  });
});

AbstractPouchDB.prototype.removeAttachment =
  adapterFun('removeAttachment', function (docId, attachmentId, rev$$1,
                                                 callback) {
  var self = this;
  self.get(docId, function (err, obj) {
    /* istanbul ignore if */
    if (err) {
      callback(err);
      return;
    }
    if (obj._rev !== rev$$1) {
      callback(createError(REV_CONFLICT));
      return;
    }
    /* istanbul ignore if */
    if (!obj._attachments) {
      return callback();
    }
    delete obj._attachments[attachmentId];
    if (Object.keys(obj._attachments).length === 0) {
      delete obj._attachments;
    }
    self.put(obj, callback);
  });
});

AbstractPouchDB.prototype.remove =
  adapterFun('remove', function (docOrId, optsOrRev, opts, callback) {
  var doc;
  if (typeof optsOrRev === 'string') {
    // id, rev, opts, callback style
    doc = {
      _id: docOrId,
      _rev: optsOrRev
    };
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
  } else {
    // doc, opts, callback style
    doc = docOrId;
    if (typeof optsOrRev === 'function') {
      callback = optsOrRev;
      opts = {};
    } else {
      callback = opts;
      opts = optsOrRev;
    }
  }
  opts = opts || {};
  opts.was_delete = true;
  var newDoc = {_id: doc._id, _rev: (doc._rev || opts.rev)};
  newDoc._deleted = true;
  if (isLocalId(newDoc._id) && typeof this._removeLocal === 'function') {
    return this._removeLocal(doc, callback);
  }
  this.bulkDocs({docs: [newDoc]}, opts, yankError(callback, newDoc._id));
});

AbstractPouchDB.prototype.revsDiff =
  adapterFun('revsDiff', function (req, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  var ids = Object.keys(req);

  if (!ids.length) {
    return callback(null, {});
  }

  var count = 0;
  var missing = new ExportedMap();

  function addToMissing(id, revId) {
    if (!missing.has(id)) {
      missing.set(id, {missing: []});
    }
    missing.get(id).missing.push(revId);
  }

  function processDoc(id, rev_tree) {
    // Is this fast enough? Maybe we should switch to a set simulated by a map
    var missingForId = req[id].slice(0);
    traverseRevTree(rev_tree, function (isLeaf, pos, revHash, ctx,
      opts) {
        var rev$$1 = pos + '-' + revHash;
        var idx = missingForId.indexOf(rev$$1);
        if (idx === -1) {
          return;
        }

        missingForId.splice(idx, 1);
        /* istanbul ignore if */
        if (opts.status !== 'available') {
          addToMissing(id, rev$$1);
        }
      });

    // Traversing the tree is synchronous, so now `missingForId` contains
    // revisions that were not found in the tree
    missingForId.forEach(function (rev$$1) {
      addToMissing(id, rev$$1);
    });
  }

  ids.map(function (id) {
    this._getRevisionTree(id, function (err, rev_tree) {
      if (err && err.status === 404 && err.message === 'missing') {
        missing.set(id, {missing: req[id]});
      } else if (err) {
        /* istanbul ignore next */
        return callback(err);
      } else {
        processDoc(id, rev_tree);
      }

      if (++count === ids.length) {
        // convert LazyMap to object
        var missingObj = {};
        missing.forEach(function (value, key) {
          missingObj[key] = value;
        });
        return callback(null, missingObj);
      }
    });
  }, this);
});

// _bulk_get API for faster replication, as described in
// https://github.com/apache/couchdb-chttpd/pull/33
// At the "abstract" level, it will just run multiple get()s in
// parallel, because this isn't much of a performance cost
// for local databases (except the cost of multiple transactions, which is
// small). The http adapter overrides this in order
// to do a more efficient single HTTP request.
AbstractPouchDB.prototype.bulkGet =
  adapterFun('bulkGet', function (opts, callback) {
  bulkGet(this, opts, callback);
});

// compact one document and fire callback
// by compacting we mean removing all revisions which
// are further from the leaf in revision tree than max_height
AbstractPouchDB.prototype.compactDocument =
  adapterFun('compactDocument', function (docId, maxHeight, callback) {
  var self = this;
  this._getRevisionTree(docId, function (err, revTree) {
    /* istanbul ignore if */
    if (err) {
      return callback(err);
    }
    var height = computeHeight(revTree);
    var candidates = [];
    var revs = [];
    Object.keys(height).forEach(function (rev$$1) {
      if (height[rev$$1] > maxHeight) {
        candidates.push(rev$$1);
      }
    });

    traverseRevTree(revTree, function (isLeaf, pos, revHash, ctx, opts) {
      var rev$$1 = pos + '-' + revHash;
      if (opts.status === 'available' && candidates.indexOf(rev$$1) !== -1) {
        revs.push(rev$$1);
      }
    });
    self._doCompaction(docId, revs, callback);
  });
});

// compact the whole database using single document
// compaction
AbstractPouchDB.prototype.compact =
  adapterFun('compact', function (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  var self = this;
  opts = opts || {};

  self._compactionQueue = self._compactionQueue || [];
  self._compactionQueue.push({opts: opts, callback: callback});
  if (self._compactionQueue.length === 1) {
    doNextCompaction(self);
  }
});
AbstractPouchDB.prototype._compact = function (opts, callback) {
  var self = this;
  var changesOpts = {
    return_docs: false,
    last_seq: opts.last_seq || 0
  };
  var promises = [];

  function onChange(row) {
    promises.push(self.compactDocument(row.id, 0));
  }
  function onComplete(resp) {
    var lastSeq = resp.last_seq;
    PouchPromise$1.all(promises).then(function () {
      return upsert(self, '_local/compaction', function deltaFunc(doc) {
        if (!doc.last_seq || doc.last_seq < lastSeq) {
          doc.last_seq = lastSeq;
          return doc;
        }
        return false; // somebody else got here first, don't update
      });
    }).then(function () {
      callback(null, {ok: true});
    }).catch(callback);
  }
  self.changes(changesOpts)
    .on('change', onChange)
    .on('complete', onComplete)
    .on('error', callback);
};

/* Begin api wrappers. Specific functionality to storage belongs in the
   _[method] */
AbstractPouchDB.prototype.get = adapterFun('get', function (id, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  if (typeof id !== 'string') {
    return cb(createError(INVALID_ID));
  }
  if (isLocalId(id) && typeof this._getLocal === 'function') {
    return this._getLocal(id, cb);
  }
  var leaves = [], self = this;

  function finishOpenRevs() {
    var result = [];
    var count = leaves.length;
    /* istanbul ignore if */
    if (!count) {
      return cb(null, result);
    }

    // order with open_revs is unspecified
    leaves.forEach(function (leaf) {
      self.get(id, {
        rev: leaf,
        revs: opts.revs,
        latest: opts.latest,
        attachments: opts.attachments
      }, function (err, doc) {
        if (!err) {
          // using latest=true can produce duplicates
          var existing;
          for (var i = 0, l = result.length; i < l; i++) {
            if (result[i].ok && result[i].ok._rev === doc._rev) {
              existing = true;
              break;
            }
          }
          if (!existing) {
            result.push({ok: doc});
          }
        } else {
          result.push({missing: leaf});
        }
        count--;
        if (!count) {
          cb(null, result);
        }
      });
    });
  }

  if (opts.open_revs) {
    if (opts.open_revs === "all") {
      this._getRevisionTree(id, function (err, rev_tree) {
        if (err) {
          return cb(err);
        }
        leaves = collectLeaves(rev_tree).map(function (leaf) {
          return leaf.rev;
        });
        finishOpenRevs();
      });
    } else {
      if (Array.isArray(opts.open_revs)) {
        leaves = opts.open_revs;
        for (var i = 0; i < leaves.length; i++) {
          var l = leaves[i];
          // looks like it's the only thing couchdb checks
          if (!(typeof (l) === "string" && /^\d+-/.test(l))) {
            return cb(createError(INVALID_REV));
          }
        }
        finishOpenRevs();
      } else {
        return cb(createError(UNKNOWN_ERROR, 'function_clause'));
      }
    }
    return; // open_revs does not like other options
  }

  return this._get(id, opts, function (err, result) {
    if (err) {
      err.docId = id;
      return cb(err);
    }

    var doc = result.doc;
    var metadata = result.metadata;
    var ctx = result.ctx;

    if (opts.conflicts) {
      var conflicts = collectConflicts(metadata);
      if (conflicts.length) {
        doc._conflicts = conflicts;
      }
    }

    if (isDeleted(metadata, doc._rev)) {
      doc._deleted = true;
    }

    if (opts.revs || opts.revs_info) {
      var splittedRev = doc._rev.split('-');
      var revNo       = parseInt(splittedRev[0], 10);
      var revHash     = splittedRev[1];

      var paths = rootToLeaf(metadata.rev_tree);
      var path = null;

      for (var i = 0; i < paths.length; i++) {
        var currentPath = paths[i];
        var hashIndex = currentPath.ids.map(function (x) { return x.id; })
          .indexOf(revHash);
        var hashFoundAtRevPos = hashIndex === (revNo - 1);

        if (hashFoundAtRevPos || (!path && hashIndex !== -1)) {
          path = currentPath;
        }
      }

      var indexOfRev = path.ids.map(function (x) { return x.id; })
        .indexOf(doc._rev.split('-')[1]) + 1;
      var howMany = path.ids.length - indexOfRev;
      path.ids.splice(indexOfRev, howMany);
      path.ids.reverse();

      if (opts.revs) {
        doc._revisions = {
          start: (path.pos + path.ids.length) - 1,
          ids: path.ids.map(function (rev$$1) {
            return rev$$1.id;
          })
        };
      }
      if (opts.revs_info) {
        var pos =  path.pos + path.ids.length;
        doc._revs_info = path.ids.map(function (rev$$1) {
          pos--;
          return {
            rev: pos + '-' + rev$$1.id,
            status: rev$$1.opts.status
          };
        });
      }
    }

    if (opts.attachments && doc._attachments) {
      var attachments = doc._attachments;
      var count = Object.keys(attachments).length;
      if (count === 0) {
        return cb(null, doc);
      }
      Object.keys(attachments).forEach(function (key) {
        this._getAttachment(doc._id, key, attachments[key], {
          // Previously the revision handling was done in adapter.js
          // getAttachment, however since idb-next doesnt we need to
          // pass the rev through
          rev: doc._rev,
          binary: opts.binary,
          ctx: ctx
        }, function (err, data) {
          var att = doc._attachments[key];
          att.data = data;
          delete att.stub;
          delete att.length;
          if (!--count) {
            cb(null, doc);
          }
        });
      }, self);
    } else {
      if (doc._attachments) {
        for (var key in doc._attachments) {
          /* istanbul ignore else */
          if (doc._attachments.hasOwnProperty(key)) {
            doc._attachments[key].stub = true;
          }
        }
      }
      cb(null, doc);
    }
  });
});

// TODO: I dont like this, it forces an extra read for every
// attachment read and enforces a confusing api between
// adapter.js and the adapter implementation
AbstractPouchDB.prototype.getAttachment =
  adapterFun('getAttachment', function (docId, attachmentId, opts, callback) {
  var self = this;
  if (opts instanceof Function) {
    callback = opts;
    opts = {};
  }
  this._get(docId, opts, function (err, res) {
    if (err) {
      return callback(err);
    }
    if (res.doc._attachments && res.doc._attachments[attachmentId]) {
      opts.ctx = res.ctx;
      opts.binary = true;
      self._getAttachment(docId, attachmentId,
                          res.doc._attachments[attachmentId], opts, callback);
    } else {
      return callback(createError(MISSING_DOC));
    }
  });
});

AbstractPouchDB.prototype.allDocs =
  adapterFun('allDocs', function (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  opts.skip = typeof opts.skip !== 'undefined' ? opts.skip : 0;
  if (opts.start_key) {
    opts.startkey = opts.start_key;
  }
  if (opts.end_key) {
    opts.endkey = opts.end_key;
  }
  if ('keys' in opts) {
    if (!Array.isArray(opts.keys)) {
      return callback(new TypeError('options.keys must be an array'));
    }
    var incompatibleOpt =
      ['startkey', 'endkey', 'key'].filter(function (incompatibleOpt) {
      return incompatibleOpt in opts;
    })[0];
    if (incompatibleOpt) {
      callback(createError(QUERY_PARSE_ERROR,
        'Query parameter `' + incompatibleOpt +
        '` is not compatible with multi-get'
      ));
      return;
    }
    if (!isRemote(this)) {
      return allDocsKeysQuery(this, opts, callback);
    }
  }

  return this._allDocs(opts, callback);
});

AbstractPouchDB.prototype.changes = function (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return new Changes$2(this, opts, callback);
};

AbstractPouchDB.prototype.close = adapterFun('close', function (callback) {
  this._closed = true;
  this.emit('closed');
  return this._close(callback);
});

AbstractPouchDB.prototype.info = adapterFun('info', function (callback) {
  var self = this;
  this._info(function (err, info) {
    if (err) {
      return callback(err);
    }
    // assume we know better than the adapter, unless it informs us
    info.db_name = info.db_name || self.name;
    info.auto_compaction = !!(self.auto_compaction && !isRemote(self));
    info.adapter = self.adapter;
    callback(null, info);
  });
});

AbstractPouchDB.prototype.id = adapterFun('id', function (callback) {
  return this._id(callback);
});

/* istanbul ignore next */
AbstractPouchDB.prototype.type = function () {
  return (typeof this._type === 'function') ? this._type() : this.adapter;
};

AbstractPouchDB.prototype.bulkDocs =
  adapterFun('bulkDocs', function (req, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  opts = opts || {};

  if (Array.isArray(req)) {
    req = {
      docs: req
    };
  }

  if (!req || !req.docs || !Array.isArray(req.docs)) {
    return callback(createError(MISSING_BULK_DOCS));
  }

  for (var i = 0; i < req.docs.length; ++i) {
    if (typeof req.docs[i] !== 'object' || Array.isArray(req.docs[i])) {
      return callback(createError(NOT_AN_OBJECT));
    }
  }

  var attachmentError;
  req.docs.forEach(function (doc) {
    if (doc._attachments) {
      Object.keys(doc._attachments).forEach(function (name) {
        attachmentError = attachmentError || attachmentNameError(name);
        if (!doc._attachments[name].content_type) {
          guardedConsole('warn', 'Attachment', name, 'on document', doc._id, 'is missing content_type');
        }
      });
    }
  });

  if (attachmentError) {
    return callback(createError(BAD_REQUEST, attachmentError));
  }

  if (!('new_edits' in opts)) {
    if ('new_edits' in req) {
      opts.new_edits = req.new_edits;
    } else {
      opts.new_edits = true;
    }
  }

  var adapter = this;
  if (!opts.new_edits && !isRemote(adapter)) {
    // ensure revisions of the same doc are sorted, so that
    // the local adapter processes them correctly (#2935)
    req.docs.sort(compareByIdThenRev);
  }

  cleanDocs(req.docs);

  // in the case of conflicts, we want to return the _ids to the user
  // however, the underlying adapter may destroy the docs array, so
  // create a copy here
  var ids = req.docs.map(function (doc) {
    return doc._id;
  });

  return this._bulkDocs(req, opts, function (err, res) {
    if (err) {
      return callback(err);
    }
    if (!opts.new_edits) {
      // this is what couch does when new_edits is false
      res = res.filter(function (x) {
        return x.error;
      });
    }
    // add ids for error/conflict responses (not required for CouchDB)
    if (!isRemote(adapter)) {
      for (var i = 0, l = res.length; i < l; i++) {
        res[i].id = res[i].id || ids[i];
      }
    }

    callback(null, res);
  });
});

AbstractPouchDB.prototype.registerDependentDatabase =
  adapterFun('registerDependentDatabase', function (dependentDb,
                                                          callback) {
  var depDB = new this.constructor(dependentDb, this.__opts);

  function diffFun(doc) {
    doc.dependentDbs = doc.dependentDbs || {};
    if (doc.dependentDbs[dependentDb]) {
      return false; // no update required
    }
    doc.dependentDbs[dependentDb] = true;
    return doc;
  }
  upsert(this, '_local/_pouch_dependentDbs', diffFun)
    .then(function () {
      callback(null, {db: depDB});
    }).catch(callback);
});

AbstractPouchDB.prototype.destroy =
  adapterFun('destroy', function (opts, callback) {

  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  var self = this;
  var usePrefix = 'use_prefix' in self ? self.use_prefix : true;

  function destroyDb() {
    // call destroy method of the particular adaptor
    self._destroy(opts, function (err, resp) {
      if (err) {
        return callback(err);
      }
      self._destroyed = true;
      self.emit('destroyed');
      callback(null, resp || { 'ok': true });
    });
  }

  if (isRemote(self)) {
    // no need to check for dependent DBs if it's a remote DB
    return destroyDb();
  }

  self.get('_local/_pouch_dependentDbs', function (err, localDoc) {
    if (err) {
      /* istanbul ignore if */
      if (err.status !== 404) {
        return callback(err);
      } else { // no dependencies
        return destroyDb();
      }
    }
    var dependentDbs = localDoc.dependentDbs;
    var PouchDB = self.constructor;
    var deletedMap = Object.keys(dependentDbs).map(function (name) {
      // use_prefix is only false in the browser
      /* istanbul ignore next */
      var trueName = usePrefix ?
        name.replace(new RegExp('^' + PouchDB.prefix), '') : name;
      return new PouchDB(trueName, self.__opts).destroy();
    });
    PouchPromise$1.all(deletedMap).then(destroyDb, callback);
  });
});

function TaskQueue$1() {
  this.isReady = false;
  this.failed = false;
  this.queue = [];
}

TaskQueue$1.prototype.execute = function () {
  var fun;
  if (this.failed) {
    while ((fun = this.queue.shift())) {
      fun(this.failed);
    }
  } else {
    while ((fun = this.queue.shift())) {
      fun();
    }
  }
};

TaskQueue$1.prototype.fail = function (err) {
  this.failed = err;
  this.execute();
};

TaskQueue$1.prototype.ready = function (db) {
  this.isReady = true;
  this.db = db;
  this.execute();
};

TaskQueue$1.prototype.addTask = function (fun) {
  this.queue.push(fun);
  if (this.failed) {
    this.execute();
  }
};

function parseAdapter(name, opts) {
  var match = name.match(/([a-z-]*):\/\/(.*)/);
  if (match) {
    // the http adapter expects the fully qualified name
    return {
      name: /https?/.test(match[1]) ? match[1] + '://' + match[2] : match[2],
      adapter: match[1]
    };
  }

  var adapters = PouchDB$5.adapters;
  var preferredAdapters = PouchDB$5.preferredAdapters;
  var prefix = PouchDB$5.prefix;
  var adapterName = opts.adapter;

  if (!adapterName) { // automatically determine adapter
    for (var i = 0; i < preferredAdapters.length; ++i) {
      adapterName = preferredAdapters[i];
      // check for browsers that have been upgraded from websql-only to websql+idb
      /* istanbul ignore if */
      if (adapterName === 'idb' && 'websql' in adapters &&
          hasLocalStorage() && localStorage['_pouch__websqldb_' + prefix + name]) {
        // log it, because this can be confusing during development
        guardedConsole('log', 'PouchDB is downgrading "' + name + '" to WebSQL to' +
          ' avoid data loss, because it was already opened with WebSQL.');
        continue; // keep using websql to avoid user data loss
      }
      break;
    }
  }

  var adapter = adapters[adapterName];

  // if adapter is invalid, then an error will be thrown later
  var usePrefix = (adapter && 'use_prefix' in adapter) ?
    adapter.use_prefix : true;

  return {
    name: usePrefix ? (prefix + name) : name,
    adapter: adapterName
  };
}

// OK, so here's the deal. Consider this code:
//     var db1 = new PouchDB('foo');
//     var db2 = new PouchDB('foo');
//     db1.destroy();
// ^ these two both need to emit 'destroyed' events,
// as well as the PouchDB constructor itself.
// So we have one db object (whichever one got destroy() called on it)
// responsible for emitting the initial event, which then gets emitted
// by the constructor, which then broadcasts it to any other dbs
// that may have been created with the same name.
function prepareForDestruction(self) {

  function onDestroyed(from_constructor) {
    self.removeListener('closed', onClosed);
    if (!from_constructor) {
      self.constructor.emit('destroyed', self.name);
    }
  }

  function onClosed() {
    self.removeListener('destroyed', onDestroyed);
    self.constructor.emit('unref', self);
  }

  self.once('destroyed', onDestroyed);
  self.once('closed', onClosed);
  self.constructor.emit('ref', self);
}

inherits(PouchDB$5, AbstractPouchDB);
function PouchDB$5(name, opts) {
  // In Node our test suite only tests this for PouchAlt unfortunately
  /* istanbul ignore if */
  if (!(this instanceof PouchDB$5)) {
    return new PouchDB$5(name, opts);
  }

  var self = this;
  opts = opts || {};

  if (name && typeof name === 'object') {
    opts = name;
    name = opts.name;
    delete opts.name;
  }

  this.__opts = opts = clone(opts);

  self.auto_compaction = opts.auto_compaction;
  self.prefix = PouchDB$5.prefix;

  if (typeof name !== 'string') {
    throw new Error('Missing/invalid DB name');
  }

  var prefixedName = (opts.prefix || '') + name;
  var backend = parseAdapter(prefixedName, opts);

  opts.name = backend.name;
  opts.adapter = opts.adapter || backend.adapter;

  self.name = name;
  self._adapter = opts.adapter;
  PouchDB$5.emit('debug', ['adapter', 'Picked adapter: ', opts.adapter]);

  if (!PouchDB$5.adapters[opts.adapter] ||
      !PouchDB$5.adapters[opts.adapter].valid()) {
    throw new Error('Invalid Adapter: ' + opts.adapter);
  }

  AbstractPouchDB.call(self);
  self.taskqueue = new TaskQueue$1();

  self.adapter = opts.adapter;

  PouchDB$5.adapters[opts.adapter].call(self, opts, function (err) {
    if (err) {
      return self.taskqueue.fail(err);
    }
    prepareForDestruction(self);

    self.emit('created', self);
    PouchDB$5.emit('created', self.name);
    self.taskqueue.ready(self);
  });

}

PouchDB$5.adapters = {};
PouchDB$5.preferredAdapters = [];

PouchDB$5.prefix = '_pouch_';

var eventEmitter = new events.EventEmitter();

function setUpEventEmitter(Pouch) {
  Object.keys(events.EventEmitter.prototype).forEach(function (key) {
    if (typeof events.EventEmitter.prototype[key] === 'function') {
      Pouch[key] = eventEmitter[key].bind(eventEmitter);
    }
  });

  // these are created in constructor.js, and allow us to notify each DB with
  // the same name that it was destroyed, via the constructor object
  var destructListeners = Pouch._destructionListeners = new ExportedMap();

  Pouch.on('ref', function onConstructorRef(db) {
    if (!destructListeners.has(db.name)) {
      destructListeners.set(db.name, []);
    }
    destructListeners.get(db.name).push(db);
  });

  Pouch.on('unref', function onConstructorUnref(db) {
    if (!destructListeners.has(db.name)) {
      return;
    }
    var dbList = destructListeners.get(db.name);
    var pos = dbList.indexOf(db);
    if (pos < 0) {
      /* istanbul ignore next */
      return;
    }
    dbList.splice(pos, 1);
    if (dbList.length > 1) {
      /* istanbul ignore next */
      destructListeners.set(db.name, dbList);
    } else {
      destructListeners.delete(db.name);
    }
  });

  Pouch.on('destroyed', function onConstructorDestroyed(name) {
    if (!destructListeners.has(name)) {
      return;
    }
    var dbList = destructListeners.get(name);
    destructListeners.delete(name);
    dbList.forEach(function (db) {
      db.emit('destroyed',true);
    });
  });
}

setUpEventEmitter(PouchDB$5);

PouchDB$5.adapter = function (id, obj, addToPreferredAdapters) {
  /* istanbul ignore else */
  if (obj.valid()) {
    PouchDB$5.adapters[id] = obj;
    if (addToPreferredAdapters) {
      PouchDB$5.preferredAdapters.push(id);
    }
  }
};

PouchDB$5.plugin = function (obj) {
  if (typeof obj === 'function') { // function style for plugins
    obj(PouchDB$5);
  } else if (typeof obj !== 'object' || Object.keys(obj).length === 0) {
    throw new Error('Invalid plugin: got "' + obj + '", expected an object or a function');
  } else {
    Object.keys(obj).forEach(function (id) { // object style for plugins
      PouchDB$5.prototype[id] = obj[id];
    });
  }
  if (this.__defaults) {
    PouchDB$5.__defaults = $inject_Object_assign({}, this.__defaults);
  }
  return PouchDB$5;
};

PouchDB$5.defaults = function (defaultOpts) {
  function PouchAlt(name, opts) {
    if (!(this instanceof PouchAlt)) {
      return new PouchAlt(name, opts);
    }

    opts = opts || {};

    if (name && typeof name === 'object') {
      opts = name;
      name = opts.name;
      delete opts.name;
    }

    opts = $inject_Object_assign({}, PouchAlt.__defaults, opts);
    PouchDB$5.call(this, name, opts);
  }

  inherits(PouchAlt, PouchDB$5);

  PouchAlt.preferredAdapters = PouchDB$5.preferredAdapters.slice();
  Object.keys(PouchDB$5).forEach(function (key) {
    if (!(key in PouchAlt)) {
      PouchAlt[key] = PouchDB$5[key];
    }
  });

  // make default options transitive
  // https://github.com/pouchdb/pouchdb/issues/5922
  PouchAlt.__defaults = $inject_Object_assign({}, this.__defaults, defaultOpts);

  return PouchAlt;
};

// managed automatically by set-version.js
var version = "6.3.4";

function debugPouch(PouchDB) {
  PouchDB.debug = debug;
  var logs = {};
  /* istanbul ignore next */
  PouchDB.on('debug', function (args) {
    // first argument is log identifier
    var logId = args[0];
    // rest should be passed verbatim to debug module
    var logArgs = args.slice(1);
    if (!logs[logId]) {
      logs[logId] = debug('pouchdb:' + logId);
    }
    logs[logId].apply(null, logArgs);
  });
}

// this would just be "return doc[field]", but fields
// can be "deep" due to dot notation
function getFieldFromDoc(doc, parsedField) {
  var value = doc;
  for (var i = 0, len = parsedField.length; i < len; i++) {
    var key = parsedField[i];
    value = value[key];
    if (!value) {
      break;
    }
  }
  return value;
}

function compare$1(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

// Converts a string in dot notation to an array of its components, with backslash escaping
function parseField(fieldName) {
  // fields may be deep (e.g. "foo.bar.baz"), so parse
  var fields = [];
  var current = '';
  for (var i = 0, len = fieldName.length; i < len; i++) {
    var ch = fieldName[i];
    if (ch === '.') {
      if (i > 0 && fieldName[i - 1] === '\\') { // escaped delimiter
        current = current.substring(0, current.length - 1) + '.';
      } else { // not escaped, so delimiter
        fields.push(current);
        current = '';
      }
    } else { // normal character
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

var combinationFields = ['$or', '$nor', '$not'];
function isCombinationalField(field) {
  return combinationFields.indexOf(field) > -1;
}

function getKey(obj) {
  return Object.keys(obj)[0];
}

function getValue(obj) {
  return obj[getKey(obj)];
}


// flatten an array of selectors joined by an $and operator
function mergeAndedSelectors(selectors) {

  // sort to ensure that e.g. if the user specified
  // $and: [{$gt: 'a'}, {$gt: 'b'}], then it's collapsed into
  // just {$gt: 'b'}
  var res = {};

  selectors.forEach(function (selector) {
    Object.keys(selector).forEach(function (field) {
      var matcher = selector[field];
      if (typeof matcher !== 'object') {
        matcher = {$eq: matcher};
      }

      if (isCombinationalField(field)) {
        if (matcher instanceof Array) {
          res[field] = matcher.map(function (m) {
            return mergeAndedSelectors([m]);
          });
        } else {
          res[field] = mergeAndedSelectors([matcher]);
        }
      } else {
        var fieldMatchers = res[field] = res[field] || {};
        Object.keys(matcher).forEach(function (operator) {
          var value = matcher[operator];

          if (operator === '$gt' || operator === '$gte') {
            return mergeGtGte(operator, value, fieldMatchers);
          } else if (operator === '$lt' || operator === '$lte') {
            return mergeLtLte(operator, value, fieldMatchers);
          } else if (operator === '$ne') {
            return mergeNe(value, fieldMatchers);
          } else if (operator === '$eq') {
            return mergeEq(value, fieldMatchers);
          }
          fieldMatchers[operator] = value;
        });
      }
    });
  });

  return res;
}



// collapse logically equivalent gt/gte values
function mergeGtGte(operator, value, fieldMatchers) {
  if (typeof fieldMatchers.$eq !== 'undefined') {
    return; // do nothing
  }
  if (typeof fieldMatchers.$gte !== 'undefined') {
    if (operator === '$gte') {
      if (value > fieldMatchers.$gte) { // more specificity
        fieldMatchers.$gte = value;
      }
    } else { // operator === '$gt'
      if (value >= fieldMatchers.$gte) { // more specificity
        delete fieldMatchers.$gte;
        fieldMatchers.$gt = value;
      }
    }
  } else if (typeof fieldMatchers.$gt !== 'undefined') {
    if (operator === '$gte') {
      if (value > fieldMatchers.$gt) { // more specificity
        delete fieldMatchers.$gt;
        fieldMatchers.$gte = value;
      }
    } else { // operator === '$gt'
      if (value > fieldMatchers.$gt) { // more specificity
        fieldMatchers.$gt = value;
      }
    }
  } else {
    fieldMatchers[operator] = value;
  }
}

// collapse logically equivalent lt/lte values
function mergeLtLte(operator, value, fieldMatchers) {
  if (typeof fieldMatchers.$eq !== 'undefined') {
    return; // do nothing
  }
  if (typeof fieldMatchers.$lte !== 'undefined') {
    if (operator === '$lte') {
      if (value < fieldMatchers.$lte) { // more specificity
        fieldMatchers.$lte = value;
      }
    } else { // operator === '$gt'
      if (value <= fieldMatchers.$lte) { // more specificity
        delete fieldMatchers.$lte;
        fieldMatchers.$lt = value;
      }
    }
  } else if (typeof fieldMatchers.$lt !== 'undefined') {
    if (operator === '$lte') {
      if (value < fieldMatchers.$lt) { // more specificity
        delete fieldMatchers.$lt;
        fieldMatchers.$lte = value;
      }
    } else { // operator === '$gt'
      if (value < fieldMatchers.$lt) { // more specificity
        fieldMatchers.$lt = value;
      }
    }
  } else {
    fieldMatchers[operator] = value;
  }
}

// combine $ne values into one array
function mergeNe(value, fieldMatchers) {
  if ('$ne' in fieldMatchers) {
    // there are many things this could "not" be
    fieldMatchers.$ne.push(value);
  } else { // doesn't exist yet
    fieldMatchers.$ne = [value];
  }
}

// add $eq into the mix
function mergeEq(value, fieldMatchers) {
  // these all have less specificity than the $eq
  // TODO: check for user errors here
  delete fieldMatchers.$gt;
  delete fieldMatchers.$gte;
  delete fieldMatchers.$lt;
  delete fieldMatchers.$lte;
  delete fieldMatchers.$ne;
  fieldMatchers.$eq = value;
}


//
// normalize the selector
//
function massageSelector(input) {
  var result = clone(input);
  var wasAnded = false;
  if ('$and' in result) {
    result = mergeAndedSelectors(result['$and']);
    wasAnded = true;
  }

  ['$or', '$nor'].forEach(function (orOrNor) {
    if (orOrNor in result) {
      // message each individual selector
      // e.g. {foo: 'bar'} becomes {foo: {$eq: 'bar'}}
      result[orOrNor].forEach(function (subSelector) {
        var fields = Object.keys(subSelector);
        for (var i = 0; i < fields.length; i++) {
          var field = fields[i];
          var matcher = subSelector[field];
          if (typeof matcher !== 'object' || matcher === null) {
            subSelector[field] = {$eq: matcher};
          }
        }
      });
    }
  });

  if ('$not' in result) {
    //This feels a little like forcing, but it will work for now,
    //I would like to come back to this and make the merging of selectors a little more generic
    result['$not'] = mergeAndedSelectors([result['$not']]);
  }

  var fields = Object.keys(result);

  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    var matcher = result[field];

    if (typeof matcher !== 'object' || matcher === null) {
      matcher = {$eq: matcher};
    } else if ('$ne' in matcher && !wasAnded) {
      // I put these in an array, since there may be more than one
      // but in the "mergeAnded" operation, I already take care of that
      matcher.$ne = [matcher.$ne];
    }
    result[field] = matcher;
  }

  return result;
}

function pad(str, padWith, upToLength) {
  var padding = '';
  var targetLength = upToLength - str.length;
  /* istanbul ignore next */
  while (padding.length < targetLength) {
    padding += padWith;
  }
  return padding;
}

function padLeft(str, padWith, upToLength) {
  var padding = pad(str, padWith, upToLength);
  return padding + str;
}

var MIN_MAGNITUDE = -324; // verified by -Number.MIN_VALUE
var MAGNITUDE_DIGITS = 3; // ditto
var SEP = ''; // set to '_' for easier debugging 

function collate(a, b) {

  if (a === b) {
    return 0;
  }

  a = normalizeKey(a);
  b = normalizeKey(b);

  var ai = collationIndex(a);
  var bi = collationIndex(b);
  if ((ai - bi) !== 0) {
    return ai - bi;
  }
  switch (typeof a) {
    case 'number':
      return a - b;
    case 'boolean':
      return a < b ? -1 : 1;
    case 'string':
      return stringCollate(a, b);
  }
  return Array.isArray(a) ? arrayCollate(a, b) : objectCollate(a, b);
}

// couch considers null/NaN/Infinity/-Infinity === undefined,
// for the purposes of mapreduce indexes. also, dates get stringified.
function normalizeKey(key) {
  switch (typeof key) {
    case 'undefined':
      return null;
    case 'number':
      if (key === Infinity || key === -Infinity || isNaN(key)) {
        return null;
      }
      return key;
    case 'object':
      var origKey = key;
      if (Array.isArray(key)) {
        var len = key.length;
        key = new Array(len);
        for (var i = 0; i < len; i++) {
          key[i] = normalizeKey(origKey[i]);
        }
      /* istanbul ignore next */
      } else if (key instanceof Date) {
        return key.toJSON();
      } else if (key !== null) { // generic object
        key = {};
        for (var k in origKey) {
          if (origKey.hasOwnProperty(k)) {
            var val = origKey[k];
            if (typeof val !== 'undefined') {
              key[k] = normalizeKey(val);
            }
          }
        }
      }
  }
  return key;
}

function indexify(key) {
  if (key !== null) {
    switch (typeof key) {
      case 'boolean':
        return key ? 1 : 0;
      case 'number':
        return numToIndexableString(key);
      case 'string':
        // We've to be sure that key does not contain \u0000
        // Do order-preserving replacements:
        // 0 -> 1, 1
        // 1 -> 1, 2
        // 2 -> 2, 2
        return key
          .replace(/\u0002/g, '\u0002\u0002')
          .replace(/\u0001/g, '\u0001\u0002')
          .replace(/\u0000/g, '\u0001\u0001');
      case 'object':
        var isArray = Array.isArray(key);
        var arr = isArray ? key : Object.keys(key);
        var i = -1;
        var len = arr.length;
        var result = '';
        if (isArray) {
          while (++i < len) {
            result += toIndexableString(arr[i]);
          }
        } else {
          while (++i < len) {
            var objKey = arr[i];
            result += toIndexableString(objKey) +
                toIndexableString(key[objKey]);
          }
        }
        return result;
    }
  }
  return '';
}

// convert the given key to a string that would be appropriate
// for lexical sorting, e.g. within a database, where the
// sorting is the same given by the collate() function.
function toIndexableString(key) {
  var zero = '\u0000';
  key = normalizeKey(key);
  return collationIndex(key) + SEP + indexify(key) + zero;
}

function parseNumber(str, i) {
  var originalIdx = i;
  var num;
  var zero = str[i] === '1';
  if (zero) {
    num = 0;
    i++;
  } else {
    var neg = str[i] === '0';
    i++;
    var numAsString = '';
    var magAsString = str.substring(i, i + MAGNITUDE_DIGITS);
    var magnitude = parseInt(magAsString, 10) + MIN_MAGNITUDE;
    /* istanbul ignore next */
    if (neg) {
      magnitude = -magnitude;
    }
    i += MAGNITUDE_DIGITS;
    while (true) {
      var ch = str[i];
      if (ch === '\u0000') {
        break;
      } else {
        numAsString += ch;
      }
      i++;
    }
    numAsString = numAsString.split('.');
    if (numAsString.length === 1) {
      num = parseInt(numAsString, 10);
    } else {
      /* istanbul ignore next */
      num = parseFloat(numAsString[0] + '.' + numAsString[1]);
    }
    /* istanbul ignore next */
    if (neg) {
      num = num - 10;
    }
    /* istanbul ignore next */
    if (magnitude !== 0) {
      // parseFloat is more reliable than pow due to rounding errors
      // e.g. Number.MAX_VALUE would return Infinity if we did
      // num * Math.pow(10, magnitude);
      num = parseFloat(num + 'e' + magnitude);
    }
  }
  return {num: num, length : i - originalIdx};
}

// move up the stack while parsing
// this function moved outside of parseIndexableString for performance
function pop(stack, metaStack) {
  var obj = stack.pop();

  if (metaStack.length) {
    var lastMetaElement = metaStack[metaStack.length - 1];
    if (obj === lastMetaElement.element) {
      // popping a meta-element, e.g. an object whose value is another object
      metaStack.pop();
      lastMetaElement = metaStack[metaStack.length - 1];
    }
    var element = lastMetaElement.element;
    var lastElementIndex = lastMetaElement.index;
    if (Array.isArray(element)) {
      element.push(obj);
    } else if (lastElementIndex === stack.length - 2) { // obj with key+value
      var key = stack.pop();
      element[key] = obj;
    } else {
      stack.push(obj); // obj with key only
    }
  }
}

function parseIndexableString(str) {
  var stack = [];
  var metaStack = []; // stack for arrays and objects
  var i = 0;

  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  while (true) {
    var collationIndex = str[i++];
    if (collationIndex === '\u0000') {
      if (stack.length === 1) {
        return stack.pop();
      } else {
        pop(stack, metaStack);
        continue;
      }
    }
    switch (collationIndex) {
      case '1':
        stack.push(null);
        break;
      case '2':
        stack.push(str[i] === '1');
        i++;
        break;
      case '3':
        var parsedNum = parseNumber(str, i);
        stack.push(parsedNum.num);
        i += parsedNum.length;
        break;
      case '4':
        var parsedStr = '';
        /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
        while (true) {
          var ch = str[i];
          if (ch === '\u0000') {
            break;
          }
          parsedStr += ch;
          i++;
        }
        // perform the reverse of the order-preserving replacement
        // algorithm (see above)
        parsedStr = parsedStr.replace(/\u0001\u0001/g, '\u0000')
          .replace(/\u0001\u0002/g, '\u0001')
          .replace(/\u0002\u0002/g, '\u0002');
        stack.push(parsedStr);
        break;
      case '5':
        var arrayElement = { element: [], index: stack.length };
        stack.push(arrayElement.element);
        metaStack.push(arrayElement);
        break;
      case '6':
        var objElement = { element: {}, index: stack.length };
        stack.push(objElement.element);
        metaStack.push(objElement);
        break;
      /* istanbul ignore next */
      default:
        throw new Error(
          'bad collationIndex or unexpectedly reached end of input: ' +
            collationIndex);
    }
  }
}

function arrayCollate(a, b) {
  var len = Math.min(a.length, b.length);
  for (var i = 0; i < len; i++) {
    var sort = collate(a[i], b[i]);
    if (sort !== 0) {
      return sort;
    }
  }
  return (a.length === b.length) ? 0 :
    (a.length > b.length) ? 1 : -1;
}
function stringCollate(a, b) {
  // See: https://github.com/daleharvey/pouchdb/issues/40
  // This is incompatible with the CouchDB implementation, but its the
  // best we can do for now
  return (a === b) ? 0 : ((a > b) ? 1 : -1);
}
function objectCollate(a, b) {
  var ak = Object.keys(a), bk = Object.keys(b);
  var len = Math.min(ak.length, bk.length);
  for (var i = 0; i < len; i++) {
    // First sort the keys
    var sort = collate(ak[i], bk[i]);
    if (sort !== 0) {
      return sort;
    }
    // if the keys are equal sort the values
    sort = collate(a[ak[i]], b[bk[i]]);
    if (sort !== 0) {
      return sort;
    }

  }
  return (ak.length === bk.length) ? 0 :
    (ak.length > bk.length) ? 1 : -1;
}
// The collation is defined by erlangs ordered terms
// the atoms null, true, false come first, then numbers, strings,
// arrays, then objects
// null/undefined/NaN/Infinity/-Infinity are all considered null
function collationIndex(x) {
  var id = ['boolean', 'number', 'string', 'object'];
  var idx = id.indexOf(typeof x);
  //false if -1 otherwise true, but fast!!!!1
  if (~idx) {
    if (x === null) {
      return 1;
    }
    if (Array.isArray(x)) {
      return 5;
    }
    return idx < 3 ? (idx + 2) : (idx + 3);
  }
  /* istanbul ignore next */
  if (Array.isArray(x)) {
    return 5;
  }
}

// conversion:
// x yyy zz...zz
// x = 0 for negative, 1 for 0, 2 for positive
// y = exponent (for negative numbers negated) moved so that it's >= 0
// z = mantisse
function numToIndexableString(num) {

  if (num === 0) {
    return '1';
  }

  // convert number to exponential format for easier and
  // more succinct string sorting
  var expFormat = num.toExponential().split(/e\+?/);
  var magnitude = parseInt(expFormat[1], 10);

  var neg = num < 0;

  var result = neg ? '0' : '2';

  // first sort by magnitude
  // it's easier if all magnitudes are positive
  var magForComparison = ((neg ? -magnitude : magnitude) - MIN_MAGNITUDE);
  var magString = padLeft((magForComparison).toString(), '0', MAGNITUDE_DIGITS);

  result += SEP + magString;

  // then sort by the factor
  var factor = Math.abs(parseFloat(expFormat[0])); // [1..10)
  /* istanbul ignore next */
  if (neg) { // for negative reverse ordering
    factor = 10 - factor;
  }

  var factorStr = factor.toFixed(20);

  // strip zeros from the end
  factorStr = factorStr.replace(/\.?0+$/, '');

  result += SEP + factorStr;

  return result;
}

// create a comparator based on the sort object
function createFieldSorter(sort) {

  function getFieldValuesAsArray(doc) {
    return sort.map(function (sorting) {
      var fieldName = getKey(sorting);
      var parsedField = parseField(fieldName);
      var docFieldValue = getFieldFromDoc(doc, parsedField);
      return docFieldValue;
    });
  }

  return function (aRow, bRow) {
    var aFieldValues = getFieldValuesAsArray(aRow.doc);
    var bFieldValues = getFieldValuesAsArray(bRow.doc);
    var collation = collate(aFieldValues, bFieldValues);
    if (collation !== 0) {
      return collation;
    }
    // this is what mango seems to do
    return compare$1(aRow.doc._id, bRow.doc._id);
  };
}

function filterInMemoryFields(rows, requestDef, inMemoryFields) {
  rows = rows.filter(function (row) {
    return rowFilter(row.doc, requestDef.selector, inMemoryFields);
  });

  if (requestDef.sort) {
    // in-memory sort
    var fieldSorter = createFieldSorter(requestDef.sort);
    rows = rows.sort(fieldSorter);
    if (typeof requestDef.sort[0] !== 'string' &&
        getValue(requestDef.sort[0]) === 'desc') {
      rows = rows.reverse();
    }
  }

  if ('limit' in requestDef || 'skip' in requestDef) {
    // have to do the limit in-memory
    var skip = requestDef.skip || 0;
    var limit = ('limit' in requestDef ? requestDef.limit : rows.length) + skip;
    rows = rows.slice(skip, limit);
  }
  return rows;
}

function rowFilter(doc, selector, inMemoryFields) {
  return inMemoryFields.every(function (field) {
    var matcher = selector[field];
    var parsedField = parseField(field);
    var docFieldValue = getFieldFromDoc(doc, parsedField);
    if (isCombinationalField(field)) {
      return matchCominationalSelector(field, matcher, doc);
    }

    return matchSelector(matcher, doc, parsedField, docFieldValue);
  });
}

function matchSelector(matcher, doc, parsedField, docFieldValue) {
  if (!matcher) {
    // no filtering necessary; this field is just needed for sorting
    return true;
  }

  return Object.keys(matcher).every(function (userOperator) {
    var userValue = matcher[userOperator];
    return match(userOperator, doc, userValue, parsedField, docFieldValue);
  });
}

function matchCominationalSelector(field, matcher, doc) {

  if (field === '$or') {
    return matcher.some(function (orMatchers) {
      return rowFilter(doc, orMatchers, Object.keys(orMatchers));
    });
  }

  if (field === '$not') {
    return !rowFilter(doc, matcher, Object.keys(matcher));
  }

  //`$nor`
  return !matcher.find(function (orMatchers) {
    return rowFilter(doc, orMatchers, Object.keys(orMatchers));
  });

}

function match(userOperator, doc, userValue, parsedField, docFieldValue) {
  if (!matchers[userOperator]) {
    throw new Error('unknown operator "' + userOperator +
      '" - should be one of $eq, $lte, $lt, $gt, $gte, $exists, $ne, $in, ' +
      '$nin, $size, $mod, $regex, $elemMatch, $type, $allMatch or $all');
  }
  return matchers[userOperator](doc, userValue, parsedField, docFieldValue);
}

function fieldExists(docFieldValue) {
  return typeof docFieldValue !== 'undefined' && docFieldValue !== null;
}

function fieldIsNotUndefined(docFieldValue) {
  return typeof docFieldValue !== 'undefined';
}

function modField(docFieldValue, userValue) {
  var divisor = userValue[0];
  var mod = userValue[1];
  if (divisor === 0) {
    throw new Error('Bad divisor, cannot divide by zero');
  }

  if (parseInt(divisor, 10) !== divisor ) {
    throw new Error('Divisor is not an integer');
  }

  if (parseInt(mod, 10) !== mod ) {
    throw new Error('Modulus is not an integer');
  }

  if (parseInt(docFieldValue, 10) !== docFieldValue) {
    return false;
  }

  return docFieldValue % divisor === mod;
}

function arrayContainsValue(docFieldValue, userValue) {
  return userValue.some(function (val) {
    if (docFieldValue instanceof Array) {
      return docFieldValue.indexOf(val) > -1;
    }

    return docFieldValue === val;
  });
}

function arrayContainsAllValues(docFieldValue, userValue) {
  return userValue.every(function (val) {
    return docFieldValue.indexOf(val) > -1;
  });
}

function arraySize(docFieldValue, userValue) {
  return docFieldValue.length === userValue;
}

function regexMatch(docFieldValue, userValue) {
  var re = new RegExp(userValue);

  return re.test(docFieldValue);
}

function typeMatch(docFieldValue, userValue) {

  switch (userValue) {
    case 'null':
      return docFieldValue === null;
    case 'boolean':
      return typeof (docFieldValue) === 'boolean';
    case 'number':
      return typeof (docFieldValue) === 'number';
    case 'string':
      return typeof (docFieldValue) === 'string';
    case 'array':
      return docFieldValue instanceof Array;
    case 'object':
      return ({}).toString.call(docFieldValue) === '[object Object]';
  }

  throw new Error(userValue + ' not supported as a type.' +
                  'Please use one of object, string, array, number, boolean or null.');

}

var matchers = {

  '$elemMatch': function (doc, userValue, parsedField, docFieldValue) {
    if (!Array.isArray(docFieldValue)) {
      return false;
    }

    if (docFieldValue.length === 0) {
      return false;
    }

    if (typeof docFieldValue[0] === 'object') {
      return docFieldValue.some(function (val) {
        return rowFilter(val, userValue, Object.keys(userValue));
      });
    }

    return docFieldValue.some(function (val) {
      return matchSelector(userValue, doc, parsedField, val);
    });
  },

  '$allMatch': function (doc, userValue, parsedField, docFieldValue) {
    if (!Array.isArray(docFieldValue)) {
      return false;
    }

    /* istanbul ignore next */
    if (docFieldValue.length === 0) {
      return false;
    }

    if (typeof docFieldValue[0] === 'object') {
      return docFieldValue.every(function (val) {
        return rowFilter(val, userValue, Object.keys(userValue));
      });
    }

    return docFieldValue.every(function (val) {
      return matchSelector(userValue, doc, parsedField, val);
    });
  },

  '$eq': function (doc, userValue, parsedField, docFieldValue) {
    return fieldIsNotUndefined(docFieldValue) && collate(docFieldValue, userValue) === 0;
  },

  '$gte': function (doc, userValue, parsedField, docFieldValue) {
    return fieldIsNotUndefined(docFieldValue) && collate(docFieldValue, userValue) >= 0;
  },

  '$gt': function (doc, userValue, parsedField, docFieldValue) {
    return fieldIsNotUndefined(docFieldValue) && collate(docFieldValue, userValue) > 0;
  },

  '$lte': function (doc, userValue, parsedField, docFieldValue) {
    return fieldIsNotUndefined(docFieldValue) && collate(docFieldValue, userValue) <= 0;
  },

  '$lt': function (doc, userValue, parsedField, docFieldValue) {
    return fieldIsNotUndefined(docFieldValue) && collate(docFieldValue, userValue) < 0;
  },

  '$exists': function (doc, userValue, parsedField, docFieldValue) {
    //a field that is null is still considered to exist
    if (userValue) {
      return fieldIsNotUndefined(docFieldValue);
    }

    return !fieldIsNotUndefined(docFieldValue);
  },

  '$mod': function (doc, userValue, parsedField, docFieldValue) {
    return fieldExists(docFieldValue) && modField(docFieldValue, userValue);
  },

  '$ne': function (doc, userValue, parsedField, docFieldValue) {
    return userValue.every(function (neValue) {
      return collate(docFieldValue, neValue) !== 0;
    });
  },
  '$in': function (doc, userValue, parsedField, docFieldValue) {
    return fieldExists(docFieldValue) && arrayContainsValue(docFieldValue, userValue);
  },

  '$nin': function (doc, userValue, parsedField, docFieldValue) {
    return fieldExists(docFieldValue) && !arrayContainsValue(docFieldValue, userValue);
  },

  '$size': function (doc, userValue, parsedField, docFieldValue) {
    return fieldExists(docFieldValue) && arraySize(docFieldValue, userValue);
  },

  '$all': function (doc, userValue, parsedField, docFieldValue) {
    return Array.isArray(docFieldValue) && arrayContainsAllValues(docFieldValue, userValue);
  },

  '$regex': function (doc, userValue, parsedField, docFieldValue) {
    return fieldExists(docFieldValue) && regexMatch(docFieldValue, userValue);
  },

  '$type': function (doc, userValue, parsedField, docFieldValue) {
    return typeMatch(docFieldValue, userValue);
  }
};

// return true if the given doc matches the supplied selector
function matchesSelector(doc, selector) {
  /* istanbul ignore if */
  if (typeof selector !== 'object') {
    // match the CouchDB error message
    throw new Error('Selector error: expected a JSON object');
  }

  selector = massageSelector(selector);
  var row = {
    'doc': doc
  };

  var rowsMatched = filterInMemoryFields([row], { 'selector': selector }, Object.keys(selector));
  return rowsMatched && rowsMatched.length === 1;
}

function evalFilter(input) {
  return scopeEval('"use strict";\nreturn ' + input + ';', {});
}

function evalView(input) {
  var code = [
    'return function(doc) {',
    '  "use strict";',
    '  var emitted = false;',
    '  var emit = function (a, b) {',
    '    emitted = true;',
    '  };',
    '  var view = ' + input + ';',
    '  view(doc);',
    '  if (emitted) {',
    '    return true;',
    '  }',
    '};'
  ].join('\n');

  return scopeEval(code, {});
}

function validate(opts, callback) {
  if (opts.selector) {
    if (opts.filter && opts.filter !== '_selector') {
      var filterName = typeof opts.filter === 'string' ?
        opts.filter : 'function';
      return callback(new Error('selector invalid for filter "' + filterName + '"'));
    }
  }
  callback();
}

function normalize(opts) {
  if (opts.view && !opts.filter) {
    opts.filter = '_view';
  }

  if (opts.selector && !opts.filter) {
    opts.filter = '_selector';
  }

  if (opts.filter && typeof opts.filter === 'string') {
    if (opts.filter === '_view') {
      opts.view = normalizeDesignDocFunctionName(opts.view);
    } else {
      opts.filter = normalizeDesignDocFunctionName(opts.filter);
    }
  }
}

function shouldFilter(changesHandler, opts) {
  return opts.filter && typeof opts.filter === 'string' &&
    !opts.doc_ids && !isRemote(changesHandler.db);
}

function filter(changesHandler, opts) {
  var callback = opts.complete;
  if (opts.filter === '_view') {
    if (!opts.view || typeof opts.view !== 'string') {
      var err = createError(BAD_REQUEST,
        '`view` filter parameter not found or invalid.');
      return callback(err);
    }
    // fetch a view from a design doc, make it behave like a filter
    var viewName = parseDesignDocFunctionName(opts.view);
    changesHandler.db.get('_design/' + viewName[0], function (err, ddoc) {
      /* istanbul ignore if */
      if (changesHandler.isCancelled) {
        return callback(null, {status: 'cancelled'});
      }
      /* istanbul ignore next */
      if (err) {
        return callback(generateErrorFromResponse(err));
      }
      var mapFun = ddoc && ddoc.views && ddoc.views[viewName[1]] &&
        ddoc.views[viewName[1]].map;
      if (!mapFun) {
        return callback(createError(MISSING_DOC,
          (ddoc.views ? 'missing json key: ' + viewName[1] :
            'missing json key: views')));
      }
      opts.filter = evalView(mapFun);
      changesHandler.doChanges(opts);
    });
  } else if (opts.selector) {
    opts.filter = function (doc) {
      return matchesSelector(doc, opts.selector);
    };
    changesHandler.doChanges(opts);
  } else {
    // fetch a filter from a design doc
    var filterName = parseDesignDocFunctionName(opts.filter);
    changesHandler.db.get('_design/' + filterName[0], function (err, ddoc) {
      /* istanbul ignore if */
      if (changesHandler.isCancelled) {
        return callback(null, {status: 'cancelled'});
      }
      /* istanbul ignore next */
      if (err) {
        return callback(generateErrorFromResponse(err));
      }
      var filterFun = ddoc && ddoc.filters && ddoc.filters[filterName[1]];
      if (!filterFun) {
        return callback(createError(MISSING_DOC,
          ((ddoc && ddoc.filters) ? 'missing json key: ' + filterName[1]
            : 'missing json key: filters')));
      }
      opts.filter = evalFilter(filterFun);
      changesHandler.doChanges(opts);
    });
  }
}

function applyChangesFilterPlugin(PouchDB) {
  PouchDB._changesFilterPlugin = {
    validate: validate,
    normalize: normalize,
    shouldFilter: shouldFilter,
    filter: filter
  };
}

// TODO: remove from pouchdb-core (breaking)
PouchDB$5.plugin(debugPouch);

// TODO: remove from pouchdb-core (breaking)
PouchDB$5.plugin(applyChangesFilterPlugin);

PouchDB$5.version = version;

function toObject(array) {
  return array.reduce(function (obj, item) {
    obj[item] = true;
    return obj;
  }, {});
}
// List of top level reserved words for doc
var reservedWords = toObject([
  '_id',
  '_rev',
  '_attachments',
  '_deleted',
  '_revisions',
  '_revs_info',
  '_conflicts',
  '_deleted_conflicts',
  '_local_seq',
  '_rev_tree',
  //replication documents
  '_replication_id',
  '_replication_state',
  '_replication_state_time',
  '_replication_state_reason',
  '_replication_stats',
  // Specific to Couchbase Sync Gateway
  '_removed'
]);

// List of reserved words that should end up the document
var dataWords = toObject([
  '_attachments',
  //replication documents
  '_replication_id',
  '_replication_state',
  '_replication_state_time',
  '_replication_state_reason',
  '_replication_stats'
]);

function parseRevisionInfo(rev$$1) {
  if (!/^\d+-./.test(rev$$1)) {
    return createError(INVALID_REV);
  }
  var idx = rev$$1.indexOf('-');
  var left = rev$$1.substring(0, idx);
  var right = rev$$1.substring(idx + 1);
  return {
    prefix: parseInt(left, 10),
    id: right
  };
}

function makeRevTreeFromRevisions(revisions, opts) {
  var pos = revisions.start - revisions.ids.length + 1;

  var revisionIds = revisions.ids;
  var ids = [revisionIds[0], opts, []];

  for (var i = 1, len = revisionIds.length; i < len; i++) {
    ids = [revisionIds[i], {status: 'missing'}, [ids]];
  }

  return [{
    pos: pos,
    ids: ids
  }];
}

// Preprocess documents, parse their revisions, assign an id and a
// revision for new writes that are missing them, etc
function parseDoc(doc, newEdits) {

  var nRevNum;
  var newRevId;
  var revInfo;
  var opts = {status: 'available'};
  if (doc._deleted) {
    opts.deleted = true;
  }

  if (newEdits) {
    if (!doc._id) {
      doc._id = uuid();
    }
    newRevId = rev();
    if (doc._rev) {
      revInfo = parseRevisionInfo(doc._rev);
      if (revInfo.error) {
        return revInfo;
      }
      doc._rev_tree = [{
        pos: revInfo.prefix,
        ids: [revInfo.id, {status: 'missing'}, [[newRevId, opts, []]]]
      }];
      nRevNum = revInfo.prefix + 1;
    } else {
      doc._rev_tree = [{
        pos: 1,
        ids : [newRevId, opts, []]
      }];
      nRevNum = 1;
    }
  } else {
    if (doc._revisions) {
      doc._rev_tree = makeRevTreeFromRevisions(doc._revisions, opts);
      nRevNum = doc._revisions.start;
      newRevId = doc._revisions.ids[0];
    }
    if (!doc._rev_tree) {
      revInfo = parseRevisionInfo(doc._rev);
      if (revInfo.error) {
        return revInfo;
      }
      nRevNum = revInfo.prefix;
      newRevId = revInfo.id;
      doc._rev_tree = [{
        pos: nRevNum,
        ids: [newRevId, opts, []]
      }];
    }
  }

  invalidIdError(doc._id);

  doc._rev = nRevNum + '-' + newRevId;

  var result = {metadata : {}, data : {}};
  for (var key in doc) {
    /* istanbul ignore else */
    if (Object.prototype.hasOwnProperty.call(doc, key)) {
      var specialKey = key[0] === '_';
      if (specialKey && !reservedWords[key]) {
        var error = createError(DOC_VALIDATION, key);
        error.message = DOC_VALIDATION.message + ': ' + key;
        throw error;
      } else if (specialKey && !dataWords[key]) {
        result.metadata[key.slice(1)] = doc[key];
      } else {
        result.data[key] = doc[key];
      }
    }
  }
  return result;
}

var thisAtob = function (str) {
  return atob(str);
};

var thisBtoa = function (str) {
  return btoa(str);
};

// Abstracts constructing a Blob object, so it also works in older
// browsers that don't support the native Blob constructor (e.g.
// old QtWebKit versions, Android < 4.4).
function createBlob(parts, properties) {
  /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
  parts = parts || [];
  properties = properties || {};
  try {
    return new Blob(parts, properties);
  } catch (e) {
    if (e.name !== "TypeError") {
      throw e;
    }
    var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder :
                  typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder :
                  typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder :
                  WebKitBlobBuilder;
    var builder = new Builder();
    for (var i = 0; i < parts.length; i += 1) {
      builder.append(parts[i]);
    }
    return builder.getBlob(properties.type);
  }
}

// From http://stackoverflow.com/questions/14967647/ (continues on next line)
// encode-decode-image-with-base64-breaks-image (2013-04-21)
function binaryStringToArrayBuffer(bin) {
  var length = bin.length;
  var buf = new ArrayBuffer(length);
  var arr = new Uint8Array(buf);
  for (var i = 0; i < length; i++) {
    arr[i] = bin.charCodeAt(i);
  }
  return buf;
}

function binStringToBluffer(binString, type) {
  return createBlob([binaryStringToArrayBuffer(binString)], {type: type});
}

function b64ToBluffer(b64, type) {
  return binStringToBluffer(thisAtob(b64), type);
}

//Can't find original post, but this is close
//http://stackoverflow.com/questions/6965107/ (continues on next line)
//converting-between-strings-and-arraybuffers
function arrayBufferToBinaryString(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var length = bytes.byteLength;
  for (var i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

// shim for browsers that don't support it
function readAsBinaryString(blob, callback) {
  if (typeof FileReader === 'undefined') {
    // fix for Firefox in a web worker
    // https://bugzilla.mozilla.org/show_bug.cgi?id=901097
    return callback(arrayBufferToBinaryString(
      new FileReaderSync().readAsArrayBuffer(blob)));
  }

  var reader = new FileReader();
  var hasBinaryString = typeof reader.readAsBinaryString === 'function';
  reader.onloadend = function (e) {
    var result = e.target.result || '';
    if (hasBinaryString) {
      return callback(result);
    }
    callback(arrayBufferToBinaryString(result));
  };
  if (hasBinaryString) {
    reader.readAsBinaryString(blob);
  } else {
    reader.readAsArrayBuffer(blob);
  }
}

function blobToBinaryString(blobOrBuffer, callback) {
  readAsBinaryString(blobOrBuffer, function (bin) {
    callback(bin);
  });
}

function blobToBase64(blobOrBuffer, callback) {
  blobToBinaryString(blobOrBuffer, function (base64) {
    callback(thisBtoa(base64));
  });
}

// simplified API. universal browser support is assumed
function readAsArrayBuffer(blob, callback) {
  if (typeof FileReader === 'undefined') {
    // fix for Firefox in a web worker:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=901097
    return callback(new FileReaderSync().readAsArrayBuffer(blob));
  }

  var reader = new FileReader();
  reader.onloadend = function (e) {
    var result = e.target.result || new ArrayBuffer(0);
    callback(result);
  };
  reader.readAsArrayBuffer(blob);
}

// this is not used in the browser

var setImmediateShim = global.setImmediate || global.setTimeout;
var MD5_CHUNK_SIZE = 32768;

function rawToBase64(raw) {
  return thisBtoa(raw);
}

function sliceBlob(blob, start, end) {
  if (blob.webkitSlice) {
    return blob.webkitSlice(start, end);
  }
  return blob.slice(start, end);
}

function appendBlob(buffer, blob, start, end, callback) {
  if (start > 0 || end < blob.size) {
    // only slice blob if we really need to
    blob = sliceBlob(blob, start, end);
  }
  readAsArrayBuffer(blob, function (arrayBuffer) {
    buffer.append(arrayBuffer);
    callback();
  });
}

function appendString(buffer, string, start, end, callback) {
  if (start > 0 || end < string.length) {
    // only create a substring if we really need to
    string = string.substring(start, end);
  }
  buffer.appendBinary(string);
  callback();
}

function binaryMd5(data, callback) {
  var inputIsString = typeof data === 'string';
  var len = inputIsString ? data.length : data.size;
  var chunkSize = Math.min(MD5_CHUNK_SIZE, len);
  var chunks = Math.ceil(len / chunkSize);
  var currentChunk = 0;
  var buffer = inputIsString ? new Md5() : new Md5.ArrayBuffer();

  var append = inputIsString ? appendString : appendBlob;

  function next() {
    setImmediateShim(loadNextChunk);
  }

  function done() {
    var raw = buffer.end(true);
    var base64 = rawToBase64(raw);
    callback(base64);
    buffer.destroy();
  }

  function loadNextChunk() {
    var start = currentChunk * chunkSize;
    var end = start + chunkSize;
    currentChunk++;
    if (currentChunk < chunks) {
      append(buffer, data, start, end, next);
    } else {
      append(buffer, data, start, end, done);
    }
  }
  loadNextChunk();
}

function stringMd5(string) {
  return Md5.hash(string);
}

function parseBase64(data) {
  try {
    return thisAtob(data);
  } catch (e) {
    var err = createError(BAD_ARG,
      'Attachment is not a valid base64 string');
    return {error: err};
  }
}

function preprocessString(att, blobType, callback) {
  var asBinary = parseBase64(att.data);
  if (asBinary.error) {
    return callback(asBinary.error);
  }

  att.length = asBinary.length;
  if (blobType === 'blob') {
    att.data = binStringToBluffer(asBinary, att.content_type);
  } else if (blobType === 'base64') {
    att.data = thisBtoa(asBinary);
  } else { // binary
    att.data = asBinary;
  }
  binaryMd5(asBinary, function (result) {
    att.digest = 'md5-' + result;
    callback();
  });
}

function preprocessBlob(att, blobType, callback) {
  binaryMd5(att.data, function (md5) {
    att.digest = 'md5-' + md5;
    // size is for blobs (browser), length is for buffers (node)
    att.length = att.data.size || att.data.length || 0;
    if (blobType === 'binary') {
      blobToBinaryString(att.data, function (binString) {
        att.data = binString;
        callback();
      });
    } else if (blobType === 'base64') {
      blobToBase64(att.data, function (b64) {
        att.data = b64;
        callback();
      });
    } else {
      callback();
    }
  });
}

function preprocessAttachment(att, blobType, callback) {
  if (att.stub) {
    return callback();
  }
  if (typeof att.data === 'string') { // input is a base64 string
    preprocessString(att, blobType, callback);
  } else { // input is a blob
    preprocessBlob(att, blobType, callback);
  }
}

function preprocessAttachments(docInfos, blobType, callback) {

  if (!docInfos.length) {
    return callback();
  }

  var docv = 0;
  var overallErr;

  docInfos.forEach(function (docInfo) {
    var attachments = docInfo.data && docInfo.data._attachments ?
      Object.keys(docInfo.data._attachments) : [];
    var recv = 0;

    if (!attachments.length) {
      return done();
    }

    function processedAttachment(err) {
      overallErr = err;
      recv++;
      if (recv === attachments.length) {
        done();
      }
    }

    for (var key in docInfo.data._attachments) {
      if (docInfo.data._attachments.hasOwnProperty(key)) {
        preprocessAttachment(docInfo.data._attachments[key],
          blobType, processedAttachment);
      }
    }
  });

  function done() {
    docv++;
    if (docInfos.length === docv) {
      if (overallErr) {
        callback(overallErr);
      } else {
        callback();
      }
    }
  }
}

function updateDoc(revLimit, prev, docInfo, results,
                   i, cb, writeDoc, newEdits) {

  if (revExists(prev.rev_tree, docInfo.metadata.rev)) {
    results[i] = docInfo;
    return cb();
  }

  // sometimes this is pre-calculated. historically not always
  var previousWinningRev = prev.winningRev || winningRev(prev);
  var previouslyDeleted = 'deleted' in prev ? prev.deleted :
    isDeleted(prev, previousWinningRev);
  var deleted = 'deleted' in docInfo.metadata ? docInfo.metadata.deleted :
    isDeleted(docInfo.metadata);
  var isRoot = /^1-/.test(docInfo.metadata.rev);

  if (previouslyDeleted && !deleted && newEdits && isRoot) {
    var newDoc = docInfo.data;
    newDoc._rev = previousWinningRev;
    newDoc._id = docInfo.metadata.id;
    docInfo = parseDoc(newDoc, newEdits);
  }

  var merged = merge(prev.rev_tree, docInfo.metadata.rev_tree[0], revLimit);

  var inConflict = newEdits && ((
    (previouslyDeleted && deleted && merged.conflicts !== 'new_leaf') ||
    (!previouslyDeleted && merged.conflicts !== 'new_leaf') ||
    (previouslyDeleted && !deleted && merged.conflicts === 'new_branch')));

  if (inConflict) {
    var err = createError(REV_CONFLICT);
    results[i] = err;
    return cb();
  }

  var newRev = docInfo.metadata.rev;
  docInfo.metadata.rev_tree = merged.tree;
  docInfo.stemmedRevs = merged.stemmedRevs || [];
  /* istanbul ignore else */
  if (prev.rev_map) {
    docInfo.metadata.rev_map = prev.rev_map; // used only by leveldb
  }

  // recalculate
  var winningRev$$1 = winningRev(docInfo.metadata);
  var winningRevIsDeleted = isDeleted(docInfo.metadata, winningRev$$1);

  // calculate the total number of documents that were added/removed,
  // from the perspective of total_rows/doc_count
  var delta = (previouslyDeleted === winningRevIsDeleted) ? 0 :
    previouslyDeleted < winningRevIsDeleted ? -1 : 1;

  var newRevIsDeleted;
  if (newRev === winningRev$$1) {
    // if the new rev is the same as the winning rev, we can reuse that value
    newRevIsDeleted = winningRevIsDeleted;
  } else {
    // if they're not the same, then we need to recalculate
    newRevIsDeleted = isDeleted(docInfo.metadata, newRev);
  }

  writeDoc(docInfo, winningRev$$1, winningRevIsDeleted, newRevIsDeleted,
    true, delta, i, cb);
}

function rootIsMissing(docInfo) {
  return docInfo.metadata.rev_tree[0].ids[1].status === 'missing';
}

function processDocs(revLimit, docInfos, api, fetchedDocs, tx, results,
                     writeDoc, opts, overallCallback) {

  // Default to 1000 locally
  revLimit = revLimit || 1000;

  function insertDoc(docInfo, resultsIdx, callback) {
    // Cant insert new deleted documents
    var winningRev$$1 = winningRev(docInfo.metadata);
    var deleted = isDeleted(docInfo.metadata, winningRev$$1);
    if ('was_delete' in opts && deleted) {
      results[resultsIdx] = createError(MISSING_DOC, 'deleted');
      return callback();
    }

    // 4712 - detect whether a new document was inserted with a _rev
    var inConflict = newEdits && rootIsMissing(docInfo);

    if (inConflict) {
      var err = createError(REV_CONFLICT);
      results[resultsIdx] = err;
      return callback();
    }

    var delta = deleted ? 0 : 1;

    writeDoc(docInfo, winningRev$$1, deleted, deleted, false,
      delta, resultsIdx, callback);
  }

  var newEdits = opts.new_edits;
  var idsToDocs = new ExportedMap();

  var docsDone = 0;
  var docsToDo = docInfos.length;

  function checkAllDocsDone() {
    if (++docsDone === docsToDo && overallCallback) {
      overallCallback();
    }
  }

  docInfos.forEach(function (currentDoc, resultsIdx) {

    if (currentDoc._id && isLocalId(currentDoc._id)) {
      var fun = currentDoc._deleted ? '_removeLocal' : '_putLocal';
      api[fun](currentDoc, {ctx: tx}, function (err, res) {
        results[resultsIdx] = err || res;
        checkAllDocsDone();
      });
      return;
    }

    var id = currentDoc.metadata.id;
    if (idsToDocs.has(id)) {
      docsToDo--; // duplicate
      idsToDocs.get(id).push([currentDoc, resultsIdx]);
    } else {
      idsToDocs.set(id, [[currentDoc, resultsIdx]]);
    }
  });

  // in the case of new_edits, the user can provide multiple docs
  // with the same id. these need to be processed sequentially
  idsToDocs.forEach(function (docs, id) {
    var numDone = 0;

    function docWritten() {
      if (++numDone < docs.length) {
        nextDoc();
      } else {
        checkAllDocsDone();
      }
    }
    function nextDoc() {
      var value = docs[numDone];
      var currentDoc = value[0];
      var resultsIdx = value[1];

      if (fetchedDocs.has(id)) {
        updateDoc(revLimit, fetchedDocs.get(id), currentDoc, results,
          resultsIdx, docWritten, writeDoc, newEdits);
      } else {
        // Ensure stemming applies to new writes as well
        var merged = merge([], currentDoc.metadata.rev_tree[0], revLimit);
        currentDoc.metadata.rev_tree = merged.tree;
        currentDoc.stemmedRevs = merged.stemmedRevs || [];
        insertDoc(currentDoc, resultsIdx, docWritten);
      }
    }
    nextDoc();
  });
}

// IndexedDB requires a versioned database structure, so we use the
// version here to manage migrations.
var ADAPTER_VERSION = 5;

// The object stores created for each database
// DOC_STORE stores the document meta data, its revision history and state
// Keyed by document id
var DOC_STORE = 'document-store';
// BY_SEQ_STORE stores a particular version of a document, keyed by its
// sequence id
var BY_SEQ_STORE = 'by-sequence';
// Where we store attachments
var ATTACH_STORE = 'attach-store';
// Where we store many-to-many relations
// between attachment digests and seqs
var ATTACH_AND_SEQ_STORE = 'attach-seq-store';

// Where we store database-wide meta data in a single record
// keyed by id: META_STORE
var META_STORE = 'meta-store';
// Where we store local documents
var LOCAL_STORE = 'local-store';
// Where we detect blob support
var DETECT_BLOB_SUPPORT_STORE = 'detect-blob-support';

function safeJsonParse(str) {
  // This try/catch guards against stack overflow errors.
  // JSON.parse() is faster than vuvuzela.parse() but vuvuzela
  // cannot overflow.
  try {
    return JSON.parse(str);
  } catch (e) {
    /* istanbul ignore next */
    return vuvuzela.parse(str);
  }
}

function safeJsonStringify(json) {
  try {
    return JSON.stringify(json);
  } catch (e) {
    /* istanbul ignore next */
    return vuvuzela.stringify(json);
  }
}

function idbError(callback) {
  return function (evt) {
    var message = 'unknown_error';
    if (evt.target && evt.target.error) {
      message = evt.target.error.name || evt.target.error.message;
    }
    callback(createError(IDB_ERROR, message, evt.type));
  };
}

// Unfortunately, the metadata has to be stringified
// when it is put into the database, because otherwise
// IndexedDB can throw errors for deeply-nested objects.
// Originally we just used JSON.parse/JSON.stringify; now
// we use this custom vuvuzela library that avoids recursion.
// If we could do it all over again, we'd probably use a
// format for the revision trees other than JSON.
function encodeMetadata(metadata, winningRev, deleted) {
  return {
    data: safeJsonStringify(metadata),
    winningRev: winningRev,
    deletedOrLocal: deleted ? '1' : '0',
    seq: metadata.seq, // highest seq for this doc
    id: metadata.id
  };
}

function decodeMetadata(storedObject) {
  if (!storedObject) {
    return null;
  }
  var metadata = safeJsonParse(storedObject.data);
  metadata.winningRev = storedObject.winningRev;
  metadata.deleted = storedObject.deletedOrLocal === '1';
  metadata.seq = storedObject.seq;
  return metadata;
}

// read the doc back out from the database. we don't store the
// _id or _rev because we already have _doc_id_rev.
function decodeDoc(doc) {
  if (!doc) {
    return doc;
  }
  var idx = doc._doc_id_rev.lastIndexOf(':');
  doc._id = doc._doc_id_rev.substring(0, idx - 1);
  doc._rev = doc._doc_id_rev.substring(idx + 1);
  delete doc._doc_id_rev;
  return doc;
}

// Read a blob from the database, encoding as necessary
// and translating from base64 if the IDB doesn't support
// native Blobs
function readBlobData(body, type, asBlob, callback) {
  if (asBlob) {
    if (!body) {
      callback(createBlob([''], {type: type}));
    } else if (typeof body !== 'string') { // we have blob support
      callback(body);
    } else { // no blob support
      callback(b64ToBluffer(body, type));
    }
  } else { // as base64 string
    if (!body) {
      callback('');
    } else if (typeof body !== 'string') { // we have blob support
      readAsBinaryString(body, function (binary) {
        callback(thisBtoa(binary));
      });
    } else { // no blob support
      callback(body);
    }
  }
}

function fetchAttachmentsIfNecessary(doc, opts, txn, cb) {
  var attachments = Object.keys(doc._attachments || {});
  if (!attachments.length) {
    return cb && cb();
  }
  var numDone = 0;

  function checkDone() {
    if (++numDone === attachments.length && cb) {
      cb();
    }
  }

  function fetchAttachment(doc, att) {
    var attObj = doc._attachments[att];
    var digest = attObj.digest;
    var req = txn.objectStore(ATTACH_STORE).get(digest);
    req.onsuccess = function (e) {
      attObj.body = e.target.result.body;
      checkDone();
    };
  }

  attachments.forEach(function (att) {
    if (opts.attachments && opts.include_docs) {
      fetchAttachment(doc, att);
    } else {
      doc._attachments[att].stub = true;
      checkDone();
    }
  });
}

// IDB-specific postprocessing necessary because
// we don't know whether we stored a true Blob or
// a base64-encoded string, and if it's a Blob it
// needs to be read outside of the transaction context
function postProcessAttachments(results, asBlob) {
  return PouchPromise$1.all(results.map(function (row) {
    if (row.doc && row.doc._attachments) {
      var attNames = Object.keys(row.doc._attachments);
      return PouchPromise$1.all(attNames.map(function (att) {
        var attObj = row.doc._attachments[att];
        if (!('body' in attObj)) { // already processed
          return;
        }
        var body = attObj.body;
        var type = attObj.content_type;
        return new PouchPromise$1(function (resolve) {
          readBlobData(body, type, asBlob, function (data) {
            row.doc._attachments[att] = $inject_Object_assign(
              pick(attObj, ['digest', 'content_type']),
              {data: data}
            );
            resolve();
          });
        });
      }));
    }
  }));
}

function compactRevs(revs, docId, txn) {

  var possiblyOrphanedDigests = [];
  var seqStore = txn.objectStore(BY_SEQ_STORE);
  var attStore = txn.objectStore(ATTACH_STORE);
  var attAndSeqStore = txn.objectStore(ATTACH_AND_SEQ_STORE);
  var count = revs.length;

  function checkDone() {
    count--;
    if (!count) { // done processing all revs
      deleteOrphanedAttachments();
    }
  }

  function deleteOrphanedAttachments() {
    if (!possiblyOrphanedDigests.length) {
      return;
    }
    possiblyOrphanedDigests.forEach(function (digest) {
      var countReq = attAndSeqStore.index('digestSeq').count(
        IDBKeyRange.bound(
          digest + '::', digest + '::\uffff', false, false));
      countReq.onsuccess = function (e) {
        var count = e.target.result;
        if (!count) {
          // orphaned
          attStore.delete(digest);
        }
      };
    });
  }

  revs.forEach(function (rev$$1) {
    var index = seqStore.index('_doc_id_rev');
    var key = docId + "::" + rev$$1;
    index.getKey(key).onsuccess = function (e) {
      var seq = e.target.result;
      if (typeof seq !== 'number') {
        return checkDone();
      }
      seqStore.delete(seq);

      var cursor = attAndSeqStore.index('seq')
        .openCursor(IDBKeyRange.only(seq));

      cursor.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          var digest = cursor.value.digestSeq.split('::')[0];
          possiblyOrphanedDigests.push(digest);
          attAndSeqStore.delete(cursor.primaryKey);
          cursor.continue();
        } else { // done
          checkDone();
        }
      };
    };
  });
}

function openTransactionSafely(idb, stores, mode) {
  try {
    return {
      txn: idb.transaction(stores, mode)
    };
  } catch (err) {
    return {
      error: err
    };
  }
}

var changesHandler = new Changes();

function idbBulkDocs(dbOpts, req, opts, api, idb, callback) {
  var docInfos = req.docs;
  var txn;
  var docStore;
  var bySeqStore;
  var attachStore;
  var attachAndSeqStore;
  var metaStore;
  var docInfoError;
  var metaDoc;

  for (var i = 0, len = docInfos.length; i < len; i++) {
    var doc = docInfos[i];
    if (doc._id && isLocalId(doc._id)) {
      continue;
    }
    doc = docInfos[i] = parseDoc(doc, opts.new_edits);
    if (doc.error && !docInfoError) {
      docInfoError = doc;
    }
  }

  if (docInfoError) {
    return callback(docInfoError);
  }

  var allDocsProcessed = false;
  var docCountDelta = 0;
  var results = new Array(docInfos.length);
  var fetchedDocs = new ExportedMap();
  var preconditionErrored = false;
  var blobType = api._meta.blobSupport ? 'blob' : 'base64';

  preprocessAttachments(docInfos, blobType, function (err) {
    if (err) {
      return callback(err);
    }
    startTransaction();
  });

  function startTransaction() {

    var stores = [
      DOC_STORE, BY_SEQ_STORE,
      ATTACH_STORE,
      LOCAL_STORE, ATTACH_AND_SEQ_STORE,
      META_STORE
    ];
    var txnResult = openTransactionSafely(idb, stores, 'readwrite');
    if (txnResult.error) {
      return callback(txnResult.error);
    }
    txn = txnResult.txn;
    txn.onabort = idbError(callback);
    txn.ontimeout = idbError(callback);
    txn.oncomplete = complete;
    docStore = txn.objectStore(DOC_STORE);
    bySeqStore = txn.objectStore(BY_SEQ_STORE);
    attachStore = txn.objectStore(ATTACH_STORE);
    attachAndSeqStore = txn.objectStore(ATTACH_AND_SEQ_STORE);
    metaStore = txn.objectStore(META_STORE);

    metaStore.get(META_STORE).onsuccess = function (e) {
      metaDoc = e.target.result;
      updateDocCountIfReady();
    };

    verifyAttachments(function (err) {
      if (err) {
        preconditionErrored = true;
        return callback(err);
      }
      fetchExistingDocs();
    });
  }

  function onAllDocsProcessed() {
    allDocsProcessed = true;
    updateDocCountIfReady();
  }

  function idbProcessDocs() {
    processDocs(dbOpts.revs_limit, docInfos, api, fetchedDocs,
                txn, results, writeDoc, opts, onAllDocsProcessed);
  }

  function updateDocCountIfReady() {
    if (!metaDoc || !allDocsProcessed) {
      return;
    }
    // caching the docCount saves a lot of time in allDocs() and
    // info(), which is why we go to all the trouble of doing this
    metaDoc.docCount += docCountDelta;
    metaStore.put(metaDoc);
  }

  function fetchExistingDocs() {

    if (!docInfos.length) {
      return;
    }

    var numFetched = 0;

    function checkDone() {
      if (++numFetched === docInfos.length) {
        idbProcessDocs();
      }
    }

    function readMetadata(event) {
      var metadata = decodeMetadata(event.target.result);

      if (metadata) {
        fetchedDocs.set(metadata.id, metadata);
      }
      checkDone();
    }

    for (var i = 0, len = docInfos.length; i < len; i++) {
      var docInfo = docInfos[i];
      if (docInfo._id && isLocalId(docInfo._id)) {
        checkDone(); // skip local docs
        continue;
      }
      var req = docStore.get(docInfo.metadata.id);
      req.onsuccess = readMetadata;
    }
  }

  function complete() {
    if (preconditionErrored) {
      return;
    }

    changesHandler.notify(api._meta.name);
    callback(null, results);
  }

  function verifyAttachment(digest, callback) {

    var req = attachStore.get(digest);
    req.onsuccess = function (e) {
      if (!e.target.result) {
        var err = createError(MISSING_STUB,
          'unknown stub attachment with digest ' +
          digest);
        err.status = 412;
        callback(err);
      } else {
        callback();
      }
    };
  }

  function verifyAttachments(finish) {


    var digests = [];
    docInfos.forEach(function (docInfo) {
      if (docInfo.data && docInfo.data._attachments) {
        Object.keys(docInfo.data._attachments).forEach(function (filename) {
          var att = docInfo.data._attachments[filename];
          if (att.stub) {
            digests.push(att.digest);
          }
        });
      }
    });
    if (!digests.length) {
      return finish();
    }
    var numDone = 0;
    var err;

    function checkDone() {
      if (++numDone === digests.length) {
        finish(err);
      }
    }
    digests.forEach(function (digest) {
      verifyAttachment(digest, function (attErr) {
        if (attErr && !err) {
          err = attErr;
        }
        checkDone();
      });
    });
  }

  function writeDoc(docInfo, winningRev$$1, winningRevIsDeleted, newRevIsDeleted,
                    isUpdate, delta, resultsIdx, callback) {

    docInfo.metadata.winningRev = winningRev$$1;
    docInfo.metadata.deleted = winningRevIsDeleted;

    var doc = docInfo.data;
    doc._id = docInfo.metadata.id;
    doc._rev = docInfo.metadata.rev;

    if (newRevIsDeleted) {
      doc._deleted = true;
    }

    var hasAttachments = doc._attachments &&
      Object.keys(doc._attachments).length;
    if (hasAttachments) {
      return writeAttachments(docInfo, winningRev$$1, winningRevIsDeleted,
        isUpdate, resultsIdx, callback);
    }

    docCountDelta += delta;
    updateDocCountIfReady();

    finishDoc(docInfo, winningRev$$1, winningRevIsDeleted,
      isUpdate, resultsIdx, callback);
  }

  function finishDoc(docInfo, winningRev$$1, winningRevIsDeleted,
                     isUpdate, resultsIdx, callback) {

    var doc = docInfo.data;
    var metadata = docInfo.metadata;

    doc._doc_id_rev = metadata.id + '::' + metadata.rev;
    delete doc._id;
    delete doc._rev;

    function afterPutDoc(e) {
      var revsToDelete = docInfo.stemmedRevs || [];

      if (isUpdate && api.auto_compaction) {
        revsToDelete = revsToDelete.concat(compactTree(docInfo.metadata));
      }

      if (revsToDelete && revsToDelete.length) {
        compactRevs(revsToDelete, docInfo.metadata.id, txn);
      }

      metadata.seq = e.target.result;
      // Current _rev is calculated from _rev_tree on read
      // delete metadata.rev;
      var metadataToStore = encodeMetadata(metadata, winningRev$$1,
        winningRevIsDeleted);
      var metaDataReq = docStore.put(metadataToStore);
      metaDataReq.onsuccess = afterPutMetadata;
    }

    function afterPutDocError(e) {
      // ConstraintError, need to update, not put (see #1638 for details)
      e.preventDefault(); // avoid transaction abort
      e.stopPropagation(); // avoid transaction onerror
      var index = bySeqStore.index('_doc_id_rev');
      var getKeyReq = index.getKey(doc._doc_id_rev);
      getKeyReq.onsuccess = function (e) {
        var putReq = bySeqStore.put(doc, e.target.result);
        putReq.onsuccess = afterPutDoc;
      };
    }

    function afterPutMetadata() {
      results[resultsIdx] = {
        ok: true,
        id: metadata.id,
        rev: metadata.rev
      };
      fetchedDocs.set(docInfo.metadata.id, docInfo.metadata);
      insertAttachmentMappings(docInfo, metadata.seq, callback);
    }

    var putReq = bySeqStore.put(doc);

    putReq.onsuccess = afterPutDoc;
    putReq.onerror = afterPutDocError;
  }

  function writeAttachments(docInfo, winningRev$$1, winningRevIsDeleted,
                            isUpdate, resultsIdx, callback) {


    var doc = docInfo.data;

    var numDone = 0;
    var attachments = Object.keys(doc._attachments);

    function collectResults() {
      if (numDone === attachments.length) {
        finishDoc(docInfo, winningRev$$1, winningRevIsDeleted,
          isUpdate, resultsIdx, callback);
      }
    }

    function attachmentSaved() {
      numDone++;
      collectResults();
    }

    attachments.forEach(function (key) {
      var att = docInfo.data._attachments[key];
      if (!att.stub) {
        var data = att.data;
        delete att.data;
        att.revpos = parseInt(winningRev$$1, 10);
        var digest = att.digest;
        saveAttachment(digest, data, attachmentSaved);
      } else {
        numDone++;
        collectResults();
      }
    });
  }

  // map seqs to attachment digests, which
  // we will need later during compaction
  function insertAttachmentMappings(docInfo, seq, callback) {

    var attsAdded = 0;
    var attsToAdd = Object.keys(docInfo.data._attachments || {});

    if (!attsToAdd.length) {
      return callback();
    }

    function checkDone() {
      if (++attsAdded === attsToAdd.length) {
        callback();
      }
    }

    function add(att) {
      var digest = docInfo.data._attachments[att].digest;
      var req = attachAndSeqStore.put({
        seq: seq,
        digestSeq: digest + '::' + seq
      });

      req.onsuccess = checkDone;
      req.onerror = function (e) {
        // this callback is for a constaint error, which we ignore
        // because this docid/rev has already been associated with
        // the digest (e.g. when new_edits == false)
        e.preventDefault(); // avoid transaction abort
        e.stopPropagation(); // avoid transaction onerror
        checkDone();
      };
    }
    for (var i = 0; i < attsToAdd.length; i++) {
      add(attsToAdd[i]); // do in parallel
    }
  }

  function saveAttachment(digest, data, callback) {


    var getKeyReq = attachStore.count(digest);
    getKeyReq.onsuccess = function (e) {
      var count = e.target.result;
      if (count) {
        return callback(); // already exists
      }
      var newAtt = {
        digest: digest,
        body: data
      };
      var putReq = attachStore.put(newAtt);
      putReq.onsuccess = callback;
    };
  }
}

// Abstraction over IDBCursor and getAll()/getAllKeys() that allows us to batch our operations
// while falling back to a normal IDBCursor operation on browsers that don't support getAll() or
// getAllKeys(). This allows for a much faster implementation than just straight-up cursors, because
// we're not processing each document one-at-a-time.
function runBatchedCursor(objectStore, keyRange, descending, batchSize, onBatch) {

  // Bail out of getAll()/getAllKeys() in the following cases:
  // 1) either method is unsupported - we need both
  // 2) batchSize is 1 (might as well use IDBCursor), or batchSize is -1 (i.e. batchSize unlimited,
  //    not really clear the user wants a batched approach where the entire DB is read into memory,
  //    perhaps they are filtering on a per-doc basis)
  // 3) descending – no real way to do this via getAll()/getAllKeys()

  var useGetAll = typeof objectStore.getAll === 'function' &&
    typeof objectStore.getAllKeys === 'function' &&
    batchSize > 1 && !descending;

  var keysBatch;
  var valuesBatch;
  var pseudoCursor;

  function onGetAll(e) {
    valuesBatch = e.target.result;
    if (keysBatch) {
      onBatch(keysBatch, valuesBatch, pseudoCursor);
    }
  }

  function onGetAllKeys(e) {
    keysBatch = e.target.result;
    if (valuesBatch) {
      onBatch(keysBatch, valuesBatch, pseudoCursor);
    }
  }

  function continuePseudoCursor() {
    if (!keysBatch.length) { // no more results
      return onBatch();
    }
    // fetch next batch, exclusive start
    var lastKey = keysBatch[keysBatch.length - 1];
    var newKeyRange;
    if (keyRange && keyRange.upper) {
      try {
        newKeyRange = IDBKeyRange.bound(lastKey, keyRange.upper,
          true, keyRange.upperOpen);
      } catch (e) {
        if (e.name === "DataError" && e.code === 0) {
          return onBatch(); // we're done, startkey and endkey are equal
        }
      }
    } else {
      newKeyRange = IDBKeyRange.lowerBound(lastKey, true);
    }
    keyRange = newKeyRange;
    keysBatch = null;
    valuesBatch = null;
    objectStore.getAll(keyRange, batchSize).onsuccess = onGetAll;
    objectStore.getAllKeys(keyRange, batchSize).onsuccess = onGetAllKeys;
  }

  function onCursor(e) {
    var cursor = e.target.result;
    if (!cursor) { // done
      return onBatch();
    }
    // regular IDBCursor acts like a batch where batch size is always 1
    onBatch([cursor.key], [cursor.value], cursor);
  }

  if (useGetAll) {
    pseudoCursor = {"continue": continuePseudoCursor};
    objectStore.getAll(keyRange, batchSize).onsuccess = onGetAll;
    objectStore.getAllKeys(keyRange, batchSize).onsuccess = onGetAllKeys;
  } else if (descending) {
    objectStore.openCursor(keyRange, 'prev').onsuccess = onCursor;
  } else {
    objectStore.openCursor(keyRange).onsuccess = onCursor;
  }
}

// simple shim for objectStore.getAll(), falling back to IDBCursor
function getAll(objectStore, keyRange, onSuccess) {
  if (typeof objectStore.getAll === 'function') {
    // use native getAll
    objectStore.getAll(keyRange).onsuccess = onSuccess;
    return;
  }
  // fall back to cursors
  var values = [];

  function onCursor(e) {
    var cursor = e.target.result;
    if (cursor) {
      values.push(cursor.value);
      cursor.continue();
    } else {
      onSuccess({
        target: {
          result: values
        }
      });
    }
  }

  objectStore.openCursor(keyRange).onsuccess = onCursor;
}

function createKeyRange(start, end, inclusiveEnd, key, descending) {
  try {
    if (start && end) {
      if (descending) {
        return IDBKeyRange.bound(end, start, !inclusiveEnd, false);
      } else {
        return IDBKeyRange.bound(start, end, false, !inclusiveEnd);
      }
    } else if (start) {
      if (descending) {
        return IDBKeyRange.upperBound(start);
      } else {
        return IDBKeyRange.lowerBound(start);
      }
    } else if (end) {
      if (descending) {
        return IDBKeyRange.lowerBound(end, !inclusiveEnd);
      } else {
        return IDBKeyRange.upperBound(end, !inclusiveEnd);
      }
    } else if (key) {
      return IDBKeyRange.only(key);
    }
  } catch (e) {
    return {error: e};
  }
  return null;
}

function idbAllDocs(opts, idb, callback) {
  var start = 'startkey' in opts ? opts.startkey : false;
  var end = 'endkey' in opts ? opts.endkey : false;
  var key = 'key' in opts ? opts.key : false;
  var skip = opts.skip || 0;
  var limit = typeof opts.limit === 'number' ? opts.limit : -1;
  var inclusiveEnd = opts.inclusive_end !== false;

  var keyRange = createKeyRange(start, end, inclusiveEnd, key, opts.descending);
  var keyRangeError = keyRange && keyRange.error;
  if (keyRangeError && !(keyRangeError.name === "DataError" &&
      keyRangeError.code === 0)) {
    // DataError with error code 0 indicates start is less than end, so
    // can just do an empty query. Else need to throw
    return callback(createError(IDB_ERROR,
      keyRangeError.name, keyRangeError.message));
  }

  var stores = [DOC_STORE, BY_SEQ_STORE, META_STORE];

  if (opts.attachments) {
    stores.push(ATTACH_STORE);
  }
  var txnResult = openTransactionSafely(idb, stores, 'readonly');
  if (txnResult.error) {
    return callback(txnResult.error);
  }
  var txn = txnResult.txn;
  txn.oncomplete = onTxnComplete;
  txn.onabort = idbError(callback);
  var docStore = txn.objectStore(DOC_STORE);
  var seqStore = txn.objectStore(BY_SEQ_STORE);
  var metaStore = txn.objectStore(META_STORE);
  var docIdRevIndex = seqStore.index('_doc_id_rev');
  var results = [];
  var docCount;

  metaStore.get(META_STORE).onsuccess = function (e) {
    docCount = e.target.result.docCount;
  };

  // if the user specifies include_docs=true, then we don't
  // want to block the main cursor while we're fetching the doc
  function fetchDocAsynchronously(metadata, row, winningRev$$1) {
    var key = metadata.id + "::" + winningRev$$1;
    docIdRevIndex.get(key).onsuccess =  function onGetDoc(e) {
      row.doc = decodeDoc(e.target.result);
      if (opts.conflicts) {
        var conflicts = collectConflicts(metadata);
        if (conflicts.length) {
          row.doc._conflicts = conflicts;
        }
      }
      fetchAttachmentsIfNecessary(row.doc, opts, txn);
    };
  }

  function allDocsInner(winningRev$$1, metadata) {
    var row = {
      id: metadata.id,
      key: metadata.id,
      value: {
        rev: winningRev$$1
      }
    };
    var deleted = metadata.deleted;
    if (opts.deleted === 'ok') {
      results.push(row);
      // deleted docs are okay with "keys" requests
      if (deleted) {
        row.value.deleted = true;
        row.doc = null;
      } else if (opts.include_docs) {
        fetchDocAsynchronously(metadata, row, winningRev$$1);
      }
    } else if (!deleted && skip-- <= 0) {
      results.push(row);
      if (opts.include_docs) {
        fetchDocAsynchronously(metadata, row, winningRev$$1);
      }
    }
  }

  function processBatch(batchValues) {
    for (var i = 0, len = batchValues.length; i < len; i++) {
      if (results.length === limit) {
        break;
      }
      var batchValue = batchValues[i];
      var metadata = decodeMetadata(batchValue);
      var winningRev$$1 = metadata.winningRev;
      allDocsInner(winningRev$$1, metadata);
    }
  }

  function onBatch(batchKeys, batchValues, cursor) {
    if (!cursor) {
      return;
    }
    processBatch(batchValues);
    if (results.length < limit) {
      cursor.continue();
    }
  }

  function onGetAll(e) {
    var values = e.target.result;
    if (opts.descending) {
      values = values.reverse();
    }
    processBatch(values);
  }

  function onResultsReady() {
    callback(null, {
      total_rows: docCount,
      offset: opts.skip,
      rows: results
    });
  }

  function onTxnComplete() {
    if (opts.attachments) {
      postProcessAttachments(results, opts.binary).then(onResultsReady);
    } else {
      onResultsReady();
    }
  }

  // don't bother doing any requests if start > end or limit === 0
  if (keyRangeError || limit === 0) {
    return;
  }
  if (limit === -1) { // just fetch everything
    return getAll(docStore, keyRange, onGetAll);
  }
  // else do a cursor
  // choose a batch size based on the skip, since we'll need to skip that many
  runBatchedCursor(docStore, keyRange, opts.descending, limit + skip, onBatch);
}

//
// Blobs are not supported in all versions of IndexedDB, notably
// Chrome <37 and Android <5. In those versions, storing a blob will throw.
//
// Various other blob bugs exist in Chrome v37-42 (inclusive).
// Detecting them is expensive and confusing to users, and Chrome 37-42
// is at very low usage worldwide, so we do a hacky userAgent check instead.
//
// content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
// 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
// FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
//
function checkBlobSupport(txn) {
  return new PouchPromise$1(function (resolve) {
    var blob = createBlob(['']);
    var req = txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

    req.onsuccess = function () {
      var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
      var matchedEdge = navigator.userAgent.match(/Edge\//);
      // MS Edge pretends to be Chrome 42:
      // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
      resolve(matchedEdge || !matchedChrome ||
        parseInt(matchedChrome[1], 10) >= 43);
    };

    txn.onabort = function (e) {
      // If the transaction aborts now its due to not being able to
      // write to the database, likely due to the disk being full
      e.preventDefault();
      e.stopPropagation();
      resolve(false);
    };
  }).catch(function () {
    return false; // error, so assume unsupported
  });
}

function countDocs(txn, cb) {
  var index = txn.objectStore(DOC_STORE).index('deletedOrLocal');
  index.count(IDBKeyRange.only('0')).onsuccess = function (e) {
    cb(e.target.result);
  };
}

// This task queue ensures that IDB open calls are done in their own tick
// and sequentially - i.e. we wait for the async IDB open to *fully* complete
// before calling the next one. This works around IE/Edge race conditions in IDB.

var running = false;
var queue = [];

function tryCode(fun, err, res, PouchDB) {
  try {
    fun(err, res);
  } catch (err) {
    // Shouldn't happen, but in some odd cases
    // IndexedDB implementations might throw a sync
    // error, in which case this will at least log it.
    PouchDB.emit('error', err);
  }
}

function applyNext() {
  if (running || !queue.length) {
    return;
  }
  running = true;
  queue.shift()();
}

function enqueueTask(action, callback, PouchDB) {
  queue.push(function runAction() {
    action(function runCallback(err, res) {
      tryCode(callback, err, res, PouchDB);
      running = false;
      nextTick(function runNext() {
        applyNext(PouchDB);
      });
    });
  });
  applyNext();
}

function changes(opts, api, dbName, idb) {
  opts = clone(opts);

  if (opts.continuous) {
    var id = dbName + ':' + uuid();
    changesHandler.addListener(dbName, id, api, opts);
    changesHandler.notify(dbName);
    return {
      cancel: function () {
        changesHandler.removeListener(dbName, id);
      }
    };
  }

  var docIds = opts.doc_ids && new ExportedSet(opts.doc_ids);

  opts.since = opts.since || 0;
  var lastSeq = opts.since;

  var limit = 'limit' in opts ? opts.limit : -1;
  if (limit === 0) {
    limit = 1; // per CouchDB _changes spec
  }
  var returnDocs;
  if ('return_docs' in opts) {
    returnDocs = opts.return_docs;
  } else if ('returnDocs' in opts) {
    // TODO: Remove 'returnDocs' in favor of 'return_docs' in a future release
    returnDocs = opts.returnDocs;
  } else {
    returnDocs = true;
  }

  var results = [];
  var numResults = 0;
  var filter = filterChange(opts);
  var docIdsToMetadata = new ExportedMap();

  var txn;
  var bySeqStore;
  var docStore;
  var docIdRevIndex;

  function onBatch(batchKeys, batchValues, cursor) {
    if (!cursor || !batchKeys.length) { // done
      return;
    }

    var winningDocs = new Array(batchKeys.length);
    var metadatas = new Array(batchKeys.length);

    function processMetadataAndWinningDoc(metadata, winningDoc) {
      var change = opts.processChange(winningDoc, metadata, opts);
      lastSeq = change.seq = metadata.seq;

      var filtered = filter(change);
      if (typeof filtered === 'object') { // anything but true/false indicates error
        return opts.complete(filtered);
      }

      if (filtered) {
        numResults++;
        if (returnDocs) {
          results.push(change);
        }
        // process the attachment immediately
        // for the benefit of live listeners
        if (opts.attachments && opts.include_docs) {
          fetchAttachmentsIfNecessary(winningDoc, opts, txn, function () {
            postProcessAttachments([change], opts.binary).then(function () {
              opts.onChange(change);
            });
          });
        } else {
          opts.onChange(change);
        }
      }
    }

    function onBatchDone() {
      for (var i = 0, len = winningDocs.length; i < len; i++) {
        if (numResults === limit) {
          break;
        }
        var winningDoc = winningDocs[i];
        if (!winningDoc) {
          continue;
        }
        var metadata = metadatas[i];
        processMetadataAndWinningDoc(metadata, winningDoc);
      }

      if (numResults !== limit) {
        cursor.continue();
      }
    }

    // Fetch all metadatas/winningdocs from this batch in parallel, then process
    // them all only once all data has been collected. This is done in parallel
    // because it's faster than doing it one-at-a-time.
    var numDone = 0;
    batchValues.forEach(function (value, i) {
      var doc = decodeDoc(value);
      var seq = batchKeys[i];
      fetchWinningDocAndMetadata(doc, seq, function (metadata, winningDoc) {
        metadatas[i] = metadata;
        winningDocs[i] = winningDoc;
        if (++numDone === batchKeys.length) {
          onBatchDone();
        }
      });
    });
  }

  function onGetMetadata(doc, seq, metadata, cb) {
    if (metadata.seq !== seq) {
      // some other seq is later
      return cb();
    }

    if (metadata.winningRev === doc._rev) {
      // this is the winning doc
      return cb(metadata, doc);
    }

    // fetch winning doc in separate request
    var docIdRev = doc._id + '::' + metadata.winningRev;
    var req = docIdRevIndex.get(docIdRev);
    req.onsuccess = function (e) {
      cb(metadata, decodeDoc(e.target.result));
    };
  }

  function fetchWinningDocAndMetadata(doc, seq, cb) {
    if (docIds && !docIds.has(doc._id)) {
      return cb();
    }

    var metadata = docIdsToMetadata.get(doc._id);
    if (metadata) { // cached
      return onGetMetadata(doc, seq, metadata, cb);
    }
    // metadata not cached, have to go fetch it
    docStore.get(doc._id).onsuccess = function (e) {
      metadata = decodeMetadata(e.target.result);
      docIdsToMetadata.set(doc._id, metadata);
      onGetMetadata(doc, seq, metadata, cb);
    };
  }

  function finish() {
    opts.complete(null, {
      results: results,
      last_seq: lastSeq
    });
  }

  function onTxnComplete() {
    if (!opts.continuous && opts.attachments) {
      // cannot guarantee that postProcessing was already done,
      // so do it again
      postProcessAttachments(results).then(finish);
    } else {
      finish();
    }
  }

  var objectStores = [DOC_STORE, BY_SEQ_STORE];
  if (opts.attachments) {
    objectStores.push(ATTACH_STORE);
  }
  var txnResult = openTransactionSafely(idb, objectStores, 'readonly');
  if (txnResult.error) {
    return opts.complete(txnResult.error);
  }
  txn = txnResult.txn;
  txn.onabort = idbError(opts.complete);
  txn.oncomplete = onTxnComplete;

  bySeqStore = txn.objectStore(BY_SEQ_STORE);
  docStore = txn.objectStore(DOC_STORE);
  docIdRevIndex = bySeqStore.index('_doc_id_rev');

  var keyRange = (opts.since && !opts.descending) ?
    IDBKeyRange.lowerBound(opts.since, true) : null;

  runBatchedCursor(bySeqStore, keyRange, opts.descending, limit, onBatch);
}

var cachedDBs = new ExportedMap();
var blobSupportPromise;
var openReqList = new ExportedMap();

function IdbPouch(opts, callback) {
  var api = this;

  enqueueTask(function (thisCallback) {
    init(api, opts, thisCallback);
  }, callback, api.constructor);
}

function init(api, opts, callback) {

  var dbName = opts.name;

  var idb = null;
  api._meta = null;

  // called when creating a fresh new database
  function createSchema(db) {
    var docStore = db.createObjectStore(DOC_STORE, {keyPath : 'id'});
    db.createObjectStore(BY_SEQ_STORE, {autoIncrement: true})
      .createIndex('_doc_id_rev', '_doc_id_rev', {unique: true});
    db.createObjectStore(ATTACH_STORE, {keyPath: 'digest'});
    db.createObjectStore(META_STORE, {keyPath: 'id', autoIncrement: false});
    db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);

    // added in v2
    docStore.createIndex('deletedOrLocal', 'deletedOrLocal', {unique : false});

    // added in v3
    db.createObjectStore(LOCAL_STORE, {keyPath: '_id'});

    // added in v4
    var attAndSeqStore = db.createObjectStore(ATTACH_AND_SEQ_STORE,
      {autoIncrement: true});
    attAndSeqStore.createIndex('seq', 'seq');
    attAndSeqStore.createIndex('digestSeq', 'digestSeq', {unique: true});
  }

  // migration to version 2
  // unfortunately "deletedOrLocal" is a misnomer now that we no longer
  // store local docs in the main doc-store, but whaddyagonnado
  function addDeletedOrLocalIndex(txn, callback) {
    var docStore = txn.objectStore(DOC_STORE);
    docStore.createIndex('deletedOrLocal', 'deletedOrLocal', {unique : false});

    docStore.openCursor().onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        var metadata = cursor.value;
        var deleted = isDeleted(metadata);
        metadata.deletedOrLocal = deleted ? "1" : "0";
        docStore.put(metadata);
        cursor.continue();
      } else {
        callback();
      }
    };
  }

  // migration to version 3 (part 1)
  function createLocalStoreSchema(db) {
    db.createObjectStore(LOCAL_STORE, {keyPath: '_id'})
      .createIndex('_doc_id_rev', '_doc_id_rev', {unique: true});
  }

  // migration to version 3 (part 2)
  function migrateLocalStore(txn, cb) {
    var localStore = txn.objectStore(LOCAL_STORE);
    var docStore = txn.objectStore(DOC_STORE);
    var seqStore = txn.objectStore(BY_SEQ_STORE);

    var cursor = docStore.openCursor();
    cursor.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        var metadata = cursor.value;
        var docId = metadata.id;
        var local = isLocalId(docId);
        var rev$$1 = winningRev(metadata);
        if (local) {
          var docIdRev = docId + "::" + rev$$1;
          // remove all seq entries
          // associated with this docId
          var start = docId + "::";
          var end = docId + "::~";
          var index = seqStore.index('_doc_id_rev');
          var range = IDBKeyRange.bound(start, end, false, false);
          var seqCursor = index.openCursor(range);
          seqCursor.onsuccess = function (e) {
            seqCursor = e.target.result;
            if (!seqCursor) {
              // done
              docStore.delete(cursor.primaryKey);
              cursor.continue();
            } else {
              var data = seqCursor.value;
              if (data._doc_id_rev === docIdRev) {
                localStore.put(data);
              }
              seqStore.delete(seqCursor.primaryKey);
              seqCursor.continue();
            }
          };
        } else {
          cursor.continue();
        }
      } else if (cb) {
        cb();
      }
    };
  }

  // migration to version 4 (part 1)
  function addAttachAndSeqStore(db) {
    var attAndSeqStore = db.createObjectStore(ATTACH_AND_SEQ_STORE,
      {autoIncrement: true});
    attAndSeqStore.createIndex('seq', 'seq');
    attAndSeqStore.createIndex('digestSeq', 'digestSeq', {unique: true});
  }

  // migration to version 4 (part 2)
  function migrateAttsAndSeqs(txn, callback) {
    var seqStore = txn.objectStore(BY_SEQ_STORE);
    var attStore = txn.objectStore(ATTACH_STORE);
    var attAndSeqStore = txn.objectStore(ATTACH_AND_SEQ_STORE);

    // need to actually populate the table. this is the expensive part,
    // so as an optimization, check first that this database even
    // contains attachments
    var req = attStore.count();
    req.onsuccess = function (e) {
      var count = e.target.result;
      if (!count) {
        return callback(); // done
      }

      seqStore.openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        if (!cursor) {
          return callback(); // done
        }
        var doc = cursor.value;
        var seq = cursor.primaryKey;
        var atts = Object.keys(doc._attachments || {});
        var digestMap = {};
        for (var j = 0; j < atts.length; j++) {
          var att = doc._attachments[atts[j]];
          digestMap[att.digest] = true; // uniq digests, just in case
        }
        var digests = Object.keys(digestMap);
        for (j = 0; j < digests.length; j++) {
          var digest = digests[j];
          attAndSeqStore.put({
            seq: seq,
            digestSeq: digest + '::' + seq
          });
        }
        cursor.continue();
      };
    };
  }

  // migration to version 5
  // Instead of relying on on-the-fly migration of metadata,
  // this brings the doc-store to its modern form:
  // - metadata.winningrev
  // - metadata.seq
  // - stringify the metadata when storing it
  function migrateMetadata(txn) {

    function decodeMetadataCompat(storedObject) {
      if (!storedObject.data) {
        // old format, when we didn't store it stringified
        storedObject.deleted = storedObject.deletedOrLocal === '1';
        return storedObject;
      }
      return decodeMetadata(storedObject);
    }

    // ensure that every metadata has a winningRev and seq,
    // which was previously created on-the-fly but better to migrate
    var bySeqStore = txn.objectStore(BY_SEQ_STORE);
    var docStore = txn.objectStore(DOC_STORE);
    var cursor = docStore.openCursor();
    cursor.onsuccess = function (e) {
      var cursor = e.target.result;
      if (!cursor) {
        return; // done
      }
      var metadata = decodeMetadataCompat(cursor.value);

      metadata.winningRev = metadata.winningRev ||
        winningRev(metadata);

      function fetchMetadataSeq() {
        // metadata.seq was added post-3.2.0, so if it's missing,
        // we need to fetch it manually
        var start = metadata.id + '::';
        var end = metadata.id + '::\uffff';
        var req = bySeqStore.index('_doc_id_rev').openCursor(
          IDBKeyRange.bound(start, end));

        var metadataSeq = 0;
        req.onsuccess = function (e) {
          var cursor = e.target.result;
          if (!cursor) {
            metadata.seq = metadataSeq;
            return onGetMetadataSeq();
          }
          var seq = cursor.primaryKey;
          if (seq > metadataSeq) {
            metadataSeq = seq;
          }
          cursor.continue();
        };
      }

      function onGetMetadataSeq() {
        var metadataToStore = encodeMetadata(metadata,
          metadata.winningRev, metadata.deleted);

        var req = docStore.put(metadataToStore);
        req.onsuccess = function () {
          cursor.continue();
        };
      }

      if (metadata.seq) {
        return onGetMetadataSeq();
      }

      fetchMetadataSeq();
    };

  }

  api._remote = false;
  api.type = function () {
    return 'idb';
  };

  api._id = toPromise(function (callback) {
    callback(null, api._meta.instanceId);
  });

  api._bulkDocs = function idb_bulkDocs(req, reqOpts, callback) {
    idbBulkDocs(opts, req, reqOpts, api, idb, callback);
  };

  // First we look up the metadata in the ids database, then we fetch the
  // current revision(s) from the by sequence store
  api._get = function idb_get(id, opts, callback) {
    var doc;
    var metadata;
    var err;
    var txn = opts.ctx;
    if (!txn) {
      var txnResult = openTransactionSafely(idb,
        [DOC_STORE, BY_SEQ_STORE, ATTACH_STORE], 'readonly');
      if (txnResult.error) {
        return callback(txnResult.error);
      }
      txn = txnResult.txn;
    }

    function finish() {
      callback(err, {doc: doc, metadata: metadata, ctx: txn});
    }

    txn.objectStore(DOC_STORE).get(id).onsuccess = function (e) {
      metadata = decodeMetadata(e.target.result);
      // we can determine the result here if:
      // 1. there is no such document
      // 2. the document is deleted and we don't ask about specific rev
      // When we ask with opts.rev we expect the answer to be either
      // doc (possibly with _deleted=true) or missing error
      if (!metadata) {
        err = createError(MISSING_DOC, 'missing');
        return finish();
      }

      var rev$$1;
      if (!opts.rev) {
        rev$$1 = metadata.winningRev;
        var deleted = isDeleted(metadata);
        if (deleted) {
          err = createError(MISSING_DOC, "deleted");
          return finish();
        }
      } else {
        rev$$1 = opts.latest ? latest(opts.rev, metadata) : opts.rev;
      }

      var objectStore = txn.objectStore(BY_SEQ_STORE);
      var key = metadata.id + '::' + rev$$1;

      objectStore.index('_doc_id_rev').get(key).onsuccess = function (e) {
        doc = e.target.result;
        if (doc) {
          doc = decodeDoc(doc);
        }
        if (!doc) {
          err = createError(MISSING_DOC, 'missing');
          return finish();
        }
        finish();
      };
    };
  };

  api._getAttachment = function (docId, attachId, attachment, opts, callback) {
    var txn;
    if (opts.ctx) {
      txn = opts.ctx;
    } else {
      var txnResult = openTransactionSafely(idb,
        [DOC_STORE, BY_SEQ_STORE, ATTACH_STORE], 'readonly');
      if (txnResult.error) {
        return callback(txnResult.error);
      }
      txn = txnResult.txn;
    }
    var digest = attachment.digest;
    var type = attachment.content_type;

    txn.objectStore(ATTACH_STORE).get(digest).onsuccess = function (e) {
      var body = e.target.result.body;
      readBlobData(body, type, opts.binary, function (blobData) {
        callback(null, blobData);
      });
    };
  };

  api._info = function idb_info(callback) {
    var updateSeq;
    var docCount;

    var txnResult = openTransactionSafely(idb, [META_STORE, BY_SEQ_STORE], 'readonly');
    if (txnResult.error) {
      return callback(txnResult.error);
    }
    var txn = txnResult.txn;
    txn.objectStore(META_STORE).get(META_STORE).onsuccess = function (e) {
      docCount = e.target.result.docCount;
    };
    txn.objectStore(BY_SEQ_STORE).openCursor(null, 'prev').onsuccess = function (e) {
      var cursor = e.target.result;
      updateSeq = cursor ? cursor.key : 0;
    };

    txn.oncomplete = function () {
      callback(null, {
        doc_count: docCount,
        update_seq: updateSeq,
        // for debugging
        idb_attachment_format: (api._meta.blobSupport ? 'binary' : 'base64')
      });
    };
  };

  api._allDocs = function idb_allDocs(opts, callback) {
    idbAllDocs(opts, idb, callback);
  };

  api._changes = function idbChanges(opts) {
    return changes(opts, api, dbName, idb);
  };

  api._close = function (callback) {
    // https://developer.mozilla.org/en-US/docs/IndexedDB/IDBDatabase#close
    // "Returns immediately and closes the connection in a separate thread..."
    idb.close();
    cachedDBs.delete(dbName);
    callback();
  };

  api._getRevisionTree = function (docId, callback) {
    var txnResult = openTransactionSafely(idb, [DOC_STORE], 'readonly');
    if (txnResult.error) {
      return callback(txnResult.error);
    }
    var txn = txnResult.txn;
    var req = txn.objectStore(DOC_STORE).get(docId);
    req.onsuccess = function (event) {
      var doc = decodeMetadata(event.target.result);
      if (!doc) {
        callback(createError(MISSING_DOC));
      } else {
        callback(null, doc.rev_tree);
      }
    };
  };

  // This function removes revisions of document docId
  // which are listed in revs and sets this document
  // revision to to rev_tree
  api._doCompaction = function (docId, revs, callback) {
    var stores = [
      DOC_STORE,
      BY_SEQ_STORE,
      ATTACH_STORE,
      ATTACH_AND_SEQ_STORE
    ];
    var txnResult = openTransactionSafely(idb, stores, 'readwrite');
    if (txnResult.error) {
      return callback(txnResult.error);
    }
    var txn = txnResult.txn;

    var docStore = txn.objectStore(DOC_STORE);

    docStore.get(docId).onsuccess = function (event) {
      var metadata = decodeMetadata(event.target.result);
      traverseRevTree(metadata.rev_tree, function (isLeaf, pos,
                                                         revHash, ctx, opts) {
        var rev$$1 = pos + '-' + revHash;
        if (revs.indexOf(rev$$1) !== -1) {
          opts.status = 'missing';
        }
      });
      compactRevs(revs, docId, txn);
      var winningRev$$1 = metadata.winningRev;
      var deleted = metadata.deleted;
      txn.objectStore(DOC_STORE).put(
        encodeMetadata(metadata, winningRev$$1, deleted));
    };
    txn.onabort = idbError(callback);
    txn.oncomplete = function () {
      callback();
    };
  };


  api._getLocal = function (id, callback) {
    var txnResult = openTransactionSafely(idb, [LOCAL_STORE], 'readonly');
    if (txnResult.error) {
      return callback(txnResult.error);
    }
    var tx = txnResult.txn;
    var req = tx.objectStore(LOCAL_STORE).get(id);

    req.onerror = idbError(callback);
    req.onsuccess = function (e) {
      var doc = e.target.result;
      if (!doc) {
        callback(createError(MISSING_DOC));
      } else {
        delete doc['_doc_id_rev']; // for backwards compat
        callback(null, doc);
      }
    };
  };

  api._putLocal = function (doc, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    delete doc._revisions; // ignore this, trust the rev
    var oldRev = doc._rev;
    var id = doc._id;
    if (!oldRev) {
      doc._rev = '0-1';
    } else {
      doc._rev = '0-' + (parseInt(oldRev.split('-')[1], 10) + 1);
    }

    var tx = opts.ctx;
    var ret;
    if (!tx) {
      var txnResult = openTransactionSafely(idb, [LOCAL_STORE], 'readwrite');
      if (txnResult.error) {
        return callback(txnResult.error);
      }
      tx = txnResult.txn;
      tx.onerror = idbError(callback);
      tx.oncomplete = function () {
        if (ret) {
          callback(null, ret);
        }
      };
    }

    var oStore = tx.objectStore(LOCAL_STORE);
    var req;
    if (oldRev) {
      req = oStore.get(id);
      req.onsuccess = function (e) {
        var oldDoc = e.target.result;
        if (!oldDoc || oldDoc._rev !== oldRev) {
          callback(createError(REV_CONFLICT));
        } else { // update
          var req = oStore.put(doc);
          req.onsuccess = function () {
            ret = {ok: true, id: doc._id, rev: doc._rev};
            if (opts.ctx) { // return immediately
              callback(null, ret);
            }
          };
        }
      };
    } else { // new doc
      req = oStore.add(doc);
      req.onerror = function (e) {
        // constraint error, already exists
        callback(createError(REV_CONFLICT));
        e.preventDefault(); // avoid transaction abort
        e.stopPropagation(); // avoid transaction onerror
      };
      req.onsuccess = function () {
        ret = {ok: true, id: doc._id, rev: doc._rev};
        if (opts.ctx) { // return immediately
          callback(null, ret);
        }
      };
    }
  };

  api._removeLocal = function (doc, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    var tx = opts.ctx;
    if (!tx) {
      var txnResult = openTransactionSafely(idb, [LOCAL_STORE], 'readwrite');
      if (txnResult.error) {
        return callback(txnResult.error);
      }
      tx = txnResult.txn;
      tx.oncomplete = function () {
        if (ret) {
          callback(null, ret);
        }
      };
    }
    var ret;
    var id = doc._id;
    var oStore = tx.objectStore(LOCAL_STORE);
    var req = oStore.get(id);

    req.onerror = idbError(callback);
    req.onsuccess = function (e) {
      var oldDoc = e.target.result;
      if (!oldDoc || oldDoc._rev !== doc._rev) {
        callback(createError(MISSING_DOC));
      } else {
        oStore.delete(id);
        ret = {ok: true, id: id, rev: '0-0'};
        if (opts.ctx) { // return immediately
          callback(null, ret);
        }
      }
    };
  };

  api._destroy = function (opts, callback) {
    changesHandler.removeAllListeners(dbName);

    //Close open request for "dbName" database to fix ie delay.
    var openReq = openReqList.get(dbName);
    if (openReq && openReq.result) {
      openReq.result.close();
      cachedDBs.delete(dbName);
    }
    var req = indexedDB.deleteDatabase(dbName);

    req.onsuccess = function () {
      //Remove open request from the list.
      openReqList.delete(dbName);
      if (hasLocalStorage() && (dbName in localStorage)) {
        delete localStorage[dbName];
      }
      callback(null, { 'ok': true });
    };

    req.onerror = idbError(callback);
  };

  var cached = cachedDBs.get(dbName);

  if (cached) {
    idb = cached.idb;
    api._meta = cached.global;
    return nextTick(function () {
      callback(null, api);
    });
  }

  var req;
  if (opts.storage) {
    req = tryStorageOption(dbName, opts.storage);
  } else {
    req = indexedDB.open(dbName, ADAPTER_VERSION);
  }

  openReqList.set(dbName, req);

  req.onupgradeneeded = function (e) {
    var db = e.target.result;
    if (e.oldVersion < 1) {
      return createSchema(db); // new db, initial schema
    }
    // do migrations

    var txn = e.currentTarget.transaction;
    // these migrations have to be done in this function, before
    // control is returned to the event loop, because IndexedDB

    if (e.oldVersion < 3) {
      createLocalStoreSchema(db); // v2 -> v3
    }
    if (e.oldVersion < 4) {
      addAttachAndSeqStore(db); // v3 -> v4
    }

    var migrations = [
      addDeletedOrLocalIndex, // v1 -> v2
      migrateLocalStore,      // v2 -> v3
      migrateAttsAndSeqs,     // v3 -> v4
      migrateMetadata         // v4 -> v5
    ];

    var i = e.oldVersion;

    function next() {
      var migration = migrations[i - 1];
      i++;
      if (migration) {
        migration(txn, next);
      }
    }

    next();
  };

  req.onsuccess = function (e) {

    idb = e.target.result;

    idb.onversionchange = function () {
      idb.close();
      cachedDBs.delete(dbName);
    };

    idb.onabort = function (e) {
      guardedConsole('error', 'Database has a global failure', e.target.error);
      idb.close();
      cachedDBs.delete(dbName);
    };

    // Do a few setup operations (in parallel as much as possible):
    // 1. Fetch meta doc
    // 2. Check blob support
    // 3. Calculate docCount
    // 4. Generate an instanceId if necessary
    // 5. Store docCount and instanceId on meta doc

    var txn = idb.transaction([
      META_STORE,
      DETECT_BLOB_SUPPORT_STORE,
      DOC_STORE
    ], 'readwrite');

    var storedMetaDoc = false;
    var metaDoc;
    var docCount;
    var blobSupport;
    var instanceId;

    function completeSetup() {
      if (typeof blobSupport === 'undefined' || !storedMetaDoc) {
        return;
      }
      api._meta = {
        name: dbName,
        instanceId: instanceId,
        blobSupport: blobSupport
      };

      cachedDBs.set(dbName, {
        idb: idb,
        global: api._meta
      });
      callback(null, api);
    }

    function storeMetaDocIfReady() {
      if (typeof docCount === 'undefined' || typeof metaDoc === 'undefined') {
        return;
      }
      var instanceKey = dbName + '_id';
      if (instanceKey in metaDoc) {
        instanceId = metaDoc[instanceKey];
      } else {
        metaDoc[instanceKey] = instanceId = uuid();
      }
      metaDoc.docCount = docCount;
      txn.objectStore(META_STORE).put(metaDoc);
    }

    //
    // fetch or generate the instanceId
    //
    txn.objectStore(META_STORE).get(META_STORE).onsuccess = function (e) {
      metaDoc = e.target.result || { id: META_STORE };
      storeMetaDocIfReady();
    };

    //
    // countDocs
    //
    countDocs(txn, function (count) {
      docCount = count;
      storeMetaDocIfReady();
    });

    //
    // check blob support
    //
    if (!blobSupportPromise) {
      // make sure blob support is only checked once
      blobSupportPromise = checkBlobSupport(txn);
    }

    blobSupportPromise.then(function (val) {
      blobSupport = val;
      completeSetup();
    });

    // only when the metadata put transaction has completed,
    // consider the setup done
    txn.oncomplete = function () {
      storedMetaDoc = true;
      completeSetup();
    };
  };

  req.onerror = function () {
    var msg = 'Failed to open indexedDB, are you in private browsing mode?';
    guardedConsole('error', msg);
    callback(createError(IDB_ERROR, msg));
  };
}

IdbPouch.valid = function () {
  // Issue #2533, we finally gave up on doing bug
  // detection instead of browser sniffing. Safari brought us
  // to our knees.
  var isSafari = typeof openDatabase !== 'undefined' &&
    /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) &&
    !/Chrome/.test(navigator.userAgent) &&
    !/BlackBerry/.test(navigator.platform);

  // some outdated implementations of IDB that appear on Samsung
  // and HTC Android devices <4.4 are missing IDBKeyRange
  return !isSafari && typeof indexedDB !== 'undefined' &&
    typeof IDBKeyRange !== 'undefined';
};

function tryStorageOption(dbName, storage) {
  try { // option only available in Firefox 26+
    return indexedDB.open(dbName, {
      version: ADAPTER_VERSION,
      storage: storage
    });
  } catch (err) {
      return indexedDB.open(dbName, ADAPTER_VERSION);
  }
}

var IDBPouch = function (PouchDB) {
  PouchDB.adapter('idb', IdbPouch, true);
};

//
// Parsing hex strings. Yeah.
//
// So basically we need this because of a bug in WebSQL:
// https://code.google.com/p/chromium/issues/detail?id=422690
// https://bugs.webkit.org/show_bug.cgi?id=137637
//
// UTF-8 and UTF-16 are provided as separate functions
// for meager performance improvements
//

function decodeUtf8(str) {
  return decodeURIComponent(escape(str));
}

function hexToInt(charCode) {
  // '0'-'9' is 48-57
  // 'A'-'F' is 65-70
  // SQLite will only give us uppercase hex
  return charCode < 65 ? (charCode - 48) : (charCode - 55);
}


// Example:
// pragma encoding=utf8;
// select hex('A');
// returns '41'
function parseHexUtf8(str, start, end) {
  var result = '';
  while (start < end) {
    result += String.fromCharCode(
      (hexToInt(str.charCodeAt(start++)) << 4) |
        hexToInt(str.charCodeAt(start++)));
  }
  return result;
}

// Example:
// pragma encoding=utf16;
// select hex('A');
// returns '4100'
// notice that the 00 comes after the 41 (i.e. it's swizzled)
function parseHexUtf16(str, start, end) {
  var result = '';
  while (start < end) {
    // UTF-16, so swizzle the bytes
    result += String.fromCharCode(
      (hexToInt(str.charCodeAt(start + 2)) << 12) |
        (hexToInt(str.charCodeAt(start + 3)) << 8) |
        (hexToInt(str.charCodeAt(start)) << 4) |
        hexToInt(str.charCodeAt(start + 1)));
    start += 4;
  }
  return result;
}

function parseHexString(str, encoding) {
  if (encoding === 'UTF-8') {
    return decodeUtf8(parseHexUtf8(str, 0, str.length));
  } else {
    return parseHexUtf16(str, 0, str.length);
  }
}

function quote(str) {
  return "'" + str + "'";
}

var ADAPTER_VERSION$1 = 7; // used to manage migrations

// The object stores created for each database
// DOC_STORE stores the document meta data, its revision history and state
var DOC_STORE$1 = quote('document-store');
// BY_SEQ_STORE stores a particular version of a document, keyed by its
// sequence id
var BY_SEQ_STORE$1 = quote('by-sequence');
// Where we store attachments
var ATTACH_STORE$1 = quote('attach-store');
var LOCAL_STORE$1 = quote('local-store');
var META_STORE$1 = quote('metadata-store');
// where we store many-to-many relations between attachment
// digests and seqs
var ATTACH_AND_SEQ_STORE$1 = quote('attach-seq-store');

// escapeBlob and unescapeBlob are workarounds for a websql bug:
// https://code.google.com/p/chromium/issues/detail?id=422690
// https://bugs.webkit.org/show_bug.cgi?id=137637
// The goal is to never actually insert the \u0000 character
// in the database.
function escapeBlob(str) {
  return str
    .replace(/\u0002/g, '\u0002\u0002')
    .replace(/\u0001/g, '\u0001\u0002')
    .replace(/\u0000/g, '\u0001\u0001');
}

function unescapeBlob(str) {
  return str
    .replace(/\u0001\u0001/g, '\u0000')
    .replace(/\u0001\u0002/g, '\u0001')
    .replace(/\u0002\u0002/g, '\u0002');
}

function stringifyDoc(doc) {
  // don't bother storing the id/rev. it uses lots of space,
  // in persistent map/reduce especially
  delete doc._id;
  delete doc._rev;
  return JSON.stringify(doc);
}

function unstringifyDoc(doc, id, rev$$1) {
  doc = JSON.parse(doc);
  doc._id = id;
  doc._rev = rev$$1;
  return doc;
}

// question mark groups IN queries, e.g. 3 -> '(?,?,?)'
function qMarks(num) {
  var s = '(';
  while (num--) {
    s += '?';
    if (num) {
      s += ',';
    }
  }
  return s + ')';
}

function select(selector, table, joiner, where, orderBy) {
  return 'SELECT ' + selector + ' FROM ' +
    (typeof table === 'string' ? table : table.join(' JOIN ')) +
    (joiner ? (' ON ' + joiner) : '') +
    (where ? (' WHERE ' +
    (typeof where === 'string' ? where : where.join(' AND '))) : '') +
    (orderBy ? (' ORDER BY ' + orderBy) : '');
}

function compactRevs$1(revs, docId, tx) {

  if (!revs.length) {
    return;
  }

  var numDone = 0;
  var seqs = [];

  function checkDone() {
    if (++numDone === revs.length) { // done
      deleteOrphans();
    }
  }

  function deleteOrphans() {
    // find orphaned attachment digests

    if (!seqs.length) {
      return;
    }

    var sql = 'SELECT DISTINCT digest AS digest FROM ' +
      ATTACH_AND_SEQ_STORE$1 + ' WHERE seq IN ' + qMarks(seqs.length);

    tx.executeSql(sql, seqs, function (tx, res) {

      var digestsToCheck = [];
      for (var i = 0; i < res.rows.length; i++) {
        digestsToCheck.push(res.rows.item(i).digest);
      }
      if (!digestsToCheck.length) {
        return;
      }

      var sql = 'DELETE FROM ' + ATTACH_AND_SEQ_STORE$1 +
        ' WHERE seq IN (' +
        seqs.map(function () { return '?'; }).join(',') +
        ')';
      tx.executeSql(sql, seqs, function (tx) {

        var sql = 'SELECT digest FROM ' + ATTACH_AND_SEQ_STORE$1 +
          ' WHERE digest IN (' +
          digestsToCheck.map(function () { return '?'; }).join(',') +
          ')';
        tx.executeSql(sql, digestsToCheck, function (tx, res) {
          var nonOrphanedDigests = new ExportedSet();
          for (var i = 0; i < res.rows.length; i++) {
            nonOrphanedDigests.add(res.rows.item(i).digest);
          }
          digestsToCheck.forEach(function (digest) {
            if (nonOrphanedDigests.has(digest)) {
              return;
            }
            tx.executeSql(
              'DELETE FROM ' + ATTACH_AND_SEQ_STORE$1 + ' WHERE digest=?',
              [digest]);
            tx.executeSql(
              'DELETE FROM ' + ATTACH_STORE$1 + ' WHERE digest=?', [digest]);
          });
        });
      });
    });
  }

  // update by-seq and attach stores in parallel
  revs.forEach(function (rev$$1) {
    var sql = 'SELECT seq FROM ' + BY_SEQ_STORE$1 +
      ' WHERE doc_id=? AND rev=?';

    tx.executeSql(sql, [docId, rev$$1], function (tx, res) {
      if (!res.rows.length) { // already deleted
        return checkDone();
      }
      var seq = res.rows.item(0).seq;
      seqs.push(seq);

      tx.executeSql(
        'DELETE FROM ' + BY_SEQ_STORE$1 + ' WHERE seq=?', [seq], checkDone);
    });
  });
}

function websqlError(callback) {
  return function (event) {
    guardedConsole('error', 'WebSQL threw an error', event);
    // event may actually be a SQLError object, so report is as such
    var errorNameMatch = event && event.constructor.toString()
        .match(/function ([^(]+)/);
    var errorName = (errorNameMatch && errorNameMatch[1]) || event.type;
    var errorReason = event.target || event.message;
    callback(createError(WSQ_ERROR, errorReason, errorName));
  };
}

function getSize(opts) {
  if ('size' in opts) {
    // triggers immediate popup in iOS, fixes #2347
    // e.g. 5000001 asks for 5 MB, 10000001 asks for 10 MB,
    return opts.size * 1000000;
  }
  // In iOS, doesn't matter as long as it's <= 5000000.
  // Except that if you request too much, our tests fail
  // because of the native "do you accept?" popup.
  // In Android <=4.3, this value is actually used as an
  // honest-to-god ceiling for data, so we need to
  // set it to a decently high number.
  var isAndroid = typeof navigator !== 'undefined' &&
    /Android/.test(navigator.userAgent);
  return isAndroid ? 5000000 : 1; // in PhantomJS, if you use 0 it will crash
}

function websqlBulkDocs(dbOpts, req, opts, api, db, websqlChanges, callback) {
  var newEdits = opts.new_edits;
  var userDocs = req.docs;

  // Parse the docs, give them a sequence number for the result
  var docInfos = userDocs.map(function (doc) {
    if (doc._id && isLocalId(doc._id)) {
      return doc;
    }
    var newDoc = parseDoc(doc, newEdits);
    return newDoc;
  });

  var docInfoErrors = docInfos.filter(function (docInfo) {
    return docInfo.error;
  });
  if (docInfoErrors.length) {
    return callback(docInfoErrors[0]);
  }

  var tx;
  var results = new Array(docInfos.length);
  var fetchedDocs = new ExportedMap();

  var preconditionErrored;
  function complete() {
    if (preconditionErrored) {
      return callback(preconditionErrored);
    }
    websqlChanges.notify(api._name);
    callback(null, results);
  }

  function verifyAttachment(digest, callback) {
    var sql = 'SELECT count(*) as cnt FROM ' + ATTACH_STORE$1 +
      ' WHERE digest=?';
    tx.executeSql(sql, [digest], function (tx, result) {
      if (result.rows.item(0).cnt === 0) {
        var err = createError(MISSING_STUB,
          'unknown stub attachment with digest ' +
          digest);
        callback(err);
      } else {
        callback();
      }
    });
  }

  function verifyAttachments(finish) {
    var digests = [];
    docInfos.forEach(function (docInfo) {
      if (docInfo.data && docInfo.data._attachments) {
        Object.keys(docInfo.data._attachments).forEach(function (filename) {
          var att = docInfo.data._attachments[filename];
          if (att.stub) {
            digests.push(att.digest);
          }
        });
      }
    });
    if (!digests.length) {
      return finish();
    }
    var numDone = 0;
    var err;

    function checkDone() {
      if (++numDone === digests.length) {
        finish(err);
      }
    }
    digests.forEach(function (digest) {
      verifyAttachment(digest, function (attErr) {
        if (attErr && !err) {
          err = attErr;
        }
        checkDone();
      });
    });
  }

  function writeDoc(docInfo, winningRev$$1, winningRevIsDeleted, newRevIsDeleted,
                    isUpdate, delta, resultsIdx, callback) {

    function finish() {
      var data = docInfo.data;
      var deletedInt = newRevIsDeleted ? 1 : 0;

      var id = data._id;
      var rev = data._rev;
      var json = stringifyDoc(data);
      var sql = 'INSERT INTO ' + BY_SEQ_STORE$1 +
        ' (doc_id, rev, json, deleted) VALUES (?, ?, ?, ?);';
      var sqlArgs = [id, rev, json, deletedInt];

      // map seqs to attachment digests, which
      // we will need later during compaction
      function insertAttachmentMappings(seq, callback) {
        var attsAdded = 0;
        var attsToAdd = Object.keys(data._attachments || {});

        if (!attsToAdd.length) {
          return callback();
        }
        function checkDone() {
          if (++attsAdded === attsToAdd.length) {
            callback();
          }
          return false; // ack handling a constraint error
        }
        function add(att) {
          var sql = 'INSERT INTO ' + ATTACH_AND_SEQ_STORE$1 +
            ' (digest, seq) VALUES (?,?)';
          var sqlArgs = [data._attachments[att].digest, seq];
          tx.executeSql(sql, sqlArgs, checkDone, checkDone);
          // second callback is for a constaint error, which we ignore
          // because this docid/rev has already been associated with
          // the digest (e.g. when new_edits == false)
        }
        for (var i = 0; i < attsToAdd.length; i++) {
          add(attsToAdd[i]); // do in parallel
        }
      }

      tx.executeSql(sql, sqlArgs, function (tx, result) {
        var seq = result.insertId;
        insertAttachmentMappings(seq, function () {
          dataWritten(tx, seq);
        });
      }, function () {
        // constraint error, recover by updating instead (see #1638)
        var fetchSql = select('seq', BY_SEQ_STORE$1, null,
          'doc_id=? AND rev=?');
        tx.executeSql(fetchSql, [id, rev], function (tx, res) {
          var seq = res.rows.item(0).seq;
          var sql = 'UPDATE ' + BY_SEQ_STORE$1 +
            ' SET json=?, deleted=? WHERE doc_id=? AND rev=?;';
          var sqlArgs = [json, deletedInt, id, rev];
          tx.executeSql(sql, sqlArgs, function (tx) {
            insertAttachmentMappings(seq, function () {
              dataWritten(tx, seq);
            });
          });
        });
        return false; // ack that we've handled the error
      });
    }

    function collectResults(attachmentErr) {
      if (!err) {
        if (attachmentErr) {
          err = attachmentErr;
          callback(err);
        } else if (recv === attachments.length) {
          finish();
        }
      }
    }

    var err = null;
    var recv = 0;

    docInfo.data._id = docInfo.metadata.id;
    docInfo.data._rev = docInfo.metadata.rev;
    var attachments = Object.keys(docInfo.data._attachments || {});


    if (newRevIsDeleted) {
      docInfo.data._deleted = true;
    }

    function attachmentSaved(err) {
      recv++;
      collectResults(err);
    }

    attachments.forEach(function (key) {
      var att = docInfo.data._attachments[key];
      if (!att.stub) {
        var data = att.data;
        delete att.data;
        att.revpos = parseInt(winningRev$$1, 10);
        var digest = att.digest;
        saveAttachment(digest, data, attachmentSaved);
      } else {
        recv++;
        collectResults();
      }
    });

    if (!attachments.length) {
      finish();
    }

    function dataWritten(tx, seq) {
      var id = docInfo.metadata.id;

      var revsToCompact = docInfo.stemmedRevs || [];
      if (isUpdate && api.auto_compaction) {
        revsToCompact = compactTree(docInfo.metadata).concat(revsToCompact);
      }
      if (revsToCompact.length) {
        compactRevs$1(revsToCompact, id, tx);
      }

      docInfo.metadata.seq = seq;
      var rev = docInfo.metadata.rev;
      delete docInfo.metadata.rev;

      var sql = isUpdate ?
      'UPDATE ' + DOC_STORE$1 +
      ' SET json=?, max_seq=?, winningseq=' +
      '(SELECT seq FROM ' + BY_SEQ_STORE$1 +
      ' WHERE doc_id=' + DOC_STORE$1 + '.id AND rev=?) WHERE id=?'
        : 'INSERT INTO ' + DOC_STORE$1 +
      ' (id, winningseq, max_seq, json) VALUES (?,?,?,?);';
      var metadataStr = safeJsonStringify(docInfo.metadata);
      var params = isUpdate ?
        [metadataStr, seq, winningRev$$1, id] :
        [id, seq, seq, metadataStr];
      tx.executeSql(sql, params, function () {
        results[resultsIdx] = {
          ok: true,
          id: docInfo.metadata.id,
          rev: rev
        };
        fetchedDocs.set(id, docInfo.metadata);
        callback();
      });
    }
  }

  function websqlProcessDocs() {
    processDocs(dbOpts.revs_limit, docInfos, api, fetchedDocs, tx,
                results, writeDoc, opts);
  }

  function fetchExistingDocs(callback) {
    if (!docInfos.length) {
      return callback();
    }

    var numFetched = 0;

    function checkDone() {
      if (++numFetched === docInfos.length) {
        callback();
      }
    }

    docInfos.forEach(function (docInfo) {
      if (docInfo._id && isLocalId(docInfo._id)) {
        return checkDone(); // skip local docs
      }
      var id = docInfo.metadata.id;
      tx.executeSql('SELECT json FROM ' + DOC_STORE$1 +
      ' WHERE id = ?', [id], function (tx, result) {
        if (result.rows.length) {
          var metadata = safeJsonParse(result.rows.item(0).json);
          fetchedDocs.set(id, metadata);
        }
        checkDone();
      });
    });
  }

  function saveAttachment(digest, data, callback) {
    var sql = 'SELECT digest FROM ' + ATTACH_STORE$1 + ' WHERE digest=?';
    tx.executeSql(sql, [digest], function (tx, result) {
      if (result.rows.length) { // attachment already exists
        return callback();
      }
      // we could just insert before selecting and catch the error,
      // but my hunch is that it's cheaper not to serialize the blob
      // from JS to C if we don't have to (TODO: confirm this)
      sql = 'INSERT INTO ' + ATTACH_STORE$1 +
      ' (digest, body, escaped) VALUES (?,?,1)';
      tx.executeSql(sql, [digest, escapeBlob(data)], function () {
        callback();
      }, function () {
        // ignore constaint errors, means it already exists
        callback();
        return false; // ack we handled the error
      });
    });
  }

  preprocessAttachments(docInfos, 'binary', function (err) {
    if (err) {
      return callback(err);
    }
    db.transaction(function (txn) {
      tx = txn;
      verifyAttachments(function (err) {
        if (err) {
          preconditionErrored = err;
        } else {
          fetchExistingDocs(websqlProcessDocs);
        }
      });
    }, websqlError(callback), complete);
  });
}

var cachedDatabases = new ExportedMap();

// openDatabase passed in through opts (e.g. for node-websql)
function openDatabaseWithOpts(opts) {
  return opts.websql(opts.name, opts.version, opts.description, opts.size);
}

function openDBSafely(opts) {
  try {
    return {
      db: openDatabaseWithOpts(opts)
    };
  } catch (err) {
    return {
      error: err
    };
  }
}

function openDB$1(opts) {
  var cachedResult = cachedDatabases.get(opts.name);
  if (!cachedResult) {
    cachedResult = openDBSafely(opts);
    cachedDatabases.set(opts.name, cachedResult);
  }
  return cachedResult;
}

var websqlChanges = new Changes();

function fetchAttachmentsIfNecessary$1(doc, opts, api, txn, cb) {
  var attachments = Object.keys(doc._attachments || {});
  if (!attachments.length) {
    return cb && cb();
  }
  var numDone = 0;

  function checkDone() {
    if (++numDone === attachments.length && cb) {
      cb();
    }
  }

  function fetchAttachment(doc, att) {
    var attObj = doc._attachments[att];
    var attOpts = {binary: opts.binary, ctx: txn};
    api._getAttachment(doc._id, att, attObj, attOpts, function (_, data) {
      doc._attachments[att] = $inject_Object_assign(
        pick(attObj, ['digest', 'content_type']),
        { data: data }
      );
      checkDone();
    });
  }

  attachments.forEach(function (att) {
    if (opts.attachments && opts.include_docs) {
      fetchAttachment(doc, att);
    } else {
      doc._attachments[att].stub = true;
      checkDone();
    }
  });
}

var POUCH_VERSION = 1;

// these indexes cover the ground for most allDocs queries
var BY_SEQ_STORE_DELETED_INDEX_SQL =
  'CREATE INDEX IF NOT EXISTS \'by-seq-deleted-idx\' ON ' +
  BY_SEQ_STORE$1 + ' (seq, deleted)';
var BY_SEQ_STORE_DOC_ID_REV_INDEX_SQL =
  'CREATE UNIQUE INDEX IF NOT EXISTS \'by-seq-doc-id-rev\' ON ' +
    BY_SEQ_STORE$1 + ' (doc_id, rev)';
var DOC_STORE_WINNINGSEQ_INDEX_SQL =
  'CREATE INDEX IF NOT EXISTS \'doc-winningseq-idx\' ON ' +
  DOC_STORE$1 + ' (winningseq)';
var ATTACH_AND_SEQ_STORE_SEQ_INDEX_SQL =
  'CREATE INDEX IF NOT EXISTS \'attach-seq-seq-idx\' ON ' +
    ATTACH_AND_SEQ_STORE$1 + ' (seq)';
var ATTACH_AND_SEQ_STORE_ATTACH_INDEX_SQL =
  'CREATE UNIQUE INDEX IF NOT EXISTS \'attach-seq-digest-idx\' ON ' +
    ATTACH_AND_SEQ_STORE$1 + ' (digest, seq)';

var DOC_STORE_AND_BY_SEQ_JOINER = BY_SEQ_STORE$1 +
  '.seq = ' + DOC_STORE$1 + '.winningseq';

var SELECT_DOCS = BY_SEQ_STORE$1 + '.seq AS seq, ' +
  BY_SEQ_STORE$1 + '.deleted AS deleted, ' +
  BY_SEQ_STORE$1 + '.json AS data, ' +
  BY_SEQ_STORE$1 + '.rev AS rev, ' +
  DOC_STORE$1 + '.json AS metadata';

function WebSqlPouch$1(opts, callback) {
  var api = this;
  var instanceId = null;
  var size = getSize(opts);
  var idRequests = [];
  var encoding;

  api._name = opts.name;

  // extend the options here, because sqlite plugin has a ton of options
  // and they are constantly changing, so it's more prudent to allow anything
  var websqlOpts = $inject_Object_assign({}, opts, {
    version: POUCH_VERSION,
    description: opts.name,
    size: size
  });
  var openDBResult = openDB$1(websqlOpts);
  if (openDBResult.error) {
    return websqlError(callback)(openDBResult.error);
  }
  var db = openDBResult.db;
  if (typeof db.readTransaction !== 'function') {
    // doesn't exist in sqlite plugin
    db.readTransaction = db.transaction;
  }

  function dbCreated() {
    // note the db name in case the browser upgrades to idb
    if (hasLocalStorage()) {
      window.localStorage['_pouch__websqldb_' + api._name] = true;
    }
    callback(null, api);
  }

  // In this migration, we added the 'deleted' and 'local' columns to the
  // by-seq and doc store tables.
  // To preserve existing user data, we re-process all the existing JSON
  // and add these values.
  // Called migration2 because it corresponds to adapter version (db_version) #2
  function runMigration2(tx, callback) {
    // index used for the join in the allDocs query
    tx.executeSql(DOC_STORE_WINNINGSEQ_INDEX_SQL);

    tx.executeSql('ALTER TABLE ' + BY_SEQ_STORE$1 +
      ' ADD COLUMN deleted TINYINT(1) DEFAULT 0', [], function () {
      tx.executeSql(BY_SEQ_STORE_DELETED_INDEX_SQL);
      tx.executeSql('ALTER TABLE ' + DOC_STORE$1 +
        ' ADD COLUMN local TINYINT(1) DEFAULT 0', [], function () {
        tx.executeSql('CREATE INDEX IF NOT EXISTS \'doc-store-local-idx\' ON ' +
          DOC_STORE$1 + ' (local, id)');

        var sql = 'SELECT ' + DOC_STORE$1 + '.winningseq AS seq, ' + DOC_STORE$1 +
          '.json AS metadata FROM ' + BY_SEQ_STORE$1 + ' JOIN ' + DOC_STORE$1 +
          ' ON ' + BY_SEQ_STORE$1 + '.seq = ' + DOC_STORE$1 + '.winningseq';

        tx.executeSql(sql, [], function (tx, result) {

          var deleted = [];
          var local = [];

          for (var i = 0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            var seq = item.seq;
            var metadata = JSON.parse(item.metadata);
            if (isDeleted(metadata)) {
              deleted.push(seq);
            }
            if (isLocalId(metadata.id)) {
              local.push(metadata.id);
            }
          }
          tx.executeSql('UPDATE ' + DOC_STORE$1 + 'SET local = 1 WHERE id IN ' +
            qMarks(local.length), local, function () {
            tx.executeSql('UPDATE ' + BY_SEQ_STORE$1 +
              ' SET deleted = 1 WHERE seq IN ' +
              qMarks(deleted.length), deleted, callback);
          });
        });
      });
    });
  }

  // in this migration, we make all the local docs unversioned
  function runMigration3(tx, callback) {
    var local = 'CREATE TABLE IF NOT EXISTS ' + LOCAL_STORE$1 +
      ' (id UNIQUE, rev, json)';
    tx.executeSql(local, [], function () {
      var sql = 'SELECT ' + DOC_STORE$1 + '.id AS id, ' +
        BY_SEQ_STORE$1 + '.json AS data ' +
        'FROM ' + BY_SEQ_STORE$1 + ' JOIN ' +
        DOC_STORE$1 + ' ON ' + BY_SEQ_STORE$1 + '.seq = ' +
        DOC_STORE$1 + '.winningseq WHERE local = 1';
      tx.executeSql(sql, [], function (tx, res) {
        var rows = [];
        for (var i = 0; i < res.rows.length; i++) {
          rows.push(res.rows.item(i));
        }
        function doNext() {
          if (!rows.length) {
            return callback(tx);
          }
          var row = rows.shift();
          var rev$$1 = JSON.parse(row.data)._rev;
          tx.executeSql('INSERT INTO ' + LOCAL_STORE$1 +
              ' (id, rev, json) VALUES (?,?,?)',
              [row.id, rev$$1, row.data], function (tx) {
            tx.executeSql('DELETE FROM ' + DOC_STORE$1 + ' WHERE id=?',
                [row.id], function (tx) {
              tx.executeSql('DELETE FROM ' + BY_SEQ_STORE$1 + ' WHERE seq=?',
                  [row.seq], function () {
                doNext();
              });
            });
          });
        }
        doNext();
      });
    });
  }

  // in this migration, we remove doc_id_rev and just use rev
  function runMigration4(tx, callback) {

    function updateRows(rows) {
      function doNext() {
        if (!rows.length) {
          return callback(tx);
        }
        var row = rows.shift();
        var doc_id_rev = parseHexString(row.hex, encoding);
        var idx = doc_id_rev.lastIndexOf('::');
        var doc_id = doc_id_rev.substring(0, idx);
        var rev$$1 = doc_id_rev.substring(idx + 2);
        var sql = 'UPDATE ' + BY_SEQ_STORE$1 +
          ' SET doc_id=?, rev=? WHERE doc_id_rev=?';
        tx.executeSql(sql, [doc_id, rev$$1, doc_id_rev], function () {
          doNext();
        });
      }
      doNext();
    }

    var sql = 'ALTER TABLE ' + BY_SEQ_STORE$1 + ' ADD COLUMN doc_id';
    tx.executeSql(sql, [], function (tx) {
      var sql = 'ALTER TABLE ' + BY_SEQ_STORE$1 + ' ADD COLUMN rev';
      tx.executeSql(sql, [], function (tx) {
        tx.executeSql(BY_SEQ_STORE_DOC_ID_REV_INDEX_SQL, [], function (tx) {
          var sql = 'SELECT hex(doc_id_rev) as hex FROM ' + BY_SEQ_STORE$1;
          tx.executeSql(sql, [], function (tx, res) {
            var rows = [];
            for (var i = 0; i < res.rows.length; i++) {
              rows.push(res.rows.item(i));
            }
            updateRows(rows);
          });
        });
      });
    });
  }

  // in this migration, we add the attach_and_seq table
  // for issue #2818
  function runMigration5(tx, callback) {

    function migrateAttsAndSeqs(tx) {
      // need to actually populate the table. this is the expensive part,
      // so as an optimization, check first that this database even
      // contains attachments
      var sql = 'SELECT COUNT(*) AS cnt FROM ' + ATTACH_STORE$1;
      tx.executeSql(sql, [], function (tx, res) {
        var count = res.rows.item(0).cnt;
        if (!count) {
          return callback(tx);
        }

        var offset = 0;
        var pageSize = 10;
        function nextPage() {
          var sql = select(
            SELECT_DOCS + ', ' + DOC_STORE$1 + '.id AS id',
            [DOC_STORE$1, BY_SEQ_STORE$1],
            DOC_STORE_AND_BY_SEQ_JOINER,
            null,
            DOC_STORE$1 + '.id '
          );
          sql += ' LIMIT ' + pageSize + ' OFFSET ' + offset;
          offset += pageSize;
          tx.executeSql(sql, [], function (tx, res) {
            if (!res.rows.length) {
              return callback(tx);
            }
            var digestSeqs = {};
            function addDigestSeq(digest, seq) {
              // uniq digest/seq pairs, just in case there are dups
              var seqs = digestSeqs[digest] = (digestSeqs[digest] || []);
              if (seqs.indexOf(seq) === -1) {
                seqs.push(seq);
              }
            }
            for (var i = 0; i < res.rows.length; i++) {
              var row = res.rows.item(i);
              var doc = unstringifyDoc(row.data, row.id, row.rev);
              var atts = Object.keys(doc._attachments || {});
              for (var j = 0; j < atts.length; j++) {
                var att = doc._attachments[atts[j]];
                addDigestSeq(att.digest, row.seq);
              }
            }
            var digestSeqPairs = [];
            Object.keys(digestSeqs).forEach(function (digest) {
              var seqs = digestSeqs[digest];
              seqs.forEach(function (seq) {
                digestSeqPairs.push([digest, seq]);
              });
            });
            if (!digestSeqPairs.length) {
              return nextPage();
            }
            var numDone = 0;
            digestSeqPairs.forEach(function (pair) {
              var sql = 'INSERT INTO ' + ATTACH_AND_SEQ_STORE$1 +
                ' (digest, seq) VALUES (?,?)';
              tx.executeSql(sql, pair, function () {
                if (++numDone === digestSeqPairs.length) {
                  nextPage();
                }
              });
            });
          });
        }
        nextPage();
      });
    }

    var attachAndRev = 'CREATE TABLE IF NOT EXISTS ' +
      ATTACH_AND_SEQ_STORE$1 + ' (digest, seq INTEGER)';
    tx.executeSql(attachAndRev, [], function (tx) {
      tx.executeSql(
        ATTACH_AND_SEQ_STORE_ATTACH_INDEX_SQL, [], function (tx) {
          tx.executeSql(
            ATTACH_AND_SEQ_STORE_SEQ_INDEX_SQL, [],
            migrateAttsAndSeqs);
        });
    });
  }

  // in this migration, we use escapeBlob() and unescapeBlob()
  // instead of reading out the binary as HEX, which is slow
  function runMigration6(tx, callback) {
    var sql = 'ALTER TABLE ' + ATTACH_STORE$1 +
      ' ADD COLUMN escaped TINYINT(1) DEFAULT 0';
    tx.executeSql(sql, [], callback);
  }

  // issue #3136, in this migration we need a "latest seq" as well
  // as the "winning seq" in the doc store
  function runMigration7(tx, callback) {
    var sql = 'ALTER TABLE ' + DOC_STORE$1 +
      ' ADD COLUMN max_seq INTEGER';
    tx.executeSql(sql, [], function (tx) {
      var sql = 'UPDATE ' + DOC_STORE$1 + ' SET max_seq=(SELECT MAX(seq) FROM ' +
        BY_SEQ_STORE$1 + ' WHERE doc_id=id)';
      tx.executeSql(sql, [], function (tx) {
        // add unique index after filling, else we'll get a constraint
        // error when we do the ALTER TABLE
        var sql =
          'CREATE UNIQUE INDEX IF NOT EXISTS \'doc-max-seq-idx\' ON ' +
          DOC_STORE$1 + ' (max_seq)';
        tx.executeSql(sql, [], callback);
      });
    });
  }

  function checkEncoding(tx, cb) {
    // UTF-8 on chrome/android, UTF-16 on safari < 7.1
    tx.executeSql('SELECT HEX("a") AS hex', [], function (tx, res) {
        var hex = res.rows.item(0).hex;
        encoding = hex.length === 2 ? 'UTF-8' : 'UTF-16';
        cb();
      }
    );
  }

  function onGetInstanceId() {
    while (idRequests.length > 0) {
      var idCallback = idRequests.pop();
      idCallback(null, instanceId);
    }
  }

  function onGetVersion(tx, dbVersion) {
    if (dbVersion === 0) {
      // initial schema

      var meta = 'CREATE TABLE IF NOT EXISTS ' + META_STORE$1 +
        ' (dbid, db_version INTEGER)';
      var attach = 'CREATE TABLE IF NOT EXISTS ' + ATTACH_STORE$1 +
        ' (digest UNIQUE, escaped TINYINT(1), body BLOB)';
      var attachAndRev = 'CREATE TABLE IF NOT EXISTS ' +
        ATTACH_AND_SEQ_STORE$1 + ' (digest, seq INTEGER)';
      // TODO: migrate winningseq to INTEGER
      var doc = 'CREATE TABLE IF NOT EXISTS ' + DOC_STORE$1 +
        ' (id unique, json, winningseq, max_seq INTEGER UNIQUE)';
      var seq = 'CREATE TABLE IF NOT EXISTS ' + BY_SEQ_STORE$1 +
        ' (seq INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        'json, deleted TINYINT(1), doc_id, rev)';
      var local = 'CREATE TABLE IF NOT EXISTS ' + LOCAL_STORE$1 +
        ' (id UNIQUE, rev, json)';

      // creates
      tx.executeSql(attach);
      tx.executeSql(local);
      tx.executeSql(attachAndRev, [], function () {
        tx.executeSql(ATTACH_AND_SEQ_STORE_SEQ_INDEX_SQL);
        tx.executeSql(ATTACH_AND_SEQ_STORE_ATTACH_INDEX_SQL);
      });
      tx.executeSql(doc, [], function () {
        tx.executeSql(DOC_STORE_WINNINGSEQ_INDEX_SQL);
        tx.executeSql(seq, [], function () {
          tx.executeSql(BY_SEQ_STORE_DELETED_INDEX_SQL);
          tx.executeSql(BY_SEQ_STORE_DOC_ID_REV_INDEX_SQL);
          tx.executeSql(meta, [], function () {
            // mark the db version, and new dbid
            var initSeq = 'INSERT INTO ' + META_STORE$1 +
              ' (db_version, dbid) VALUES (?,?)';
            instanceId = uuid();
            var initSeqArgs = [ADAPTER_VERSION$1, instanceId];
            tx.executeSql(initSeq, initSeqArgs, function () {
              onGetInstanceId();
            });
          });
        });
      });
    } else { // version > 0

      var setupDone = function () {
        var migrated = dbVersion < ADAPTER_VERSION$1;
        if (migrated) {
          // update the db version within this transaction
          tx.executeSql('UPDATE ' + META_STORE$1 + ' SET db_version = ' +
            ADAPTER_VERSION$1);
        }
        // notify db.id() callers
        var sql = 'SELECT dbid FROM ' + META_STORE$1;
        tx.executeSql(sql, [], function (tx, result) {
          instanceId = result.rows.item(0).dbid;
          onGetInstanceId();
        });
      };

      // would love to use promises here, but then websql
      // ends the transaction early
      var tasks = [
        runMigration2,
        runMigration3,
        runMigration4,
        runMigration5,
        runMigration6,
        runMigration7,
        setupDone
      ];

      // run each migration sequentially
      var i = dbVersion;
      var nextMigration = function (tx) {
        tasks[i - 1](tx, nextMigration);
        i++;
      };
      nextMigration(tx);
    }
  }

  function setup() {
    db.transaction(function (tx) {
      // first check the encoding
      checkEncoding(tx, function () {
        // then get the version
        fetchVersion(tx);
      });
    }, websqlError(callback), dbCreated);
  }

  function fetchVersion(tx) {
    var sql = 'SELECT sql FROM sqlite_master WHERE tbl_name = ' + META_STORE$1;
    tx.executeSql(sql, [], function (tx, result) {
      if (!result.rows.length) {
        // database hasn't even been created yet (version 0)
        onGetVersion(tx, 0);
      } else if (!/db_version/.test(result.rows.item(0).sql)) {
        // table was created, but without the new db_version column,
        // so add it.
        tx.executeSql('ALTER TABLE ' + META_STORE$1 +
          ' ADD COLUMN db_version INTEGER', [], function () {
          // before version 2, this column didn't even exist
          onGetVersion(tx, 1);
        });
      } else { // column exists, we can safely get it
        tx.executeSql('SELECT db_version FROM ' + META_STORE$1,
          [], function (tx, result) {
          var dbVersion = result.rows.item(0).db_version;
          onGetVersion(tx, dbVersion);
        });
      }
    });
  }

  setup();

  function getMaxSeq(tx, callback) {
    var sql = 'SELECT MAX(seq) AS seq FROM ' + BY_SEQ_STORE$1;
    tx.executeSql(sql, [], function (tx, res) {
      var updateSeq = res.rows.item(0).seq || 0;
      callback(updateSeq);
    });
  }

  function countDocs(tx, callback) {
    // count the total rows
    var sql = select(
      'COUNT(' + DOC_STORE$1 + '.id) AS \'num\'',
      [DOC_STORE$1, BY_SEQ_STORE$1],
      DOC_STORE_AND_BY_SEQ_JOINER,
      BY_SEQ_STORE$1 + '.deleted=0');

    tx.executeSql(sql, [], function (tx, result) {
      callback(result.rows.item(0).num);
    });
  }

  api._remote = false;
  api.type = function () {
    return 'websql';
  };

  api._id = toPromise(function (callback) {
    callback(null, instanceId);
  });

  api._info = function (callback) {
    var seq;
    var docCount;
    db.readTransaction(function (tx) {
      getMaxSeq(tx, function (theSeq) {
        seq = theSeq;
      });
      countDocs(tx, function (theDocCount) {
        docCount = theDocCount;
      });
    }, websqlError(callback), function () {
      callback(null, {
        doc_count: docCount,
        update_seq: seq,
        websql_encoding: encoding
      });
    });
  };

  api._bulkDocs = function (req, reqOpts, callback) {
    websqlBulkDocs(opts, req, reqOpts, api, db, websqlChanges, callback);
  };

  function latest$$1(tx, id, rev$$1, callback, finish) {
    var sql = select(
        SELECT_DOCS,
        [DOC_STORE$1, BY_SEQ_STORE$1],
        DOC_STORE_AND_BY_SEQ_JOINER,
        DOC_STORE$1 + '.id=?');
    var sqlArgs = [id];

    tx.executeSql(sql, sqlArgs, function (a, results) {
      if (!results.rows.length) {
        var err = createError(MISSING_DOC, 'missing');
        return finish(err);
      }
      var item = results.rows.item(0);
      var metadata = safeJsonParse(item.metadata);
      callback(latest(rev$$1, metadata));
    });
  }

  api._get = function (id, opts, callback) {
    var doc;
    var metadata;
    var tx = opts.ctx;
    if (!tx) {
      return db.readTransaction(function (txn) {
        api._get(id, $inject_Object_assign({ctx: txn}, opts), callback);
      });
    }

    function finish(err) {
      callback(err, {doc: doc, metadata: metadata, ctx: tx});
    }

    var sql;
    var sqlArgs;

    if (!opts.rev) {
      sql = select(
        SELECT_DOCS,
        [DOC_STORE$1, BY_SEQ_STORE$1],
        DOC_STORE_AND_BY_SEQ_JOINER,
        DOC_STORE$1 + '.id=?');
      sqlArgs = [id];
    } else if (opts.latest) {
      latest$$1(tx, id, opts.rev, function (latestRev) {
        opts.latest = false;
        opts.rev = latestRev;
        api._get(id, opts, callback);
      }, finish);
      return;
    } else {
      sql = select(
        SELECT_DOCS,
        [DOC_STORE$1, BY_SEQ_STORE$1],
        DOC_STORE$1 + '.id=' + BY_SEQ_STORE$1 + '.doc_id',
        [BY_SEQ_STORE$1 + '.doc_id=?', BY_SEQ_STORE$1 + '.rev=?']);
      sqlArgs = [id, opts.rev];
    }

    tx.executeSql(sql, sqlArgs, function (a, results) {
      if (!results.rows.length) {
        var missingErr = createError(MISSING_DOC, 'missing');
        return finish(missingErr);
      }
      var item = results.rows.item(0);
      metadata = safeJsonParse(item.metadata);
      if (item.deleted && !opts.rev) {
        var deletedErr = createError(MISSING_DOC, 'deleted');
        return finish(deletedErr);
      }
      doc = unstringifyDoc(item.data, metadata.id, item.rev);
      finish();
    });
  };

  api._allDocs = function (opts, callback) {
    var results = [];
    var totalRows;

    var start = 'startkey' in opts ? opts.startkey : false;
    var end = 'endkey' in opts ? opts.endkey : false;
    var key = 'key' in opts ? opts.key : false;
    var descending = 'descending' in opts ? opts.descending : false;
    var limit = 'limit' in opts ? opts.limit : -1;
    var offset = 'skip' in opts ? opts.skip : 0;
    var inclusiveEnd = opts.inclusive_end !== false;

    var sqlArgs = [];
    var criteria = [];

    if (key !== false) {
      criteria.push(DOC_STORE$1 + '.id = ?');
      sqlArgs.push(key);
    } else if (start !== false || end !== false) {
      if (start !== false) {
        criteria.push(DOC_STORE$1 + '.id ' + (descending ? '<=' : '>=') + ' ?');
        sqlArgs.push(start);
      }
      if (end !== false) {
        var comparator = descending ? '>' : '<';
        if (inclusiveEnd) {
          comparator += '=';
        }
        criteria.push(DOC_STORE$1 + '.id ' + comparator + ' ?');
        sqlArgs.push(end);
      }
      if (key !== false) {
        criteria.push(DOC_STORE$1 + '.id = ?');
        sqlArgs.push(key);
      }
    }

    if (opts.deleted !== 'ok') {
      // report deleted if keys are specified
      criteria.push(BY_SEQ_STORE$1 + '.deleted = 0');
    }

    db.readTransaction(function (tx) {
      // count the docs in parallel to other operations
      countDocs(tx, function (docCount) {
        totalRows = docCount;
      });

      if (limit === 0) {
        return;
      }

      // do a single query to fetch the documents
      var sql = select(
        SELECT_DOCS,
        [DOC_STORE$1, BY_SEQ_STORE$1],
        DOC_STORE_AND_BY_SEQ_JOINER,
        criteria,
        DOC_STORE$1 + '.id ' + (descending ? 'DESC' : 'ASC')
        );
      sql += ' LIMIT ' + limit + ' OFFSET ' + offset;

      tx.executeSql(sql, sqlArgs, function (tx, result) {
        for (var i = 0, l = result.rows.length; i < l; i++) {
          var item = result.rows.item(i);
          var metadata = safeJsonParse(item.metadata);
          var id = metadata.id;
          var data = unstringifyDoc(item.data, id, item.rev);
          var winningRev$$1 = data._rev;
          var doc = {
            id: id,
            key: id,
            value: {rev: winningRev$$1}
          };
          if (opts.include_docs) {
            doc.doc = data;
            doc.doc._rev = winningRev$$1;
            if (opts.conflicts) {
              var conflicts = collectConflicts(metadata);
              if (conflicts.length) {
                doc.doc._conflicts = conflicts;
              }
            }
            fetchAttachmentsIfNecessary$1(doc.doc, opts, api, tx);
          }
          if (item.deleted) {
            if (opts.deleted === 'ok') {
              doc.value.deleted = true;
              doc.doc = null;
            } else {
              continue;
            }
          }
          results.push(doc);
        }
      });
    }, websqlError(callback), function () {
      callback(null, {
        total_rows: totalRows,
        offset: opts.skip,
        rows: results
      });
    });
  };

  api._changes = function (opts) {
    opts = clone(opts);

    if (opts.continuous) {
      var id = api._name + ':' + uuid();
      websqlChanges.addListener(api._name, id, api, opts);
      websqlChanges.notify(api._name);
      return {
        cancel: function () {
          websqlChanges.removeListener(api._name, id);
        }
      };
    }

    var descending = opts.descending;

    // Ignore the `since` parameter when `descending` is true
    opts.since = opts.since && !descending ? opts.since : 0;

    var limit = 'limit' in opts ? opts.limit : -1;
    if (limit === 0) {
      limit = 1; // per CouchDB _changes spec
    }

    var returnDocs;
    if ('return_docs' in opts) {
      returnDocs = opts.return_docs;
    } else if ('returnDocs' in opts) {
      // TODO: Remove 'returnDocs' in favor of 'return_docs' in a future release
      returnDocs = opts.returnDocs;
    } else {
      returnDocs = true;
    }
    var results = [];
    var numResults = 0;

    function fetchChanges() {

      var selectStmt =
        DOC_STORE$1 + '.json AS metadata, ' +
        DOC_STORE$1 + '.max_seq AS maxSeq, ' +
        BY_SEQ_STORE$1 + '.json AS winningDoc, ' +
        BY_SEQ_STORE$1 + '.rev AS winningRev ';

      var from = DOC_STORE$1 + ' JOIN ' + BY_SEQ_STORE$1;

      var joiner = DOC_STORE$1 + '.id=' + BY_SEQ_STORE$1 + '.doc_id' +
        ' AND ' + DOC_STORE$1 + '.winningseq=' + BY_SEQ_STORE$1 + '.seq';

      var criteria = ['maxSeq > ?'];
      var sqlArgs = [opts.since];

      if (opts.doc_ids) {
        criteria.push(DOC_STORE$1 + '.id IN ' + qMarks(opts.doc_ids.length));
        sqlArgs = sqlArgs.concat(opts.doc_ids);
      }

      var orderBy = 'maxSeq ' + (descending ? 'DESC' : 'ASC');

      var sql = select(selectStmt, from, joiner, criteria, orderBy);

      var filter = filterChange(opts);
      if (!opts.view && !opts.filter) {
        // we can just limit in the query
        sql += ' LIMIT ' + limit;
      }

      var lastSeq = opts.since || 0;
      db.readTransaction(function (tx) {
        tx.executeSql(sql, sqlArgs, function (tx, result) {
          function reportChange(change) {
            return function () {
              opts.onChange(change);
            };
          }
          for (var i = 0, l = result.rows.length; i < l; i++) {
            var item = result.rows.item(i);
            var metadata = safeJsonParse(item.metadata);
            lastSeq = item.maxSeq;

            var doc = unstringifyDoc(item.winningDoc, metadata.id,
              item.winningRev);
            var change = opts.processChange(doc, metadata, opts);
            change.seq = item.maxSeq;

            var filtered = filter(change);
            if (typeof filtered === 'object') {
              return opts.complete(filtered);
            }

            if (filtered) {
              numResults++;
              if (returnDocs) {
                results.push(change);
              }
              // process the attachment immediately
              // for the benefit of live listeners
              if (opts.attachments && opts.include_docs) {
                fetchAttachmentsIfNecessary$1(doc, opts, api, tx,
                  reportChange(change));
              } else {
                reportChange(change)();
              }
            }
            if (numResults === limit) {
              break;
            }
          }
        });
      }, websqlError(opts.complete), function () {
        if (!opts.continuous) {
          opts.complete(null, {
            results: results,
            last_seq: lastSeq
          });
        }
      });
    }

    fetchChanges();
  };

  api._close = function (callback) {
    //WebSQL databases do not need to be closed
    callback();
  };

  api._getAttachment = function (docId, attachId, attachment, opts, callback) {
    var res;
    var tx = opts.ctx;
    var digest = attachment.digest;
    var type = attachment.content_type;
    var sql = 'SELECT escaped, ' +
      'CASE WHEN escaped = 1 THEN body ELSE HEX(body) END AS body FROM ' +
      ATTACH_STORE$1 + ' WHERE digest=?';
    tx.executeSql(sql, [digest], function (tx, result) {
      // websql has a bug where \u0000 causes early truncation in strings
      // and blobs. to work around this, we used to use the hex() function,
      // but that's not performant. after migration 6, we remove \u0000
      // and add it back in afterwards
      var item = result.rows.item(0);
      var data = item.escaped ? unescapeBlob(item.body) :
        parseHexString(item.body, encoding);
      if (opts.binary) {
        res = binStringToBluffer(data, type);
      } else {
        res = thisBtoa(data);
      }
      callback(null, res);
    });
  };

  api._getRevisionTree = function (docId, callback) {
    db.readTransaction(function (tx) {
      var sql = 'SELECT json AS metadata FROM ' + DOC_STORE$1 + ' WHERE id = ?';
      tx.executeSql(sql, [docId], function (tx, result) {
        if (!result.rows.length) {
          callback(createError(MISSING_DOC));
        } else {
          var data = safeJsonParse(result.rows.item(0).metadata);
          callback(null, data.rev_tree);
        }
      });
    });
  };

  api._doCompaction = function (docId, revs, callback) {
    if (!revs.length) {
      return callback();
    }
    db.transaction(function (tx) {

      // update doc store
      var sql = 'SELECT json AS metadata FROM ' + DOC_STORE$1 + ' WHERE id = ?';
      tx.executeSql(sql, [docId], function (tx, result) {
        var metadata = safeJsonParse(result.rows.item(0).metadata);
        traverseRevTree(metadata.rev_tree, function (isLeaf, pos,
                                                           revHash, ctx, opts) {
          var rev$$1 = pos + '-' + revHash;
          if (revs.indexOf(rev$$1) !== -1) {
            opts.status = 'missing';
          }
        });

        var sql = 'UPDATE ' + DOC_STORE$1 + ' SET json = ? WHERE id = ?';
        tx.executeSql(sql, [safeJsonStringify(metadata), docId]);
      });

      compactRevs$1(revs, docId, tx);
    }, websqlError(callback), function () {
      callback();
    });
  };

  api._getLocal = function (id, callback) {
    db.readTransaction(function (tx) {
      var sql = 'SELECT json, rev FROM ' + LOCAL_STORE$1 + ' WHERE id=?';
      tx.executeSql(sql, [id], function (tx, res) {
        if (res.rows.length) {
          var item = res.rows.item(0);
          var doc = unstringifyDoc(item.json, id, item.rev);
          callback(null, doc);
        } else {
          callback(createError(MISSING_DOC));
        }
      });
    });
  };

  api._putLocal = function (doc, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    delete doc._revisions; // ignore this, trust the rev
    var oldRev = doc._rev;
    var id = doc._id;
    var newRev;
    if (!oldRev) {
      newRev = doc._rev = '0-1';
    } else {
      newRev = doc._rev = '0-' + (parseInt(oldRev.split('-')[1], 10) + 1);
    }
    var json = stringifyDoc(doc);

    var ret;
    function putLocal(tx) {
      var sql;
      var values;
      if (oldRev) {
        sql = 'UPDATE ' + LOCAL_STORE$1 + ' SET rev=?, json=? ' +
          'WHERE id=? AND rev=?';
        values = [newRev, json, id, oldRev];
      } else {
        sql = 'INSERT INTO ' + LOCAL_STORE$1 + ' (id, rev, json) VALUES (?,?,?)';
        values = [id, newRev, json];
      }
      tx.executeSql(sql, values, function (tx, res) {
        if (res.rowsAffected) {
          ret = {ok: true, id: id, rev: newRev};
          if (opts.ctx) { // return immediately
            callback(null, ret);
          }
        } else {
          callback(createError(REV_CONFLICT));
        }
      }, function () {
        callback(createError(REV_CONFLICT));
        return false; // ack that we handled the error
      });
    }

    if (opts.ctx) {
      putLocal(opts.ctx);
    } else {
      db.transaction(putLocal, websqlError(callback), function () {
        if (ret) {
          callback(null, ret);
        }
      });
    }
  };

  api._removeLocal = function (doc, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    var ret;

    function removeLocal(tx) {
      var sql = 'DELETE FROM ' + LOCAL_STORE$1 + ' WHERE id=? AND rev=?';
      var params = [doc._id, doc._rev];
      tx.executeSql(sql, params, function (tx, res) {
        if (!res.rowsAffected) {
          return callback(createError(MISSING_DOC));
        }
        ret = {ok: true, id: doc._id, rev: '0-0'};
        if (opts.ctx) { // return immediately
          callback(null, ret);
        }
      });
    }

    if (opts.ctx) {
      removeLocal(opts.ctx);
    } else {
      db.transaction(removeLocal, websqlError(callback), function () {
        if (ret) {
          callback(null, ret);
        }
      });
    }
  };

  api._destroy = function (opts, callback) {
    websqlChanges.removeAllListeners(api._name);
    db.transaction(function (tx) {
      var stores = [DOC_STORE$1, BY_SEQ_STORE$1, ATTACH_STORE$1, META_STORE$1,
        LOCAL_STORE$1, ATTACH_AND_SEQ_STORE$1];
      stores.forEach(function (store) {
        tx.executeSql('DROP TABLE IF EXISTS ' + store, []);
      });
    }, websqlError(callback), function () {
      if (hasLocalStorage()) {
        delete window.localStorage['_pouch__websqldb_' + api._name];
        delete window.localStorage[api._name];
      }
      callback(null, {'ok': true});
    });
  };
}

function canOpenTestDB() {
  try {
    openDatabase('_pouch_validate_websql', 1, '', 1);
    return true;
  } catch (err) {
    return false;
  }
}

// WKWebView had a bug where WebSQL would throw a DOM Exception 18
// (see https://bugs.webkit.org/show_bug.cgi?id=137760 and
// https://github.com/pouchdb/pouchdb/issues/5079)
// This has been fixed in latest WebKit, so we try to detect it here.
function isValidWebSQL() {
  // WKWebView UA:
  //   Mozilla/5.0 (iPhone; CPU iPhone OS 9_2 like Mac OS X)
  //   AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13C75
  // Chrome for iOS UA:
  //   Mozilla/5.0 (iPhone; U; CPU iPhone OS 5_1_1 like Mac OS X; en)
  //   AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60
  //   Mobile/9B206 Safari/7534.48.3
  // Firefox for iOS UA:
  //   Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4
  //   (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4

  // indexedDB is null on some UIWebViews and undefined in others
  // see: https://bugs.webkit.org/show_bug.cgi?id=137034
  if (typeof indexedDB === 'undefined' || indexedDB === null ||
      !/iP(hone|od|ad)/.test(navigator.userAgent)) {
    // definitely not WKWebView, avoid creating an unnecessary database
    return true;
  }
  // Cache the result in LocalStorage. Reason we do this is because if we
  // call openDatabase() too many times, Safari craps out in SauceLabs and
  // starts throwing DOM Exception 14s.
  var hasLS = hasLocalStorage();
  // Include user agent in the hash, so that if Safari is upgraded, we don't
  // continually think it's broken.
  var localStorageKey = '_pouch__websqldb_valid_' + navigator.userAgent;
  if (hasLS && localStorage[localStorageKey]) {
    return localStorage[localStorageKey] === '1';
  }
  var openedTestDB = canOpenTestDB();
  if (hasLS) {
    localStorage[localStorageKey] = openedTestDB ? '1' : '0';
  }
  return openedTestDB;
}

function valid() {
  if (typeof openDatabase !== 'function') {
    return false;
  }
  return isValidWebSQL();
}

function openDB(name, version, description, size) {
  // Traditional WebSQL API
  return openDatabase(name, version, description, size);
}

function WebSQLPouch(opts, callback) {
  var _opts = $inject_Object_assign({
    websql: openDB
  }, opts);

  WebSqlPouch$1.call(this, _opts, callback);
}

WebSQLPouch.valid = valid;

WebSQLPouch.use_prefix = true;

var WebSqlPouch = function (PouchDB) {
  PouchDB.adapter('websql', WebSQLPouch, true);
};

/* global fetch */
/* global Headers */
function wrappedFetch() {
  var wrappedPromise = {};

  var promise = new PouchPromise$1(function (resolve, reject) {
    wrappedPromise.resolve = resolve;
    wrappedPromise.reject = reject;
  });

  var args = new Array(arguments.length);

  for (var i = 0; i < args.length; i++) {
    args[i] = arguments[i];
  }

  wrappedPromise.promise = promise;

  PouchPromise$1.resolve().then(function () {
    return fetch.apply(null, args);
  }).then(function (response) {
    wrappedPromise.resolve(response);
  }).catch(function (error) {
    wrappedPromise.reject(error);
  });

  return wrappedPromise;
}

function fetchRequest(options, callback) {
  var wrappedPromise, timer, response;

  var headers = new Headers();

  var fetchOptions = {
    method: options.method,
    credentials: 'include',
    headers: headers
  };

  if (options.json) {
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', options.headers['Content-Type'] ||
      'application/json');
  }

  if (options.body &&
      options.processData &&
      typeof options.body !== 'string') {
    fetchOptions.body = JSON.stringify(options.body);
  } else if ('body' in options) {
    fetchOptions.body = options.body;
  } else {
    fetchOptions.body = null;
  }

  Object.keys(options.headers).forEach(function (key) {
    if (options.headers.hasOwnProperty(key)) {
      headers.set(key, options.headers[key]);
    }
  });

  wrappedPromise = wrappedFetch(options.url, fetchOptions);

  if (options.timeout > 0) {
    timer = setTimeout(function () {
      wrappedPromise.reject(new Error('Load timeout for resource: ' +
        options.url));
    }, options.timeout);
  }

  wrappedPromise.promise.then(function (fetchResponse) {
    response = {
      statusCode: fetchResponse.status
    };

    if (options.timeout > 0) {
      clearTimeout(timer);
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return options.binary ? fetchResponse.blob() : fetchResponse.text();
    }

    return fetchResponse.json();
  }).then(function (result) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      callback(null, response, result);
    } else {
      result.status = response.statusCode;
      callback(result);
    }
  }).catch(function (error) {
    if (!error) {
      // this happens when the listener is canceled
      error = new Error('canceled');
    }
    callback(error);
  });

  return {abort: wrappedPromise.reject};
}

function xhRequest(options, callback) {

  var xhr, timer;
  var timedout = false;

  var abortReq = function () {
    xhr.abort();
    cleanUp();
  };

  var timeoutReq = function () {
    timedout = true;
    xhr.abort();
    cleanUp();
  };

  var ret = {abort: abortReq};

  var cleanUp = function () {
    clearTimeout(timer);
    ret.abort = function () {};
    if (xhr) {
      xhr.onprogress = undefined;
      if (xhr.upload) {
        xhr.upload.onprogress = undefined;
      }
      xhr.onreadystatechange = undefined;
      xhr = undefined;
    }
  };

  if (options.xhr) {
    xhr = new options.xhr();
  } else {
    xhr = new XMLHttpRequest();
  }

  try {
    xhr.open(options.method, options.url);
  } catch (exception) {
    return callback(new Error(exception.name || 'Url is invalid'));
  }

  xhr.withCredentials = ('withCredentials' in options) ?
    options.withCredentials : true;

  if (options.method === 'GET') {
    delete options.headers['Content-Type'];
  } else if (options.json) {
    options.headers.Accept = 'application/json';
    options.headers['Content-Type'] = options.headers['Content-Type'] ||
      'application/json';
    if (options.body &&
        options.processData &&
        typeof options.body !== "string") {
      options.body = JSON.stringify(options.body);
    }
  }

  if (options.binary) {
    xhr.responseType = 'arraybuffer';
  }

  if (!('body' in options)) {
    options.body = null;
  }

  for (var key in options.headers) {
    if (options.headers.hasOwnProperty(key)) {
      xhr.setRequestHeader(key, options.headers[key]);
    }
  }

  if (options.timeout > 0) {
    timer = setTimeout(timeoutReq, options.timeout);
    xhr.onprogress = function () {
      clearTimeout(timer);
      if (xhr.readyState !== 4) {
        timer = setTimeout(timeoutReq, options.timeout);
      }
    };
    if (typeof xhr.upload !== 'undefined') { // does not exist in ie9
      xhr.upload.onprogress = xhr.onprogress;
    }
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) {
      return;
    }

    var response = {
      statusCode: xhr.status
    };

    if (xhr.status >= 200 && xhr.status < 300) {
      var data;
      if (options.binary) {
        data = createBlob([xhr.response || ''], {
          type: xhr.getResponseHeader('Content-Type')
        });
      } else {
        data = xhr.responseText;
      }
      callback(null, response, data);
    } else {
      var err = {};
      if (timedout) {
        err = new Error('ETIMEDOUT');
        err.code = 'ETIMEDOUT';
      } else if (typeof xhr.response === 'string') {
        try {
          err = JSON.parse(xhr.response);
        } catch (e) {}
      }
      err.status = xhr.status;
      callback(err);
    }
    cleanUp();
  };

  if (options.body && (options.body instanceof Blob)) {
    readAsArrayBuffer(options.body, function (arrayBuffer) {
      xhr.send(arrayBuffer);
    });
  } else {
    xhr.send(options.body);
  }

  return ret;
}

function testXhr() {
  try {
    new XMLHttpRequest();
    return true;
  } catch (err) {
    return false;
  }
}

var hasXhr = testXhr();

function ajax$1(options, callback) {
  if (!false && (hasXhr || options.xhr)) {
    return xhRequest(options, callback);
  } else {
    return fetchRequest(options, callback);
  }
}

// the blob already has a type; do nothing
var res$2 = function () {};

function defaultBody() {
  return '';
}

function ajaxCore$1(options, callback) {

  options = clone(options);

  var defaultOptions = {
    method : "GET",
    headers: {},
    json: true,
    processData: true,
    timeout: 10000,
    cache: false
  };

  options = $inject_Object_assign(defaultOptions, options);

  function onSuccess(obj, resp, cb) {
    if (!options.binary && options.json && typeof obj === 'string') {
      /* istanbul ignore next */
      try {
        obj = JSON.parse(obj);
      } catch (e) {
        // Probably a malformed JSON from server
        return cb(e);
      }
    }
    if (Array.isArray(obj)) {
      obj = obj.map(function (v) {
        if (v.error || v.missing) {
          return generateErrorFromResponse(v);
        } else {
          return v;
        }
      });
    }
    if (options.binary) {
      res$2(obj, resp);
    }
    cb(null, obj, resp);
  }

  if (options.json) {
    if (!options.binary) {
      options.headers.Accept = 'application/json';
    }
    options.headers['Content-Type'] = options.headers['Content-Type'] ||
      'application/json';
  }

  if (options.binary) {
    options.encoding = null;
    options.json = false;
  }

  if (!options.processData) {
    options.json = false;
  }

  return ajax$1(options, function (err, response, body) {

    if (err) {
      return callback(generateErrorFromResponse(err));
    }

    var error;
    var content_type = response.headers && response.headers['content-type'];
    var data = body || defaultBody();

    // CouchDB doesn't always return the right content-type for JSON data, so
    // we check for ^{ and }$ (ignoring leading/trailing whitespace)
    if (!options.binary && (options.json || !options.processData) &&
        typeof data !== 'object' &&
        (/json/.test(content_type) ||
         (/^[\s]*\{/.test(data) && /\}[\s]*$/.test(data)))) {
      try {
        data = JSON.parse(data.toString());
      } catch (e) {}
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      onSuccess(data, response, callback);
    } else {
      error = generateErrorFromResponse(data);
      error.status = response.statusCode;
      callback(error);
    }
  });
}

function ajax(opts, callback) {

  // cache-buster, specifically designed to work around IE's aggressive caching
  // see http://www.dashbay.com/2011/05/internet-explorer-caches-ajax/
  // Also Safari caches POSTs, so we need to cache-bust those too.
  var ua = (navigator && navigator.userAgent) ?
    navigator.userAgent.toLowerCase() : '';

  var isSafari = ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1;
  var isIE = ua.indexOf('msie') !== -1;
  var isEdge = ua.indexOf('edge') !== -1;

  // it appears the new version of safari also caches GETs,
  // see https://github.com/pouchdb/pouchdb/issues/5010
  var shouldCacheBust = (isSafari ||
    ((isIE || isEdge) && opts.method === 'GET'));

  var cache = 'cache' in opts ? opts.cache : true;

  var isBlobUrl = /^blob:/.test(opts.url); // don't append nonces for blob URLs

  if (!isBlobUrl && (shouldCacheBust || !cache)) {
    var hasArgs = opts.url.indexOf('?') !== -1;
    opts.url += (hasArgs ? '&' : '?') + '_nonce=' + Date.now();
  }

  return ajaxCore$1(opts, callback);
}

// dead simple promise pool, inspired by https://github.com/timdp/es6-promise-pool
// but much smaller in code size. limits the number of concurrent promises that are executed


function pool(promiseFactories, limit) {
  return new PouchPromise$1(function (resolve, reject) {
    var running = 0;
    var current = 0;
    var done = 0;
    var len = promiseFactories.length;
    var err;

    function runNext() {
      running++;
      promiseFactories[current++]().then(onSuccess, onError);
    }

    function doNext() {
      if (++done === len) {
        /* istanbul ignore if */
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      } else {
        runNextBatch();
      }
    }

    function onSuccess() {
      running--;
      doNext();
    }

    /* istanbul ignore next */
    function onError(thisErr) {
      running--;
      err = err || thisErr;
      doNext();
    }

    function runNextBatch() {
      while (running < limit && current < len) {
        runNext();
      }
    }

    runNextBatch();
  });
}

var CHANGES_BATCH_SIZE = 25;
var MAX_SIMULTANEOUS_REVS = 50;
var CHANGES_TIMEOUT_BUFFER = 5000;
var DEFAULT_HEARTBEAT = 10000;

var supportsBulkGetMap = {};

function readAttachmentsAsBlobOrBuffer(row) {
  var atts = row.doc && row.doc._attachments;
  if (!atts) {
    return;
  }
  Object.keys(atts).forEach(function (filename) {
    var att = atts[filename];
    att.data = b64ToBluffer(att.data, att.content_type);
  });
}

function encodeDocId(id) {
  if (/^_design/.test(id)) {
    return '_design/' + encodeURIComponent(id.slice(8));
  }
  if (/^_local/.test(id)) {
    return '_local/' + encodeURIComponent(id.slice(7));
  }
  return encodeURIComponent(id);
}

function preprocessAttachments$2(doc) {
  if (!doc._attachments || !Object.keys(doc._attachments)) {
    return PouchPromise$1.resolve();
  }

  return PouchPromise$1.all(Object.keys(doc._attachments).map(function (key) {
    var attachment = doc._attachments[key];
    if (attachment.data && typeof attachment.data !== 'string') {
      return new PouchPromise$1(function (resolve) {
        blobToBase64(attachment.data, resolve);
      }).then(function (b64) {
        attachment.data = b64;
      });
    }
  }));
}

function hasUrlPrefix(opts) {
  if (!opts.prefix) {
    return false;
  }

  var protocol = parseUri(opts.prefix).protocol;

  return protocol === 'http' || protocol === 'https';
}

// Get all the information you possibly can about the URI given by name and
// return it as a suitable object.
function getHost(name, opts) {

  // encode db name if opts.prefix is a url (#5574)
  if (hasUrlPrefix(opts)) {
    var dbName = opts.name.substr(opts.prefix.length);
    name = opts.prefix + encodeURIComponent(dbName);
  }

  // Prase the URI into all its little bits
  var uri = parseUri(name);

  // Store the user and password as a separate auth object
  if (uri.user || uri.password) {
    uri.auth = {username: uri.user, password: uri.password};
  }

  // Split the path part of the URI into parts using '/' as the delimiter
  // after removing any leading '/' and any trailing '/'
  var parts = uri.path.replace(/(^\/|\/$)/g, '').split('/');

  // Store the first part as the database name and remove it from the parts
  // array
  uri.db = parts.pop();
  // Prevent double encoding of URI component
  if (uri.db.indexOf('%') === -1) {
    uri.db = encodeURIComponent(uri.db);
  }

  // Restore the path by joining all the remaining parts (all the parts
  // except for the database name) with '/'s
  uri.path = parts.join('/');

  return uri;
}

// Generate a URL with the host data given by opts and the given path
function genDBUrl(opts, path) {
  return genUrl(opts, opts.db + '/' + path);
}

// Generate a URL with the host data given by opts and the given path
function genUrl(opts, path) {
  // If the host already has a path, then we need to have a path delimiter
  // Otherwise, the path delimiter is the empty string
  var pathDel = !opts.path ? '' : '/';

  // If the host already has a path, then we need to have a path delimiter
  // Otherwise, the path delimiter is the empty string
  return opts.protocol + '://' + opts.host +
         (opts.port ? (':' + opts.port) : '') +
         '/' + opts.path + pathDel + path;
}

function paramsToStr(params) {
  return '?' + Object.keys(params).map(function (k) {
    return k + '=' + encodeURIComponent(params[k]);
  }).join('&');
}

// Implements the PouchDB API for dealing with CouchDB instances over HTTP
function HttpPouch(opts, callback) {

  // The functions that will be publicly available for HttpPouch
  var api = this;

  var host = getHost(opts.name, opts);
  var dbUrl = genDBUrl(host, '');

  opts = clone(opts);
  var ajaxOpts = opts.ajax || {};

  if (opts.auth || host.auth) {
    var nAuth = opts.auth || host.auth;
    var str = nAuth.username + ':' + nAuth.password;
    var token = thisBtoa(unescape(encodeURIComponent(str)));
    ajaxOpts.headers = ajaxOpts.headers || {};
    ajaxOpts.headers.Authorization = 'Basic ' + token;
  }

  // Not strictly necessary, but we do this because numerous tests
  // rely on swapping ajax in and out.
  api._ajax = ajax;

  function ajax$$1(userOpts, options, callback) {
    var reqAjax = userOpts.ajax || {};
    var reqOpts = $inject_Object_assign(clone(ajaxOpts), reqAjax, options);
    var defaultHeaders = clone(ajaxOpts.headers || {});
    reqOpts.headers = $inject_Object_assign(defaultHeaders, reqAjax.headers,
      options.headers || {});
    /* istanbul ignore if */
    if (api.constructor.listeners('debug').length) {
      api.constructor.emit('debug', ['http', reqOpts.method, reqOpts.url]);
    }
    return api._ajax(reqOpts, callback);
  }

  function ajaxPromise(userOpts, opts) {
    return new PouchPromise$1(function (resolve, reject) {
      ajax$$1(userOpts, opts, function (err, res) {
        /* istanbul ignore if */
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  }

  function adapterFun$$1(name, fun) {
    return adapterFun(name, getArguments(function (args) {
      setup().then(function () {
        return fun.apply(this, args);
      }).catch(function (e) {
        var callback = args.pop();
        callback(e);
      });
    }));
  }

  var setupPromise;

  function setup() {
    // TODO: Remove `skipSetup` in favor of `skip_setup` in a future release
    if (opts.skipSetup || opts.skip_setup) {
      return PouchPromise$1.resolve();
    }

    // If there is a setup in process or previous successful setup
    // done then we will use that
    // If previous setups have been rejected we will try again
    if (setupPromise) {
      return setupPromise;
    }

    var checkExists = {method: 'GET', url: dbUrl};
    setupPromise = ajaxPromise({}, checkExists).catch(function (err) {
      if (err && err.status && err.status === 404) {
        // Doesnt exist, create it
        explainError(404, 'PouchDB is just detecting if the remote exists.');
        return ajaxPromise({}, {method: 'PUT', url: dbUrl});
      } else {
        return PouchPromise$1.reject(err);
      }
    }).catch(function (err) {
      // If we try to create a database that already exists, skipped in
      // istanbul since its catching a race condition.
      /* istanbul ignore if */
      if (err && err.status && err.status === 412) {
        return true;
      }
      return PouchPromise$1.reject(err);
    });

    setupPromise.catch(function () {
      setupPromise = null;
    });

    return setupPromise;
  }

  nextTick(function () {
    callback(null, api);
  });

  api._remote = true;
  /* istanbul ignore next */
  api.type = function () {
    return 'http';
  };

  api.id = adapterFun$$1('id', function (callback) {
    ajax$$1({}, {method: 'GET', url: genUrl(host, '')}, function (err, result) {
      var uuid$$1 = (result && result.uuid) ?
        (result.uuid + host.db) : genDBUrl(host, '');
      callback(null, uuid$$1);
    });
  });

  api.request = adapterFun$$1('request', function (options, callback) {
    options.url = genDBUrl(host, options.url);
    ajax$$1({}, options, callback);
  });

  // Sends a POST request to the host calling the couchdb _compact function
  //    version: The version of CouchDB it is running
  api.compact = adapterFun$$1('compact', function (opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    opts = clone(opts);
    ajax$$1(opts, {
      url: genDBUrl(host, '_compact'),
      method: 'POST'
    }, function () {
      function ping() {
        api.info(function (err, res) {
          // CouchDB may send a "compact_running:true" if it's
          // already compacting. PouchDB Server doesn't.
          /* istanbul ignore else */
          if (res && !res.compact_running) {
            callback(null, {ok: true});
          } else {
            setTimeout(ping, opts.interval || 200);
          }
        });
      }
      // Ping the http if it's finished compaction
      ping();
    });
  });

  api.bulkGet = adapterFun('bulkGet', function (opts, callback) {
    var self = this;

    function doBulkGet(cb) {
      var params = {};
      if (opts.revs) {
        params.revs = true;
      }
      if (opts.attachments) {
        /* istanbul ignore next */
        params.attachments = true;
      }
      if (opts.latest) {
        params.latest = true;
      }
      ajax$$1(opts, {
        url: genDBUrl(host, '_bulk_get' + paramsToStr(params)),
        method: 'POST',
        body: { docs: opts.docs}
      }, cb);
    }

    /* istanbul ignore next */
    function doBulkGetShim() {
      // avoid "url too long error" by splitting up into multiple requests
      var batchSize = MAX_SIMULTANEOUS_REVS;
      var numBatches = Math.ceil(opts.docs.length / batchSize);
      var numDone = 0;
      var results = new Array(numBatches);

      function onResult(batchNum) {
        return function (err, res) {
          // err is impossible because shim returns a list of errs in that case
          results[batchNum] = res.results;
          if (++numDone === numBatches) {
            callback(null, {results: flatten(results)});
          }
        };
      }

      for (var i = 0; i < numBatches; i++) {
        var subOpts = pick(opts, ['revs', 'attachments', 'latest']);
        subOpts.ajax = ajaxOpts;
        subOpts.docs = opts.docs.slice(i * batchSize,
          Math.min(opts.docs.length, (i + 1) * batchSize));
        bulkGet(self, subOpts, onResult(i));
      }
    }

    // mark the whole database as either supporting or not supporting _bulk_get
    var dbUrl = genUrl(host, '');
    var supportsBulkGet = supportsBulkGetMap[dbUrl];

    /* istanbul ignore next */
    if (typeof supportsBulkGet !== 'boolean') {
      // check if this database supports _bulk_get
      doBulkGet(function (err, res) {
        if (err) {
          supportsBulkGetMap[dbUrl] = false;
          explainError(
            err.status,
            'PouchDB is just detecting if the remote ' +
            'supports the _bulk_get API.'
          );
          doBulkGetShim();
        } else {
          supportsBulkGetMap[dbUrl] = true;
          callback(null, res);
        }
      });
    } else if (supportsBulkGet) {
      doBulkGet(callback);
    } else {
      doBulkGetShim();
    }
  });

  // Calls GET on the host, which gets back a JSON string containing
  //    couchdb: A welcome string
  //    version: The version of CouchDB it is running
  api._info = function (callback) {
    setup().then(function () {
      ajax$$1({}, {
        method: 'GET',
        url: genDBUrl(host, '')
      }, function (err, res) {
        /* istanbul ignore next */
        if (err) {
        return callback(err);
        }
        res.host = genDBUrl(host, '');
        callback(null, res);
      });
    }).catch(callback);
  };

  // Get the document with the given id from the database given by host.
  // The id could be solely the _id in the database, or it may be a
  // _design/ID or _local/ID path
  api.get = adapterFun$$1('get', function (id, opts, callback) {
    // If no options were given, set the callback to the second parameter
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    opts = clone(opts);

    // List of parameters to add to the GET request
    var params = {};

    if (opts.revs) {
      params.revs = true;
    }

    if (opts.revs_info) {
      params.revs_info = true;
    }

    if (opts.latest) {
      params.latest = true;
    }

    if (opts.open_revs) {
      if (opts.open_revs !== "all") {
        opts.open_revs = JSON.stringify(opts.open_revs);
      }
      params.open_revs = opts.open_revs;
    }

    if (opts.rev) {
      params.rev = opts.rev;
    }

    if (opts.conflicts) {
      params.conflicts = opts.conflicts;
    }

    id = encodeDocId(id);

    // Set the options for the ajax call
    var options = {
      method: 'GET',
      url: genDBUrl(host, id + paramsToStr(params))
    };

    function fetchAttachments(doc) {
      var atts = doc._attachments;
      var filenames = atts && Object.keys(atts);
      if (!atts || !filenames.length) {
        return;
      }
      // we fetch these manually in separate XHRs, because
      // Sync Gateway would normally send it back as multipart/mixed,
      // which we cannot parse. Also, this is more efficient than
      // receiving attachments as base64-encoded strings.
      function fetch(filename) {
        var att = atts[filename];
        var path = encodeDocId(doc._id) + '/' + encodeAttachmentId(filename) +
          '?rev=' + doc._rev;
        return ajaxPromise(opts, {
          method: 'GET',
          url: genDBUrl(host, path),
          binary: true
        }).then(function (blob) {
          if (opts.binary) {
            return blob;
          }
          return new PouchPromise$1(function (resolve) {
            blobToBase64(blob, resolve);
          });
        }).then(function (data) {
          delete att.stub;
          delete att.length;
          att.data = data;
        });
      }

      var promiseFactories = filenames.map(function (filename) {
        return function () {
          return fetch(filename);
        };
      });

      // This limits the number of parallel xhr requests to 5 any time
      // to avoid issues with maximum browser request limits
      return pool(promiseFactories, 5);
    }

    function fetchAllAttachments(docOrDocs) {
      if (Array.isArray(docOrDocs)) {
        return PouchPromise$1.all(docOrDocs.map(function (doc) {
          if (doc.ok) {
            return fetchAttachments(doc.ok);
          }
        }));
      }
      return fetchAttachments(docOrDocs);
    }

    ajaxPromise(opts, options).then(function (res) {
      return PouchPromise$1.resolve().then(function () {
        if (opts.attachments) {
          return fetchAllAttachments(res);
        }
      }).then(function () {
        callback(null, res);
      });
    }).catch(function (e) {
      e.docId = id;
      callback(e);
    });
  });

  // Delete the document given by doc from the database given by host.
  api.remove = adapterFun$$1('remove',
      function (docOrId, optsOrRev, opts, callback) {
    var doc;
    if (typeof optsOrRev === 'string') {
      // id, rev, opts, callback style
      doc = {
        _id: docOrId,
        _rev: optsOrRev
      };
      if (typeof opts === 'function') {
        callback = opts;
        opts = {};
      }
    } else {
      // doc, opts, callback style
      doc = docOrId;
      if (typeof optsOrRev === 'function') {
        callback = optsOrRev;
        opts = {};
      } else {
        callback = opts;
        opts = optsOrRev;
      }
    }

    var rev$$1 = (doc._rev || opts.rev);

    // Delete the document
    ajax$$1(opts, {
      method: 'DELETE',
      url: genDBUrl(host, encodeDocId(doc._id)) + '?rev=' + rev$$1
    }, callback);
  });

  function encodeAttachmentId(attachmentId) {
    return attachmentId.split("/").map(encodeURIComponent).join("/");
  }

  // Get the attachment
  api.getAttachment =
    adapterFun$$1('getAttachment', function (docId, attachmentId, opts,
                                                callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    var params = opts.rev ? ('?rev=' + opts.rev) : '';
    var url = genDBUrl(host, encodeDocId(docId)) + '/' +
      encodeAttachmentId(attachmentId) + params;
    ajax$$1(opts, {
      method: 'GET',
      url: url,
      binary: true
    }, callback);
  });

  // Remove the attachment given by the id and rev
  api.removeAttachment =
    adapterFun$$1('removeAttachment', function (docId, attachmentId, rev$$1,
                                                   callback) {

    var url = genDBUrl(host, encodeDocId(docId) + '/' +
      encodeAttachmentId(attachmentId)) + '?rev=' + rev$$1;

    ajax$$1({}, {
      method: 'DELETE',
      url: url
    }, callback);
  });

  // Add the attachment given by blob and its contentType property
  // to the document with the given id, the revision given by rev, and
  // add it to the database given by host.
  api.putAttachment =
    adapterFun$$1('putAttachment', function (docId, attachmentId, rev$$1, blob,
                                                type, callback) {
    if (typeof type === 'function') {
      callback = type;
      type = blob;
      blob = rev$$1;
      rev$$1 = null;
    }
    var id = encodeDocId(docId) + '/' + encodeAttachmentId(attachmentId);
    var url = genDBUrl(host, id);
    if (rev$$1) {
      url += '?rev=' + rev$$1;
    }

    if (typeof blob === 'string') {
      // input is assumed to be a base64 string
      var binary;
      try {
        binary = thisAtob(blob);
      } catch (err) {
        return callback(createError(BAD_ARG,
                        'Attachment is not a valid base64 string'));
      }
      blob = binary ? binStringToBluffer(binary, type) : '';
    }

    var opts = {
      headers: {'Content-Type': type},
      method: 'PUT',
      url: url,
      processData: false,
      body: blob,
      timeout: ajaxOpts.timeout || 60000
    };
    // Add the attachment
    ajax$$1({}, opts, callback);
  });

  // Update/create multiple documents given by req in the database
  // given by host.
  api._bulkDocs = function (req, opts, callback) {
    // If new_edits=false then it prevents the database from creating
    // new revision numbers for the documents. Instead it just uses
    // the old ones. This is used in database replication.
    req.new_edits = opts.new_edits;

    setup().then(function () {
      return PouchPromise$1.all(req.docs.map(preprocessAttachments$2));
    }).then(function () {
      // Update/create the documents
      ajax$$1(opts, {
        method: 'POST',
        url: genDBUrl(host, '_bulk_docs'),
        timeout: opts.timeout,
        body: req
      }, function (err, results) {
        if (err) {
          return callback(err);
        }
        results.forEach(function (result) {
          result.ok = true; // smooths out cloudant not adding this
        });
        callback(null, results);
      });
    }).catch(callback);
  };


  // Update/create document
  api._put = function (doc, opts, callback) {
    setup().then(function () {
      return preprocessAttachments$2(doc);
    }).then(function () {
      // Update/create the document
      ajax$$1(opts, {
        method: 'PUT',
        url: genDBUrl(host, encodeDocId(doc._id)),
        body: doc
      }, function (err, result) {
        if (err) {
          err.docId = doc && doc._id;
          return callback(err);
        }
        callback(null, result);
      });
    }).catch(callback);
  };


  // Get a listing of the documents in the database given
  // by host and ordered by increasing id.
  api.allDocs = adapterFun$$1('allDocs', function (opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    opts = clone(opts);

    // List of parameters to add to the GET request
    var params = {};
    var body;
    var method = 'GET';

    if (opts.conflicts) {
      params.conflicts = true;
    }

    if (opts.descending) {
      params.descending = true;
    }

    if (opts.include_docs) {
      params.include_docs = true;
    }

    // added in CouchDB 1.6.0
    if (opts.attachments) {
      params.attachments = true;
    }

    if (opts.key) {
      params.key = JSON.stringify(opts.key);
    }

    if (opts.start_key) {
      opts.startkey = opts.start_key;
    }

    if (opts.startkey) {
      params.startkey = JSON.stringify(opts.startkey);
    }

    if (opts.end_key) {
      opts.endkey = opts.end_key;
    }

    if (opts.endkey) {
      params.endkey = JSON.stringify(opts.endkey);
    }

    if (typeof opts.inclusive_end !== 'undefined') {
      params.inclusive_end = !!opts.inclusive_end;
    }

    if (typeof opts.limit !== 'undefined') {
      params.limit = opts.limit;
    }

    if (typeof opts.skip !== 'undefined') {
      params.skip = opts.skip;
    }

    var paramStr = paramsToStr(params);

    if (typeof opts.keys !== 'undefined') {
      method = 'POST';
      body = {keys: opts.keys};
    }

    // Get the document listing
    ajaxPromise(opts, {
      method: method,
      url: genDBUrl(host, '_all_docs' + paramStr),
      body: body
    }).then(function (res) {
      if (opts.include_docs && opts.attachments && opts.binary) {
        res.rows.forEach(readAttachmentsAsBlobOrBuffer);
      }
      callback(null, res);
    }).catch(callback);
  });

  // Get a list of changes made to documents in the database given by host.
  // TODO According to the README, there should be two other methods here,
  // api.changes.addListener and api.changes.removeListener.
  api._changes = function (opts) {

    // We internally page the results of a changes request, this means
    // if there is a large set of changes to be returned we can start
    // processing them quicker instead of waiting on the entire
    // set of changes to return and attempting to process them at once
    var batchSize = 'batch_size' in opts ? opts.batch_size : CHANGES_BATCH_SIZE;

    opts = clone(opts);

    if (opts.continuous && !('heartbeat' in opts)) {
      opts.heartbeat = DEFAULT_HEARTBEAT;
    }

    var requestTimeout = ('timeout' in opts) ? opts.timeout :
      ('timeout' in ajaxOpts) ? ajaxOpts.timeout :
      30 * 1000;

    // ensure CHANGES_TIMEOUT_BUFFER applies
    if ('timeout' in opts && opts.timeout &&
      (requestTimeout - opts.timeout) < CHANGES_TIMEOUT_BUFFER) {
        requestTimeout = opts.timeout + CHANGES_TIMEOUT_BUFFER;
    }

    if ('heartbeat' in opts && opts.heartbeat &&
       (requestTimeout - opts.heartbeat) < CHANGES_TIMEOUT_BUFFER) {
        requestTimeout = opts.heartbeat + CHANGES_TIMEOUT_BUFFER;
    }

    var params = {};
    if ('timeout' in opts && opts.timeout) {
      params.timeout = opts.timeout;
    }

    var limit = (typeof opts.limit !== 'undefined') ? opts.limit : false;
    var returnDocs;
    if ('return_docs' in opts) {
      returnDocs = opts.return_docs;
    } else if ('returnDocs' in opts) {
      // TODO: Remove 'returnDocs' in favor of 'return_docs' in a future release
      returnDocs = opts.returnDocs;
    } else {
      returnDocs = true;
    }
    //
    var leftToFetch = limit;

    if (opts.style) {
      params.style = opts.style;
    }

    if (opts.include_docs || opts.filter && typeof opts.filter === 'function') {
      params.include_docs = true;
    }

    if (opts.attachments) {
      params.attachments = true;
    }

    if (opts.continuous) {
      params.feed = 'longpoll';
    }

    if (opts.conflicts) {
      params.conflicts = true;
    }

    if (opts.descending) {
      params.descending = true;
    }

    if ('heartbeat' in opts) {
      // If the heartbeat value is false, it disables the default heartbeat
      if (opts.heartbeat) {
        params.heartbeat = opts.heartbeat;
      }
    }

    if (opts.filter && typeof opts.filter === 'string') {
      params.filter = opts.filter;
    }

    if (opts.view && typeof opts.view === 'string') {
      params.filter = '_view';
      params.view = opts.view;
    }

    // If opts.query_params exists, pass it through to the changes request.
    // These parameters may be used by the filter on the source database.
    if (opts.query_params && typeof opts.query_params === 'object') {
      for (var param_name in opts.query_params) {
        /* istanbul ignore else */
        if (opts.query_params.hasOwnProperty(param_name)) {
          params[param_name] = opts.query_params[param_name];
        }
      }
    }

    var method = 'GET';
    var body;

    if (opts.doc_ids) {
      // set this automagically for the user; it's annoying that couchdb
      // requires both a "filter" and a "doc_ids" param.
      params.filter = '_doc_ids';
      method = 'POST';
      body = {doc_ids: opts.doc_ids };
    }
    /* istanbul ignore next */
    else if (opts.selector) {
      // set this automagically for the user, similar to above
      params.filter = '_selector';
      method = 'POST';
      body = {selector: opts.selector };
    }

    var xhr;
    var lastFetchedSeq;

    // Get all the changes starting wtih the one immediately after the
    // sequence number given by since.
    var fetch = function (since, callback) {
      if (opts.aborted) {
        return;
      }
      params.since = since;
      // "since" can be any kind of json object in Coudant/CouchDB 2.x
      /* istanbul ignore next */
      if (typeof params.since === "object") {
        params.since = JSON.stringify(params.since);
      }

      if (opts.descending) {
        if (limit) {
          params.limit = leftToFetch;
        }
      } else {
        params.limit = (!limit || leftToFetch > batchSize) ?
          batchSize : leftToFetch;
      }

      // Set the options for the ajax call
      var xhrOpts = {
        method: method,
        url: genDBUrl(host, '_changes' + paramsToStr(params)),
        timeout: requestTimeout,
        body: body
      };
      lastFetchedSeq = since;

      /* istanbul ignore if */
      if (opts.aborted) {
        return;
      }

      // Get the changes
      setup().then(function () {
        xhr = ajax$$1(opts, xhrOpts, callback);
      }).catch(callback);
    };

    // If opts.since exists, get all the changes from the sequence
    // number given by opts.since. Otherwise, get all the changes
    // from the sequence number 0.
    var results = {results: []};

    var fetched = function (err, res) {
      if (opts.aborted) {
        return;
      }
      var raw_results_length = 0;
      // If the result of the ajax call (res) contains changes (res.results)
      if (res && res.results) {
        raw_results_length = res.results.length;
        results.last_seq = res.last_seq;
        // For each change
        var req = {};
        req.query = opts.query_params;
        res.results = res.results.filter(function (c) {
          leftToFetch--;
          var ret = filterChange(opts)(c);
          if (ret) {
            if (opts.include_docs && opts.attachments && opts.binary) {
              readAttachmentsAsBlobOrBuffer(c);
            }
            if (returnDocs) {
              results.results.push(c);
            }
            opts.onChange(c);
          }
          return ret;
        });
      } else if (err) {
        // In case of an error, stop listening for changes and call
        // opts.complete
        opts.aborted = true;
        opts.complete(err);
        return;
      }

      // The changes feed may have timed out with no results
      // if so reuse last update sequence
      if (res && res.last_seq) {
        lastFetchedSeq = res.last_seq;
      }

      var finished = (limit && leftToFetch <= 0) ||
        (res && raw_results_length < batchSize) ||
        (opts.descending);

      if ((opts.continuous && !(limit && leftToFetch <= 0)) || !finished) {
        // Queue a call to fetch again with the newest sequence number
        nextTick(function () { fetch(lastFetchedSeq, fetched); });
      } else {
        // We're done, call the callback
        opts.complete(null, results);
      }
    };

    fetch(opts.since || 0, fetched);

    // Return a method to cancel this method from processing any more
    return {
      cancel: function () {
        opts.aborted = true;
        if (xhr) {
          xhr.abort();
        }
      }
    };
  };

  // Given a set of document/revision IDs (given by req), tets the subset of
  // those that do NOT correspond to revisions stored in the database.
  // See http://wiki.apache.org/couchdb/HttpPostRevsDiff
  api.revsDiff = adapterFun$$1('revsDiff', function (req, opts, callback) {
    // If no options were given, set the callback to be the second parameter
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    // Get the missing document/revision IDs
    ajax$$1(opts, {
      method: 'POST',
      url: genDBUrl(host, '_revs_diff'),
      body: req
    }, callback);
  });

  api._close = function (callback) {
    callback();
  };

  api._destroy = function (options, callback) {
    ajax$$1(options, {
      url: genDBUrl(host, ''),
      method: 'DELETE'
    }, function (err, resp) {
      if (err && err.status && err.status !== 404) {
        return callback(err);
      }
      callback(null, resp);
    });
  };
}

// HttpPouch is a valid adapter.
HttpPouch.valid = function () {
  return true;
};

var HttpPouch$1 = function (PouchDB) {
  PouchDB.adapter('http', HttpPouch, false);
  PouchDB.adapter('https', HttpPouch, false);
};

function QueryParseError(message) {
  this.status = 400;
  this.name = 'query_parse_error';
  this.message = message;
  this.error = true;
  try {
    Error.captureStackTrace(this, QueryParseError);
  } catch (e) {}
}

inherits(QueryParseError, Error);

function NotFoundError(message) {
  this.status = 404;
  this.name = 'not_found';
  this.message = message;
  this.error = true;
  try {
    Error.captureStackTrace(this, NotFoundError);
  } catch (e) {}
}

inherits(NotFoundError, Error);

function BuiltInError(message) {
  this.status = 500;
  this.name = 'invalid_value';
  this.message = message;
  this.error = true;
  try {
    Error.captureStackTrace(this, BuiltInError);
  } catch (e) {}
}

inherits(BuiltInError, Error);

function promisedCallback(promise, callback) {
  if (callback) {
    promise.then(function (res) {
      nextTick(function () {
        callback(null, res);
      });
    }, function (reason) {
      nextTick(function () {
        callback(reason);
      });
    });
  }
  return promise;
}

function callbackify(fun) {
  return getArguments(function (args) {
    var cb = args.pop();
    var promise = fun.apply(this, args);
    if (typeof cb === 'function') {
      promisedCallback(promise, cb);
    }
    return promise;
  });
}

// Promise finally util similar to Q.finally
function fin(promise, finalPromiseFactory) {
  return promise.then(function (res) {
    return finalPromiseFactory().then(function () {
      return res;
    });
  }, function (reason) {
    return finalPromiseFactory().then(function () {
      throw reason;
    });
  });
}

function sequentialize(queue, promiseFactory) {
  return function () {
    var args = arguments;
    var that = this;
    return queue.add(function () {
      return promiseFactory.apply(that, args);
    });
  };
}

// uniq an array of strings, order not guaranteed
// similar to underscore/lodash _.uniq
function uniq(arr) {
  var theSet = new ExportedSet(arr);
  var result = new Array(theSet.size);
  var index = -1;
  theSet.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

function mapToKeysArray(map) {
  var result = new Array(map.size);
  var index = -1;
  map.forEach(function (value, key) {
    result[++index] = key;
  });
  return result;
}

function createBuiltInError(name) {
  var message = 'builtin ' + name +
    ' function requires map values to be numbers' +
    ' or number arrays';
  return new BuiltInError(message);
}

function sum(values) {
  var result = 0;
  for (var i = 0, len = values.length; i < len; i++) {
    var num = values[i];
    if (typeof num !== 'number') {
      if (Array.isArray(num)) {
        // lists of numbers are also allowed, sum them separately
        result = typeof result === 'number' ? [result] : result;
        for (var j = 0, jLen = num.length; j < jLen; j++) {
          var jNum = num[j];
          if (typeof jNum !== 'number') {
            throw createBuiltInError('_sum');
          } else if (typeof result[j] === 'undefined') {
            result.push(jNum);
          } else {
            result[j] += jNum;
          }
        }
      } else { // not array/number
        throw createBuiltInError('_sum');
      }
    } else if (typeof result === 'number') {
      result += num;
    } else { // add number to array
      result[0] += num;
    }
  }
  return result;
}

var log = guardedConsole.bind(null, 'log');
var isArray = Array.isArray;
var toJSON = JSON.parse;

function evalFunctionWithEval(func, emit) {
  return scopeEval(
    "return (" + func.replace(/;\s*$/, "") + ");",
    {
      emit: emit,
      sum: sum,
      log: log,
      isArray: isArray,
      toJSON: toJSON
    }
  );
}

/*
 * Simple task queue to sequentialize actions. Assumes
 * callbacks will eventually fire (once).
 */


function TaskQueue$2() {
  this.promise = new PouchPromise$1(function (fulfill) {fulfill(); });
}
TaskQueue$2.prototype.add = function (promiseFactory) {
  this.promise = this.promise.catch(function () {
    // just recover
  }).then(function () {
    return promiseFactory();
  });
  return this.promise;
};
TaskQueue$2.prototype.finish = function () {
  return this.promise;
};

function stringify(input) {
  if (!input) {
    return 'undefined'; // backwards compat for empty reduce
  }
  // for backwards compat with mapreduce, functions/strings are stringified
  // as-is. everything else is JSON-stringified.
  switch (typeof input) {
    case 'function':
      // e.g. a mapreduce map
      return input.toString();
    case 'string':
      // e.g. a mapreduce built-in _reduce function
      return input.toString();
    default:
      // e.g. a JSON object in the case of mango queries
      return JSON.stringify(input);
  }
}

/* create a string signature for a view so we can cache it and uniq it */
function createViewSignature(mapFun, reduceFun) {
  // the "undefined" part is for backwards compatibility
  return stringify(mapFun) + stringify(reduceFun) + 'undefined';
}

function createView(sourceDB, viewName, mapFun, reduceFun, temporary, localDocName) {
  var viewSignature = createViewSignature(mapFun, reduceFun);

  var cachedViews;
  if (!temporary) {
    // cache this to ensure we don't try to update the same view twice
    cachedViews = sourceDB._cachedViews = sourceDB._cachedViews || {};
    if (cachedViews[viewSignature]) {
      return cachedViews[viewSignature];
    }
  }

  var promiseForView = sourceDB.info().then(function (info) {

    var depDbName = info.db_name + '-mrview-' +
      (temporary ? 'temp' : stringMd5(viewSignature));

    // save the view name in the source db so it can be cleaned up if necessary
    // (e.g. when the _design doc is deleted, remove all associated view data)
    function diffFunction(doc) {
      doc.views = doc.views || {};
      var fullViewName = viewName;
      if (fullViewName.indexOf('/') === -1) {
        fullViewName = viewName + '/' + viewName;
      }
      var depDbs = doc.views[fullViewName] = doc.views[fullViewName] || {};
      /* istanbul ignore if */
      if (depDbs[depDbName]) {
        return; // no update necessary
      }
      depDbs[depDbName] = true;
      return doc;
    }
    return upsert(sourceDB, '_local/' + localDocName, diffFunction).then(function () {
      return sourceDB.registerDependentDatabase(depDbName).then(function (res) {
        var db = res.db;
        db.auto_compaction = true;
        var view = {
          name: depDbName,
          db: db,
          sourceDB: sourceDB,
          adapter: sourceDB.adapter,
          mapFun: mapFun,
          reduceFun: reduceFun
        };
        return view.db.get('_local/lastSeq').catch(function (err) {
          /* istanbul ignore if */
          if (err.status !== 404) {
            throw err;
          }
        }).then(function (lastSeqDoc) {
          view.seq = lastSeqDoc ? lastSeqDoc.seq : 0;
          if (cachedViews) {
            view.db.once('destroyed', function () {
              delete cachedViews[viewSignature];
            });
          }
          return view;
        });
      });
    });
  });

  if (cachedViews) {
    cachedViews[viewSignature] = promiseForView;
  }
  return promiseForView;
}

var persistentQueues = {};
var tempViewQueue = new TaskQueue$2();
var CHANGES_BATCH_SIZE$1 = 50;

function parseViewName(name) {
  // can be either 'ddocname/viewname' or just 'viewname'
  // (where the ddoc name is the same)
  return name.indexOf('/') === -1 ? [name, name] : name.split('/');
}

function isGenOne(changes) {
  // only return true if the current change is 1-
  // and there are no other leafs
  return changes.length === 1 && /^1-/.test(changes[0].rev);
}

function emitError(db, e) {
  try {
    db.emit('error', e);
  } catch (err) {
    guardedConsole('error',
      'The user\'s map/reduce function threw an uncaught error.\n' +
      'You can debug this error by doing:\n' +
      'myDatabase.on(\'error\', function (err) { debugger; });\n' +
      'Please double-check your map/reduce function.');
    guardedConsole('error', e);
  }
}

/**
 * Returns an "abstract" mapreduce object of the form:
 *
 *   {
 *     query: queryFun,
 *     viewCleanup: viewCleanupFun
 *   }
 *
 * Arguments are:
 *
 * localDoc: string
 *   This is for the local doc that gets saved in order to track the
 *   "dependent" DBs and clean them up for viewCleanup. It should be
 *   unique, so that indexer plugins don't collide with each other.
 * mapper: function (mapFunDef, emit)
 *   Returns a map function based on the mapFunDef, which in the case of
 *   normal map/reduce is just the de-stringified function, but may be
 *   something else, such as an object in the case of pouchdb-find.
 * reducer: function (reduceFunDef)
 *   Ditto, but for reducing. Modules don't have to support reducing
 *   (e.g. pouchdb-find).
 * ddocValidator: function (ddoc, viewName)
 *   Throws an error if the ddoc or viewName is not valid.
 *   This could be a way to communicate to the user that the configuration for the
 *   indexer is invalid.
 */
function createAbstractMapReduce(localDocName, mapper, reducer, ddocValidator) {

  function tryMap(db, fun, doc) {
    // emit an event if there was an error thrown by a map function.
    // putting try/catches in a single function also avoids deoptimizations.
    try {
      fun(doc);
    } catch (e) {
      emitError(db, e);
    }
  }

  function tryReduce(db, fun, keys, values, rereduce) {
    // same as above, but returning the result or an error. there are two separate
    // functions to avoid extra memory allocations since the tryCode() case is used
    // for custom map functions (common) vs this function, which is only used for
    // custom reduce functions (rare)
    try {
      return {output : fun(keys, values, rereduce)};
    } catch (e) {
      emitError(db, e);
      return {error: e};
    }
  }

  function sortByKeyThenValue(x, y) {
    var keyCompare = collate(x.key, y.key);
    return keyCompare !== 0 ? keyCompare : collate(x.value, y.value);
  }

  function sliceResults(results, limit, skip) {
    skip = skip || 0;
    if (typeof limit === 'number') {
      return results.slice(skip, limit + skip);
    } else if (skip > 0) {
      return results.slice(skip);
    }
    return results;
  }

  function rowToDocId(row) {
    var val = row.value;
    // Users can explicitly specify a joined doc _id, or it
    // defaults to the doc _id that emitted the key/value.
    var docId = (val && typeof val === 'object' && val._id) || row.id;
    return docId;
  }

  function readAttachmentsAsBlobOrBuffer(res) {
    res.rows.forEach(function (row) {
      var atts = row.doc && row.doc._attachments;
      if (!atts) {
        return;
      }
      Object.keys(atts).forEach(function (filename) {
        var att = atts[filename];
        atts[filename].data = b64ToBluffer(att.data, att.content_type);
      });
    });
  }

  function postprocessAttachments(opts) {
    return function (res) {
      if (opts.include_docs && opts.attachments && opts.binary) {
        readAttachmentsAsBlobOrBuffer(res);
      }
      return res;
    };
  }

  function addHttpParam(paramName, opts, params, asJson) {
    // add an http param from opts to params, optionally json-encoded
    var val = opts[paramName];
    if (typeof val !== 'undefined') {
      if (asJson) {
        val = encodeURIComponent(JSON.stringify(val));
      }
      params.push(paramName + '=' + val);
    }
  }

  function coerceInteger(integerCandidate) {
    if (typeof integerCandidate !== 'undefined') {
      var asNumber = Number(integerCandidate);
      // prevents e.g. '1foo' or '1.1' being coerced to 1
      if (!isNaN(asNumber) && asNumber === parseInt(integerCandidate, 10)) {
        return asNumber;
      } else {
        return integerCandidate;
      }
    }
  }

  function coerceOptions(opts) {
    opts.group_level = coerceInteger(opts.group_level);
    opts.limit = coerceInteger(opts.limit);
    opts.skip = coerceInteger(opts.skip);
    return opts;
  }

  function checkPositiveInteger(number) {
    if (number) {
      if (typeof number !== 'number') {
        return  new QueryParseError('Invalid value for integer: "' +
          number + '"');
      }
      if (number < 0) {
        return new QueryParseError('Invalid value for positive integer: ' +
          '"' + number + '"');
      }
    }
  }

  function checkQueryParseError(options, fun) {
    var startkeyName = options.descending ? 'endkey' : 'startkey';
    var endkeyName = options.descending ? 'startkey' : 'endkey';

    if (typeof options[startkeyName] !== 'undefined' &&
      typeof options[endkeyName] !== 'undefined' &&
      collate(options[startkeyName], options[endkeyName]) > 0) {
      throw new QueryParseError('No rows can match your key range, ' +
        'reverse your start_key and end_key or set {descending : true}');
    } else if (fun.reduce && options.reduce !== false) {
      if (options.include_docs) {
        throw new QueryParseError('{include_docs:true} is invalid for reduce');
      } else if (options.keys && options.keys.length > 1 &&
        !options.group && !options.group_level) {
        throw new QueryParseError('Multi-key fetches for reduce views must use ' +
          '{group: true}');
      }
    }
    ['group_level', 'limit', 'skip'].forEach(function (optionName) {
      var error = checkPositiveInteger(options[optionName]);
      if (error) {
        throw error;
      }
    });
  }

  function httpQuery(db, fun, opts) {
    // List of parameters to add to the PUT request
    var params = [];
    var body;
    var method = 'GET';

    // If opts.reduce exists and is defined, then add it to the list
    // of parameters.
    // If reduce=false then the results are that of only the map function
    // not the final result of map and reduce.
    addHttpParam('reduce', opts, params);
    addHttpParam('include_docs', opts, params);
    addHttpParam('attachments', opts, params);
    addHttpParam('limit', opts, params);
    addHttpParam('descending', opts, params);
    addHttpParam('group', opts, params);
    addHttpParam('group_level', opts, params);
    addHttpParam('skip', opts, params);
    addHttpParam('stale', opts, params);
    addHttpParam('conflicts', opts, params);
    addHttpParam('startkey', opts, params, true);
    addHttpParam('start_key', opts, params, true);
    addHttpParam('endkey', opts, params, true);
    addHttpParam('end_key', opts, params, true);
    addHttpParam('inclusive_end', opts, params);
    addHttpParam('key', opts, params, true);

    // Format the list of parameters into a valid URI query string
    params = params.join('&');
    params = params === '' ? '' : '?' + params;

    // If keys are supplied, issue a POST to circumvent GET query string limits
    // see http://wiki.apache.org/couchdb/HTTP_view_API#Querying_Options
    if (typeof opts.keys !== 'undefined') {
      var MAX_URL_LENGTH = 2000;
      // according to http://stackoverflow.com/a/417184/680742,
      // the de facto URL length limit is 2000 characters

      var keysAsString =
        'keys=' + encodeURIComponent(JSON.stringify(opts.keys));
      if (keysAsString.length + params.length + 1 <= MAX_URL_LENGTH) {
        // If the keys are short enough, do a GET. we do this to work around
        // Safari not understanding 304s on POSTs (see pouchdb/pouchdb#1239)
        params += (params[0] === '?' ? '&' : '?') + keysAsString;
      } else {
        method = 'POST';
        if (typeof fun === 'string') {
          body = {keys: opts.keys};
        } else { // fun is {map : mapfun}, so append to this
          fun.keys = opts.keys;
        }
      }
    }

    // We are referencing a query defined in the design doc
    if (typeof fun === 'string') {
      var parts = parseViewName(fun);
      return db.request({
        method: method,
        url: '_design/' + parts[0] + '/_view/' + parts[1] + params,
        body: body
      }).then(
        /* istanbul ignore next */
        function (result) {
          // fail the entire request if the result contains an error
          result.rows.forEach(function (row) {
            if (row.value && row.value.error && row.value.error === "builtin_reduce_error") {
              throw new Error(row.reason);
            }
          });

          return result;
      })
      .then(postprocessAttachments(opts));
    }

    // We are using a temporary view, terrible for performance, good for testing
    body = body || {};
    Object.keys(fun).forEach(function (key) {
      if (Array.isArray(fun[key])) {
        body[key] = fun[key];
      } else {
        body[key] = fun[key].toString();
      }
    });
    return db.request({
      method: 'POST',
      url: '_temp_view' + params,
      body: body
    }).then(postprocessAttachments(opts));
  }

  // custom adapters can define their own api._query
  // and override the default behavior
  /* istanbul ignore next */
  function customQuery(db, fun, opts) {
    return new PouchPromise$1(function (resolve, reject) {
      db._query(fun, opts, function (err, res) {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  }

  // custom adapters can define their own api._viewCleanup
  // and override the default behavior
  /* istanbul ignore next */
  function customViewCleanup(db) {
    return new PouchPromise$1(function (resolve, reject) {
      db._viewCleanup(function (err, res) {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  }

  function defaultsTo(value) {
    return function (reason) {
      /* istanbul ignore else */
      if (reason.status === 404) {
        return value;
      } else {
        throw reason;
      }
    };
  }

  // returns a promise for a list of docs to update, based on the input docId.
  // the order doesn't matter, because post-3.2.0, bulkDocs
  // is an atomic operation in all three adapters.
  function getDocsToPersist(docId, view, docIdsToChangesAndEmits) {
    var metaDocId = '_local/doc_' + docId;
    var defaultMetaDoc = {_id: metaDocId, keys: []};
    var docData = docIdsToChangesAndEmits.get(docId);
    var indexableKeysToKeyValues = docData[0];
    var changes = docData[1];

    function getMetaDoc() {
      if (isGenOne(changes)) {
        // generation 1, so we can safely assume initial state
        // for performance reasons (avoids unnecessary GETs)
        return PouchPromise$1.resolve(defaultMetaDoc);
      }
      return view.db.get(metaDocId).catch(defaultsTo(defaultMetaDoc));
    }

    function getKeyValueDocs(metaDoc) {
      if (!metaDoc.keys.length) {
        // no keys, no need for a lookup
        return PouchPromise$1.resolve({rows: []});
      }
      return view.db.allDocs({
        keys: metaDoc.keys,
        include_docs: true
      });
    }

    function processKeyValueDocs(metaDoc, kvDocsRes) {
      var kvDocs = [];
      var oldKeys = new ExportedSet();

      for (var i = 0, len = kvDocsRes.rows.length; i < len; i++) {
        var row = kvDocsRes.rows[i];
        var doc = row.doc;
        if (!doc) { // deleted
          continue;
        }
        kvDocs.push(doc);
        oldKeys.add(doc._id);
        doc._deleted = !indexableKeysToKeyValues.has(doc._id);
        if (!doc._deleted) {
          var keyValue = indexableKeysToKeyValues.get(doc._id);
          if ('value' in keyValue) {
            doc.value = keyValue.value;
          }
        }
      }
      var newKeys = mapToKeysArray(indexableKeysToKeyValues);
      newKeys.forEach(function (key) {
        if (!oldKeys.has(key)) {
          // new doc
          var kvDoc = {
            _id: key
          };
          var keyValue = indexableKeysToKeyValues.get(key);
          if ('value' in keyValue) {
            kvDoc.value = keyValue.value;
          }
          kvDocs.push(kvDoc);
        }
      });
      metaDoc.keys = uniq(newKeys.concat(metaDoc.keys));
      kvDocs.push(metaDoc);

      return kvDocs;
    }

    return getMetaDoc().then(function (metaDoc) {
      return getKeyValueDocs(metaDoc).then(function (kvDocsRes) {
        return processKeyValueDocs(metaDoc, kvDocsRes);
      });
    });
  }

  // updates all emitted key/value docs and metaDocs in the mrview database
  // for the given batch of documents from the source database
  function saveKeyValues(view, docIdsToChangesAndEmits, seq) {
    var seqDocId = '_local/lastSeq';
    return view.db.get(seqDocId)
      .catch(defaultsTo({_id: seqDocId, seq: 0}))
      .then(function (lastSeqDoc) {
        var docIds = mapToKeysArray(docIdsToChangesAndEmits);
        return PouchPromise$1.all(docIds.map(function (docId) {
          return getDocsToPersist(docId, view, docIdsToChangesAndEmits);
        })).then(function (listOfDocsToPersist) {
          var docsToPersist = flatten(listOfDocsToPersist);
          lastSeqDoc.seq = seq;
          docsToPersist.push(lastSeqDoc);
          // write all docs in a single operation, update the seq once
          return view.db.bulkDocs({docs : docsToPersist});
        });
      });
  }

  function getQueue(view) {
    var viewName = typeof view === 'string' ? view : view.name;
    var queue = persistentQueues[viewName];
    if (!queue) {
      queue = persistentQueues[viewName] = new TaskQueue$2();
    }
    return queue;
  }

  function updateView(view) {
    return sequentialize(getQueue(view), function () {
      return updateViewInQueue(view);
    })();
  }

  function updateViewInQueue(view) {
    // bind the emit function once
    var mapResults;
    var doc;

    function emit(key, value) {
      var output = {id: doc._id, key: normalizeKey(key)};
      // Don't explicitly store the value unless it's defined and non-null.
      // This saves on storage space, because often people don't use it.
      if (typeof value !== 'undefined' && value !== null) {
        output.value = normalizeKey(value);
      }
      mapResults.push(output);
    }

    var mapFun = mapper(view.mapFun, emit);

    var currentSeq = view.seq || 0;

    function processChange(docIdsToChangesAndEmits, seq) {
      return function () {
        return saveKeyValues(view, docIdsToChangesAndEmits, seq);
      };
    }

    var queue = new TaskQueue$2();

    function processNextBatch() {
      return view.sourceDB.changes({
        conflicts: true,
        include_docs: true,
        style: 'all_docs',
        since: currentSeq,
        limit: CHANGES_BATCH_SIZE$1
      }).then(processBatch);
    }

    function processBatch(response) {
      var results = response.results;
      if (!results.length) {
        return;
      }
      var docIdsToChangesAndEmits = createDocIdsToChangesAndEmits(results);
      queue.add(processChange(docIdsToChangesAndEmits, currentSeq));
      if (results.length < CHANGES_BATCH_SIZE$1) {
        return;
      }
      return processNextBatch();
    }

    function createDocIdsToChangesAndEmits(results) {
      var docIdsToChangesAndEmits = new ExportedMap();
      for (var i = 0, len = results.length; i < len; i++) {
        var change = results[i];
        if (change.doc._id[0] !== '_') {
          mapResults = [];
          doc = change.doc;

          if (!doc._deleted) {
            tryMap(view.sourceDB, mapFun, doc);
          }
          mapResults.sort(sortByKeyThenValue);

          var indexableKeysToKeyValues = createIndexableKeysToKeyValues(mapResults);
          docIdsToChangesAndEmits.set(change.doc._id, [
            indexableKeysToKeyValues,
            change.changes
          ]);
        }
        currentSeq = change.seq;
      }
      return docIdsToChangesAndEmits;
    }

    function createIndexableKeysToKeyValues(mapResults) {
      var indexableKeysToKeyValues = new ExportedMap();
      var lastKey;
      for (var i = 0, len = mapResults.length; i < len; i++) {
        var emittedKeyValue = mapResults[i];
        var complexKey = [emittedKeyValue.key, emittedKeyValue.id];
        if (i > 0 && collate(emittedKeyValue.key, lastKey) === 0) {
          complexKey.push(i); // dup key+id, so make it unique
        }
        indexableKeysToKeyValues.set(toIndexableString(complexKey), emittedKeyValue);
        lastKey = emittedKeyValue.key;
      }
      return indexableKeysToKeyValues;
    }

    return processNextBatch().then(function () {
      return queue.finish();
    }).then(function () {
      view.seq = currentSeq;
    });
  }

  function reduceView(view, results, options) {
    if (options.group_level === 0) {
      delete options.group_level;
    }

    var shouldGroup = options.group || options.group_level;

    var reduceFun = reducer(view.reduceFun);

    var groups = [];
    var lvl = isNaN(options.group_level) ? Number.POSITIVE_INFINITY :
      options.group_level;
    results.forEach(function (e) {
      var last = groups[groups.length - 1];
      var groupKey = shouldGroup ? e.key : null;

      // only set group_level for array keys
      if (shouldGroup && Array.isArray(groupKey)) {
        groupKey = groupKey.slice(0, lvl);
      }

      if (last && collate(last.groupKey, groupKey) === 0) {
        last.keys.push([e.key, e.id]);
        last.values.push(e.value);
        return;
      }
      groups.push({
        keys: [[e.key, e.id]],
        values: [e.value],
        groupKey: groupKey
      });
    });
    results = [];
    for (var i = 0, len = groups.length; i < len; i++) {
      var e = groups[i];
      var reduceTry = tryReduce(view.sourceDB, reduceFun, e.keys, e.values, false);
      if (reduceTry.error && reduceTry.error instanceof BuiltInError) {
        // CouchDB returns an error if a built-in errors out
        throw reduceTry.error;
      }
      results.push({
        // CouchDB just sets the value to null if a non-built-in errors out
        value: reduceTry.error ? null : reduceTry.output,
        key: e.groupKey
      });
    }
    // no total_rows/offset when reducing
    return {rows: sliceResults(results, options.limit, options.skip)};
  }

  function queryView(view, opts) {
    return sequentialize(getQueue(view), function () {
      return queryViewInQueue(view, opts);
    })();
  }

  function queryViewInQueue(view, opts) {
    var totalRows;
    var shouldReduce = view.reduceFun && opts.reduce !== false;
    var skip = opts.skip || 0;
    if (typeof opts.keys !== 'undefined' && !opts.keys.length) {
      // equivalent query
      opts.limit = 0;
      delete opts.keys;
    }

    function fetchFromView(viewOpts) {
      viewOpts.include_docs = true;
      return view.db.allDocs(viewOpts).then(function (res) {
        totalRows = res.total_rows;
        return res.rows.map(function (result) {

          // implicit migration - in older versions of PouchDB,
          // we explicitly stored the doc as {id: ..., key: ..., value: ...}
          // this is tested in a migration test
          /* istanbul ignore next */
          if ('value' in result.doc && typeof result.doc.value === 'object' &&
            result.doc.value !== null) {
            var keys = Object.keys(result.doc.value).sort();
            // this detection method is not perfect, but it's unlikely the user
            // emitted a value which was an object with these 3 exact keys
            var expectedKeys = ['id', 'key', 'value'];
            if (!(keys < expectedKeys || keys > expectedKeys)) {
              return result.doc.value;
            }
          }

          var parsedKeyAndDocId = parseIndexableString(result.doc._id);
          return {
            key: parsedKeyAndDocId[0],
            id: parsedKeyAndDocId[1],
            value: ('value' in result.doc ? result.doc.value : null)
          };
        });
      });
    }

    function onMapResultsReady(rows) {
      var finalResults;
      if (shouldReduce) {
        finalResults = reduceView(view, rows, opts);
      } else {
        finalResults = {
          total_rows: totalRows,
          offset: skip,
          rows: rows
        };
      }
      if (opts.include_docs) {
        var docIds = uniq(rows.map(rowToDocId));

        return view.sourceDB.allDocs({
          keys: docIds,
          include_docs: true,
          conflicts: opts.conflicts,
          attachments: opts.attachments,
          binary: opts.binary
        }).then(function (allDocsRes) {
          var docIdsToDocs = new ExportedMap();
          allDocsRes.rows.forEach(function (row) {
            docIdsToDocs.set(row.id, row.doc);
          });
          rows.forEach(function (row) {
            var docId = rowToDocId(row);
            var doc = docIdsToDocs.get(docId);
            if (doc) {
              row.doc = doc;
            }
          });
          return finalResults;
        });
      } else {
        return finalResults;
      }
    }

    if (typeof opts.keys !== 'undefined') {
      var keys = opts.keys;
      var fetchPromises = keys.map(function (key) {
        var viewOpts = {
          startkey : toIndexableString([key]),
          endkey   : toIndexableString([key, {}])
        };
        return fetchFromView(viewOpts);
      });
      return PouchPromise$1.all(fetchPromises).then(flatten).then(onMapResultsReady);
    } else { // normal query, no 'keys'
      var viewOpts = {
        descending : opts.descending
      };
      var startkey;
      var endkey;
      if ('start_key' in opts) {
        startkey = opts.start_key;
      }
      if ('startkey' in opts) {
        startkey = opts.startkey;
      }
      if ('end_key' in opts) {
        endkey = opts.end_key;
      }
      if ('endkey' in opts) {
        endkey = opts.endkey;
      }
      if (typeof startkey !== 'undefined') {
        viewOpts.startkey = opts.descending ?
          toIndexableString([startkey, {}]) :
          toIndexableString([startkey]);
      }
      if (typeof endkey !== 'undefined') {
        var inclusiveEnd = opts.inclusive_end !== false;
        if (opts.descending) {
          inclusiveEnd = !inclusiveEnd;
        }

        viewOpts.endkey = toIndexableString(
          inclusiveEnd ? [endkey, {}] : [endkey]);
      }
      if (typeof opts.key !== 'undefined') {
        var keyStart = toIndexableString([opts.key]);
        var keyEnd = toIndexableString([opts.key, {}]);
        if (viewOpts.descending) {
          viewOpts.endkey = keyStart;
          viewOpts.startkey = keyEnd;
        } else {
          viewOpts.startkey = keyStart;
          viewOpts.endkey = keyEnd;
        }
      }
      if (!shouldReduce) {
        if (typeof opts.limit === 'number') {
          viewOpts.limit = opts.limit;
        }
        viewOpts.skip = skip;
      }
      return fetchFromView(viewOpts).then(onMapResultsReady);
    }
  }

  function httpViewCleanup(db) {
    return db.request({
      method: 'POST',
      url: '_view_cleanup'
    });
  }

  function localViewCleanup(db) {
    return db.get('_local/' + localDocName).then(function (metaDoc) {
      var docsToViews = new ExportedMap();
      Object.keys(metaDoc.views).forEach(function (fullViewName) {
        var parts = parseViewName(fullViewName);
        var designDocName = '_design/' + parts[0];
        var viewName = parts[1];
        var views = docsToViews.get(designDocName);
        if (!views) {
          views = new ExportedSet();
          docsToViews.set(designDocName, views);
        }
        views.add(viewName);
      });
      var opts = {
        keys : mapToKeysArray(docsToViews),
        include_docs : true
      };
      return db.allDocs(opts).then(function (res) {
        var viewsToStatus = {};
        res.rows.forEach(function (row) {
          var ddocName = row.key.substring(8); // cuts off '_design/'
          docsToViews.get(row.key).forEach(function (viewName) {
            var fullViewName = ddocName + '/' + viewName;
            /* istanbul ignore if */
            if (!metaDoc.views[fullViewName]) {
              // new format, without slashes, to support PouchDB 2.2.0
              // migration test in pouchdb's browser.migration.js verifies this
              fullViewName = viewName;
            }
            var viewDBNames = Object.keys(metaDoc.views[fullViewName]);
            // design doc deleted, or view function nonexistent
            var statusIsGood = row.doc && row.doc.views &&
              row.doc.views[viewName];
            viewDBNames.forEach(function (viewDBName) {
              viewsToStatus[viewDBName] =
                viewsToStatus[viewDBName] || statusIsGood;
            });
          });
        });
        var dbsToDelete = Object.keys(viewsToStatus).filter(
          function (viewDBName) { return !viewsToStatus[viewDBName]; });
        var destroyPromises = dbsToDelete.map(function (viewDBName) {
          return sequentialize(getQueue(viewDBName), function () {
            return new db.constructor(viewDBName, db.__opts).destroy();
          })();
        });
        return PouchPromise$1.all(destroyPromises).then(function () {
          return {ok: true};
        });
      });
    }, defaultsTo({ok: true}));
  }

  function queryPromised(db, fun, opts) {
    /* istanbul ignore next */
    if (typeof db._query === 'function') {
      return customQuery(db, fun, opts);
    }
    if (isRemote(db)) {
      return httpQuery(db, fun, opts);
    }

    if (typeof fun !== 'string') {
      // temp_view
      checkQueryParseError(opts, fun);

      tempViewQueue.add(function () {
        var createViewPromise = createView(
          /* sourceDB */ db,
          /* viewName */ 'temp_view/temp_view',
          /* mapFun */ fun.map,
          /* reduceFun */ fun.reduce,
          /* temporary */ true,
          /* localDocName */ localDocName);
        return createViewPromise.then(function (view) {
          return fin(updateView(view).then(function () {
            return queryView(view, opts);
          }), function () {
            return view.db.destroy();
          });
        });
      });
      return tempViewQueue.finish();
    } else {
      // persistent view
      var fullViewName = fun;
      var parts = parseViewName(fullViewName);
      var designDocName = parts[0];
      var viewName = parts[1];
      return db.get('_design/' + designDocName).then(function (doc) {
        var fun = doc.views && doc.views[viewName];

        if (!fun) {
          // basic validator; it's assumed that every subclass would want this
          throw new NotFoundError('ddoc ' + doc._id + ' has no view named ' +
            viewName);
        }

        ddocValidator(doc, viewName);
        checkQueryParseError(opts, fun);

        var createViewPromise = createView(
          /* sourceDB */ db,
          /* viewName */ fullViewName,
          /* mapFun */ fun.map,
          /* reduceFun */ fun.reduce,
          /* temporary */ false,
          /* localDocName */ localDocName);
        return createViewPromise.then(function (view) {
          if (opts.stale === 'ok' || opts.stale === 'update_after') {
            if (opts.stale === 'update_after') {
              nextTick(function () {
                updateView(view);
              });
            }
            return queryView(view, opts);
          } else { // stale not ok
            return updateView(view).then(function () {
              return queryView(view, opts);
            });
          }
        });
      });
    }
  }

  function abstractQuery(fun, opts, callback) {
    var db = this;
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    opts = opts ? coerceOptions(opts) : {};

    if (typeof fun === 'function') {
      fun = {map : fun};
    }

    var promise = PouchPromise$1.resolve().then(function () {
      return queryPromised(db, fun, opts);
    });
    promisedCallback(promise, callback);
    return promise;
  }

  var abstractViewCleanup = callbackify(function () {
    var db = this;
    /* istanbul ignore next */
    if (typeof db._viewCleanup === 'function') {
      return customViewCleanup(db);
    }
    if (isRemote(db)) {
      return httpViewCleanup(db);
    }
    return localViewCleanup(db);
  });

  return {
    query: abstractQuery,
    viewCleanup: abstractViewCleanup
  };
}

var builtInReduce = {
  _sum: function (keys, values) {
    return sum(values);
  },

  _count: function (keys, values) {
    return values.length;
  },

  _stats: function (keys, values) {
    // no need to implement rereduce=true, because Pouch
    // will never call it
    function sumsqr(values) {
      var _sumsqr = 0;
      for (var i = 0, len = values.length; i < len; i++) {
        var num = values[i];
        _sumsqr += (num * num);
      }
      return _sumsqr;
    }
    return {
      sum     : sum(values),
      min     : Math.min.apply(null, values),
      max     : Math.max.apply(null, values),
      count   : values.length,
      sumsqr : sumsqr(values)
    };
  }
};

function getBuiltIn(reduceFunString) {
  if (/^_sum/.test(reduceFunString)) {
    return builtInReduce._sum;
  } else if (/^_count/.test(reduceFunString)) {
    return builtInReduce._count;
  } else if (/^_stats/.test(reduceFunString)) {
    return builtInReduce._stats;
  } else if (/^_/.test(reduceFunString)) {
    throw new Error(reduceFunString + ' is not a supported reduce function.');
  }
}

function mapper(mapFun, emit) {
  // for temp_views one can use emit(doc, emit), see #38
  if (typeof mapFun === "function" && mapFun.length === 2) {
    var origMap = mapFun;
    return function (doc) {
      return origMap(doc, emit);
    };
  } else {
    return evalFunctionWithEval(mapFun.toString(), emit);
  }
}

function reducer(reduceFun) {
  var reduceFunString = reduceFun.toString();
  var builtIn = getBuiltIn(reduceFunString);
  if (builtIn) {
    return builtIn;
  } else {
    return evalFunctionWithEval(reduceFunString);
  }
}

function ddocValidator(ddoc, viewName) {
  var fun = ddoc.views && ddoc.views[viewName];
  if (typeof fun.map !== 'string') {
    throw new NotFoundError('ddoc ' + ddoc._id + ' has no string view named ' +
      viewName + ', instead found object of type: ' + typeof fun.map);
  }
}

var localDocName = 'mrviews';
var abstract = createAbstractMapReduce(localDocName, mapper, reducer, ddocValidator);

function query(fun, opts, callback) {
  return abstract.query.call(this, fun, opts, callback);
}

function viewCleanup(callback) {
  return abstract.viewCleanup.call(this, callback);
}

var mapreduce = {
  query: query,
  viewCleanup: viewCleanup
};

function isGenOne$1(rev$$1) {
  return /^1-/.test(rev$$1);
}

function fileHasChanged(localDoc, remoteDoc, filename) {
  return !localDoc._attachments ||
         !localDoc._attachments[filename] ||
         localDoc._attachments[filename].digest !== remoteDoc._attachments[filename].digest;
}

function getDocAttachments(db, doc) {
  var filenames = Object.keys(doc._attachments);
  return PouchPromise$1.all(filenames.map(function (filename) {
    return db.getAttachment(doc._id, filename, {rev: doc._rev});
  }));
}

function getDocAttachmentsFromTargetOrSource(target, src, doc) {
  var doCheckForLocalAttachments = isRemote(src) && !isRemote(target);
  var filenames = Object.keys(doc._attachments);

  if (!doCheckForLocalAttachments) {
    return getDocAttachments(src, doc);
  }

  return target.get(doc._id).then(function (localDoc) {
    return PouchPromise$1.all(filenames.map(function (filename) {
      if (fileHasChanged(localDoc, doc, filename)) {
        return src.getAttachment(doc._id, filename);
      }

      return target.getAttachment(localDoc._id, filename);
    }));
  }).catch(function (error) {
    /* istanbul ignore if */
    if (error.status !== 404) {
      throw error;
    }

    return getDocAttachments(src, doc);
  });
}

function createBulkGetOpts(diffs) {
  var requests = [];
  Object.keys(diffs).forEach(function (id) {
    var missingRevs = diffs[id].missing;
    missingRevs.forEach(function (missingRev) {
      requests.push({
        id: id,
        rev: missingRev
      });
    });
  });

  return {
    docs: requests,
    revs: true,
    latest: true
  };
}

//
// Fetch all the documents from the src as described in the "diffs",
// which is a mapping of docs IDs to revisions. If the state ever
// changes to "cancelled", then the returned promise will be rejected.
// Else it will be resolved with a list of fetched documents.
//
function getDocs(src, target, diffs, state) {
  diffs = clone(diffs); // we do not need to modify this

  var resultDocs = [],
      ok = true;

  function getAllDocs() {

    var bulkGetOpts = createBulkGetOpts(diffs);

    if (!bulkGetOpts.docs.length) { // optimization: skip empty requests
      return;
    }

    return src.bulkGet(bulkGetOpts).then(function (bulkGetResponse) {
      /* istanbul ignore if */
      if (state.cancelled) {
        throw new Error('cancelled');
      }
      return PouchPromise$1.all(bulkGetResponse.results.map(function (bulkGetInfo) {
        return PouchPromise$1.all(bulkGetInfo.docs.map(function (doc) {
          var remoteDoc = doc.ok;

          if (doc.error) {
            // when AUTO_COMPACTION is set, docs can be returned which look
            // like this: {"missing":"1-7c3ac256b693c462af8442f992b83696"}
            ok = false;
          }

          if (!remoteDoc || !remoteDoc._attachments) {
            return remoteDoc;
          }

          return getDocAttachmentsFromTargetOrSource(target, src, remoteDoc)
                   .then(function (attachments) {
                           var filenames = Object.keys(remoteDoc._attachments);
                           attachments
                             .forEach(function (attachment, i) {
                                        var att = remoteDoc._attachments[filenames[i]];
                                        delete att.stub;
                                        delete att.length;
                                        att.data = attachment;
                                      });

                                      return remoteDoc;
                                    });
        }));
      }))

      .then(function (results) {
        resultDocs = resultDocs.concat(flatten(results).filter(Boolean));
      });
    });
  }

  function hasAttachments(doc) {
    return doc._attachments && Object.keys(doc._attachments).length > 0;
  }

  function hasConflicts(doc) {
    return doc._conflicts && doc._conflicts.length > 0;
  }

  function fetchRevisionOneDocs(ids) {
    // Optimization: fetch gen-1 docs and attachments in
    // a single request using _all_docs
    return src.allDocs({
      keys: ids,
      include_docs: true,
      conflicts: true
    }).then(function (res) {
      if (state.cancelled) {
        throw new Error('cancelled');
      }
      res.rows.forEach(function (row) {
        if (row.deleted || !row.doc || !isGenOne$1(row.value.rev) ||
            hasAttachments(row.doc) || hasConflicts(row.doc)) {
          // if any of these conditions apply, we need to fetch using get()
          return;
        }

        // strip _conflicts array to appease CSG (#5793)
        /* istanbul ignore if */
        if (row.doc._conflicts) {
          delete row.doc._conflicts;
        }

        // the doc we got back from allDocs() is sufficient
        resultDocs.push(row.doc);
        delete diffs[row.id];
      });
    });
  }

  function getRevisionOneDocs() {
    // filter out the generation 1 docs and get them
    // leaving the non-generation one docs to be got otherwise
    var ids = Object.keys(diffs).filter(function (id) {
      var missing = diffs[id].missing;
      return missing.length === 1 && isGenOne$1(missing[0]);
    });
    if (ids.length > 0) {
      return fetchRevisionOneDocs(ids);
    }
  }

  function returnResult() {
    return { ok:ok, docs:resultDocs };
  }

  return PouchPromise$1.resolve()
    .then(getRevisionOneDocs)
    .then(getAllDocs)
    .then(returnResult);
}

var CHECKPOINT_VERSION = 1;
var REPLICATOR = "pouchdb";
// This is an arbitrary number to limit the
// amount of replication history we save in the checkpoint.
// If we save too much, the checkpoing docs will become very big,
// if we save fewer, we'll run a greater risk of having to
// read all the changes from 0 when checkpoint PUTs fail
// CouchDB 2.0 has a more involved history pruning,
// but let's go for the simple version for now.
var CHECKPOINT_HISTORY_SIZE = 5;
var LOWEST_SEQ = 0;

function updateCheckpoint(db, id, checkpoint, session, returnValue) {
  return db.get(id).catch(function (err) {
    if (err.status === 404) {
      if (db.adapter === 'http' || db.adapter === 'https') {
        explainError(
          404, 'PouchDB is just checking if a remote checkpoint exists.'
        );
      }
      return {
        session_id: session,
        _id: id,
        history: [],
        replicator: REPLICATOR,
        version: CHECKPOINT_VERSION
      };
    }
    throw err;
  }).then(function (doc) {
    if (returnValue.cancelled) {
      return;
    }

    // if the checkpoint has not changed, do not update
    if (doc.last_seq === checkpoint) {
      return;
    }

    // Filter out current entry for this replication
    doc.history = (doc.history || []).filter(function (item) {
      return item.session_id !== session;
    });

    // Add the latest checkpoint to history
    doc.history.unshift({
      last_seq: checkpoint,
      session_id: session
    });

    // Just take the last pieces in history, to
    // avoid really big checkpoint docs.
    // see comment on history size above
    doc.history = doc.history.slice(0, CHECKPOINT_HISTORY_SIZE);

    doc.version = CHECKPOINT_VERSION;
    doc.replicator = REPLICATOR;

    doc.session_id = session;
    doc.last_seq = checkpoint;

    return db.put(doc).catch(function (err) {
      if (err.status === 409) {
        // retry; someone is trying to write a checkpoint simultaneously
        return updateCheckpoint(db, id, checkpoint, session, returnValue);
      }
      throw err;
    });
  });
}

function Checkpointer(src, target, id, returnValue, opts) {
  this.src = src;
  this.target = target;
  this.id = id;
  this.returnValue = returnValue;
  this.opts = opts;
}

Checkpointer.prototype.writeCheckpoint = function (checkpoint, session) {
  var self = this;
  return this.updateTarget(checkpoint, session).then(function () {
    return self.updateSource(checkpoint, session);
  });
};

Checkpointer.prototype.updateTarget = function (checkpoint, session) {
  if (this.opts.writeTargetCheckpoint) {
    return updateCheckpoint(this.target, this.id, checkpoint,
      session, this.returnValue);
  } else {
    return PouchPromise$1.resolve(true);
  }
};

Checkpointer.prototype.updateSource = function (checkpoint, session) {
  if (this.opts.writeSourceCheckpoint) {
    var self = this;
    if (this.readOnlySource) {
      return PouchPromise$1.resolve(true);
    }
    return updateCheckpoint(this.src, this.id, checkpoint,
      session, this.returnValue)
      .catch(function (err) {
        if (isForbiddenError(err)) {
          self.readOnlySource = true;
          return true;
        }
        throw err;
      });
  } else {
    return PouchPromise$1.resolve(true);
  }
};

var comparisons = {
  "undefined": function (targetDoc, sourceDoc) {
    // This is the previous comparison function
    if (collate(targetDoc.last_seq, sourceDoc.last_seq) === 0) {
      return sourceDoc.last_seq;
    }
    /* istanbul ignore next */
    return 0;
  },
  "1": function (targetDoc, sourceDoc) {
    // This is the comparison function ported from CouchDB
    return compareReplicationLogs(sourceDoc, targetDoc).last_seq;
  }
};

Checkpointer.prototype.getCheckpoint = function () {
  var self = this;
  return self.target.get(self.id).then(function (targetDoc) {
    if (self.readOnlySource) {
      return PouchPromise$1.resolve(targetDoc.last_seq);
    }

    return self.src.get(self.id).then(function (sourceDoc) {
      // Since we can't migrate an old version doc to a new one
      // (no session id), we just go with the lowest seq in this case
      /* istanbul ignore if */
      if (targetDoc.version !== sourceDoc.version) {
        return LOWEST_SEQ;
      }

      var version;
      if (targetDoc.version) {
        version = targetDoc.version.toString();
      } else {
        version = "undefined";
      }

      if (version in comparisons) {
        return comparisons[version](targetDoc, sourceDoc);
      }
      /* istanbul ignore next */
      return LOWEST_SEQ;
    }, function (err) {
      if (err.status === 404 && targetDoc.last_seq) {
        return self.src.put({
          _id: self.id,
          last_seq: LOWEST_SEQ
        }).then(function () {
          return LOWEST_SEQ;
        }, function (err) {
          if (isForbiddenError(err)) {
            self.readOnlySource = true;
            return targetDoc.last_seq;
          }
          /* istanbul ignore next */
          return LOWEST_SEQ;
        });
      }
      throw err;
    });
  }).catch(function (err) {
    if (err.status !== 404) {
      throw err;
    }
    return LOWEST_SEQ;
  });
};
// This checkpoint comparison is ported from CouchDBs source
// they come from here:
// https://github.com/apache/couchdb-couch-replicator/blob/master/src/couch_replicator.erl#L863-L906

function compareReplicationLogs(srcDoc, tgtDoc) {
  if (srcDoc.session_id === tgtDoc.session_id) {
    return {
      last_seq: srcDoc.last_seq,
      history: srcDoc.history
    };
  }

  return compareReplicationHistory(srcDoc.history, tgtDoc.history);
}

function compareReplicationHistory(sourceHistory, targetHistory) {
  // the erlang loop via function arguments is not so easy to repeat in JS
  // therefore, doing this as recursion
  var S = sourceHistory[0];
  var sourceRest = sourceHistory.slice(1);
  var T = targetHistory[0];
  var targetRest = targetHistory.slice(1);

  if (!S || targetHistory.length === 0) {
    return {
      last_seq: LOWEST_SEQ,
      history: []
    };
  }

  var sourceId = S.session_id;
  /* istanbul ignore if */
  if (hasSessionId(sourceId, targetHistory)) {
    return {
      last_seq: S.last_seq,
      history: sourceHistory
    };
  }

  var targetId = T.session_id;
  if (hasSessionId(targetId, sourceRest)) {
    return {
      last_seq: T.last_seq,
      history: targetRest
    };
  }

  return compareReplicationHistory(sourceRest, targetRest);
}

function hasSessionId(sessionId, history) {
  var props = history[0];
  var rest = history.slice(1);

  if (!sessionId || history.length === 0) {
    return false;
  }

  if (sessionId === props.session_id) {
    return true;
  }

  return hasSessionId(sessionId, rest);
}

function isForbiddenError(err) {
  return typeof err.status === 'number' && Math.floor(err.status / 100) === 4;
}

var STARTING_BACK_OFF = 0;

function backOff(opts, returnValue, error, callback) {
  if (opts.retry === false) {
    returnValue.emit('error', error);
    returnValue.removeAllListeners();
    return;
  }
  if (typeof opts.back_off_function !== 'function') {
    opts.back_off_function = defaultBackOff;
  }
  returnValue.emit('requestError', error);
  if (returnValue.state === 'active' || returnValue.state === 'pending') {
    returnValue.emit('paused', error);
    returnValue.state = 'stopped';
    var backOffSet = function backoffTimeSet() {
      opts.current_back_off = STARTING_BACK_OFF;
    };
    var removeBackOffSetter = function removeBackOffTimeSet() {
      returnValue.removeListener('active', backOffSet);
    };
    returnValue.once('paused', removeBackOffSetter);
    returnValue.once('active', backOffSet);
  }

  opts.current_back_off = opts.current_back_off || STARTING_BACK_OFF;
  opts.current_back_off = opts.back_off_function(opts.current_back_off);
  setTimeout(callback, opts.current_back_off);
}

function sortObjectPropertiesByKey(queryParams) {
  return Object.keys(queryParams).sort(collate).reduce(function (result, key) {
    result[key] = queryParams[key];
    return result;
  }, {});
}

// Generate a unique id particular to this replication.
// Not guaranteed to align perfectly with CouchDB's rep ids.
function generateReplicationId(src, target, opts) {
  var docIds = opts.doc_ids ? opts.doc_ids.sort(collate) : '';
  var filterFun = opts.filter ? opts.filter.toString() : '';
  var queryParams = '';
  var filterViewName =  '';
  var selector = '';

  // possibility for checkpoints to be lost here as behaviour of
  // JSON.stringify is not stable (see #6226)
  /* istanbul ignore if */
  if (opts.selector) {
    selector = JSON.stringify(opts.selector);
  }

  if (opts.filter && opts.query_params) {
    queryParams = JSON.stringify(sortObjectPropertiesByKey(opts.query_params));
  }

  if (opts.filter && opts.filter === '_view') {
    filterViewName = opts.view.toString();
  }

  return PouchPromise$1.all([src.id(), target.id()]).then(function (res) {
    var queryData = res[0] + res[1] + filterFun + filterViewName +
      queryParams + docIds + selector;
    return new PouchPromise$1(function (resolve) {
      binaryMd5(queryData, resolve);
    });
  }).then(function (md5sum) {
    // can't use straight-up md5 alphabet, because
    // the char '/' is interpreted as being for attachments,
    // and + is also not url-safe
    md5sum = md5sum.replace(/\//g, '.').replace(/\+/g, '_');
    return '_local/' + md5sum;
  });
}

function replicate(src, target, opts, returnValue, result) {
  var batches = [];               // list of batches to be processed
  var currentBatch;               // the batch currently being processed
  var pendingBatch = {
    seq: 0,
    changes: [],
    docs: []
  }; // next batch, not yet ready to be processed
  var writingCheckpoint = false;  // true while checkpoint is being written
  var changesCompleted = false;   // true when all changes received
  var replicationCompleted = false; // true when replication has completed
  var last_seq = 0;
  var continuous = opts.continuous || opts.live || false;
  var batch_size = opts.batch_size || 100;
  var batches_limit = opts.batches_limit || 10;
  var changesPending = false;     // true while src.changes is running
  var doc_ids = opts.doc_ids;
  var selector = opts.selector;
  var repId;
  var checkpointer;
  var changedDocs = [];
  // Like couchdb, every replication gets a unique session id
  var session = uuid();

  result = result || {
    ok: true,
    start_time: new Date(),
    docs_read: 0,
    docs_written: 0,
    doc_write_failures: 0,
    errors: []
  };

  var changesOpts = {};
  returnValue.ready(src, target);

  function initCheckpointer() {
    if (checkpointer) {
      return PouchPromise$1.resolve();
    }
    return generateReplicationId(src, target, opts).then(function (res) {
      repId = res;

      var checkpointOpts = {};
      if (opts.checkpoint === false) {
        checkpointOpts = { writeSourceCheckpoint: false, writeTargetCheckpoint: false };
      } else if (opts.checkpoint === 'source') {
        checkpointOpts = { writeSourceCheckpoint: true, writeTargetCheckpoint: false };
      } else if (opts.checkpoint === 'target') {
        checkpointOpts = { writeSourceCheckpoint: false, writeTargetCheckpoint: true };
      } else {
        checkpointOpts = { writeSourceCheckpoint: true, writeTargetCheckpoint: true };
      }

      checkpointer = new Checkpointer(src, target, repId, returnValue, checkpointOpts);
    });
  }

  function writeDocs() {
    changedDocs = [];

    if (currentBatch.docs.length === 0) {
      return;
    }
    var docs = currentBatch.docs;
    var bulkOpts = {timeout: opts.timeout};
    return target.bulkDocs({docs: docs, new_edits: false}, bulkOpts).then(function (res) {
      /* istanbul ignore if */
      if (returnValue.cancelled) {
        completeReplication();
        throw new Error('cancelled');
      }

      // `res` doesn't include full documents (which live in `docs`), so we create a map of 
      // (id -> error), and check for errors while iterating over `docs`
      var errorsById = Object.create(null);
      res.forEach(function (res) {
        if (res.error) {
          errorsById[res.id] = res;
        }
      });

      var errorsNo = Object.keys(errorsById).length;
      result.doc_write_failures += errorsNo;
      result.docs_written += docs.length - errorsNo;

      docs.forEach(function (doc) {
        var error = errorsById[doc._id];
        if (error) {
          result.errors.push(error);
          if (error.name === 'unauthorized' || error.name === 'forbidden') {
            returnValue.emit('denied', clone(error));
          } else {
            throw error;
          }
        } else {
          changedDocs.push(doc);
        }
      });

    }, function (err) {
      result.doc_write_failures += docs.length;
      throw err;
    });
  }

  function finishBatch() {
    if (currentBatch.error) {
      throw new Error('There was a problem getting docs.');
    }
    result.last_seq = last_seq = currentBatch.seq;
    var outResult = clone(result);
    if (changedDocs.length) {
      outResult.docs = changedDocs;
      returnValue.emit('change', outResult);
    }
    writingCheckpoint = true;
    return checkpointer.writeCheckpoint(currentBatch.seq,
        session).then(function () {
      writingCheckpoint = false;
      /* istanbul ignore if */
      if (returnValue.cancelled) {
        completeReplication();
        throw new Error('cancelled');
      }
      currentBatch = undefined;
      getChanges();
    }).catch(function (err) {
      onCheckpointError(err);
      throw err;
    });
  }

  function getDiffs() {
    var diff = {};
    currentBatch.changes.forEach(function (change) {
      // Couchbase Sync Gateway emits these, but we can ignore them
      /* istanbul ignore if */
      if (change.id === "_user/") {
        return;
      }
      diff[change.id] = change.changes.map(function (x) {
        return x.rev;
      });
    });
    return target.revsDiff(diff).then(function (diffs) {
      /* istanbul ignore if */
      if (returnValue.cancelled) {
        completeReplication();
        throw new Error('cancelled');
      }
      // currentBatch.diffs elements are deleted as the documents are written
      currentBatch.diffs = diffs;
    });
  }

  function getBatchDocs() {
    return getDocs(src, target, currentBatch.diffs, returnValue).then(function (got) {
      currentBatch.error = !got.ok;
      got.docs.forEach(function (doc) {
        delete currentBatch.diffs[doc._id];
        result.docs_read++;
        currentBatch.docs.push(doc);
      });
    });
  }

  function startNextBatch() {
    if (returnValue.cancelled || currentBatch) {
      return;
    }
    if (batches.length === 0) {
      processPendingBatch(true);
      return;
    }
    currentBatch = batches.shift();
    getDiffs()
      .then(getBatchDocs)
      .then(writeDocs)
      .then(finishBatch)
      .then(startNextBatch)
      .catch(function (err) {
        abortReplication('batch processing terminated with error', err);
      });
  }


  function processPendingBatch(immediate) {
    if (pendingBatch.changes.length === 0) {
      if (batches.length === 0 && !currentBatch) {
        if ((continuous && changesOpts.live) || changesCompleted) {
          returnValue.state = 'pending';
          returnValue.emit('paused');
        }
        if (changesCompleted) {
          completeReplication();
        }
      }
      return;
    }
    if (
      immediate ||
      changesCompleted ||
      pendingBatch.changes.length >= batch_size
    ) {
      batches.push(pendingBatch);
      pendingBatch = {
        seq: 0,
        changes: [],
        docs: []
      };
      if (returnValue.state === 'pending' || returnValue.state === 'stopped') {
        returnValue.state = 'active';
        returnValue.emit('active');
      }
      startNextBatch();
    }
  }


  function abortReplication(reason, err) {
    if (replicationCompleted) {
      return;
    }
    if (!err.message) {
      err.message = reason;
    }
    result.ok = false;
    result.status = 'aborting';
    batches = [];
    pendingBatch = {
      seq: 0,
      changes: [],
      docs: []
    };
    completeReplication(err);
  }


  function completeReplication(fatalError) {
    if (replicationCompleted) {
      return;
    }
    /* istanbul ignore if */
    if (returnValue.cancelled) {
      result.status = 'cancelled';
      if (writingCheckpoint) {
        return;
      }
    }
    result.status = result.status || 'complete';
    result.end_time = new Date();
    result.last_seq = last_seq;
    replicationCompleted = true;

    if (fatalError) {
      // need to extend the error because Firefox considers ".result" read-only
      fatalError = createError(fatalError);
      fatalError.result = result;

      if (fatalError.name === 'unauthorized' || fatalError.name === 'forbidden') {
        returnValue.emit('error', fatalError);
        returnValue.removeAllListeners();
      } else {
        backOff(opts, returnValue, fatalError, function () {
          replicate(src, target, opts, returnValue);
        });
      }
    } else {
      returnValue.emit('complete', result);
      returnValue.removeAllListeners();
    }
  }


  function onChange(change) {
    /* istanbul ignore if */
    if (returnValue.cancelled) {
      return completeReplication();
    }
    var filter = filterChange(opts)(change);
    if (!filter) {
      return;
    }
    pendingBatch.seq = change.seq;
    pendingBatch.changes.push(change);
    processPendingBatch(batches.length === 0 && changesOpts.live);
  }


  function onChangesComplete(changes) {
    changesPending = false;
    /* istanbul ignore if */
    if (returnValue.cancelled) {
      return completeReplication();
    }

    // if no results were returned then we're done,
    // else fetch more
    if (changes.results.length > 0) {
      changesOpts.since = changes.last_seq;
      getChanges();
      processPendingBatch(true);
    } else {

      var complete = function () {
        if (continuous) {
          changesOpts.live = true;
          getChanges();
        } else {
          changesCompleted = true;
        }
        processPendingBatch(true);
      };

      // update the checkpoint so we start from the right seq next time
      if (!currentBatch && changes.results.length === 0) {
        writingCheckpoint = true;
        checkpointer.writeCheckpoint(changes.last_seq,
            session).then(function () {
          writingCheckpoint = false;
          result.last_seq = last_seq = changes.last_seq;
          complete();
        })
        .catch(onCheckpointError);
      } else {
        complete();
      }
    }
  }


  function onChangesError(err) {
    changesPending = false;
    /* istanbul ignore if */
    if (returnValue.cancelled) {
      return completeReplication();
    }
    abortReplication('changes rejected', err);
  }


  function getChanges() {
    if (!(
      !changesPending &&
      !changesCompleted &&
      batches.length < batches_limit
      )) {
      return;
    }
    changesPending = true;
    function abortChanges() {
      changes.cancel();
    }
    function removeListener() {
      returnValue.removeListener('cancel', abortChanges);
    }

    if (returnValue._changes) { // remove old changes() and listeners
      returnValue.removeListener('cancel', returnValue._abortChanges);
      returnValue._changes.cancel();
    }
    returnValue.once('cancel', abortChanges);

    var changes = src.changes(changesOpts)
      .on('change', onChange);
    changes.then(removeListener, removeListener);
    changes.then(onChangesComplete)
      .catch(onChangesError);

    if (opts.retry) {
      // save for later so we can cancel if necessary
      returnValue._changes = changes;
      returnValue._abortChanges = abortChanges;
    }
  }


  function startChanges() {
    initCheckpointer().then(function () {
      /* istanbul ignore if */
      if (returnValue.cancelled) {
        completeReplication();
        return;
      }
      return checkpointer.getCheckpoint().then(function (checkpoint) {
        last_seq = checkpoint;
        changesOpts = {
          since: last_seq,
          limit: batch_size,
          batch_size: batch_size,
          style: 'all_docs',
          doc_ids: doc_ids,
          selector: selector,
          return_docs: true // required so we know when we're done
        };
        if (opts.filter) {
          if (typeof opts.filter !== 'string') {
            // required for the client-side filter in onChange
            changesOpts.include_docs = true;
          } else { // ddoc filter
            changesOpts.filter = opts.filter;
          }
        }
        if ('heartbeat' in opts) {
          changesOpts.heartbeat = opts.heartbeat;
        }
        if ('timeout' in opts) {
          changesOpts.timeout = opts.timeout;
        }
        if (opts.query_params) {
          changesOpts.query_params = opts.query_params;
        }
        if (opts.view) {
          changesOpts.view = opts.view;
        }
        getChanges();
      });
    }).catch(function (err) {
      abortReplication('getCheckpoint rejected with ', err);
    });
  }

  /* istanbul ignore next */
  function onCheckpointError(err) {
    writingCheckpoint = false;
    abortReplication('writeCheckpoint completed with error', err);
  }

  /* istanbul ignore if */
  if (returnValue.cancelled) { // cancelled immediately
    completeReplication();
    return;
  }

  if (!returnValue._addedListeners) {
    returnValue.once('cancel', completeReplication);

    if (typeof opts.complete === 'function') {
      returnValue.once('error', opts.complete);
      returnValue.once('complete', function (result) {
        opts.complete(null, result);
      });
    }
    returnValue._addedListeners = true;
  }

  if (typeof opts.since === 'undefined') {
    startChanges();
  } else {
    initCheckpointer().then(function () {
      writingCheckpoint = true;
      return checkpointer.writeCheckpoint(opts.since, session);
    }).then(function () {
      writingCheckpoint = false;
      /* istanbul ignore if */
      if (returnValue.cancelled) {
        completeReplication();
        return;
      }
      last_seq = opts.since;
      startChanges();
    }).catch(onCheckpointError);
  }
}

// We create a basic promise so the caller can cancel the replication possibly
// before we have actually started listening to changes etc
inherits(Replication, events.EventEmitter);
function Replication() {
  events.EventEmitter.call(this);
  this.cancelled = false;
  this.state = 'pending';
  var self = this;
  var promise = new PouchPromise$1(function (fulfill, reject) {
    self.once('complete', fulfill);
    self.once('error', reject);
  });
  self.then = function (resolve, reject) {
    return promise.then(resolve, reject);
  };
  self.catch = function (reject) {
    return promise.catch(reject);
  };
  // As we allow error handling via "error" event as well,
  // put a stub in here so that rejecting never throws UnhandledError.
  self.catch(function () {});
}

Replication.prototype.cancel = function () {
  this.cancelled = true;
  this.state = 'cancelled';
  this.emit('cancel');
};

Replication.prototype.ready = function (src, target) {
  var self = this;
  if (self._readyCalled) {
    return;
  }
  self._readyCalled = true;

  function onDestroy() {
    self.cancel();
  }
  src.once('destroyed', onDestroy);
  target.once('destroyed', onDestroy);
  function cleanup() {
    src.removeListener('destroyed', onDestroy);
    target.removeListener('destroyed', onDestroy);
  }
  self.once('complete', cleanup);
};

function toPouch(db, opts) {
  var PouchConstructor = opts.PouchConstructor;
  if (typeof db === 'string') {
    return new PouchConstructor(db, opts);
  } else {
    return db;
  }
}

function replicateWrapper(src, target, opts, callback) {

  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  if (typeof opts === 'undefined') {
    opts = {};
  }

  if (opts.doc_ids && !Array.isArray(opts.doc_ids)) {
    throw createError(BAD_REQUEST,
                       "`doc_ids` filter parameter is not a list.");
  }

  opts.complete = callback;
  opts = clone(opts);
  opts.continuous = opts.continuous || opts.live;
  opts.retry = ('retry' in opts) ? opts.retry : false;
  /*jshint validthis:true */
  opts.PouchConstructor = opts.PouchConstructor || this;
  var replicateRet = new Replication(opts);
  var srcPouch = toPouch(src, opts);
  var targetPouch = toPouch(target, opts);
  replicate(srcPouch, targetPouch, opts, replicateRet);
  return replicateRet;
}

inherits(Sync, events.EventEmitter);
function sync$1(src, target, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  if (typeof opts === 'undefined') {
    opts = {};
  }
  opts = clone(opts);
  /*jshint validthis:true */
  opts.PouchConstructor = opts.PouchConstructor || this;
  src = toPouch(src, opts);
  target = toPouch(target, opts);
  return new Sync(src, target, opts, callback);
}

function Sync(src, target, opts, callback) {
  var self = this;
  this.canceled = false;

  var optsPush = opts.push ? $inject_Object_assign({}, opts, opts.push) : opts;
  var optsPull = opts.pull ? $inject_Object_assign({}, opts, opts.pull) : opts;

  this.push = replicateWrapper(src, target, optsPush);
  this.pull = replicateWrapper(target, src, optsPull);

  this.pushPaused = true;
  this.pullPaused = true;

  function pullChange(change) {
    self.emit('change', {
      direction: 'pull',
      change: change
    });
  }
  function pushChange(change) {
    self.emit('change', {
      direction: 'push',
      change: change
    });
  }
  function pushDenied(doc) {
    self.emit('denied', {
      direction: 'push',
      doc: doc
    });
  }
  function pullDenied(doc) {
    self.emit('denied', {
      direction: 'pull',
      doc: doc
    });
  }
  function pushPaused() {
    self.pushPaused = true;
    /* istanbul ignore if */
    if (self.pullPaused) {
      self.emit('paused');
    }
  }
  function pullPaused() {
    self.pullPaused = true;
    /* istanbul ignore if */
    if (self.pushPaused) {
      self.emit('paused');
    }
  }
  function pushActive() {
    self.pushPaused = false;
    /* istanbul ignore if */
    if (self.pullPaused) {
      self.emit('active', {
        direction: 'push'
      });
    }
  }
  function pullActive() {
    self.pullPaused = false;
    /* istanbul ignore if */
    if (self.pushPaused) {
      self.emit('active', {
        direction: 'pull'
      });
    }
  }

  var removed = {};

  function removeAll(type) { // type is 'push' or 'pull'
    return function (event, func) {
      var isChange = event === 'change' &&
        (func === pullChange || func === pushChange);
      var isDenied = event === 'denied' &&
        (func === pullDenied || func === pushDenied);
      var isPaused = event === 'paused' &&
        (func === pullPaused || func === pushPaused);
      var isActive = event === 'active' &&
        (func === pullActive || func === pushActive);

      if (isChange || isDenied || isPaused || isActive) {
        if (!(event in removed)) {
          removed[event] = {};
        }
        removed[event][type] = true;
        if (Object.keys(removed[event]).length === 2) {
          // both push and pull have asked to be removed
          self.removeAllListeners(event);
        }
      }
    };
  }

  if (opts.live) {
    this.push.on('complete', self.pull.cancel.bind(self.pull));
    this.pull.on('complete', self.push.cancel.bind(self.push));
  }

  function addOneListener(ee, event, listener) {
    if (ee.listeners(event).indexOf(listener) == -1) {
      ee.on(event, listener);
    }
  }

  this.on('newListener', function (event) {
    if (event === 'change') {
      addOneListener(self.pull, 'change', pullChange);
      addOneListener(self.push, 'change', pushChange);
    } else if (event === 'denied') {
      addOneListener(self.pull, 'denied', pullDenied);
      addOneListener(self.push, 'denied', pushDenied);
    } else if (event === 'active') {
      addOneListener(self.pull, 'active', pullActive);
      addOneListener(self.push, 'active', pushActive);
    } else if (event === 'paused') {
      addOneListener(self.pull, 'paused', pullPaused);
      addOneListener(self.push, 'paused', pushPaused);
    }
  });

  this.on('removeListener', function (event) {
    if (event === 'change') {
      self.pull.removeListener('change', pullChange);
      self.push.removeListener('change', pushChange);
    } else if (event === 'denied') {
      self.pull.removeListener('denied', pullDenied);
      self.push.removeListener('denied', pushDenied);
    } else if (event === 'active') {
      self.pull.removeListener('active', pullActive);
      self.push.removeListener('active', pushActive);
    } else if (event === 'paused') {
      self.pull.removeListener('paused', pullPaused);
      self.push.removeListener('paused', pushPaused);
    }
  });

  this.pull.on('removeListener', removeAll('pull'));
  this.push.on('removeListener', removeAll('push'));

  var promise = PouchPromise$1.all([
    this.push,
    this.pull
  ]).then(function (resp) {
    var out = {
      push: resp[0],
      pull: resp[1]
    };
    self.emit('complete', out);
    if (callback) {
      callback(null, out);
    }
    self.removeAllListeners();
    return out;
  }, function (err) {
    self.cancel();
    if (callback) {
      // if there's a callback, then the callback can receive
      // the error event
      callback(err);
    } else {
      // if there's no callback, then we're safe to emit an error
      // event, which would otherwise throw an unhandled error
      // due to 'error' being a special event in EventEmitters
      self.emit('error', err);
    }
    self.removeAllListeners();
    if (callback) {
      // no sense throwing if we're already emitting an 'error' event
      throw err;
    }
  });

  this.then = function (success, err) {
    return promise.then(success, err);
  };

  this.catch = function (err) {
    return promise.catch(err);
  };
}

Sync.prototype.cancel = function () {
  if (!this.canceled) {
    this.canceled = true;
    this.push.cancel();
    this.pull.cancel();
  }
};

function replication(PouchDB) {
  PouchDB.replicate = replicateWrapper;
  PouchDB.sync = sync$1;

  Object.defineProperty(PouchDB.prototype, 'replicate', {
    get: function () {
      var self = this;
      return {
        from: function (other, opts, callback) {
          return self.constructor.replicate(other, self, opts, callback);
        },
        to: function (other, opts, callback) {
          return self.constructor.replicate(self, other, opts, callback);
        }
      };
    }
  });

  PouchDB.prototype.sync = function (dbName, opts, callback) {
    return this.constructor.sync(this, dbName, opts, callback);
  };
}

PouchDB$5.plugin(IDBPouch)
  .plugin(WebSqlPouch)
  .plugin(HttpPouch$1)
  .plugin(mapreduce)
  .plugin(replication);

// Pull from src because pouchdb-node/pouchdb-browser themselves
// are aggressively optimized and jsnext:main would normally give us this
// aggressive bundle.

module.exports = PouchDB$5;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"argsarray":1,"debug":2,"events":4,"immediate":6,"inherits":7,"lie":8,"spark-md5":11,"uuid":12,"vuvuzela":17}],11:[function(require,module,exports){
(function (factory) {
    if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else {
        // Browser globals (with support for web workers)
        var glob;

        try {
            glob = window;
        } catch (e) {
            glob = self;
        }

        glob.SparkMD5 = factory();
    }
}(function (undefined) {

    'use strict';

    /*
     * Fastest md5 implementation around (JKM md5).
     * Credits: Joseph Myers
     *
     * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
     * @see http://jsperf.com/md5-shootout/7
     */

    /* this function is much faster,
      so if possible we use it. Some IEs
      are the only ones I know of that
      need the idiotic second function,
      generated by an if clause.  */
    var add32 = function (a, b) {
        return (a + b) & 0xFFFFFFFF;
    },
        hex_chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];


    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }

    function md5cycle(x, k) {
        var a = x[0],
            b = x[1],
            c = x[2],
            d = x[3];

        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;

        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;

        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;

        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b  = (b << 21 |b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b  = (b << 21 |b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b  = (b << 21 |b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b  = (b << 21 | b >>> 11) + c | 0;

        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
    }

    function md5blk(s) {
        var md5blks = [],
            i; /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    }

    function md5blk_array(a) {
        var md5blks = [],
            i; /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
        }
        return md5blks;
    }

    function md51(s) {
        var n = s.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp,
            lo,
            hi;

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        length = s.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        }
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;

        md5cycle(state, tail);
        return state;
    }

    function md51_array(a) {
        var n = a.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp,
            lo,
            hi;

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
        }

        // Not sure if it is a bug, however IE10 will always produce a sub array of length 1
        // containing the last element of the parent array if the sub array specified starts
        // beyond the length of the parent array - weird.
        // https://connect.microsoft.com/IE/feedback/details/771452/typed-array-subarray-issue
        a = (i - 64) < n ? a.subarray(i - 64) : new Uint8Array(0);

        length = a.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= a[i] << ((i % 4) << 3);
        }

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;

        md5cycle(state, tail);

        return state;
    }

    function rhex(n) {
        var s = '',
            j;
        for (j = 0; j < 4; j += 1) {
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
        }
        return s;
    }

    function hex(x) {
        var i;
        for (i = 0; i < x.length; i += 1) {
            x[i] = rhex(x[i]);
        }
        return x.join('');
    }

    // In some cases the fast add32 function cannot be used..
    if (hex(md51('hello')) !== '5d41402abc4b2a76b9719d911017c592') {
        add32 = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };
    }

    // ---------------------------------------------------

    /**
     * ArrayBuffer slice polyfill.
     *
     * @see https://github.com/ttaubert/node-arraybuffer-slice
     */

    if (typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.prototype.slice) {
        (function () {
            function clamp(val, length) {
                val = (val | 0) || 0;

                if (val < 0) {
                    return Math.max(val + length, 0);
                }

                return Math.min(val, length);
            }

            ArrayBuffer.prototype.slice = function (from, to) {
                var length = this.byteLength,
                    begin = clamp(from, length),
                    end = length,
                    num,
                    target,
                    targetArray,
                    sourceArray;

                if (to !== undefined) {
                    end = clamp(to, length);
                }

                if (begin > end) {
                    return new ArrayBuffer(0);
                }

                num = end - begin;
                target = new ArrayBuffer(num);
                targetArray = new Uint8Array(target);

                sourceArray = new Uint8Array(this, begin, num);
                targetArray.set(sourceArray);

                return target;
            };
        })();
    }

    // ---------------------------------------------------

    /**
     * Helpers.
     */

    function toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
            str = unescape(encodeURIComponent(str));
        }

        return str;
    }

    function utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length,
           buff = new ArrayBuffer(length),
           arr = new Uint8Array(buff),
           i;

        for (i = 0; i < length; i += 1) {
            arr[i] = str.charCodeAt(i);
        }

        return returnUInt8Array ? arr : buff;
    }

    function arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
    }

    function concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);

        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);

        return returnUInt8Array ? result : result.buffer;
    }

    function hexToBinaryString(hex) {
        var bytes = [],
            length = hex.length,
            x;

        for (x = 0; x < length - 1; x += 2) {
            bytes.push(parseInt(hex.substr(x, 2), 16));
        }

        return String.fromCharCode.apply(String, bytes);
    }

    // ---------------------------------------------------

    /**
     * SparkMD5 OOP implementation.
     *
     * Use this class to perform an incremental md5, otherwise use the
     * static methods instead.
     */

    function SparkMD5() {
        // call reset to init the instance
        this.reset();
    }

    /**
     * Appends a string.
     * A conversion will be applied if an utf8 string is detected.
     *
     * @param {String} str The string to be appended
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.append = function (str) {
        // Converts the string to utf8 bytes if necessary
        // Then append as binary
        this.appendBinary(toUtf8(str));

        return this;
    };

    /**
     * Appends a binary string.
     *
     * @param {String} contents The binary string to be appended
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.appendBinary = function (contents) {
        this._buff += contents;
        this._length += contents.length;

        var length = this._buff.length,
            i;

        for (i = 64; i <= length; i += 64) {
            md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
        }

        this._buff = this._buff.substring(i - 64);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.prototype.end = function (raw) {
        var buff = this._buff,
            length = buff.length,
            i,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff.charCodeAt(i) << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = hex(this._hash);

        if (raw) {
            ret = hexToBinaryString(ret);
        }

        this.reset();

        return ret;
    };

    /**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.reset = function () {
        this._buff = '';
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */
    SparkMD5.prototype.getState = function () {
        return {
            buff: this._buff,
            length: this._length,
            hash: this._hash
        };
    };

    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.setState = function (state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;

        return this;
    };

    /**
     * Releases memory used by the incremental buffer and other additional
     * resources. If you plan to use the instance again, use reset instead.
     */
    SparkMD5.prototype.destroy = function () {
        delete this._hash;
        delete this._buff;
        delete this._length;
    };

    /**
     * Finish the final calculation based on the tail.
     *
     * @param {Array}  tail   The tail (will be modified)
     * @param {Number} length The length of the remaining buffer
     */
    SparkMD5.prototype._finish = function (tail, length) {
        var i = length,
            tmp,
            lo,
            hi;

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(this._hash, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;
        md5cycle(this._hash, tail);
    };

    /**
     * Performs the md5 hash on a string.
     * A conversion will be applied if utf8 string is detected.
     *
     * @param {String}  str The string
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.hash = function (str, raw) {
        // Converts the string to utf8 bytes if necessary
        // Then compute it using the binary function
        return SparkMD5.hashBinary(toUtf8(str), raw);
    };

    /**
     * Performs the md5 hash on a binary string.
     *
     * @param {String}  content The binary string
     * @param {Boolean} raw     True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.hashBinary = function (content, raw) {
        var hash = md51(content),
            ret = hex(hash);

        return raw ? hexToBinaryString(ret) : ret;
    };

    // ---------------------------------------------------

    /**
     * SparkMD5 OOP implementation for array buffers.
     *
     * Use this class to perform an incremental md5 ONLY for array buffers.
     */
    SparkMD5.ArrayBuffer = function () {
        // call reset to init the instance
        this.reset();
    };

    /**
     * Appends an array buffer.
     *
     * @param {ArrayBuffer} arr The array to be appended
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.append = function (arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true),
            length = buff.length,
            i;

        this._length += arr.byteLength;

        for (i = 64; i <= length; i += 64) {
            md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
        }

        this._buff = (i - 64) < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.ArrayBuffer.prototype.end = function (raw) {
        var buff = this._buff,
            length = buff.length,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            i,
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff[i] << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = hex(this._hash);

        if (raw) {
            ret = hexToBinaryString(ret);
        }

        this.reset();

        return ret;
    };

    /**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.reset = function () {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */
    SparkMD5.ArrayBuffer.prototype.getState = function () {
        var state = SparkMD5.prototype.getState.call(this);

        // Convert buffer to a string
        state.buff = arrayBuffer2Utf8Str(state.buff);

        return state;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.setState = function (state) {
        // Convert string to buffer
        state.buff = utf8Str2ArrayBuffer(state.buff, true);

        return SparkMD5.prototype.setState.call(this, state);
    };

    SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;

    SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;

    /**
     * Performs the md5 hash on an array buffer.
     *
     * @param {ArrayBuffer} arr The array buffer
     * @param {Boolean}     raw True to get the raw string, false to get the hex one
     *
     * @return {String} The result
     */
    SparkMD5.ArrayBuffer.hash = function (arr, raw) {
        var hash = md51_array(new Uint8Array(arr)),
            ret = hex(hash);

        return raw ? hexToBinaryString(ret) : ret;
    };

    return SparkMD5;
}));

},{}],12:[function(require,module,exports){
var v1 = require('./v1');
var v4 = require('./v4');

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;

},{"./v1":15,"./v4":16}],13:[function(require,module,exports){
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;

},{}],14:[function(require,module,exports){
(function (global){
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],15:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;

},{"./lib/bytesToUuid":13,"./lib/rng":14}],16:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

},{"./lib/bytesToUuid":13,"./lib/rng":14}],17:[function(require,module,exports){
'use strict';

/**
 * Stringify/parse functions that don't operate
 * recursively, so they avoid call stack exceeded
 * errors.
 */
exports.stringify = function stringify(input) {
  var queue = [];
  queue.push({obj: input});

  var res = '';
  var next, obj, prefix, val, i, arrayPrefix, keys, k, key, value, objPrefix;
  while ((next = queue.pop())) {
    obj = next.obj;
    prefix = next.prefix || '';
    val = next.val || '';
    res += prefix;
    if (val) {
      res += val;
    } else if (typeof obj !== 'object') {
      res += typeof obj === 'undefined' ? null : JSON.stringify(obj);
    } else if (obj === null) {
      res += 'null';
    } else if (Array.isArray(obj)) {
      queue.push({val: ']'});
      for (i = obj.length - 1; i >= 0; i--) {
        arrayPrefix = i === 0 ? '' : ',';
        queue.push({obj: obj[i], prefix: arrayPrefix});
      }
      queue.push({val: '['});
    } else { // object
      keys = [];
      for (k in obj) {
        if (obj.hasOwnProperty(k)) {
          keys.push(k);
        }
      }
      queue.push({val: '}'});
      for (i = keys.length - 1; i >= 0; i--) {
        key = keys[i];
        value = obj[key];
        objPrefix = (i > 0 ? ',' : '');
        objPrefix += JSON.stringify(key) + ':';
        queue.push({obj: value, prefix: objPrefix});
      }
      queue.push({val: '{'});
    }
  }
  return res;
};

// Convenience function for the parse function.
// This pop function is basically copied from
// pouchCollate.parseIndexableString
function pop(obj, stack, metaStack) {
  var lastMetaElement = metaStack[metaStack.length - 1];
  if (obj === lastMetaElement.element) {
    // popping a meta-element, e.g. an object whose value is another object
    metaStack.pop();
    lastMetaElement = metaStack[metaStack.length - 1];
  }
  var element = lastMetaElement.element;
  var lastElementIndex = lastMetaElement.index;
  if (Array.isArray(element)) {
    element.push(obj);
  } else if (lastElementIndex === stack.length - 2) { // obj with key+value
    var key = stack.pop();
    element[key] = obj;
  } else {
    stack.push(obj); // obj with key only
  }
}

exports.parse = function (str) {
  var stack = [];
  var metaStack = []; // stack for arrays and objects
  var i = 0;
  var collationIndex,parsedNum,numChar;
  var parsedString,lastCh,numConsecutiveSlashes,ch;
  var arrayElement, objElement;
  while (true) {
    collationIndex = str[i++];
    if (collationIndex === '}' ||
        collationIndex === ']' ||
        typeof collationIndex === 'undefined') {
      if (stack.length === 1) {
        return stack.pop();
      } else {
        pop(stack.pop(), stack, metaStack);
        continue;
      }
    }
    switch (collationIndex) {
      case ' ':
      case '\t':
      case '\n':
      case ':':
      case ',':
        break;
      case 'n':
        i += 3; // 'ull'
        pop(null, stack, metaStack);
        break;
      case 't':
        i += 3; // 'rue'
        pop(true, stack, metaStack);
        break;
      case 'f':
        i += 4; // 'alse'
        pop(false, stack, metaStack);
        break;
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '-':
        parsedNum = '';
        i--;
        while (true) {
          numChar = str[i++];
          if (/[\d\.\-e\+]/.test(numChar)) {
            parsedNum += numChar;
          } else {
            i--;
            break;
          }
        }
        pop(parseFloat(parsedNum), stack, metaStack);
        break;
      case '"':
        parsedString = '';
        lastCh = void 0;
        numConsecutiveSlashes = 0;
        while (true) {
          ch = str[i++];
          if (ch !== '"' || (lastCh === '\\' &&
              numConsecutiveSlashes % 2 === 1)) {
            parsedString += ch;
            lastCh = ch;
            if (lastCh === '\\') {
              numConsecutiveSlashes++;
            } else {
              numConsecutiveSlashes = 0;
            }
          } else {
            break;
          }
        }
        pop(JSON.parse('"' + parsedString + '"'), stack, metaStack);
        break;
      case '[':
        arrayElement = { element: [], index: stack.length };
        stack.push(arrayElement.element);
        metaStack.push(arrayElement);
        break;
      case '{':
        objElement = { element: {}, index: stack.length };
        stack.push(objElement.element);
        metaStack.push(objElement);
        break;
      default:
        throw new Error(
          'unexpectedly reached end of input: ' + collationIndex);
    }
  }
};

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUUID = exports.measurementsDB = exports.chronicleDB = exports.annotatorsDB = exports.animalsDB = exports.adjectivesDB = exports.measurementsURL = exports.chronicleURL = exports.animalsURL = exports.adjectivesURL = exports.annotatorsURL = exports.uuidURL = undefined;

var _pouchdb = require('pouchdb');

var _pouchdb2 = _interopRequireDefault(_pouchdb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const baseURL='http://rsnacrowdquant.cloudapp.net:5984';
var baseURL = 'http://rsnacrowdquant2.eastus2.cloudapp.azure.com:5984'; // const baseUrl='http://127.0.0.1:5984';
var uuidURL = exports.uuidURL = baseURL + '/_uuids';
var annotatorsURL = exports.annotatorsURL = baseURL + '/annotators';
var adjectivesURL = exports.adjectivesURL = baseURL + '/adjectives';
var animalsURL = exports.animalsURL = baseURL + '/animals';
//export const chronicleURL = `${baseURL}/chronicle`;
var chronicleURL = exports.chronicleURL = baseURL + '/compressed-chronicle';

var measurementsURL = exports.measurementsURL = baseURL + '/measurements';

// console.log('url:', uuidUrl);

// export const uuidDB = new PouchDB(uuidURL);
var adjectivesDB = exports.adjectivesDB = new _pouchdb2.default(adjectivesURL);
var animalsDB = exports.animalsDB = new _pouchdb2.default(animalsURL);
var annotatorsDB = exports.annotatorsDB = new _pouchdb2.default(annotatorsURL);
var chronicleDB = exports.chronicleDB = new _pouchdb2.default(chronicleURL);
var measurementsDB = exports.measurementsDB = new _pouchdb2.default(measurementsURL);

var getUUID = exports.getUUID = function getUUID() {
  return new Promise(function (resolve, reject) {
    $.get(uuidURL, function (_ref) {
      var uuids = _ref.uuids;
      resolve(uuids[0]);
    });
    // const uuid = doc.uuids[0];
    // console.log('uuid:', uuid);
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiLmpzIl0sIm5hbWVzIjpbImJhc2VVUkwiLCJ1dWlkVVJMIiwiYW5ub3RhdG9yc1VSTCIsImFkamVjdGl2ZXNVUkwiLCJhbmltYWxzVVJMIiwiY2hyb25pY2xlVVJMIiwibWVhc3VyZW1lbnRzVVJMIiwiYWRqZWN0aXZlc0RCIiwiYW5pbWFsc0RCIiwiYW5ub3RhdG9yc0RCIiwiY2hyb25pY2xlREIiLCJtZWFzdXJlbWVudHNEQiIsImdldFVVSUQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIiQiLCJnZXQiLCJ1dWlkcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOzs7Ozs7QUFFQTtBQUNBLElBQU1BLFVBQVEsd0RBQWQsQyxDQUpBO0FBTU8sSUFBTUMsNEJBQWFELE9BQWIsWUFBTjtBQUNBLElBQU1FLHdDQUFtQkYsT0FBbkIsZ0JBQU47QUFDQSxJQUFNRyx3Q0FBbUJILE9BQW5CLGdCQUFOO0FBQ0EsSUFBTUksa0NBQWdCSixPQUFoQixhQUFOO0FBQ1A7QUFDTyxJQUFNSyxzQ0FBa0JMLE9BQWxCLDBCQUFOOztBQUVBLElBQU1NLDRDQUFxQk4sT0FBckIsa0JBQU47O0FBRVA7O0FBRUE7QUFDTyxJQUFNTyxzQ0FBZSxzQkFBWUosYUFBWixDQUFyQjtBQUNBLElBQU1LLGdDQUFZLHNCQUFZSixVQUFaLENBQWxCO0FBQ0EsSUFBTUssc0NBQWUsc0JBQVlQLGFBQVosQ0FBckI7QUFDQSxJQUFNUSxvQ0FBYyxzQkFBWUwsWUFBWixDQUFwQjtBQUNBLElBQU1NLDBDQUFpQixzQkFBWUwsZUFBWixDQUF2Qjs7QUFFQSxJQUFNTSw0QkFBVSxTQUFWQSxPQUFVLEdBQU07QUFDM0IsU0FBTyxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDQyxNQUFFQyxHQUFGLENBQU1oQixPQUFOLEVBQWUsZ0JBQWE7QUFBQSxVQUFYaUIsS0FBVyxRQUFYQSxLQUFXO0FBQUNKLGNBQVFJLE1BQU0sQ0FBTixDQUFSO0FBQWtCLEtBQS9DO0FBQ0U7QUFDQTtBQUNILEdBSk0sQ0FBUDtBQUtELENBTk0iLCJmaWxlIjoiZGIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjb25zdCBiYXNlVXJsPSdodHRwOi8vMTI3LjAuMC4xOjU5ODQnO1xuaW1wb3J0IFBvdWNoREIgZnJvbSAncG91Y2hkYic7XG5cbi8vY29uc3QgYmFzZVVSTD0naHR0cDovL3JzbmFjcm93ZHF1YW50LmNsb3VkYXBwLm5ldDo1OTg0JztcbmNvbnN0IGJhc2VVUkw9J2h0dHA6Ly9yc25hY3Jvd2RxdWFudDIuZWFzdHVzMi5jbG91ZGFwcC5henVyZS5jb206NTk4NCc7XG5cbmV4cG9ydCBjb25zdCB1dWlkVVJMID0gYCR7YmFzZVVSTH0vX3V1aWRzYDtcbmV4cG9ydCBjb25zdCBhbm5vdGF0b3JzVVJMID0gYCR7YmFzZVVSTH0vYW5ub3RhdG9yc2A7XG5leHBvcnQgY29uc3QgYWRqZWN0aXZlc1VSTCA9IGAke2Jhc2VVUkx9L2FkamVjdGl2ZXNgO1xuZXhwb3J0IGNvbnN0IGFuaW1hbHNVUkwgPSBgJHtiYXNlVVJMfS9hbmltYWxzYDtcbi8vZXhwb3J0IGNvbnN0IGNocm9uaWNsZVVSTCA9IGAke2Jhc2VVUkx9L2Nocm9uaWNsZWA7XG5leHBvcnQgY29uc3QgY2hyb25pY2xlVVJMID0gYCR7YmFzZVVSTH0vY29tcHJlc3NlZC1jaHJvbmljbGVgO1xuXG5leHBvcnQgY29uc3QgbWVhc3VyZW1lbnRzVVJMID0gYCR7YmFzZVVSTH0vbWVhc3VyZW1lbnRzYDtcblxuLy8gY29uc29sZS5sb2coJ3VybDonLCB1dWlkVXJsKTtcblxuLy8gZXhwb3J0IGNvbnN0IHV1aWREQiA9IG5ldyBQb3VjaERCKHV1aWRVUkwpO1xuZXhwb3J0IGNvbnN0IGFkamVjdGl2ZXNEQiA9IG5ldyBQb3VjaERCKGFkamVjdGl2ZXNVUkwpO1xuZXhwb3J0IGNvbnN0IGFuaW1hbHNEQiA9IG5ldyBQb3VjaERCKGFuaW1hbHNVUkwpO1xuZXhwb3J0IGNvbnN0IGFubm90YXRvcnNEQiA9IG5ldyBQb3VjaERCKGFubm90YXRvcnNVUkwpO1xuZXhwb3J0IGNvbnN0IGNocm9uaWNsZURCID0gbmV3IFBvdWNoREIoY2hyb25pY2xlVVJMKTtcbmV4cG9ydCBjb25zdCBtZWFzdXJlbWVudHNEQiA9IG5ldyBQb3VjaERCKG1lYXN1cmVtZW50c1VSTCk7XG5cbmV4cG9ydCBjb25zdCBnZXRVVUlEID0gKCkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICQuZ2V0KHV1aWRVUkwsICh7dXVpZHN9KSA9PiB7cmVzb2x2ZSh1dWlkc1swXSl9KTtcbiAgICAgIC8vIGNvbnN0IHV1aWQgPSBkb2MudXVpZHNbMF07XG4gICAgICAvLyBjb25zb2xlLmxvZygndXVpZDonLCB1dWlkKTtcbiAgfSk7XG59O1xuIl19
},{"pouchdb":10}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _login = require('../login/login');

var _login2 = _interopRequireDefault(_login);

var _viewer = require('../viewer/viewer');

var _viewer2 = _interopRequireDefault(_viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  $modal: $('.error-modal'),
  $overlay: $('.loading-overlay'),
  logout: function logout() {
    this.$modal.removeClass('show');
    this.$overlay.addClass('invisible');

    _login2.default.logout();
  },
  nextCase: function nextCase() {
    this.hide();

    _viewer2.default.getNextCase();
  },
  show: function show() {
    this.$modal.addClass('show');
    this.$overlay.removeClass('invisible');
  },
  hide: function hide() {
    this.$modal.removeClass('show');
    this.$overlay.addClass('invisible');
  },
  init: function init() {
    var _this = this;

    this.$modal.find('.ok').on('click', function () {
      return _this.hide();
    });
    // this.$modal.find('.next-case').on('click', () => this.nextCase());
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGFsLmpzIl0sIm5hbWVzIjpbIiRtb2RhbCIsIiQiLCIkb3ZlcmxheSIsImxvZ291dCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJuZXh0Q2FzZSIsImhpZGUiLCJnZXROZXh0Q2FzZSIsInNob3ciLCJpbml0IiwiZmluZCIsIm9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7a0JBRWU7QUFDYkEsVUFBUUMsRUFBRSxjQUFGLENBREs7QUFFYkMsWUFBVUQsRUFBRSxrQkFBRixDQUZHO0FBR2JFLFFBSGEsb0JBR0o7QUFDUCxTQUFLSCxNQUFMLENBQVlJLFdBQVosQ0FBd0IsTUFBeEI7QUFDQSxTQUFLRixRQUFMLENBQWNHLFFBQWQsQ0FBdUIsV0FBdkI7O0FBRUEsb0JBQU1GLE1BQU47QUFDRCxHQVJZO0FBU2JHLFVBVGEsc0JBU0Y7QUFDVCxTQUFLQyxJQUFMOztBQUVBLHFCQUFPQyxXQUFQO0FBQ0QsR0FiWTtBQWNiQyxNQWRhLGtCQWNOO0FBQ0wsU0FBS1QsTUFBTCxDQUFZSyxRQUFaLENBQXFCLE1BQXJCO0FBQ0EsU0FBS0gsUUFBTCxDQUFjRSxXQUFkLENBQTBCLFdBQTFCO0FBQ0QsR0FqQlk7QUFrQmJHLE1BbEJhLGtCQWtCTjtBQUNMLFNBQUtQLE1BQUwsQ0FBWUksV0FBWixDQUF3QixNQUF4QjtBQUNBLFNBQUtGLFFBQUwsQ0FBY0csUUFBZCxDQUF1QixXQUF2QjtBQUNELEdBckJZO0FBc0JiSyxNQXRCYSxrQkFzQk47QUFBQTs7QUFDTCxTQUFLVixNQUFMLENBQVlXLElBQVosQ0FBaUIsS0FBakIsRUFBd0JDLEVBQXhCLENBQTJCLE9BQTNCLEVBQW9DO0FBQUEsYUFBTSxNQUFLTCxJQUFMLEVBQU47QUFBQSxLQUFwQztBQUNBO0FBQ0Q7QUF6QlksQyIsImZpbGUiOiJtb2RhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2dpbiBmcm9tICcuLi9sb2dpbi9sb2dpbic7XG5pbXBvcnQgVmlld2VyIGZyb20gJy4uL3ZpZXdlci92aWV3ZXInO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICRtb2RhbDogJCgnLmVycm9yLW1vZGFsJyksXG4gICRvdmVybGF5OiAkKCcubG9hZGluZy1vdmVybGF5JyksXG4gIGxvZ291dCgpIHtcbiAgICB0aGlzLiRtb2RhbC5yZW1vdmVDbGFzcygnc2hvdycpO1xuICAgIHRoaXMuJG92ZXJsYXkuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xuXG4gICAgTG9naW4ubG9nb3V0KCk7XG4gIH0sXG4gIG5leHRDYXNlKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuXG4gICAgVmlld2VyLmdldE5leHRDYXNlKCk7XG4gIH0sXG4gIHNob3coKSB7XG4gICAgdGhpcy4kbW9kYWwuYWRkQ2xhc3MoJ3Nob3cnKTtcbiAgICB0aGlzLiRvdmVybGF5LnJlbW92ZUNsYXNzKCdpbnZpc2libGUnKTtcbiAgfSxcbiAgaGlkZSgpIHtcbiAgICB0aGlzLiRtb2RhbC5yZW1vdmVDbGFzcygnc2hvdycpO1xuICAgIHRoaXMuJG92ZXJsYXkuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xuICB9LFxuICBpbml0KCkge1xuICAgIHRoaXMuJG1vZGFsLmZpbmQoJy5vaycpLm9uKCdjbGljaycsICgpID0+IHRoaXMuaGlkZSgpKTtcbiAgICAvLyB0aGlzLiRtb2RhbC5maW5kKCcubmV4dC1jYXNlJykub24oJ2NsaWNrJywgKCkgPT4gdGhpcy5uZXh0Q2FzZSgpKTtcbiAgfVxufVxuIl19
},{"../login/login":21,"../viewer/viewer":30}],20:[function(require,module,exports){
'use strict';

var _viewer = require('../viewer/viewer');

var _viewer2 = _interopRequireDefault(_viewer);

var _login = require('./login');

var _login2 = _interopRequireDefault(_login);

var _signup = require('../signup/signup');

var _signup2 = _interopRequireDefault(_signup);

var _db = require('../db/db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_login2.default.$loginForm.off('submit').on('submit', function (evt) {
  evt.preventDefault();

  _login2.default.$loadingImg.removeClass('invisible');
  var $loginUsername = $('#login-username');
  var username = $loginUsername.val();
  $loginUsername.val('');
  _login2.default.username = username;
  console.log('username:', username);
  console.log('Login Login:', _login2.default);

  _db.annotatorsDB.get(username).then(function (user) {
    console.log('username', username, 'exist');
    window.localStorage.setItem('username', username);
    _login2.default.$loadingImg.addClass('invisible');
    _login2.default.$loginForm.addClass('invisible');

    _viewer2.default.initViewer();
  }).catch(function (err) {
    var loginError = $('#login-error');
    loginError.text('Username ' + username + ' is not found. Try another username or sign up for a new account');
    loginError.removeClass('invisible');
    _login2.default.$loadingImg.addClass('invisible');
  });
});

$('#open-signup-btn-new').off('click').click(function (event) {
  event.preventDefault();

  _login2.default.$loginWrapper.addClass('invisible');

  new _signup2.default().init();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfNDBjYzQ5NTMuanMiXSwibmFtZXMiOlsiJGxvZ2luRm9ybSIsIm9mZiIsIm9uIiwiZXZ0IiwicHJldmVudERlZmF1bHQiLCIkbG9hZGluZ0ltZyIsInJlbW92ZUNsYXNzIiwiJGxvZ2luVXNlcm5hbWUiLCIkIiwidXNlcm5hbWUiLCJ2YWwiLCJjb25zb2xlIiwibG9nIiwiZ2V0IiwidGhlbiIsInVzZXIiLCJ3aW5kb3ciLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiYWRkQ2xhc3MiLCJpbml0Vmlld2VyIiwiY2F0Y2giLCJlcnIiLCJsb2dpbkVycm9yIiwidGV4dCIsImNsaWNrIiwiZXZlbnQiLCIkbG9naW5XcmFwcGVyIiwiaW5pdCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBLGdCQUFNQSxVQUFOLENBQWlCQyxHQUFqQixDQUFxQixRQUFyQixFQUErQkMsRUFBL0IsQ0FBa0MsUUFBbEMsRUFBNEMsVUFBVUMsR0FBVixFQUFlO0FBQ3pEQSxNQUFJQyxjQUFKOztBQUVBLGtCQUFNQyxXQUFOLENBQWtCQyxXQUFsQixDQUE4QixXQUE5QjtBQUNBLE1BQU1DLGlCQUFpQkMsRUFBRSxpQkFBRixDQUF2QjtBQUNBLE1BQU1DLFdBQVdGLGVBQWVHLEdBQWYsRUFBakI7QUFDQUgsaUJBQWVHLEdBQWYsQ0FBbUIsRUFBbkI7QUFDQSxrQkFBTUQsUUFBTixHQUFpQkEsUUFBakI7QUFDQUUsVUFBUUMsR0FBUixDQUFZLFdBQVosRUFBeUJILFFBQXpCO0FBQ0FFLFVBQVFDLEdBQVIsQ0FBWSxjQUFaOztBQUVBLG1CQUFhQyxHQUFiLENBQWlCSixRQUFqQixFQUEyQkssSUFBM0IsQ0FBZ0MsVUFBQ0MsSUFBRCxFQUFVO0FBQ3hDSixZQUFRQyxHQUFSLENBQVksVUFBWixFQUF3QkgsUUFBeEIsRUFBa0MsT0FBbEM7QUFDQU8sV0FBT0MsWUFBUCxDQUFvQkMsT0FBcEIsQ0FBNEIsVUFBNUIsRUFBd0NULFFBQXhDO0FBQ0Esb0JBQU1KLFdBQU4sQ0FBa0JjLFFBQWxCLENBQTJCLFdBQTNCO0FBQ0Esb0JBQU1uQixVQUFOLENBQWlCbUIsUUFBakIsQ0FBMEIsV0FBMUI7O0FBRUEscUJBQU9DLFVBQVA7QUFDRCxHQVBELEVBT0dDLEtBUEgsQ0FPUyxVQUFDQyxHQUFELEVBQVM7QUFDaEIsUUFBTUMsYUFBYWYsRUFBRSxjQUFGLENBQW5CO0FBQ0FlLGVBQVdDLElBQVgsZUFBNEJmLFFBQTVCO0FBQ0FjLGVBQVdqQixXQUFYLENBQXVCLFdBQXZCO0FBQ0Esb0JBQU1ELFdBQU4sQ0FBa0JjLFFBQWxCLENBQTJCLFdBQTNCO0FBQ0QsR0FaRDtBQWFELENBeEJEOztBQTBCQVgsRUFBRSxzQkFBRixFQUEwQlAsR0FBMUIsQ0FBOEIsT0FBOUIsRUFBdUN3QixLQUF2QyxDQUE2QyxVQUFTQyxLQUFULEVBQWdCO0FBQzNEQSxRQUFNdEIsY0FBTjs7QUFFQSxrQkFBTXVCLGFBQU4sQ0FBb0JSLFFBQXBCLENBQTZCLFdBQTdCOztBQUVBLHlCQUFhUyxJQUFiO0FBQ0QsQ0FORCIsImZpbGUiOiJmYWtlXzQwY2M0OTUzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXdlciBmcm9tICcuLi92aWV3ZXIvdmlld2VyJztcbmltcG9ydCBMb2dpbiBmcm9tICcuL2xvZ2luJztcbmltcG9ydCBTaWdudXAgZnJvbSAnLi4vc2lnbnVwL3NpZ251cCc7XG5pbXBvcnQge2Fubm90YXRvcnNEQn0gZnJvbSAnLi4vZGIvZGInO1xuXG5Mb2dpbi4kbG9naW5Gb3JtLm9mZignc3VibWl0Jykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIChldnQpIHtcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgTG9naW4uJGxvYWRpbmdJbWcucmVtb3ZlQ2xhc3MoJ2ludmlzaWJsZScpO1xuICBjb25zdCAkbG9naW5Vc2VybmFtZSA9ICQoJyNsb2dpbi11c2VybmFtZScpO1xuICBjb25zdCB1c2VybmFtZSA9ICRsb2dpblVzZXJuYW1lLnZhbCgpO1xuICAkbG9naW5Vc2VybmFtZS52YWwoJycpO1xuICBMb2dpbi51c2VybmFtZSA9IHVzZXJuYW1lO1xuICBjb25zb2xlLmxvZygndXNlcm5hbWU6JywgdXNlcm5hbWUpO1xuICBjb25zb2xlLmxvZygnTG9naW4gTG9naW46JywgTG9naW4pO1xuXG4gIGFubm90YXRvcnNEQi5nZXQodXNlcm5hbWUpLnRoZW4oKHVzZXIpID0+IHtcbiAgICBjb25zb2xlLmxvZygndXNlcm5hbWUnLCB1c2VybmFtZSwgJ2V4aXN0Jyk7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VybmFtZScsIHVzZXJuYW1lKTtcbiAgICBMb2dpbi4kbG9hZGluZ0ltZy5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG4gICAgTG9naW4uJGxvZ2luRm9ybS5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG5cbiAgICBWaWV3ZXIuaW5pdFZpZXdlcigpO1xuICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgY29uc3QgbG9naW5FcnJvciA9ICQoJyNsb2dpbi1lcnJvcicpO1xuICAgIGxvZ2luRXJyb3IudGV4dChgVXNlcm5hbWUgJHt1c2VybmFtZX0gaXMgbm90IGZvdW5kLiBUcnkgYW5vdGhlciB1c2VybmFtZSBvciBzaWduIHVwIGZvciBhIG5ldyBhY2NvdW50YClcbiAgICBsb2dpbkVycm9yLnJlbW92ZUNsYXNzKCdpbnZpc2libGUnKTtcbiAgICBMb2dpbi4kbG9hZGluZ0ltZy5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG4gIH0pO1xufSk7XG5cbiQoJyNvcGVuLXNpZ251cC1idG4tbmV3Jykub2ZmKCdjbGljaycpLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgTG9naW4uJGxvZ2luV3JhcHBlci5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG5cbiAgbmV3IFNpZ251cCgpLmluaXQoKTtcbn0pOyJdfQ==
},{"../db/db":18,"../signup/signup":24,"../viewer/viewer":30,"./login":21}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var $loadingImg = $('.login-wrapper form button.submit img.loading');
var $loginForm = $('.login-wrapper form');
var $loginWrapper = $('.login-wrapper');
var $viewWrapper = $('.viewer-wrapper');
var $overlay = $('.loading-overlay');

var Login = {
  $loadingImg: $loadingImg,
  $loginForm: $loginForm,
  $loginWrapper: $loginWrapper,
  $viewWrapper: $viewWrapper,
  $overlay: $overlay,
  username: undefined,
  logout: function logout() {
    this.username = undefined;
    this.$overlay.addClass('invisible');
    this.$loginWrapper.removeClass('invisible');
    this.$viewWrapper.addClass('invisible');
  }
};

exports.default = Login;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2luLmpzIl0sIm5hbWVzIjpbIiRsb2FkaW5nSW1nIiwiJCIsIiRsb2dpbkZvcm0iLCIkbG9naW5XcmFwcGVyIiwiJHZpZXdXcmFwcGVyIiwiJG92ZXJsYXkiLCJMb2dpbiIsInVzZXJuYW1lIiwidW5kZWZpbmVkIiwibG9nb3V0IiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFNQSxjQUFjQyxFQUFFLCtDQUFGLENBQXBCO0FBQ0EsSUFBTUMsYUFBYUQsRUFBRSxxQkFBRixDQUFuQjtBQUNBLElBQU1FLGdCQUFnQkYsRUFBRSxnQkFBRixDQUF0QjtBQUNBLElBQU1HLGVBQWVILEVBQUUsaUJBQUYsQ0FBckI7QUFDQSxJQUFNSSxXQUFXSixFQUFFLGtCQUFGLENBQWpCOztBQUVBLElBQU1LLFFBQVE7QUFDWk4sMEJBRFk7QUFFWkUsd0JBRlk7QUFHWkMsOEJBSFk7QUFJWkMsNEJBSlk7QUFLWkMsb0JBTFk7QUFNWkUsWUFBVUMsU0FORTtBQU9aQyxRQVBZLG9CQU9IO0FBQ1AsU0FBS0YsUUFBTCxHQUFnQkMsU0FBaEI7QUFDQSxTQUFLSCxRQUFMLENBQWNLLFFBQWQsQ0FBdUIsV0FBdkI7QUFDQSxTQUFLUCxhQUFMLENBQW1CUSxXQUFuQixDQUErQixXQUEvQjtBQUNBLFNBQUtQLFlBQUwsQ0FBa0JNLFFBQWxCLENBQTJCLFdBQTNCO0FBQ0Q7QUFaVyxDQUFkOztrQkFlZUosSyIsImZpbGUiOiJsb2dpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0ICRsb2FkaW5nSW1nID0gJCgnLmxvZ2luLXdyYXBwZXIgZm9ybSBidXR0b24uc3VibWl0IGltZy5sb2FkaW5nJyk7XG5jb25zdCAkbG9naW5Gb3JtID0gJCgnLmxvZ2luLXdyYXBwZXIgZm9ybScpO1xuY29uc3QgJGxvZ2luV3JhcHBlciA9ICQoJy5sb2dpbi13cmFwcGVyJyk7XG5jb25zdCAkdmlld1dyYXBwZXIgPSAkKCcudmlld2VyLXdyYXBwZXInKTtcbmNvbnN0ICRvdmVybGF5ID0gJCgnLmxvYWRpbmctb3ZlcmxheScpO1xuXG5jb25zdCBMb2dpbiA9IHtcbiAgJGxvYWRpbmdJbWcsXG4gICRsb2dpbkZvcm0sXG4gICRsb2dpbldyYXBwZXIsXG4gICR2aWV3V3JhcHBlcixcbiAgJG92ZXJsYXksXG4gIHVzZXJuYW1lOiB1bmRlZmluZWQsXG4gIGxvZ291dCgpIHtcbiAgICB0aGlzLnVzZXJuYW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuJG92ZXJsYXkuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xuICAgIHRoaXMuJGxvZ2luV3JhcHBlci5yZW1vdmVDbGFzcygnaW52aXNpYmxlJyk7XG4gICAgdGhpcy4kdmlld1dyYXBwZXIuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBMb2dpbjsiXX0=
},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _login = require('../login/login');

var _login2 = _interopRequireDefault(_login);

var _modal = require('../modal/modal');

var _modal2 = _interopRequireDefault(_modal);

var _modal3 = require('../errorModal/modal');

var _modal4 = _interopRequireDefault(_modal3);

var _viewer = require('../viewer/viewer');

var _viewer2 = _interopRequireDefault(_viewer);

var _db = require('../db/db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  $menuWrapper: $('.menu-wrapper'),
  $overlay: $('.loading-overlay'),

  submit: function submit() {
    this.closeMenu();
    Commands.save();
  },
  nextCase: function nextCase() {
    this.closeMenu();
    _viewer2.default.getNextCase();
  },
  logout: function logout() {
    this.closeMenu();
    _login2.default.logout();
  },
  closeMenu: function closeMenu() {
    var _this = this;

    this.$overlay.addClass('invisible');
    this.$menuWrapper.removeClass('opened');

    setTimeout(function () {
      _this.$menuWrapper.addClass('invisible');
    }, 1200);
  },
  init: function init() {
    var _this2 = this;

    _modal2.default.init();
    _modal4.default.init();

    this.$menuWrapper.on('click', 'a[data-menu]', function (event) {
      var $element = $(event.currentTarget);
      var menu = $element.attr('data-menu');

      event.preventDefault();

      if (menu) {
        _this2[menu]();
      }
    });

    this.$overlay.on('click', function (event) {
      if (_this2.$menuWrapper.hasClass('opened')) {
        _this2.closeMenu();
      }
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lbnUuanMiXSwibmFtZXMiOlsiJG1lbnVXcmFwcGVyIiwiJCIsIiRvdmVybGF5Iiwic3VibWl0IiwiY2xvc2VNZW51IiwiQ29tbWFuZHMiLCJzYXZlIiwibmV4dENhc2UiLCJnZXROZXh0Q2FzZSIsImxvZ291dCIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJzZXRUaW1lb3V0IiwiaW5pdCIsIm9uIiwiZXZlbnQiLCIkZWxlbWVudCIsImN1cnJlbnRUYXJnZXQiLCJtZW51IiwiYXR0ciIsInByZXZlbnREZWZhdWx0IiwiaGFzQ2xhc3MiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7a0JBR2U7QUFDYkEsZ0JBQWNDLEVBQUUsZUFBRixDQUREO0FBRWJDLFlBQVVELEVBQUUsa0JBQUYsQ0FGRzs7QUFJYkUsUUFKYSxvQkFJSjtBQUNQLFNBQUtDLFNBQUw7QUFDQUMsYUFBU0MsSUFBVDtBQUNELEdBUFk7QUFRYkMsVUFSYSxzQkFRRjtBQUNULFNBQUtILFNBQUw7QUFDQSxxQkFBT0ksV0FBUDtBQUNELEdBWFk7QUFZYkMsUUFaYSxvQkFZTDtBQUNOLFNBQUtMLFNBQUw7QUFDQSxvQkFBTUssTUFBTjtBQUNELEdBZlk7QUFnQmJMLFdBaEJhLHVCQWdCRDtBQUFBOztBQUNWLFNBQUtGLFFBQUwsQ0FBY1EsUUFBZCxDQUF1QixXQUF2QjtBQUNBLFNBQUtWLFlBQUwsQ0FBa0JXLFdBQWxCLENBQThCLFFBQTlCOztBQUVBQyxlQUFXLFlBQU07QUFDZixZQUFLWixZQUFMLENBQWtCVSxRQUFsQixDQUEyQixXQUEzQjtBQUNELEtBRkQsRUFFRyxJQUZIO0FBR0QsR0F2Qlk7QUF3QmJHLE1BeEJhLGtCQXdCTjtBQUFBOztBQUNMLG9CQUFNQSxJQUFOO0FBQ0Esb0JBQVdBLElBQVg7O0FBRUEsU0FBS2IsWUFBTCxDQUFrQmMsRUFBbEIsQ0FBcUIsT0FBckIsRUFBOEIsY0FBOUIsRUFBOEMsVUFBQ0MsS0FBRCxFQUFXO0FBQ3ZELFVBQU1DLFdBQVdmLEVBQUVjLE1BQU1FLGFBQVIsQ0FBakI7QUFDQSxVQUFNQyxPQUFPRixTQUFTRyxJQUFULENBQWMsV0FBZCxDQUFiOztBQUVBSixZQUFNSyxjQUFOOztBQUVBLFVBQUlGLElBQUosRUFBVTtBQUNSLGVBQUtBLElBQUw7QUFDRDtBQUNGLEtBVEQ7O0FBV0EsU0FBS2hCLFFBQUwsQ0FBY1ksRUFBZCxDQUFpQixPQUFqQixFQUEwQixVQUFDQyxLQUFELEVBQVc7QUFDbkMsVUFBSSxPQUFLZixZQUFMLENBQWtCcUIsUUFBbEIsQ0FBMkIsUUFBM0IsQ0FBSixFQUEwQztBQUN4QyxlQUFLakIsU0FBTDtBQUNEO0FBQ0YsS0FKRDtBQUtEO0FBNUNZLEMiLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2dpbiBmcm9tICcuLi9sb2dpbi9sb2dpbic7XG5pbXBvcnQgTW9kYWwgZnJvbSAnLi4vbW9kYWwvbW9kYWwnO1xuaW1wb3J0IEVycm9yTW9kYWwgZnJvbSAnLi4vZXJyb3JNb2RhbC9tb2RhbCc7XG5pbXBvcnQgVmlld2VyIGZyb20gJy4uL3ZpZXdlci92aWV3ZXInO1xuaW1wb3J0IHttZWFzdXJlbWVudHNEQiwgZ2V0VVVJRH0gZnJvbSAnLi4vZGIvZGInO1xuaW1wb3J0IHt1c2VybmFtZX0gZnJvbSAnLi4vbG9naW4vbG9naW4nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICRtZW51V3JhcHBlcjogJCgnLm1lbnUtd3JhcHBlcicpLFxuICAkb3ZlcmxheTogJCgnLmxvYWRpbmctb3ZlcmxheScpLFxuXG4gIHN1Ym1pdCgpIHtcbiAgICB0aGlzLmNsb3NlTWVudSgpO1xuICAgIENvbW1hbmRzLnNhdmUoKTtcbiAgfSxcbiAgbmV4dENhc2UoKSB7XG4gICAgdGhpcy5jbG9zZU1lbnUoKTtcbiAgICBWaWV3ZXIuZ2V0TmV4dENhc2UoKTtcbiAgfSxcbiAgbG9nb3V0KCl7XG4gICAgdGhpcy5jbG9zZU1lbnUoKTtcbiAgICBMb2dpbi5sb2dvdXQoKTtcbiAgfSxcbiAgY2xvc2VNZW51KCkge1xuICAgIHRoaXMuJG92ZXJsYXkuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xuICAgIHRoaXMuJG1lbnVXcmFwcGVyLnJlbW92ZUNsYXNzKCdvcGVuZWQnKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy4kbWVudVdyYXBwZXIuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xuICAgIH0sIDEyMDApO1xuICB9LFxuICBpbml0KCkge1xuICAgIE1vZGFsLmluaXQoKTtcbiAgICBFcnJvck1vZGFsLmluaXQoKTtcblxuICAgIHRoaXMuJG1lbnVXcmFwcGVyLm9uKCdjbGljaycsICdhW2RhdGEtbWVudV0nLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0ICRlbGVtZW50ID0gJChldmVudC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIGNvbnN0IG1lbnUgPSAkZWxlbWVudC5hdHRyKCdkYXRhLW1lbnUnKTtcblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaWYgKG1lbnUpIHtcbiAgICAgICAgdGhpc1ttZW51XSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy4kb3ZlcmxheS5vbignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmICh0aGlzLiRtZW51V3JhcHBlci5oYXNDbGFzcygnb3BlbmVkJykpIHtcbiAgICAgICAgdGhpcy5jbG9zZU1lbnUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19
},{"../db/db":18,"../errorModal/modal":19,"../login/login":21,"../modal/modal":23,"../viewer/viewer":30}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _login = require('../login/login');

var _login2 = _interopRequireDefault(_login);

var _viewer = require('../viewer/viewer');

var _viewer2 = _interopRequireDefault(_viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  $modal: $('.modal'),
  $overlay: $('.loading-overlay'),
  logout: function logout() {
    this.$modal.removeClass('show');
    this.$overlay.addClass('invisible');

    _login2.default.logout();
  },
  show: function show() {
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
    this.$modal.find('.next-case').on('click', function () {
      return _this.nextCase();
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGFsLmpzIl0sIm5hbWVzIjpbIiRtb2RhbCIsIiQiLCIkb3ZlcmxheSIsImxvZ291dCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJzaG93IiwiaGlkZSIsImluaXQiLCJmaW5kIiwib24iLCJuZXh0Q2FzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O2tCQUVlO0FBQ2JBLFVBQVFDLEVBQUUsUUFBRixDQURLO0FBRWJDLFlBQVVELEVBQUUsa0JBQUYsQ0FGRztBQUdiRSxRQUhhLG9CQUdKO0FBQ1AsU0FBS0gsTUFBTCxDQUFZSSxXQUFaLENBQXdCLE1BQXhCO0FBQ0EsU0FBS0YsUUFBTCxDQUFjRyxRQUFkLENBQXVCLFdBQXZCOztBQUVBLG9CQUFNRixNQUFOO0FBQ0QsR0FSWTtBQVNiRyxNQVRhLGtCQVNOO0FBQ0wsU0FBS04sTUFBTCxDQUFZSyxRQUFaLENBQXFCLE1BQXJCO0FBQ0EsU0FBS0gsUUFBTCxDQUFjRSxXQUFkLENBQTBCLFdBQTFCO0FBQ0QsR0FaWTtBQWFiRyxNQWJhLGtCQWFOO0FBQ0wsU0FBS1AsTUFBTCxDQUFZSSxXQUFaLENBQXdCLE1BQXhCO0FBQ0EsU0FBS0YsUUFBTCxDQUFjRyxRQUFkLENBQXVCLFdBQXZCO0FBQ0QsR0FoQlk7QUFpQmJHLE1BakJhLGtCQWlCTjtBQUFBOztBQUNMLFNBQUtSLE1BQUwsQ0FBWVMsSUFBWixDQUFpQixTQUFqQixFQUE0QkMsRUFBNUIsQ0FBK0IsT0FBL0IsRUFBd0M7QUFBQSxhQUFNLE1BQUtQLE1BQUwsRUFBTjtBQUFBLEtBQXhDO0FBQ0EsU0FBS0gsTUFBTCxDQUFZUyxJQUFaLENBQWlCLFlBQWpCLEVBQStCQyxFQUEvQixDQUFrQyxPQUFsQyxFQUEyQztBQUFBLGFBQU0sTUFBS0MsUUFBTCxFQUFOO0FBQUEsS0FBM0M7QUFDRDtBQXBCWSxDIiwiZmlsZSI6Im1vZGFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZ2luIGZyb20gJy4uL2xvZ2luL2xvZ2luJztcbmltcG9ydCBWaWV3ZXIgZnJvbSAnLi4vdmlld2VyL3ZpZXdlcic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgJG1vZGFsOiAkKCcubW9kYWwnKSxcbiAgJG92ZXJsYXk6ICQoJy5sb2FkaW5nLW92ZXJsYXknKSxcbiAgbG9nb3V0KCkge1xuICAgIHRoaXMuJG1vZGFsLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG4gICAgdGhpcy4kb3ZlcmxheS5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG5cbiAgICBMb2dpbi5sb2dvdXQoKTtcbiAgfSxcbiAgc2hvdygpIHtcbiAgICB0aGlzLiRtb2RhbC5hZGRDbGFzcygnc2hvdycpO1xuICAgIHRoaXMuJG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ2ludmlzaWJsZScpO1xuICB9LFxuICBoaWRlKCkge1xuICAgIHRoaXMuJG1vZGFsLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG4gICAgdGhpcy4kb3ZlcmxheS5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG4gIH0sXG4gIGluaXQoKSB7XG4gICAgdGhpcy4kbW9kYWwuZmluZCgnLmxvZ291dCcpLm9uKCdjbGljaycsICgpID0+IHRoaXMubG9nb3V0KCkpO1xuICAgIHRoaXMuJG1vZGFsLmZpbmQoJy5uZXh0LWNhc2UnKS5vbignY2xpY2snLCAoKSA9PiB0aGlzLm5leHRDYXNlKCkpO1xuICB9XG59XG4iXX0=
},{"../login/login":21,"../viewer/viewer":30}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _db = require('../db/db');

var _viewer = require('../viewer/viewer');

var _viewer2 = _interopRequireDefault(_viewer);

var _login = require('../login/login');

var _login2 = _interopRequireDefault(_login);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Signup = function () {
  function Signup() {
    _classCallCheck(this, Signup);
  }

  _createClass(Signup, [{
    key: 'getRandomUsername',
    value: function getRandomUsername() {
      var numOfAdjectives = 0;
      var numOfAnimals = 0;
      var name = void 0;

      return _db.adjectivesDB.info().then(function (doc) {
        numOfAdjectives = doc.doc_count;
        // console.log('numOfAdjectives', numOfAdjectives);
        var rand = Math.floor(numOfAdjectives * Math.random());
        return _db.adjectivesDB.get(rand);
      }).then(function (doc) {
        // console.log(doc.name);
        name = doc.name;
        return _db.animalsDB.info();
      }).then(function (doc) {
        numOfAnimals = doc.doc_count;
        // console.log('numOfAnimals', numOfAnimals);
        var rand = Math.floor(numOfAnimals * Math.random());
        return _db.animalsDB.get(rand);
      }).then(function (doc) {
        return name + ('_' + doc.name);
      }).catch(function (err) {
        throw err;
      });
    }
  }, {
    key: 'getRandomUsernames',
    value: function getRandomUsernames() {
      var _this = this;

      var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var names = [];
      console.log('num:', num);

      var next = function next() {
        return _this.getRandomUsername().then(function (name) {
          var accept = true;
          names.forEach(function (n) {
            if (n === name) {
              accept = false;
            }
          });

          if (accept) {
            return _db.annotatorsDB.get(name).then(function (user) {
              console.log('username', name, 'already exist in the database');

              return next();
            }).catch(function (err) {
              names.push(name);

              if (names.length !== num) {
                return next();
              }
            });
          } else {
            return next();
          }
        });
      };

      return next().then(function () {
        return names;
      });
    }
  }, {
    key: 'createUser',
    value: function createUser(id, data) {
      return new Promise(function (resolve, reject) {
        $.ajax({
          url: annotatorURL + '/' + id,
          type: 'PUT',
          dataType: 'json',
          data: data,
          success: function success(res) {
            // $loadingImg.addClass('invisible');
            // $signupWrapper.addClass('invisible');
            // Viewer.initViewer();
            resolve(res);
          },
          error: function error(err) {
            console.log(err);
            reject(err);
          }
        });
      });
    }
  }, {
    key: 'init',
    value: function init() {
      console.log('Signup.init() is called');
      var $loading = $('.signup-wrapper form button.submit img.loading');
      var $signup = $('.signup-wrapper');
      var $overlay = $('.loading-overlay');

      $overlay.removeClass('invisible').addClass('loading');

      this.getRandomUsernames(4).then(function (names) {
        // console.log('usernames:', names);
        $overlay.removeClass('loading').addClass('invisible');
        $signup.removeClass('invisible');

        $('#signup-name-select').append('<option value=' + names[0] + '>' + names[0] + '</option>');
        $('#signup-name-select').append('<option value=' + names[1] + '>' + names[1] + '</option>');
        $('#signup-name-select').append('<option value=' + names[2] + '>' + names[2] + '</option>');
        $('#signup-name-select').append('<option value=' + names[3] + '>' + names[3] + '</option>');
      });

      var radiologist = $('input[name="is-radiologist"]');
      $(radiologist).change(function () {
        var isChecked = radiologist.is(':checked');
        // console.log('isChecked:', isChecked);
        if (isChecked) {
          var isRadiologist = $('input[name="is-radiologist"]:checked').val() === 'yes';
          // console.log('isRadiologist:', isRadiologist);
          if (isRadiologist) {
            if (!$('#signup-speciality').hasClass('invisible')) {
              $('#signup-speciality').addClass('invisible');
            }
            $('#signup-years-of-experience').removeClass('invisible');
          } else {
            if (!$('#signup-years-of-experience').hasClass('invisible')) {
              $('#signup-years-of-experience').addClass('invisible');
            }
            $('#signup-speciality').removeClass('invisible');
          }
        }
      });

      // $('input[name="years-of-experience"]').focus(function() {
      //   console.log('years of exp');
      //   if(!$('.signup-wrapper .error').hasClass('invisible')){
      //     $('.signup-wrapper .error').text('');
      //     $('.signup-wrapper .error').addClass('invisible');
      //   }
      // });

      $('.signup-wrapper form').off('submit').on('submit', function (event) {
        event.preventDefault();

        $loading.removeClass('invisible');
        // $('.signup-wrapper .error').addClass('invisible');

        var username = $('#signup-name-select option:selected').text();
        _login2.default.username = username;
        // console.log('signup Login:', Login);
        // const username = $('input[name="username"]').val();
        // const password = $('input[name="password"]').val();
        // const confirmPassword = $('input[name="confirm-password"]').val();
        var isRadiologist = $('input[name="is-radiologist"]:checked').val() === 'yes';
        // const isChecked = $('input:radio[name="is-radiologist"]').is(':checked');
        // const isRadiologist2 = $('#radiologist-no').val();
        var yearsOfExperience = void 0;
        var speciality = void 0;
        var anatomyChoices = [];

        if (isRadiologist) {
          yearsOfExperience = $('#signup-years-of-experience option:selected').val();
        } else {
          speciality = $('#signup-speciality option:selected').val();
        }

        $("#anatomy-choices input:checkbox[name=anatomy-choice]:checked").each(function () {
          anatomyChoices.push($(this).val());
        });

        var email = $('#signup-email').val();
        console.log('email:', email);

        // if(isRadiologist && isNaN(yearsOfExperience)){
        //     $('.signup-wrapper .error').removeClass('invisible');
        //     $('.signup-wrapper .error').text('"Years of exprience" must be a number');
        //
        //     $('input[name="years-of-experience"]').val('');
        //
        //     $('#signup-button').blur();
        //
        //     $loadingImg.addClass('invisible');
        //
        //     return false;
        // }

        // var values = $(this).serializeArray();
        // console.log('values', values);

        // if(password !== confirmPassword){
        //   $('.signup-wrapper .error').removeClass('invisible');
        //   $('.signup-wrapper .error').text('Passwords don\'t match');
        //
        //   const password = $('#signup-password').val('');
        //   const confirmPassword = $('#signup-confirm-password').val('');
        //
        //   $('#signup-button').blur();
        //
        //   $loadingImg.addClass('invisible');
        //
        // }

        var data = {
          _id: username,
          username: username,
          // password,
          isRadiologist: isRadiologist,
          anatomyChoices: anatomyChoices
        };
        window.localStorage.setItem('username', username);

        if (speciality) {
          data.speciality = speciality;
        }

        if (yearsOfExperience) {
          data.yearsOfExperience = yearsOfExperience;
        }

        if (email) {
          data.email = email;
        }

        if (anatomyChoices && anatomyChoices.length > 0) {
          data.anatomyChoices = anatomyChoices;
        }

        console.log('data:', data);
        _db.annotatorsDB.put(data).then(function () {
          $loading.addClass('invisible');
          $signup.addClass('invisible');

          _viewer2.default.initViewer();
        });

        // getUuid().then((id) => {
        //   console.log('id:', id);
        //   return createUser(id, data);
        // }).then((res) => {
        //   console.log('res:', res);
        // })

        //   // Mocking login
        //   setTimeout(function () {
        //     $loadingImg.addClass('invisible');
        //     $loginWrapper.addClass('invisible');
        //
        //     Viewer.initViewer();
        //   }, 1000);
        // });
        //
        // $('#open-signup-btn').click(function(event) {
        //   event.preventDefault();
        //   $loginWrapper.addClass('invisible');
        //
        //   Signup.initSignup();
      });
    }
  }]);

  return Signup;
}();

exports.default = Signup;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpZ251cC5qcyJdLCJuYW1lcyI6WyJTaWdudXAiLCJudW1PZkFkamVjdGl2ZXMiLCJudW1PZkFuaW1hbHMiLCJuYW1lIiwiaW5mbyIsInRoZW4iLCJkb2MiLCJkb2NfY291bnQiLCJyYW5kIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZ2V0IiwiY2F0Y2giLCJlcnIiLCJudW0iLCJuYW1lcyIsImNvbnNvbGUiLCJsb2ciLCJuZXh0IiwiZ2V0UmFuZG9tVXNlcm5hbWUiLCJhY2NlcHQiLCJmb3JFYWNoIiwibiIsInVzZXIiLCJwdXNoIiwibGVuZ3RoIiwiaWQiLCJkYXRhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCIkIiwiYWpheCIsInVybCIsImFubm90YXRvclVSTCIsInR5cGUiLCJkYXRhVHlwZSIsInN1Y2Nlc3MiLCJyZXMiLCJlcnJvciIsIiRsb2FkaW5nIiwiJHNpZ251cCIsIiRvdmVybGF5IiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImdldFJhbmRvbVVzZXJuYW1lcyIsImFwcGVuZCIsInJhZGlvbG9naXN0IiwiY2hhbmdlIiwiaXNDaGVja2VkIiwiaXMiLCJpc1JhZGlvbG9naXN0IiwidmFsIiwiaGFzQ2xhc3MiLCJvZmYiLCJvbiIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJ1c2VybmFtZSIsInRleHQiLCJ5ZWFyc09mRXhwZXJpZW5jZSIsInNwZWNpYWxpdHkiLCJhbmF0b215Q2hvaWNlcyIsImVhY2giLCJlbWFpbCIsIl9pZCIsIndpbmRvdyIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJwdXQiLCJpbml0Vmlld2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0lBRU1BLE07QUFFSixvQkFBZTtBQUFBO0FBRWQ7Ozs7d0NBRW9CO0FBQ25CLFVBQUlDLGtCQUFrQixDQUF0QjtBQUNBLFVBQUlDLGVBQWUsQ0FBbkI7QUFDQSxVQUFJQyxhQUFKOztBQUVBLGFBQU8saUJBQWFD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QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNELE9BbkhEO0FBb0hEOzs7Ozs7a0JBR1l2RSxNIiwiZmlsZSI6InNpZ251cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YWRqZWN0aXZlc0RCLCBhbmltYWxzREIsIGFubm90YXRvcnNEQiwgYW5ub3RhdG9yc1VSTH0gZnJvbSAnLi4vZGIvZGInO1xuaW1wb3J0IFZpZXdlciBmcm9tICcuLi92aWV3ZXIvdmlld2VyJztcbmltcG9ydCBMb2dpbiBmcm9tICcuLi9sb2dpbi9sb2dpbic7XG5cbmNsYXNzIFNpZ251cCB7XG5cbiAgY29uc3RydWN0b3IgKCkge1xuXG4gIH1cblxuICBnZXRSYW5kb21Vc2VybmFtZSAoKSB7XG4gICAgbGV0IG51bU9mQWRqZWN0aXZlcyA9IDA7XG4gICAgbGV0IG51bU9mQW5pbWFscyA9IDA7XG4gICAgbGV0IG5hbWU7XG5cbiAgICByZXR1cm4gYWRqZWN0aXZlc0RCLmluZm8oKS50aGVuKChkb2MpID0+IHtcbiAgICAgIG51bU9mQWRqZWN0aXZlcyA9IGRvYy5kb2NfY291bnQ7XG4gICAgICAvLyBjb25zb2xlLmxvZygnbnVtT2ZBZGplY3RpdmVzJywgbnVtT2ZBZGplY3RpdmVzKTtcbiAgICAgIGNvbnN0IHJhbmQgPSBNYXRoLmZsb29yKG51bU9mQWRqZWN0aXZlcypNYXRoLnJhbmRvbSgpKTtcbiAgICAgIHJldHVybiBhZGplY3RpdmVzREIuZ2V0KHJhbmQpO1xuICAgIH0pLnRoZW4oKGRvYykgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coZG9jLm5hbWUpO1xuICAgICAgbmFtZSA9IGRvYy5uYW1lO1xuICAgICAgcmV0dXJuIGFuaW1hbHNEQi5pbmZvKCk7XG4gICAgfSkudGhlbigoZG9jKSA9PiB7XG4gICAgICBudW1PZkFuaW1hbHMgPSBkb2MuZG9jX2NvdW50O1xuICAgICAgLy8gY29uc29sZS5sb2coJ251bU9mQW5pbWFscycsIG51bU9mQW5pbWFscyk7XG4gICAgICBjb25zdCByYW5kID0gTWF0aC5mbG9vcihudW1PZkFuaW1hbHMqTWF0aC5yYW5kb20oKSk7XG4gICAgICByZXR1cm4gYW5pbWFsc0RCLmdldChyYW5kKTtcbiAgICB9KS50aGVuKChkb2MpID0+IHtcbiAgICAgIHJldHVybiBuYW1lICsgYF8ke2RvYy5uYW1lfWA7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0UmFuZG9tVXNlcm5hbWVzIChudW09MCkge1xuICAgIGNvbnN0IG5hbWVzID0gW107XG4gICAgY29uc29sZS5sb2coJ251bTonLCBudW0pO1xuXG4gICAgY29uc3QgbmV4dCA9ICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldFJhbmRvbVVzZXJuYW1lKCkudGhlbigobmFtZSkgPT4ge1xuICAgICAgICBsZXQgYWNjZXB0ID0gdHJ1ZTtcbiAgICAgICAgbmFtZXMuZm9yRWFjaCgobikgPT4ge1xuICAgICAgICAgIGlmKG4gPT09IG5hbWUpe1xuICAgICAgICAgICAgYWNjZXB0ID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZihhY2NlcHQpe1xuICAgICAgICAgIHJldHVybiBhbm5vdGF0b3JzREIuZ2V0KG5hbWUpLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1c2VybmFtZScsIG5hbWUsICdhbHJlYWR5IGV4aXN0IGluIHRoZSBkYXRhYmFzZScpO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIG5hbWVzLnB1c2gobmFtZSk7XG5cbiAgICAgICAgICAgIGlmKG5hbWVzLmxlbmd0aCAhPT0gbnVtKXtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHQoKS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBuYW1lcztcbiAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZVVzZXIgKGlkLCBkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogYCR7YW5ub3RhdG9yVVJMfS8ke2lkfWAsXG4gICAgICAgIHR5cGU6ICdQVVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpe1xuICAgICAgICAgIC8vICRsb2FkaW5nSW1nLmFkZENsYXNzKCdpbnZpc2libGUnKTtcbiAgICAgICAgICAvLyAkc2lnbnVwV3JhcHBlci5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG4gICAgICAgICAgLy8gVmlld2VyLmluaXRWaWV3ZXIoKTtcbiAgICAgICAgICByZXNvbHZlKHJlcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbihlcnIpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdCAoKSB7XG4gICAgY29uc29sZS5sb2coJ1NpZ251cC5pbml0KCkgaXMgY2FsbGVkJyk7XG4gICAgdmFyICRsb2FkaW5nID0gJCgnLnNpZ251cC13cmFwcGVyIGZvcm0gYnV0dG9uLnN1Ym1pdCBpbWcubG9hZGluZycpO1xuICAgIHZhciAkc2lnbnVwID0gJCgnLnNpZ251cC13cmFwcGVyJyk7XG4gICAgdmFyICRvdmVybGF5ID0gJCgnLmxvYWRpbmctb3ZlcmxheScpO1xuXG4gICAgJG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ2ludmlzaWJsZScpLmFkZENsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICB0aGlzLmdldFJhbmRvbVVzZXJuYW1lcyg0KS50aGVuKChuYW1lcykgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coJ3VzZXJuYW1lczonLCBuYW1lcyk7XG4gICAgICAkb3ZlcmxheS5yZW1vdmVDbGFzcygnbG9hZGluZycpLmFkZENsYXNzKCdpbnZpc2libGUnKTtcbiAgICAgICRzaWdudXAucmVtb3ZlQ2xhc3MoJ2ludmlzaWJsZScpO1xuXG4gICAgICAkKCcjc2lnbnVwLW5hbWUtc2VsZWN0JykuYXBwZW5kKGA8b3B0aW9uIHZhbHVlPSR7bmFtZXNbMF19PiR7bmFtZXNbMF19PC9vcHRpb24+YCk7XG4gICAgICAkKCcjc2lnbnVwLW5hbWUtc2VsZWN0JykuYXBwZW5kKGA8b3B0aW9uIHZhbHVlPSR7bmFtZXNbMV19PiR7bmFtZXNbMV19PC9vcHRpb24+YCk7XG4gICAgICAkKCcjc2lnbnVwLW5hbWUtc2VsZWN0JykuYXBwZW5kKGA8b3B0aW9uIHZhbHVlPSR7bmFtZXNbMl19PiR7bmFtZXNbMl19PC9vcHRpb24+YCk7XG4gICAgICAkKCcjc2lnbnVwLW5hbWUtc2VsZWN0JykuYXBwZW5kKGA8b3B0aW9uIHZhbHVlPSR7bmFtZXNbM119PiR7bmFtZXNbM119PC9vcHRpb24+YCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCByYWRpb2xvZ2lzdCA9ICQoJ2lucHV0W25hbWU9XCJpcy1yYWRpb2xvZ2lzdFwiXScpO1xuICAgICQocmFkaW9sb2dpc3QpLmNoYW5nZSgoKSA9PiB7XG4gICAgICBjb25zdCBpc0NoZWNrZWQgPSByYWRpb2xvZ2lzdC5pcygnOmNoZWNrZWQnKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdpc0NoZWNrZWQ6JywgaXNDaGVja2VkKTtcbiAgICAgIGlmKGlzQ2hlY2tlZCkge1xuICAgICAgICBjb25zdCBpc1JhZGlvbG9naXN0ID0gKCQoJ2lucHV0W25hbWU9XCJpcy1yYWRpb2xvZ2lzdFwiXTpjaGVja2VkJykudmFsKCkgPT09ICd5ZXMnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2lzUmFkaW9sb2dpc3Q6JywgaXNSYWRpb2xvZ2lzdCk7XG4gICAgICAgIGlmKGlzUmFkaW9sb2dpc3Qpe1xuICAgICAgICAgIGlmKCEkKCcjc2lnbnVwLXNwZWNpYWxpdHknKS5oYXNDbGFzcygnaW52aXNpYmxlJykpe1xuICAgICAgICAgICAgJCgnI3NpZ251cC1zcGVjaWFsaXR5JykuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkKCcjc2lnbnVwLXllYXJzLW9mLWV4cGVyaWVuY2UnKS5yZW1vdmVDbGFzcygnaW52aXNpYmxlJyk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGlmKCEkKCcjc2lnbnVwLXllYXJzLW9mLWV4cGVyaWVuY2UnKS5oYXNDbGFzcygnaW52aXNpYmxlJykpe1xuICAgICAgICAgICAgJCgnI3NpZ251cC15ZWFycy1vZi1leHBlcmllbmNlJykuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkKCcjc2lnbnVwLXNwZWNpYWxpdHknKS5yZW1vdmVDbGFzcygnaW52aXNpYmxlJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgLy8gJCgnaW5wdXRbbmFtZT1cInllYXJzLW9mLWV4cGVyaWVuY2VcIl0nKS5mb2N1cyhmdW5jdGlvbigpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCd5ZWFycyBvZiBleHAnKTtcbiAgICAvLyAgIGlmKCEkKCcuc2lnbnVwLXdyYXBwZXIgLmVycm9yJykuaGFzQ2xhc3MoJ2ludmlzaWJsZScpKXtcbiAgICAvLyAgICAgJCgnLnNpZ251cC13cmFwcGVyIC5lcnJvcicpLnRleHQoJycpO1xuICAgIC8vICAgICAkKCcuc2lnbnVwLXdyYXBwZXIgLmVycm9yJykuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xuICAgIC8vICAgfVxuICAgIC8vIH0pO1xuXG4gICAgJCgnLnNpZ251cC13cmFwcGVyIGZvcm0nKS5vZmYoJ3N1Ym1pdCcpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICRsb2FkaW5nLnJlbW92ZUNsYXNzKCdpbnZpc2libGUnKTtcbiAgICAgIC8vICQoJy5zaWdudXAtd3JhcHBlciAuZXJyb3InKS5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG5cbiAgICAgIGNvbnN0IHVzZXJuYW1lID0gJCgnI3NpZ251cC1uYW1lLXNlbGVjdCBvcHRpb246c2VsZWN0ZWQnKS50ZXh0KCk7XG4gICAgICBMb2dpbi51c2VybmFtZSA9IHVzZXJuYW1lO1xuICAgICAgLy8gY29uc29sZS5sb2coJ3NpZ251cCBMb2dpbjonLCBMb2dpbik7XG4gICAgICAvLyBjb25zdCB1c2VybmFtZSA9ICQoJ2lucHV0W25hbWU9XCJ1c2VybmFtZVwiXScpLnZhbCgpO1xuICAgICAgLy8gY29uc3QgcGFzc3dvcmQgPSAkKCdpbnB1dFtuYW1lPVwicGFzc3dvcmRcIl0nKS52YWwoKTtcbiAgICAgIC8vIGNvbnN0IGNvbmZpcm1QYXNzd29yZCA9ICQoJ2lucHV0W25hbWU9XCJjb25maXJtLXBhc3N3b3JkXCJdJykudmFsKCk7XG4gICAgICBjb25zdCBpc1JhZGlvbG9naXN0ID0gKCQoJ2lucHV0W25hbWU9XCJpcy1yYWRpb2xvZ2lzdFwiXTpjaGVja2VkJykudmFsKCkgPT09ICd5ZXMnKTtcbiAgICAgIC8vIGNvbnN0IGlzQ2hlY2tlZCA9ICQoJ2lucHV0OnJhZGlvW25hbWU9XCJpcy1yYWRpb2xvZ2lzdFwiXScpLmlzKCc6Y2hlY2tlZCcpO1xuICAgICAgLy8gY29uc3QgaXNSYWRpb2xvZ2lzdDIgPSAkKCcjcmFkaW9sb2dpc3Qtbm8nKS52YWwoKTtcbiAgICAgIGxldCB5ZWFyc09mRXhwZXJpZW5jZTtcbiAgICAgIGxldCBzcGVjaWFsaXR5O1xuICAgICAgbGV0IGFuYXRvbXlDaG9pY2VzID0gW107XG5cbiAgICAgIGlmKGlzUmFkaW9sb2dpc3Qpe1xuICAgICAgICB5ZWFyc09mRXhwZXJpZW5jZSA9ICQoJyNzaWdudXAteWVhcnMtb2YtZXhwZXJpZW5jZSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKTtcbiAgICAgIH1lbHNle1xuICAgICAgICBzcGVjaWFsaXR5ID0gJCgnI3NpZ251cC1zcGVjaWFsaXR5IG9wdGlvbjpzZWxlY3RlZCcpLnZhbCgpO1xuICAgICAgfVxuXG4gICAgICAkKFwiI2FuYXRvbXktY2hvaWNlcyBpbnB1dDpjaGVja2JveFtuYW1lPWFuYXRvbXktY2hvaWNlXTpjaGVja2VkXCIpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICBhbmF0b215Q2hvaWNlcy5wdXNoKCQodGhpcykudmFsKCkpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGVtYWlsID0gJCgnI3NpZ251cC1lbWFpbCcpLnZhbCgpO1xuICAgICAgY29uc29sZS5sb2coJ2VtYWlsOicsIGVtYWlsKTtcblxuICAgICAgLy8gaWYoaXNSYWRpb2xvZ2lzdCAmJiBpc05hTih5ZWFyc09mRXhwZXJpZW5jZSkpe1xuICAgICAgLy8gICAgICQoJy5zaWdudXAtd3JhcHBlciAuZXJyb3InKS5yZW1vdmVDbGFzcygnaW52aXNpYmxlJyk7XG4gICAgICAvLyAgICAgJCgnLnNpZ251cC13cmFwcGVyIC5lcnJvcicpLnRleHQoJ1wiWWVhcnMgb2YgZXhwcmllbmNlXCIgbXVzdCBiZSBhIG51bWJlcicpO1xuICAgICAgLy9cbiAgICAgIC8vICAgICAkKCdpbnB1dFtuYW1lPVwieWVhcnMtb2YtZXhwZXJpZW5jZVwiXScpLnZhbCgnJyk7XG4gICAgICAvL1xuICAgICAgLy8gICAgICQoJyNzaWdudXAtYnV0dG9uJykuYmx1cigpO1xuICAgICAgLy9cbiAgICAgIC8vICAgICAkbG9hZGluZ0ltZy5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG4gICAgICAvL1xuICAgICAgLy8gICAgIHJldHVybiBmYWxzZTtcbiAgICAgIC8vIH1cblxuICAgICAgLy8gdmFyIHZhbHVlcyA9ICQodGhpcykuc2VyaWFsaXplQXJyYXkoKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd2YWx1ZXMnLCB2YWx1ZXMpO1xuXG4gICAgICAvLyBpZihwYXNzd29yZCAhPT0gY29uZmlybVBhc3N3b3JkKXtcbiAgICAgIC8vICAgJCgnLnNpZ251cC13cmFwcGVyIC5lcnJvcicpLnJlbW92ZUNsYXNzKCdpbnZpc2libGUnKTtcbiAgICAgIC8vICAgJCgnLnNpZ251cC13cmFwcGVyIC5lcnJvcicpLnRleHQoJ1Bhc3N3b3JkcyBkb25cXCd0IG1hdGNoJyk7XG4gICAgICAvL1xuICAgICAgLy8gICBjb25zdCBwYXNzd29yZCA9ICQoJyNzaWdudXAtcGFzc3dvcmQnKS52YWwoJycpO1xuICAgICAgLy8gICBjb25zdCBjb25maXJtUGFzc3dvcmQgPSAkKCcjc2lnbnVwLWNvbmZpcm0tcGFzc3dvcmQnKS52YWwoJycpO1xuICAgICAgLy9cbiAgICAgIC8vICAgJCgnI3NpZ251cC1idXR0b24nKS5ibHVyKCk7XG4gICAgICAvL1xuICAgICAgLy8gICAkbG9hZGluZ0ltZy5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG4gICAgICAvL1xuICAgICAgLy8gfVxuXG4gICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICBfaWQ6IHVzZXJuYW1lLFxuICAgICAgICB1c2VybmFtZSxcbiAgICAgICAgLy8gcGFzc3dvcmQsXG4gICAgICAgIGlzUmFkaW9sb2dpc3QsXG4gICAgICAgIGFuYXRvbXlDaG9pY2VzXG4gICAgICB9XG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJuYW1lJywgdXNlcm5hbWUpO1xuXG4gICAgICBpZihzcGVjaWFsaXR5KXtcbiAgICAgICAgZGF0YS5zcGVjaWFsaXR5ID0gc3BlY2lhbGl0eTtcbiAgICAgIH1cblxuICAgICAgaWYoeWVhcnNPZkV4cGVyaWVuY2Upe1xuICAgICAgICBkYXRhLnllYXJzT2ZFeHBlcmllbmNlID0geWVhcnNPZkV4cGVyaWVuY2U7XG4gICAgICB9XG5cbiAgICAgIGlmKGVtYWlsKXtcbiAgICAgICAgZGF0YS5lbWFpbCA9IGVtYWlsO1xuICAgICAgfVxuXG4gICAgICBpZiAoYW5hdG9teUNob2ljZXMgJiYgYW5hdG9teUNob2ljZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBkYXRhLmFuYXRvbXlDaG9pY2VzID0gYW5hdG9teUNob2ljZXM7XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKCdkYXRhOicsIGRhdGEpO1xuICAgICAgYW5ub3RhdG9yc0RCLnB1dChkYXRhKS50aGVuKCgpID0+IHtcbiAgICAgICAgJGxvYWRpbmcuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xuICAgICAgICAkc2lnbnVwLmFkZENsYXNzKCdpbnZpc2libGUnKTtcblxuICAgICAgICBWaWV3ZXIuaW5pdFZpZXdlcigpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIGdldFV1aWQoKS50aGVuKChpZCkgPT4ge1xuICAgICAgLy8gICBjb25zb2xlLmxvZygnaWQ6JywgaWQpO1xuICAgICAgLy8gICByZXR1cm4gY3JlYXRlVXNlcihpZCwgZGF0YSk7XG4gICAgICAvLyB9KS50aGVuKChyZXMpID0+IHtcbiAgICAgIC8vICAgY29uc29sZS5sb2coJ3JlczonLCByZXMpO1xuICAgICAgLy8gfSlcblxuICAgICAgLy8gICAvLyBNb2NraW5nIGxvZ2luXG4gICAgICAvLyAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gICAgICRsb2FkaW5nSW1nLmFkZENsYXNzKCdpbnZpc2libGUnKTtcbiAgICAgIC8vICAgICAkbG9naW5XcmFwcGVyLmFkZENsYXNzKCdpbnZpc2libGUnKTtcbiAgICAgIC8vXG4gICAgICAvLyAgICAgVmlld2VyLmluaXRWaWV3ZXIoKTtcbiAgICAgIC8vICAgfSwgMTAwMCk7XG4gICAgICAvLyB9KTtcbiAgICAgIC8vXG4gICAgICAvLyAkKCcjb3Blbi1zaWdudXAtYnRuJykuY2xpY2soZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIC8vICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIC8vICAgJGxvZ2luV3JhcHBlci5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG4gICAgICAvL1xuICAgICAgLy8gICBTaWdudXAuaW5pdFNpZ251cCgpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpZ251cDtcbiJdfQ==
},{"../db/db":18,"../login/login":21,"../viewer/viewer":30}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _menu = require('../menu/menu.js');

var _menu2 = _interopRequireDefault(_menu);

var _viewer = require('../viewer/viewer.js');

var _viewer2 = _interopRequireDefault(_viewer);

var _modal = require('../errorModal/modal.js');

var _modal2 = _interopRequireDefault(_modal);

var _db = require('../db/db.js');

var _login = require('../login/login');

var _login2 = _interopRequireDefault(_login);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// helper from https://stackoverflow.com/questions/12168909/blob-from-dataurl
function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);
  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  // create a view into the buffer
  var ia = new Uint8Array(ab);
  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], { type: mimeString });
  return blob;
}

exports.default = {
  isMenuOpened: false,
  commandSelector: '.viewer-tools',
  $overlay: $('.loading-overlay'),
  $loadingText: $('.loading-overlay .content .submit-text'),
  $commandMenu: $('.commands-wrapper'),

  clearAll: function clearAll() {
    // Remove all imageId-specific measurements associated with this element
    cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState({});

    // Reset the viewport parameters (i.e. VOI LUT, scale, translation)
    cornerstone.reset(this.element);
  },


  skip: function skip() {
    var _this = this;

    this.$overlay.removeClass('invisible').addClass('loading');

    var stack = cornerstoneTools.getToolState(this.element, 'stack');

    (0, _db.getUUID)().then(function (uuid) {
      var sliceIndex = stack.data[0].currentImageIdIndex;
      var doc = {
        '_id': uuid,
        'skip': true,
        'annotator': _login2.default.username,
        'seriesUID': window.rsnaCrowdQuantSeriesUID,
        'instanceUID': window.rsnaCrowdQuantCaseStudy.instanceUIDs[sliceIndex],
        'instanceURL': window.rsnaCrowdQuantCaseStudy.urls[sliceIndex],
        'sliceIndex': sliceIndex,
        'date': Math.floor(Date.now() / 1000),
        'userAgent': navigator.userAgent
      };
      return _db.measurementsDB.put(doc);
    });

    _viewer2.default.getNextCase().then(function () {
      _this.$overlay.removeClass('loading').addClass('invisible');
    });
  },

  setWL: function setWL(windowWidth, windowCenter) {
    var enabledElement = cornerstone.getEnabledElement(this.element);
    var viewport = enabledElement.viewport;

    viewport.voi.windowWidth = windowWidth;
    viewport.voi.windowCenter = windowCenter;

    cornerstone.updateImage(this.element);
  },

  setLungWL: function setLungWL() {
    this.setWL(1600, -600);
  },

  setLiverWL: function setLiverWL() {
    this.setWL(150, 30);
  },

  toggleMoreMenu: function toggleMoreMenu() {
    var _this2 = this;

    if (this.isMenuOpened) {
      this.$commandMenu.removeClass('open');
      setTimeout(function () {
        _this2.$commandMenu.removeClass('border');
      }, 1100);
    } else {
      this.$commandMenu.addClass('open border');
    }

    this.isMenuOpened = !this.isMenuOpened;
  },

  save: function save() {
    var _this3 = this;

    this.$overlay.removeClass('invisible').addClass('loading');
    this.$loadingText.text('Submitting your measurement...');

    // Retrieve the tool state manager for this element
    var toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;

    // Dump all of its tool state into an Object
    var toolState = toolStateManager.saveToolState();

    // Get the stack tool data
    var stackData = cornerstoneTools.getToolState(this.element, 'stack');
    var stack = stackData.data[0];

    // Retrieve the length data from this Object
    var lengthData = [];
    Object.keys(toolState).forEach(function (imageId) {
      if (!toolState[imageId]['length'] || !toolState[imageId]['length'].data.length) {
        return;
      }

      lengthData.push({
        imageIndex: stack.imageIds.indexOf(imageId),
        data: toolState[imageId].length
      });
    });

    if (!lengthData.length) {
      // console.log('ErrorModal', ErrorModal);
      _modal2.default.show();
      this.$loadingText.text('');
      this.$overlay.removeClass('loading').addClass('invisible');
      return;
    }

    if (lengthData.length > 1) {
      throw new Error('Only one length measurement should be in the lengthData');
    }

    var savingPromise = new Promise(function (resolve, reject) {
      console.time('getUUID');
      (0, _db.getUUID)().then(function (uuid) {
        console.timeEnd('getUUID');
        console.time('PUT to Measurement DB');
        var measurement = lengthData[0];
        var lengthMeasurement = measurement.data.data[0];

        cornerstoneTools.scrollToIndex(_this3.element, measurement.imageIndex);

        var doc = {
          '_id': uuid,
          'length': lengthMeasurement.length,
          'start_x': lengthMeasurement.handles.start.x,
          'start_y': lengthMeasurement.handles.start.y,
          'end_x': lengthMeasurement.handles.end.x,
          'end_y': lengthMeasurement.handles.end.y,
          'annotator': _login2.default.username,
          'seriesUID': window.rsnaCrowdQuantSeriesUID,
          'instanceUID': window.rsnaCrowdQuantCaseStudy.instanceUIDs[measurement.imageIndex],
          'instanceURL': window.rsnaCrowdQuantCaseStudy.urls[measurement.imageIndex],
          'sliceIndex': measurement.imageIndex,
          'date': Math.floor(Date.now() / 1000),
          'userAgent': navigator.userAgent
        };

        return _db.measurementsDB.put(doc);
      }).then(function (response) {
        console.timeEnd('PUT to Measurement DB');
        console.time('PUT putAttachment');
        var canvas = document.querySelector('#cornerstoneViewport canvas');
        var imageBlob = dataURItoBlob(canvas.toDataURL());
        return _db.measurementsDB.putAttachment(response.id, 'screenshot.png', response.rev, imageBlob, 'image/png');
      }).then(function () {
        console.timeEnd('PUT putAttachment');
        resolve();
      }).catch(function (error) {
        reject(error);
      });
    });

    _viewer2.default.getNextCase().then(function () {
      _this3.$loadingText.text('');
      _this3.$overlay.removeClass('loading').addClass('invisible');
    });

    return savingPromise;
  },

  initCommands: function initCommands() {
    var _this4 = this;

    $(this.commandSelector).off('click');
    $(this.commandSelector).on('click', 'div[data-command]', function (event) {
      event.preventDefault();
      event.stopPropagation();

      var $element = $(event.currentTarget);
      var tool = $element.attr('data-command');

      _this4[tool]();

      $element.addClass('active');

      setTimeout(function () {
        $element.removeClass('active');
      }, 300);
    });

    $(document).off('click');
    $(document).on('click', function (event) {
      if (_this4.isMenuOpened) {
        _this4.toggleMoreMenu();
      }
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1hbmRzLmpzIl0sIm5hbWVzIjpbImRhdGFVUkl0b0Jsb2IiLCJkYXRhVVJJIiwiYnl0ZVN0cmluZyIsImF0b2IiLCJzcGxpdCIsIm1pbWVTdHJpbmciLCJhYiIsIkFycmF5QnVmZmVyIiwibGVuZ3RoIiwiaWEiLCJVaW50OEFycmF5IiwiaSIsImNoYXJDb2RlQXQiLCJibG9iIiwiQmxvYiIsInR5cGUiLCJpc01lbnVPcGVuZWQiLCJjb21tYW5kU2VsZWN0b3IiLCIkb3ZlcmxheSIsIiQiLCIkbG9hZGluZ1RleHQiLCIkY29tbWFuZE1lbnUiLCJjbGVhckFsbCIsImNvcm5lcnN0b25lVG9vbHMiLCJnbG9iYWxJbWFnZUlkU3BlY2lmaWNUb29sU3RhdGVNYW5hZ2VyIiwicmVzdG9yZVRvb2xTdGF0ZSIsImNvcm5lcnN0b25lIiwicmVzZXQiLCJlbGVtZW50Iiwic2tpcCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJzdGFjayIsImdldFRvb2xTdGF0ZSIsInRoZW4iLCJ1dWlkIiwic2xpY2VJbmRleCIsImRhdGEiLCJjdXJyZW50SW1hZ2VJZEluZGV4IiwiZG9jIiwidXNlcm5hbWUiLCJ3aW5kb3ciLCJyc25hQ3Jvd2RRdWFudFNlcmllc1VJRCIsInJzbmFDcm93ZFF1YW50Q2FzZVN0dWR5IiwiaW5zdGFuY2VVSURzIiwidXJscyIsIk1hdGgiLCJmbG9vciIsIkRhdGUiLCJub3ciLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJwdXQiLCJnZXROZXh0Q2FzZSIsInNldFdMIiwid2luZG93V2lkdGgiLCJ3aW5kb3dDZW50ZXIiLCJlbmFibGVkRWxlbWVudCIsImdldEVuYWJsZWRFbGVtZW50Iiwidmlld3BvcnQiLCJ2b2kiLCJ1cGRhdGVJbWFnZSIsInNldEx1bmdXTCIsInNldExpdmVyV0wiLCJ0b2dnbGVNb3JlTWVudSIsInNldFRpbWVvdXQiLCJzYXZlIiwidGV4dCIsInRvb2xTdGF0ZU1hbmFnZXIiLCJ0b29sU3RhdGUiLCJzYXZlVG9vbFN0YXRlIiwic3RhY2tEYXRhIiwibGVuZ3RoRGF0YSIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiaW1hZ2VJZCIsInB1c2giLCJpbWFnZUluZGV4IiwiaW1hZ2VJZHMiLCJpbmRleE9mIiwic2hvdyIsIkVycm9yIiwic2F2aW5nUHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY29uc29sZSIsInRpbWUiLCJ0aW1lRW5kIiwibWVhc3VyZW1lbnQiLCJsZW5ndGhNZWFzdXJlbWVudCIsInNjcm9sbFRvSW5kZXgiLCJoYW5kbGVzIiwic3RhcnQiLCJ4IiwieSIsImVuZCIsInJlc3BvbnNlIiwiY2FudmFzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiaW1hZ2VCbG9iIiwidG9EYXRhVVJMIiwicHV0QXR0YWNobWVudCIsImlkIiwicmV2IiwiY2F0Y2giLCJlcnJvciIsImluaXRDb21tYW5kcyIsIm9mZiIsIm9uIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsIiRlbGVtZW50IiwiY3VycmVudFRhcmdldCIsInRvb2wiLCJhdHRyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUE7QUFDQSxTQUFTQSxhQUFULENBQXVCQyxPQUF2QixFQUFnQztBQUM5QjtBQUNBO0FBQ0EsTUFBSUMsYUFBYUMsS0FBS0YsUUFBUUcsS0FBUixDQUFjLEdBQWQsRUFBbUIsQ0FBbkIsQ0FBTCxDQUFqQjtBQUNBO0FBQ0EsTUFBSUMsYUFBYUosUUFBUUcsS0FBUixDQUFjLEdBQWQsRUFBbUIsQ0FBbkIsRUFBc0JBLEtBQXRCLENBQTRCLEdBQTVCLEVBQWlDLENBQWpDLEVBQW9DQSxLQUFwQyxDQUEwQyxHQUExQyxFQUErQyxDQUEvQyxDQUFqQjtBQUNBO0FBQ0EsTUFBSUUsS0FBSyxJQUFJQyxXQUFKLENBQWdCTCxXQUFXTSxNQUEzQixDQUFUO0FBQ0E7QUFDQSxNQUFJQyxLQUFLLElBQUlDLFVBQUosQ0FB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S2IwQixjQWhLYSwwQkFnS0U7QUFBQTs7QUFDYjFGLE1BQUUsS0FBS0YsZUFBUCxFQUF3QjZGLEdBQXhCLENBQTRCLE9BQTVCO0FBQ0EzRixNQUFFLEtBQUtGLGVBQVAsRUFBd0I4RixFQUF4QixDQUEyQixPQUEzQixFQUFvQyxtQkFBcEMsRUFBeUQsaUJBQVM7QUFDaEVDLFlBQU1DLGNBQU47QUFDQUQsWUFBTUUsZUFBTjs7QUFFQSxVQUFNQyxXQUFXaEcsRUFBRTZGLE1BQU1JLGFBQVIsQ0FBakI7QUFDQSxVQUFNQyxPQUFPRixTQUFTRyxJQUFULENBQWMsY0FBZCxDQUFiOztBQUVBLGFBQUtELElBQUw7O0FBRUFGLGVBQVNwRixRQUFULENBQWtCLFFBQWxCOztBQUVBa0MsaUJBQVcsWUFBVztBQUNwQmtELGlCQUFTckYsV0FBVCxDQUFxQixRQUFyQjtBQUNELE9BRkQsRUFFRyxHQUZIO0FBR0QsS0FkRDs7QUFnQkFYLE1BQUVpRixRQUFGLEVBQVlVLEdBQVosQ0FBZ0IsT0FBaEI7QUFDQTNGLE1BQUVpRixRQUFGLEVBQVlXLEVBQVosQ0FBZSxPQUFmLEVBQXdCLGlCQUFTO0FBQy9CLFVBQUksT0FBSy9GLFlBQVQsRUFBdUI7QUFDckIsZUFBS2dELGNBQUw7QUFDRDtBQUNGLEtBSkQ7QUFLRDtBQXhMWSxDIiwiZmlsZSI6ImNvbW1hbmRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1lbnUgZnJvbSAnLi4vbWVudS9tZW51LmpzJztcbmltcG9ydCBWaWV3ZXIgZnJvbSAnLi4vdmlld2VyL3ZpZXdlci5qcyc7XG5pbXBvcnQgRXJyb3JNb2RhbCBmcm9tICcuLi9lcnJvck1vZGFsL21vZGFsLmpzJztcbmltcG9ydCB7bWVhc3VyZW1lbnRzREIsIGdldFVVSUR9IGZyb20gJy4uL2RiL2RiLmpzJztcbmltcG9ydCBMb2dpbiBmcm9tICcuLi9sb2dpbi9sb2dpbic7XG5cbi8vIGhlbHBlciBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEyMTY4OTA5L2Jsb2ItZnJvbS1kYXRhdXJsXG5mdW5jdGlvbiBkYXRhVVJJdG9CbG9iKGRhdGFVUkkpIHtcbiAgLy8gY29udmVydCBiYXNlNjQgdG8gcmF3IGJpbmFyeSBkYXRhIGhlbGQgaW4gYSBzdHJpbmdcbiAgLy8gZG9lc24ndCBoYW5kbGUgVVJMRW5jb2RlZCBEYXRhVVJJcyAtIHNlZSBTTyBhbnN3ZXIgIzY4NTAyNzYgZm9yIGNvZGUgdGhhdCBkb2VzIHRoaXNcbiAgdmFyIGJ5dGVTdHJpbmcgPSBhdG9iKGRhdGFVUkkuc3BsaXQoJywnKVsxXSk7XG4gIC8vIHNlcGFyYXRlIG91dCB0aGUgbWltZSBjb21wb25lbnRcbiAgdmFyIG1pbWVTdHJpbmcgPSBkYXRhVVJJLnNwbGl0KCcsJylbMF0uc3BsaXQoJzonKVsxXS5zcGxpdCgnOycpWzBdXG4gIC8vIHdyaXRlIHRoZSBieXRlcyBvZiB0aGUgc3RyaW5nIHRvIGFuIEFycmF5QnVmZmVyXG4gIHZhciBhYiA9IG5ldyBBcnJheUJ1ZmZlcihieXRlU3RyaW5nLmxlbmd0aCk7XG4gIC8vIGNyZWF0ZSBhIHZpZXcgaW50byB0aGUgYnVmZmVyXG4gIHZhciBpYSA9IG5ldyBVaW50OEFycmF5KGFiKTtcbiAgLy8gc2V0IHRoZSBieXRlcyBvZiB0aGUgYnVmZmVyIHRvIHRoZSBjb3JyZWN0IHZhbHVlc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVTdHJpbmcubGVuZ3RoOyBpKyspIHtcbiAgICBpYVtpXSA9IGJ5dGVTdHJpbmcuY2hhckNvZGVBdChpKTtcbiAgfVxuICAvLyB3cml0ZSB0aGUgQXJyYXlCdWZmZXIgdG8gYSBibG9iLCBhbmQgeW91J3JlIGRvbmVcbiAgdmFyIGJsb2IgPSBuZXcgQmxvYihbYWJdLCB7dHlwZTogbWltZVN0cmluZ30pO1xuICByZXR1cm4gYmxvYjtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBpc01lbnVPcGVuZWQ6IGZhbHNlLFxuICBjb21tYW5kU2VsZWN0b3I6ICcudmlld2VyLXRvb2xzJyxcbiAgJG92ZXJsYXk6ICQoJy5sb2FkaW5nLW92ZXJsYXknKSxcbiAgJGxvYWRpbmdUZXh0OiAkKCcubG9hZGluZy1vdmVybGF5IC5jb250ZW50IC5zdWJtaXQtdGV4dCcpLFxuICAkY29tbWFuZE1lbnU6ICQoJy5jb21tYW5kcy13cmFwcGVyJyksXG5cbiAgY2xlYXJBbGwoKSB7XG4gICAgLy8gUmVtb3ZlIGFsbCBpbWFnZUlkLXNwZWNpZmljIG1lYXN1cmVtZW50cyBhc3NvY2lhdGVkIHdpdGggdGhpcyBlbGVtZW50XG4gICAgY29ybmVyc3RvbmVUb29scy5nbG9iYWxJbWFnZUlkU3BlY2lmaWNUb29sU3RhdGVNYW5hZ2VyLnJlc3RvcmVUb29sU3RhdGUoe30pO1xuXG4gICAgLy8gUmVzZXQgdGhlIHZpZXdwb3J0IHBhcmFtZXRlcnMgKGkuZS4gVk9JIExVVCwgc2NhbGUsIHRyYW5zbGF0aW9uKVxuICAgIGNvcm5lcnN0b25lLnJlc2V0KHRoaXMuZWxlbWVudCk7XG4gIH0sXG5cbiAgc2tpcDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kb3ZlcmxheS5yZW1vdmVDbGFzcygnaW52aXNpYmxlJykuYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgIGNvbnN0IHN0YWNrID0gY29ybmVyc3RvbmVUb29scy5nZXRUb29sU3RhdGUodGhpcy5lbGVtZW50LCAnc3RhY2snKTtcblxuICAgIGdldFVVSUQoKS50aGVuKCh1dWlkKSA9PiB7XG4gICAgICBjb25zdCBzbGljZUluZGV4ID0gc3RhY2suZGF0YVswXS5jdXJyZW50SW1hZ2VJZEluZGV4O1xuICAgICAgY29uc3QgZG9jID0ge1xuICAgICAgICAnX2lkJzogdXVpZCxcbiAgICAgICAgJ3NraXAnOiB0cnVlLFxuICAgICAgICAnYW5ub3RhdG9yJzogTG9naW4udXNlcm5hbWUsXG4gICAgICAgICdzZXJpZXNVSUQnOiB3aW5kb3cucnNuYUNyb3dkUXVhbnRTZXJpZXNVSUQsXG4gICAgICAgICdpbnN0YW5jZVVJRCc6IHdpbmRvdy5yc25hQ3Jvd2RRdWFudENhc2VTdHVkeS5pbnN0YW5jZVVJRHNbc2xpY2VJbmRleF0sXG4gICAgICAgICdpbnN0YW5jZVVSTCc6IHdpbmRvdy5yc25hQ3Jvd2RRdWFudENhc2VTdHVkeS51cmxzW3NsaWNlSW5kZXhdLFxuICAgICAgICAnc2xpY2VJbmRleCc6IHNsaWNlSW5kZXgsXG4gICAgICAgICdkYXRlJzogTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCksXG4gICAgICAgICd1c2VyQWdlbnQnOiBuYXZpZ2F0b3IudXNlckFnZW50XG4gICAgICB9O1xuICAgICAgcmV0dXJuIG1lYXN1cmVtZW50c0RCLnB1dChkb2MpO1xuICAgIH0pO1xuXG4gICAgVmlld2VyLmdldE5leHRDYXNlKCkudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLiRvdmVybGF5LnJlbW92ZUNsYXNzKCdsb2FkaW5nJykuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xuICAgIH0pO1xuICB9LFxuXG4gIHNldFdMOiBmdW5jdGlvbiAod2luZG93V2lkdGgsIHdpbmRvd0NlbnRlcikge1xuICAgIGNvbnN0IGVuYWJsZWRFbGVtZW50ID0gY29ybmVyc3RvbmUuZ2V0RW5hYmxlZEVsZW1lbnQodGhpcy5lbGVtZW50KTtcbiAgICBjb25zdCB2aWV3cG9ydCA9IGVuYWJsZWRFbGVtZW50LnZpZXdwb3J0O1xuXG4gICAgdmlld3BvcnQudm9pLndpbmRvd1dpZHRoID0gd2luZG93V2lkdGg7XG4gICAgdmlld3BvcnQudm9pLndpbmRvd0NlbnRlciA9IHdpbmRvd0NlbnRlcjtcblxuICAgIGNvcm5lcnN0b25lLnVwZGF0ZUltYWdlKHRoaXMuZWxlbWVudCk7XG4gIH0sXG5cbiAgc2V0THVuZ1dMOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFdMKDE2MDAsIC02MDApO1xuICB9LFxuXG4gIHNldExpdmVyV0w6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0V0woMTUwLCAzMCk7XG4gIH0sXG5cbiAgdG9nZ2xlTW9yZU1lbnU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc01lbnVPcGVuZWQpIHtcbiAgICAgIHRoaXMuJGNvbW1hbmRNZW51LnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy4kY29tbWFuZE1lbnUucmVtb3ZlQ2xhc3MoJ2JvcmRlcicpO1xuICAgICAgfSwgMTEwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJGNvbW1hbmRNZW51LmFkZENsYXNzKCdvcGVuIGJvcmRlcicpO1xuICAgIH1cblxuICAgIHRoaXMuaXNNZW51T3BlbmVkID0gIXRoaXMuaXNNZW51T3BlbmVkO1xuICB9LFxuXG4gIHNhdmU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRvdmVybGF5LnJlbW92ZUNsYXNzKCdpbnZpc2libGUnKS5hZGRDbGFzcygnbG9hZGluZycpO1xuICAgIHRoaXMuJGxvYWRpbmdUZXh0LnRleHQoJ1N1Ym1pdHRpbmcgeW91ciBtZWFzdXJlbWVudC4uLicpO1xuXG4gICAgLy8gUmV0cmlldmUgdGhlIHRvb2wgc3RhdGUgbWFuYWdlciBmb3IgdGhpcyBlbGVtZW50XG4gICAgY29uc3QgdG9vbFN0YXRlTWFuYWdlciA9IGNvcm5lcnN0b25lVG9vbHMuZ2xvYmFsSW1hZ2VJZFNwZWNpZmljVG9vbFN0YXRlTWFuYWdlcjtcblxuICAgIC8vIER1bXAgYWxsIG9mIGl0cyB0b29sIHN0YXRlIGludG8gYW4gT2JqZWN0XG4gICAgY29uc3QgdG9vbFN0YXRlID0gdG9vbFN0YXRlTWFuYWdlci5zYXZlVG9vbFN0YXRlKCk7XG5cbiAgICAvLyBHZXQgdGhlIHN0YWNrIHRvb2wgZGF0YVxuICAgIGNvbnN0IHN0YWNrRGF0YSA9IGNvcm5lcnN0b25lVG9vbHMuZ2V0VG9vbFN0YXRlKHRoaXMuZWxlbWVudCwgJ3N0YWNrJyk7XG4gICAgY29uc3Qgc3RhY2sgPSBzdGFja0RhdGEuZGF0YVswXTtcblxuICAgIC8vIFJldHJpZXZlIHRoZSBsZW5ndGggZGF0YSBmcm9tIHRoaXMgT2JqZWN0XG4gICAgbGV0IGxlbmd0aERhdGEgPSBbXTtcbiAgICBPYmplY3Qua2V5cyh0b29sU3RhdGUpLmZvckVhY2goaW1hZ2VJZCA9PiB7XG4gICAgICBpZiAoIXRvb2xTdGF0ZVtpbWFnZUlkXVsnbGVuZ3RoJ10gfHwgIXRvb2xTdGF0ZVtpbWFnZUlkXVsnbGVuZ3RoJ10uZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZW5ndGhEYXRhLnB1c2goe1xuICAgICAgICBpbWFnZUluZGV4OiBzdGFjay5pbWFnZUlkcy5pbmRleE9mKGltYWdlSWQpLFxuICAgICAgICBkYXRhOiB0b29sU3RhdGVbaW1hZ2VJZF0ubGVuZ3RoXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGlmICghbGVuZ3RoRGF0YS5sZW5ndGgpe1xuICAgICAgLy8gY29uc29sZS5sb2coJ0Vycm9yTW9kYWwnLCBFcnJvck1vZGFsKTtcbiAgICAgIEVycm9yTW9kYWwuc2hvdygpO1xuICAgICAgdGhpcy4kbG9hZGluZ1RleHQudGV4dCgnJyk7XG4gICAgICB0aGlzLiRvdmVybGF5LnJlbW92ZUNsYXNzKCdsb2FkaW5nJykuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChsZW5ndGhEYXRhLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBvbmUgbGVuZ3RoIG1lYXN1cmVtZW50IHNob3VsZCBiZSBpbiB0aGUgbGVuZ3RoRGF0YScpO1xuICAgIH1cblxuICAgIGNvbnN0IHNhdmluZ1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zb2xlLnRpbWUoJ2dldFVVSUQnKTtcbiAgICAgIGdldFVVSUQoKS50aGVuKCh1dWlkKSA9PiB7XG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnZ2V0VVVJRCcpO1xuICAgICAgICBjb25zb2xlLnRpbWUoJ1BVVCB0byBNZWFzdXJlbWVudCBEQicpO1xuICAgICAgICBjb25zdCBtZWFzdXJlbWVudCA9IGxlbmd0aERhdGFbMF07XG4gICAgICAgIGNvbnN0IGxlbmd0aE1lYXN1cmVtZW50ID0gbWVhc3VyZW1lbnQuZGF0YS5kYXRhWzBdO1xuXG4gICAgICAgIGNvcm5lcnN0b25lVG9vbHMuc2Nyb2xsVG9JbmRleCh0aGlzLmVsZW1lbnQsIG1lYXN1cmVtZW50LmltYWdlSW5kZXgpO1xuXG4gICAgICAgIGNvbnN0IGRvYyA9IHtcbiAgICAgICAgICAnX2lkJzogdXVpZCxcbiAgICAgICAgICAnbGVuZ3RoJzogbGVuZ3RoTWVhc3VyZW1lbnQubGVuZ3RoLFxuICAgICAgICAgICdzdGFydF94JzogbGVuZ3RoTWVhc3VyZW1lbnQuaGFuZGxlcy5zdGFydC54LFxuICAgICAgICAgICdzdGFydF95JzogbGVuZ3RoTWVhc3VyZW1lbnQuaGFuZGxlcy5zdGFydC55LFxuICAgICAgICAgICdlbmRfeCc6IGxlbmd0aE1lYXN1cmVtZW50LmhhbmRsZXMuZW5kLngsXG4gICAgICAgICAgJ2VuZF95JzogbGVuZ3RoTWVhc3VyZW1lbnQuaGFuZGxlcy5lbmQueSxcbiAgICAgICAgICAnYW5ub3RhdG9yJzogTG9naW4udXNlcm5hbWUsXG4gICAgICAgICAgJ3Nlcmllc1VJRCc6IHdpbmRvdy5yc25hQ3Jvd2RRdWFudFNlcmllc1VJRCxcbiAgICAgICAgICAnaW5zdGFuY2VVSUQnOiB3aW5kb3cucnNuYUNyb3dkUXVhbnRDYXNlU3R1ZHkuaW5zdGFuY2VVSURzW21lYXN1cmVtZW50LmltYWdlSW5kZXhdLFxuICAgICAgICAgICdpbnN0YW5jZVVSTCc6IHdpbmRvdy5yc25hQ3Jvd2RRdWFudENhc2VTdHVkeS51cmxzW21lYXN1cmVtZW50LmltYWdlSW5kZXhdLFxuICAgICAgICAgICdzbGljZUluZGV4JzogbWVhc3VyZW1lbnQuaW1hZ2VJbmRleCxcbiAgICAgICAgICAnZGF0ZSc6IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApLFxuICAgICAgICAgICd1c2VyQWdlbnQnOiBuYXZpZ2F0b3IudXNlckFnZW50XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1lYXN1cmVtZW50c0RCLnB1dChkb2MpO1xuICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc29sZS50aW1lRW5kKCdQVVQgdG8gTWVhc3VyZW1lbnQgREInKTtcbiAgICAgICAgY29uc29sZS50aW1lKCdQVVQgcHV0QXR0YWNobWVudCcpO1xuICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29ybmVyc3RvbmVWaWV3cG9ydCBjYW52YXMnKTtcbiAgICAgICAgY29uc3QgaW1hZ2VCbG9iID0gZGF0YVVSSXRvQmxvYihjYW52YXMudG9EYXRhVVJMKCkpO1xuICAgICAgICByZXR1cm4gbWVhc3VyZW1lbnRzREIucHV0QXR0YWNobWVudChyZXNwb25zZS5pZCwgJ3NjcmVlbnNob3QucG5nJywgcmVzcG9uc2UucmV2LCBpbWFnZUJsb2IsICdpbWFnZS9wbmcnKTtcbiAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ1BVVCBwdXRBdHRhY2htZW50Jyk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIFZpZXdlci5nZXROZXh0Q2FzZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy4kbG9hZGluZ1RleHQudGV4dCgnJyk7XG4gICAgICB0aGlzLiRvdmVybGF5LnJlbW92ZUNsYXNzKCdsb2FkaW5nJykuYWRkQ2xhc3MoJ2ludmlzaWJsZScpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNhdmluZ1Byb21pc2U7XG4gIH0sXG5cbiAgaW5pdENvbW1hbmRzKCkge1xuICAgICQodGhpcy5jb21tYW5kU2VsZWN0b3IpLm9mZignY2xpY2snKTtcbiAgICAkKHRoaXMuY29tbWFuZFNlbGVjdG9yKS5vbignY2xpY2snLCAnZGl2W2RhdGEtY29tbWFuZF0nLCBldmVudCA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGNvbnN0ICRlbGVtZW50ID0gJChldmVudC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIGNvbnN0IHRvb2wgPSAkZWxlbWVudC5hdHRyKCdkYXRhLWNvbW1hbmQnKTtcblxuICAgICAgdGhpc1t0b29sXSgpO1xuXG4gICAgICAkZWxlbWVudC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICRlbGVtZW50LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgIH0sIDMwMCk7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vZmYoJ2NsaWNrJyk7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNNZW51T3BlbmVkKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlTW9yZU1lbnUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTtcbiJdfQ==
},{"../db/db.js":18,"../errorModal/modal.js":19,"../login/login":21,"../menu/menu.js":22,"../viewer/viewer.js":30}],26:[function(require,module,exports){
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

      $.ajax(mockUrl).then(successHandler, errorHandler);
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbm5lY3Rvci5qcyJdLCJuYW1lcyI6WyJtb2NrVXJsIiwiZ2V0Q2FzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3VjY2Vzc0hhbmRsZXIiLCJyZXNwb25zZSIsImVycm9ySGFuZGxlciIsImVycm9yIiwiY29uc29sZSIsIiQiLCJhamF4IiwidGhlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFNQSxVQUFVLGlDQUFoQjs7a0JBRWU7QUFDYkMsU0FEYSxxQkFDSDtBQUNSLFdBQU8sSUFBSUMsT0FBSixDQUFZLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQzVDLFVBQU1DLGlCQUFpQixTQUFqQkEsY0FBaUIsQ0FBQ0MsUUFBRCxFQUFjO0FBQ25DSCxnQkFBUUcsUUFBUjtBQUNELE9BRkQ7QUFHQSxVQUFNQyxlQUFlLFNBQWZBLFlBQWUsQ0FBQ0MsS0FBRCxFQUFXO0FBQzlCLFlBQUlBLEtBQUosRUFBVztBQUNUQyxrQkFBUUQsS0FBUixDQUFjQSxLQUFkO0FBQ0Q7O0FBRURKLGVBQU9JLEtBQVA7QUFDRCxPQU5EOztBQVFBRSxRQUFFQyxJQUFGLENBQU9YLE9BQVAsRUFBZ0JZLElBQWhCLENBQXFCUCxjQUFyQixFQUFxQ0UsWUFBckM7QUFDRCxLQWJNLENBQVA7QUFjRDtBQWhCWSxDIiwiZmlsZSI6ImNvbm5lY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG1vY2tVcmwgPSAnaHR0cDovL2xvY2FsaG9zdDo0MDAwL21vY2suanNvbic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZ2V0Q2FzZSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgY29uc3Qgc3VjY2Vzc0hhbmRsZXIgPSAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9O1xuICAgICAgY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgIH07XG5cbiAgICAgICQuYWpheChtb2NrVXJsKS50aGVuKHN1Y2Nlc3NIYW5kbGVyLCBlcnJvckhhbmRsZXIpO1xuICAgIH0pO1xuICB9XG59O1xuIl19
},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (action, timeWindow) {
  var timeout = void 0;

  return function () {
    var _this = this,
        _arguments = arguments;

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      return action.apply(_this, _arguments);
    }, timeWindow);
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlYm91bmNlLmpzIl0sIm5hbWVzIjpbImFjdGlvbiIsInRpbWVXaW5kb3ciLCJ0aW1lb3V0IiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImFwcGx5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7a0JBQWUsVUFBVUEsTUFBVixFQUFrQkMsVUFBbEIsRUFBOEI7QUFDM0MsTUFBSUMsZ0JBQUo7O0FBRUEsU0FBTyxZQUFXO0FBQUE7QUFBQTs7QUFDaEJDLGlCQUFhRCxPQUFiO0FBQ0FBLGNBQVVFLFdBQVc7QUFBQSxhQUFNSixPQUFPSyxLQUFQLG1CQUFOO0FBQUEsS0FBWCxFQUFnREosVUFBaEQsQ0FBVjtBQUNELEdBSEQ7QUFJRCxDIiwiZmlsZSI6ImRlYm91bmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGFjdGlvbiwgdGltZVdpbmRvdykge1xuICBsZXQgdGltZW91dDtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IGFjdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCB0aW1lV2luZG93KTtcbiAgfTtcbn0iXX0=
},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _connector = require('./connector');

var _connector2 = _interopRequireDefault(_connector);

var _login = require('../login/login');

var _login2 = _interopRequireDefault(_login);

var _db = require('../db/db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  getCaseImages: function getCaseImages() {
    var $overlay = $('.loading-overlay');
    $overlay.addClass('loading');
    $overlay.removeClass('invisible');

    return this.getChronicleImageIDs().then(function (caseStudy) {
      if (!caseStudy || !caseStudy.urls) {
        throw new Error('No case study or no URLs provided');
      }

      // where to store the case id for access during save?
      // I don't understand the model hierarchy, so let's stick it on the window
      window.rsnaCrowdQuantSeriesUID = caseStudy.seriesUID;
      window.rsnaCrowdQuantCaseStudy = caseStudy;

      return caseStudy.urls.map(function (url) {
        return url.replace('http', 'wadouri');
      });
    });
  },


  currentSeriesIndex: undefined,
  seriesUID_A: undefined,

  getChronicleImageIDs: function getChronicleImageIDs() {
    var _this = this;

    return _db.chronicleDB.query("instances/context", {
      reduce: true,
      stale: 'update_after',
      // key: [["UnspecifiedInstitution", "TCGA-17-Z011"], ["UnspecifiedStudyDescription", "1.3.6.1.4.1.14519.5.2.1.7777.9002.242742387344636595876380532248"]],
      // startkey : [['UnspecifiedInstitution', 'TCGA-17-Z011']], // only show the prostates - they basically work
      // endkey: [['UnspecifiedInstitution', 'TCGA-17-Z013']],
      group_level: 3
    }).then(function (data) {

      var annotatorID = _login2.default.username;
      return _this.getNextSeriesForAnnotator(annotatorID);
    }).then(function (seriesUID) {

      if (!_this.currentSeriesIndex) {
        _this.currentSeriesIndex = 0;
      }
      _this.currentSeriesIndex++;
      console.log('series Index:', _this.currentSeriesIndex);

      //const key = data.rows[this.currentSeriesIndex].key;

      // if(currentSeriesIndex >= data.rows.length){
      //   currentSeriesIndex=0;
      // }

      _this.seriesUID_A = seriesUID;
      console.log('series UID:', seriesUID);

      if (seriesUID === undefined) {
        alert('Congratulations - you have looked at all the series');
        window.location.reload();
      }

      return _db.chronicleDB.query("instances/seriesInstances", {
        startkey: seriesUID,
        endkey: seriesUID + '\u9999',
        stale: 'update_after',
        reduce: false
      });
    }).then(function (data) {
      // console.log('instance data:', data);
      var instanceUIDs = [];
      data.rows.forEach(function (row) {
        var instanceUID = row.value[1];
        instanceUIDs.push(instanceUID);
      });

      console.time('Metadata Retrieval from Chronicle DB');
      // TODO: Switch to some study or series-level call
      // It is quite slow to wait on metadata for every single image
      // each retrieved in separate calls
      return Promise.all(instanceUIDs.map(function (uid) {
        return _db.chronicleDB.get(uid);
      }));
    }).then(function (docs) {
      console.timeEnd('Metadata Retrieval from Chronicle DB');
      var instanceNumberTag = "00200013";
      var instanceUIDsByImageNumber = {};
      docs.forEach(function (doc) {
        var imageNumber = Number(doc.dataset[instanceNumberTag].Value);
        instanceUIDsByImageNumber[imageNumber] = doc._id;
      });

      var imageNumbers = Object.keys(instanceUIDsByImageNumber);
      imageNumbers.sort(function (a, b) {
        return a - b;
      });

      var instanceURLs = [];
      var instanceUIDs = [];
      imageNumbers.forEach(function (imageNumber) {
        var instanceUID = instanceUIDsByImageNumber[imageNumber];
        var instanceURL = _db.chronicleURL + '/' + instanceUID + '/object.dcm';
        instanceURLs.push(instanceURL);
        instanceUIDs.push(instanceUID);
      });

      return {
        name: "default_case",
        seriesUID: _this.seriesUID_A,
        currentSeriesIndex: _this.currentSeriesIndex - 1,
        urls: instanceURLs,
        instanceUIDs: instanceUIDs
      };
    }).catch(function (err) {
      throw err;
    });
  },
  getNextSeriesForAnnotator: function getNextSeriesForAnnotator(annotatorID) {

    var measurementsPerSeries = {};
    var annotatorMeasuredSeries = {};
    var seriesUIDs = [];

    // first, get list of all series (this should be factored out to be global and only queried once)
    return _db.chronicleDB.query('instances/context', {
      reduce: true,
      group: true,
      group_level: 3
    }).then(function (result) {

      result.rows.forEach(function (row) {
        seriesUIDs.push(row.key[2][2]);
      });

      // then get the list of all measurements per series and how many measurements
      // (not all series will have been measured)
      return _db.measurementsDB.query('by/seriesUID', {
        reduce: true,
        group: true,
        level: 'exact'
      });
    }).then(function (result) {
      result.rows.forEach(function (row) {
        measurementsPerSeries[row.key] = row.value;
      });

      return _db.measurementsDB.query('by/annotators', {
        reduce: false,
        include_docs: true,
        start_key: annotatorID,
        end_key: annotatorID
      });
    }).then(function (result) {

      result.rows.forEach(function (row) {
        annotatorMeasuredSeries[row.doc.seriesUID] = true;
      });

      // now reconcile the data
      // - look through each available series
      // -- if nobody has measured it then use it
      // - if the user already measured it, ignore it
      // - otherwise find the least measured one
      var leastMeasured = { seriesUID: undefined, measurementCount: Number.MAX_SAFE_INTEGER };
      for (var seriesIndex = 0; seriesIndex < seriesUIDs.length; seriesIndex++) {
        var seriesUID = seriesUIDs[seriesIndex];
        if (!(seriesUID in measurementsPerSeries)) {
          return seriesUID;
        }
        if (!(seriesUID in annotatorMeasuredSeries) && measurementsPerSeries[seriesUID] < leastMeasured.measurementCount) {
          leastMeasured.seriesUID = seriesUID;
          leastMeasured.measurementCount = measurementsPerSeries[seriesUID];
        }
      }
      return leastMeasured.seriesUID;
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGVzLmpzIl0sIm5hbWVzIjpbImdldENhc2VJbWFnZXMiLCIkb3ZlcmxheSIsIiQiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiZ2V0Q2hyb25pY2xlSW1hZ2VJRHMiLCJ0aGVuIiwiY2FzZVN0dWR5IiwidXJscyIsIkVycm9yIiwid2luZG93IiwicnNuYUNyb3dkUXVhbnRTZXJpZXNVSUQiLCJzZXJpZXNVSUQiLCJyc25hQ3Jvd2RRdWFudENhc2VTdHVkeSIsIm1hcCIsInVybCIsInJlcGxhY2UiLCJjdXJyZW50U2VyaWVzSW5kZXgiLCJ1bmRlZmluZWQiLCJzZXJpZXNVSURfQSIsInF1ZXJ5IiwicmVkdWNlIiwic3RhbGUiLCJncm91cF9sZXZlbCIsImRhdGEiLCJhbm5vdGF0b3JJRCIsInVzZXJuYW1lIiwiZ2V0TmV4dFNlcmllc0ZvckFubm90YXRvciIsImNvbnNvbGUiLCJsb2ciLCJhbGVydCIsImxvY2F0aW9uIiwicmVsb2FkIiwic3RhcnRrZXkiLCJlbmRrZXkiLCJpbnN0YW5jZVVJRHMiLCJyb3dzIiwiZm9yRWFjaCIsInJvdyIsImluc3RhbmNlVUlEIiwidmFsdWUiLCJwdXNoIiwidGltZSIsIlByb21pc2UiLCJhbGwiLCJ1aWQiLCJnZXQiLCJkb2NzIiwidGltZUVuZCIsImluc3RhbmNlTnVtYmVyVGFnIiwiaW5zdGFuY2VVSURzQnlJbWFnZU51bWJlciIsImRvYyIsImltYWdlTnVtYmVyIiwiTnVtYmVyIiwiZGF0YXNldCIsIlZhbHVlIiwiX2lkIiwiaW1hZ2VOdW1iZXJzIiwiT2JqZWN0Iiwia2V5cyIsInNvcnQiLCJhIiwiYiIsImluc3RhbmNlVVJMcyIsImluc3RhbmNlVVJMIiwibmFtZSIsImNhdGNoIiwiZXJyIiwibWVhc3VyZW1lbnRzUGVyU2VyaWVzIiwiYW5ub3RhdG9yTWVhc3VyZWRTZXJpZXMiLCJzZXJpZXNVSURzIiwiZ3JvdXAiLCJyZXN1bHQiLCJrZXkiLCJsZXZlbCIsImluY2x1ZGVfZG9jcyIsInN0YXJ0X2tleSIsImVuZF9rZXkiLCJsZWFzdE1lYXN1cmVkIiwibWVhc3VyZW1lbnRDb3VudCIsIk1BWF9TQUZFX0lOVEVHRVIiLCJzZXJpZXNJbmRleCIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O2tCQUVlO0FBQ2JBLGVBRGEsMkJBQ0c7QUFDZCxRQUFNQyxXQUFXQyxFQUFFLGtCQUFGLENBQWpCO0FBQ0FELGFBQVNFLFFBQVQsQ0FBa0IsU0FBbEI7QUFDQUYsYUFBU0csV0FBVCxDQUFxQixXQUFyQjs7QUFFQSxXQUFPLEtBQUtDLG9CQUFMLEdBQTRCQyxJQUE1QixDQUFpQyxVQUFDQyxTQUFELEVBQWU7QUFDckQsVUFBSSxDQUFDQSxTQUFELElBQWMsQ0FBQ0EsVUFBVUMsSUFBN0IsRUFBbUM7QUFDakMsY0FBTSxJQUFJQyxLQUFKLENBQVUsbUNBQVYsQ0FBTjtBQUNEOztBQUVEO0FBQ0E7QUFDQUMsYUFBT0MsdUJBQVAsR0FBaUNKLFVBQVVLLFNBQTNDO0FBQ0FGLGFBQU9HLHVCQUFQLEdBQWlDTixTQUFqQzs7QUFFQSxhQUFPQSxVQUFVQyxJQUFWLENBQWVNLEdBQWYsQ0FBbUI7QUFBQSxlQUFPQyxJQUFJQyxPQUFKLENBQVksTUFBWixFQUFvQixTQUFwQixDQUFQO0FBQUEsT0FBbkIsQ0FBUDtBQUNELEtBWE0sQ0FBUDtBQVlELEdBbEJZOzs7QUFvQmJDLHNCQUFvQkMsU0FwQlA7QUFxQmJDLGVBQWFELFNBckJBOztBQXVCYmIsc0JBdkJhLGtDQXVCVztBQUFBOztBQUN0QixXQUFPLGdCQUFZZSxLQUFaLENBQWtCLG1CQUFsQixFQUF1QztBQUM1Q0MsY0FBUyxJQURtQztBQUU1Q0MsYUFBUSxjQUZvQztBQUc1QztBQUNBO0FBQ0E7QUFDQUMsbUJBQWM7QUFOOEIsS0FBdkMsRUFPSmpCLElBUEksQ0FPQyxVQUFDa0IsSUFBRCxFQUFVOztBQUVoQixVQUFNQyxjQUFjLGdCQUFNQyxRQUExQjtBQUNBLGFBQU8sTUFBS0MseUJBQUwsQ0FBK0JGLFdBQS9CLENBQVA7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LGdCQUFnQixFQUFDbEUsV0FBV00sU0FBWixFQUF1QjZELGtCQUFrQjFCLE9BQU8yQixnQkFBaEQsRUFBcEI7QUFDQSxXQUFLLElBQUlDLGNBQWMsQ0FBdkIsRUFBMEJBLGNBQWNYLFdBQVdZLE1BQW5ELEVBQTJERCxhQUEzRCxFQUEwRTtBQUN4RSxZQUFJckUsWUFBWTBELFdBQVdXLFdBQVgsQ0FBaEI7QUFDQSxZQUFLLEVBQUdyRSxhQUFhd0QscUJBQWhCLENBQUwsRUFBOEM7QUFDNUMsaUJBQU94RCxTQUFQO0FBRUQ7QUFDRCxZQUFNLEVBQUdBLGFBQWF5RCx1QkFBaEIsQ0FBRCxJQUNFRCxzQkFBc0J4RCxTQUF0QixJQUFtQ2tFLGNBQWNDLGdCQUR4RCxFQUM0RTtBQUMxRUQsd0JBQWNsRSxTQUFkLEdBQTBCQSxTQUExQjtBQUNBa0Usd0JBQWNDLGdCQUFkLEdBQWlDWCxzQkFBc0J4RCxTQUF0QixDQUFqQztBQUNEO0FBQ0Y7QUFDRCxhQUFPa0UsY0FBY2xFLFNBQXJCO0FBQ0QsS0FyRE0sQ0FBUDtBQXNERDtBQTVLWSxDIiwiZmlsZSI6ImZpbGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbm5lY3RvciBmcm9tICcuL2Nvbm5lY3Rvcic7XG5pbXBvcnQgTG9naW4gZnJvbSAnLi4vbG9naW4vbG9naW4nO1xuaW1wb3J0IHtjaHJvbmljbGVVUkwsIGNocm9uaWNsZURCLCBtZWFzdXJlbWVudHNEQn0gZnJvbSAnLi4vZGIvZGInO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldENhc2VJbWFnZXMoKSB7XG4gICAgY29uc3QgJG92ZXJsYXkgPSAkKCcubG9hZGluZy1vdmVybGF5Jyk7XG4gICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAkb3ZlcmxheS5yZW1vdmVDbGFzcygnaW52aXNpYmxlJyk7XG5cbiAgICByZXR1cm4gdGhpcy5nZXRDaHJvbmljbGVJbWFnZUlEcygpLnRoZW4oKGNhc2VTdHVkeSkgPT4ge1xuICAgICAgaWYgKCFjYXNlU3R1ZHkgfHwgIWNhc2VTdHVkeS51cmxzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gY2FzZSBzdHVkeSBvciBubyBVUkxzIHByb3ZpZGVkJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIHdoZXJlIHRvIHN0b3JlIHRoZSBjYXNlIGlkIGZvciBhY2Nlc3MgZHVyaW5nIHNhdmU/XG4gICAgICAvLyBJIGRvbid0IHVuZGVyc3RhbmQgdGhlIG1vZGVsIGhpZXJhcmNoeSwgc28gbGV0J3Mgc3RpY2sgaXQgb24gdGhlIHdpbmRvd1xuICAgICAgd2luZG93LnJzbmFDcm93ZFF1YW50U2VyaWVzVUlEID0gY2FzZVN0dWR5LnNlcmllc1VJRDtcbiAgICAgIHdpbmRvdy5yc25hQ3Jvd2RRdWFudENhc2VTdHVkeSA9IGNhc2VTdHVkeTtcblxuICAgICAgcmV0dXJuIGNhc2VTdHVkeS51cmxzLm1hcCh1cmwgPT4gdXJsLnJlcGxhY2UoJ2h0dHAnLCAnd2Fkb3VyaScpKTtcbiAgICB9KTtcbiAgfSxcblxuICBjdXJyZW50U2VyaWVzSW5kZXg6IHVuZGVmaW5lZCxcbiAgc2VyaWVzVUlEX0E6IHVuZGVmaW5lZCxcblxuICBnZXRDaHJvbmljbGVJbWFnZUlEcyAoKSB7XG4gICAgcmV0dXJuIGNocm9uaWNsZURCLnF1ZXJ5KFwiaW5zdGFuY2VzL2NvbnRleHRcIiwge1xuICAgICAgcmVkdWNlIDogdHJ1ZSxcbiAgICAgIHN0YWxlIDogJ3VwZGF0ZV9hZnRlcicsXG4gICAgICAvLyBrZXk6IFtbXCJVbnNwZWNpZmllZEluc3RpdHV0aW9uXCIsIFwiVENHQS0xNy1aMDExXCJdLCBbXCJVbnNwZWNpZmllZFN0dWR5RGVzY3JpcHRpb25cIiwgXCIxLjMuNi4xLjQuMS4xNDUxOS41LjIuMS43Nzc3LjkwMDIuMjQyNzQyMzg3MzQ0NjM2NTk1ODc2MzgwNTMyMjQ4XCJdXSxcbiAgICAgIC8vIHN0YXJ0a2V5IDogW1snVW5zcGVjaWZpZWRJbnN0aXR1dGlvbicsICdUQ0dBLTE3LVowMTEnXV0sIC8vIG9ubHkgc2hvdyB0aGUgcHJvc3RhdGVzIC0gdGhleSBiYXNpY2FsbHkgd29ya1xuICAgICAgLy8gZW5ka2V5OiBbWydVbnNwZWNpZmllZEluc3RpdHV0aW9uJywgJ1RDR0EtMTctWjAxMyddXSxcbiAgICAgIGdyb3VwX2xldmVsIDogMyxcbiAgICB9KS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgIGNvbnN0IGFubm90YXRvcklEID0gTG9naW4udXNlcm5hbWU7XG4gICAgICByZXR1cm4gdGhpcy5nZXROZXh0U2VyaWVzRm9yQW5ub3RhdG9yKGFubm90YXRvcklEKTtcbiAgfSkudGhlbiAoKHNlcmllc1VJRCkgPT4ge1xuXG4gICAgICBpZighdGhpcy5jdXJyZW50U2VyaWVzSW5kZXgpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U2VyaWVzSW5kZXggPSAwO1xuICAgICAgfVxuICAgICAgdGhpcy5jdXJyZW50U2VyaWVzSW5kZXgrKztcbiAgICAgIGNvbnNvbGUubG9nKCdzZXJpZXMgSW5kZXg6JywgdGhpcy5jdXJyZW50U2VyaWVzSW5kZXgpO1xuXG4gICAgICAvL2NvbnN0IGtleSA9IGRhdGEucm93c1t0aGlzLmN1cnJlbnRTZXJpZXNJbmRleF0ua2V5O1xuXG4gICAgICAvLyBpZihjdXJyZW50U2VyaWVzSW5kZXggPj0gZGF0YS5yb3dzLmxlbmd0aCl7XG4gICAgICAvLyAgIGN1cnJlbnRTZXJpZXNJbmRleD0wO1xuICAgICAgLy8gfVxuXG4gICAgICB0aGlzLnNlcmllc1VJRF9BID0gc2VyaWVzVUlEO1xuICAgICAgY29uc29sZS5sb2coJ3NlcmllcyBVSUQ6Jywgc2VyaWVzVUlEKTtcblxuICAgICAgaWYgKHNlcmllc1VJRCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGFsZXJ0KCdDb25ncmF0dWxhdGlvbnMgLSB5b3UgaGF2ZSBsb29rZWQgYXQgYWxsIHRoZSBzZXJpZXMnKTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2hyb25pY2xlREIucXVlcnkoXCJpbnN0YW5jZXMvc2VyaWVzSW5zdGFuY2VzXCIsIHtcbiAgICAgICAgc3RhcnRrZXkgOiBzZXJpZXNVSUQsXG4gICAgICAgIGVuZGtleSA6IHNlcmllc1VJRCArICdcXHU5OTk5JyxcbiAgICAgICAgc3RhbGUgOiAndXBkYXRlX2FmdGVyJyxcbiAgICAgICAgcmVkdWNlIDogZmFsc2UsXG4gICAgICB9KTtcbiAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnaW5zdGFuY2UgZGF0YTonLCBkYXRhKTtcbiAgICAgIGNvbnN0IGluc3RhbmNlVUlEcyA9IFtdO1xuICAgICAgZGF0YS5yb3dzLmZvckVhY2goKHJvdykgPT4ge1xuICAgICAgICBjb25zdCBpbnN0YW5jZVVJRCA9IHJvdy52YWx1ZVsxXTtcbiAgICAgICAgaW5zdGFuY2VVSURzLnB1c2goaW5zdGFuY2VVSUQpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnNvbGUudGltZSgnTWV0YWRhdGEgUmV0cmlldmFsIGZyb20gQ2hyb25pY2xlIERCJyk7XG4gICAgICAvLyBUT0RPOiBTd2l0Y2ggdG8gc29tZSBzdHVkeSBvciBzZXJpZXMtbGV2ZWwgY2FsbFxuICAgICAgLy8gSXQgaXMgcXVpdGUgc2xvdyB0byB3YWl0IG9uIG1ldGFkYXRhIGZvciBldmVyeSBzaW5nbGUgaW1hZ2VcbiAgICAgIC8vIGVhY2ggcmV0cmlldmVkIGluIHNlcGFyYXRlIGNhbGxzXG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoaW5zdGFuY2VVSURzLm1hcCgodWlkKSA9PiB7XG4gICAgICAgIHJldHVybiBjaHJvbmljbGVEQi5nZXQodWlkKTtcbiAgICAgIH0pKTtcbiAgICB9KS50aGVuKChkb2NzKSA9PiB7XG4gICAgICBjb25zb2xlLnRpbWVFbmQoJ01ldGFkYXRhIFJldHJpZXZhbCBmcm9tIENocm9uaWNsZSBEQicpO1xuICAgICAgY29uc3QgaW5zdGFuY2VOdW1iZXJUYWcgPSBcIjAwMjAwMDEzXCI7XG4gICAgICBsZXQgaW5zdGFuY2VVSURzQnlJbWFnZU51bWJlciA9IHt9O1xuICAgICAgZG9jcy5mb3JFYWNoKChkb2MpID0+IHtcbiAgICAgICAgY29uc3QgaW1hZ2VOdW1iZXIgPSBOdW1iZXIoZG9jLmRhdGFzZXRbaW5zdGFuY2VOdW1iZXJUYWddLlZhbHVlKTtcbiAgICAgICAgaW5zdGFuY2VVSURzQnlJbWFnZU51bWJlcltpbWFnZU51bWJlcl0gPSBkb2MuX2lkO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGltYWdlTnVtYmVycyA9IE9iamVjdC5rZXlzKGluc3RhbmNlVUlEc0J5SW1hZ2VOdW1iZXIpO1xuICAgICAgaW1hZ2VOdW1iZXJzLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcblxuICAgICAgbGV0IGluc3RhbmNlVVJMcyA9IFtdO1xuICAgICAgbGV0IGluc3RhbmNlVUlEcyA9IFtdO1xuICAgICAgaW1hZ2VOdW1iZXJzLmZvckVhY2goKGltYWdlTnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlVUlEID0gaW5zdGFuY2VVSURzQnlJbWFnZU51bWJlcltpbWFnZU51bWJlcl07XG4gICAgICAgIGNvbnN0IGluc3RhbmNlVVJMID0gYCR7Y2hyb25pY2xlVVJMfS8ke2luc3RhbmNlVUlEfS9vYmplY3QuZGNtYDtcbiAgICAgICAgaW5zdGFuY2VVUkxzLnB1c2goaW5zdGFuY2VVUkwpO1xuICAgICAgICBpbnN0YW5jZVVJRHMucHVzaChpbnN0YW5jZVVJRCk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogXCJkZWZhdWx0X2Nhc2VcIixcbiAgICAgICAgc2VyaWVzVUlEOiB0aGlzLnNlcmllc1VJRF9BLFxuICAgICAgICBjdXJyZW50U2VyaWVzSW5kZXg6IHRoaXMuY3VycmVudFNlcmllc0luZGV4IC0gMSxcbiAgICAgICAgdXJsczogaW5zdGFuY2VVUkxzLFxuICAgICAgICBpbnN0YW5jZVVJRHNcbiAgICAgIH07XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH0pO1xuICB9LFxuXG4gIGdldE5leHRTZXJpZXNGb3JBbm5vdGF0b3IoYW5ub3RhdG9ySUQpIHtcblxuICAgIGxldCBtZWFzdXJlbWVudHNQZXJTZXJpZXMgPSB7fTtcbiAgICBsZXQgYW5ub3RhdG9yTWVhc3VyZWRTZXJpZXMgPSB7fTtcbiAgICBsZXQgc2VyaWVzVUlEcyA9IFtdO1xuXG4gICAgLy8gZmlyc3QsIGdldCBsaXN0IG9mIGFsbCBzZXJpZXMgKHRoaXMgc2hvdWxkIGJlIGZhY3RvcmVkIG91dCB0byBiZSBnbG9iYWwgYW5kIG9ubHkgcXVlcmllZCBvbmNlKVxuICAgIHJldHVybiBjaHJvbmljbGVEQi5xdWVyeSgnaW5zdGFuY2VzL2NvbnRleHQnLCB7XG4gICAgICByZWR1Y2U6IHRydWUsXG4gICAgICBncm91cDogdHJ1ZSxcbiAgICAgIGdyb3VwX2xldmVsOiAzLFxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuXG4gICAgICByZXN1bHQucm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgIHNlcmllc1VJRHMucHVzaChyb3cua2V5WzJdWzJdKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyB0aGVuIGdldCB0aGUgbGlzdCBvZiBhbGwgbWVhc3VyZW1lbnRzIHBlciBzZXJpZXMgYW5kIGhvdyBtYW55IG1lYXN1cmVtZW50c1xuICAgICAgLy8gKG5vdCBhbGwgc2VyaWVzIHdpbGwgaGF2ZSBiZWVuIG1lYXN1cmVkKVxuICAgICAgcmV0dXJuIG1lYXN1cmVtZW50c0RCLnF1ZXJ5KCdieS9zZXJpZXNVSUQnLCB7XG4gICAgICAgIHJlZHVjZTogdHJ1ZSxcbiAgICAgICAgZ3JvdXA6IHRydWUsXG4gICAgICAgIGxldmVsOiAnZXhhY3QnLFxuICAgICAgfSlcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgcmVzdWx0LnJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgIG1lYXN1cmVtZW50c1BlclNlcmllc1tyb3cua2V5XSA9IHJvdy52YWx1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG1lYXN1cmVtZW50c0RCLnF1ZXJ5KCdieS9hbm5vdGF0b3JzJywge1xuICAgICAgICAgIHJlZHVjZTogZmFsc2UsXG4gICAgICAgICAgaW5jbHVkZV9kb2NzOiB0cnVlLFxuICAgICAgICAgIHN0YXJ0X2tleTogYW5ub3RhdG9ySUQsXG4gICAgICAgICAgZW5kX2tleTogYW5ub3RhdG9ySUQsXG4gICAgICAgIH0pXG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG5cbiAgICAgIHJlc3VsdC5yb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgYW5ub3RhdG9yTWVhc3VyZWRTZXJpZXNbcm93LmRvYy5zZXJpZXNVSURdID0gdHJ1ZTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBub3cgcmVjb25jaWxlIHRoZSBkYXRhXG4gICAgICAvLyAtIGxvb2sgdGhyb3VnaCBlYWNoIGF2YWlsYWJsZSBzZXJpZXNcbiAgICAgIC8vIC0tIGlmIG5vYm9keSBoYXMgbWVhc3VyZWQgaXQgdGhlbiB1c2UgaXRcbiAgICAgIC8vIC0gaWYgdGhlIHVzZXIgYWxyZWFkeSBtZWFzdXJlZCBpdCwgaWdub3JlIGl0XG4gICAgICAvLyAtIG90aGVyd2lzZSBmaW5kIHRoZSBsZWFzdCBtZWFzdXJlZCBvbmVcbiAgICAgIGxldCBsZWFzdE1lYXN1cmVkID0ge3Nlcmllc1VJRDogdW5kZWZpbmVkLCBtZWFzdXJlbWVudENvdW50OiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUn07XG4gICAgICBmb3IgKGxldCBzZXJpZXNJbmRleCA9IDA7IHNlcmllc0luZGV4IDwgc2VyaWVzVUlEcy5sZW5ndGg7IHNlcmllc0luZGV4KyspIHtcbiAgICAgICAgbGV0IHNlcmllc1VJRCA9IHNlcmllc1VJRHNbc2VyaWVzSW5kZXhdO1xuICAgICAgICBpZiAoICEgKHNlcmllc1VJRCBpbiBtZWFzdXJlbWVudHNQZXJTZXJpZXMpICkge1xuICAgICAgICAgIHJldHVybiBzZXJpZXNVSUQ7XG5cbiAgICAgICAgfVxuICAgICAgICBpZiAoICghIChzZXJpZXNVSUQgaW4gYW5ub3RhdG9yTWVhc3VyZWRTZXJpZXMpKSAmJlxuICAgICAgICAgICAgICAobWVhc3VyZW1lbnRzUGVyU2VyaWVzW3Nlcmllc1VJRF0gPCBsZWFzdE1lYXN1cmVkLm1lYXN1cmVtZW50Q291bnQpICkge1xuICAgICAgICAgIGxlYXN0TWVhc3VyZWQuc2VyaWVzVUlEID0gc2VyaWVzVUlEO1xuICAgICAgICAgIGxlYXN0TWVhc3VyZWQubWVhc3VyZW1lbnRDb3VudCA9IG1lYXN1cmVtZW50c1BlclNlcmllc1tzZXJpZXNVSURdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbGVhc3RNZWFzdXJlZC5zZXJpZXNVSUQ7XG4gICAgfSlcbiAgfVxufVxuIl19
},{"../db/db":18,"../login/login":21,"./connector":26}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debounce = require('./debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tools = {
  pan: {
    mouse: cornerstoneTools.pan,
    touch: cornerstoneTools.panTouchDrag
  },
  wwwc: {
    mouse: cornerstoneTools.wwwc,
    touch: cornerstoneTools.wwwcTouchDrag
  },
  stackScroll: {
    mouse: cornerstoneTools.stackScroll,
    touch: cornerstoneTools.stackScrollTouchDrag
  },
  length: {
    mouse: cornerstoneTools.length,
    touch: cornerstoneTools.lengthTouch
  },
  zoom: {
    mouse: cornerstoneTools.zoom,
    touch: cornerstoneTools.zoomTouchDrag
  }
};

exports.default = {
  active: undefined,
  toolsSelector: '.viewer-tools',
  $cornerstoneViewport: $('#cornerstoneViewport'),
  toggleTool: function toggleTool(toolToActivate) {
    console.log('toggleTool ' + toolToActivate);
    if (!toolToActivate) {
      return;
    }

    var element = this.element;

    if (this.active) {
      var previousMouseTool = tools[this.active].mouse;
      var previousTouchTool = tools[this.active].touch;
      previousMouseTool.deactivate(element, 1);
      previousTouchTool.deactivate(element);
    }

    var mouseTool = tools[toolToActivate].mouse;
    var touchTool = tools[toolToActivate].touch;

    if (toolToActivate === 'pan') {
      // If the user has selected the pan tool, activate it for both left and middle
      // 3 means left mouse button and middle mouse button
      cornerstoneTools.pan.activate(element, 3);
      cornerstoneTools.zoom.activate(element, 4);
    } else if (toolToActivate === 'zoom') {
      // If the user has selected the zoom tool, activate it for both left and right
      // 5 means left mouse button and right mouse button
      cornerstoneTools.zoom.activate(element, 5);
      cornerstoneTools.pan.activate(element, 2);
    } else {
      // Otherwise, active the tool on left mouse, pan on middle, and zoom on right
      mouseTool.activate(element, 1);
      cornerstoneTools.pan.activate(element, 2);
      cornerstoneTools.zoom.activate(element, 4);
    }

    touchTool.activate(element);

    this.active = toolToActivate;
  },
  initStackTool: function initStackTool(imageIds) {
    var _this = this;

    var slider = $('.imageSlider')[0];
    var stack = {
      currentImageIdIndex: 0,
      imageIds: imageIds
    };

    // Init slider configurations
    slider.min = 0;
    slider.max = stack.imageIds.length - 1;
    slider.step = 1;
    slider.value = stack.currentImageIdIndex;

    // Clear any previous tool state
    cornerstoneTools.clearToolState(this.element, 'stack');

    // Disable stack prefetch in case there are still queued requests
    cornerstoneTools.stackPrefetch.disable(this.element);

    cornerstoneTools.addStackStateManager(this.element, ['stack']);
    cornerstoneTools.addToolState(this.element, 'stack', stack);
    cornerstoneTools.stackPrefetch.enable(this.element);

    var element = this.element;
    var slideTimeoutTime = 40;
    var slideTimeout = void 0;

    // Adding input listener
    function selectImage(event) {
      // Note that we throttle requests to prevent the
      // user's ultrafast scrolling from firing requests too quickly.
      clearTimeout(slideTimeout);
      slideTimeout = setTimeout(function () {
        var newImageIdIndex = parseInt(event.currentTarget.value, 10);
        cornerstoneTools.scrollToIndex(element, newImageIdIndex);
      }, slideTimeoutTime);
    }

    $(slider).off('input', selectImage);
    $(slider).on('input', selectImage);

    // Setting the slider size
    $(slider).css('width', this.$cornerstoneViewport.height() + 'px');

    var debounceWindowResizeHandler = (0, _debounce2.default)(function () {
      return $(slider).css('width', _this.$cornerstoneViewport.height() + 'px');
    }, 150);
    $(window).off('resize', debounceWindowResizeHandler);
    $(window).on('resize', debounceWindowResizeHandler);

    // Listening to viewport stack image change, so the slider is synced
    var cornerstoneNewImageHandler = function cornerstoneNewImageHandler() {
      // Update the slider value
      slider.value = stack.currentImageIdIndex;
    };

    this.$cornerstoneViewport[0].removeEventListener('cornerstonenewimage', cornerstoneNewImageHandler);
    this.$cornerstoneViewport[0].addEventListener('cornerstonenewimage', cornerstoneNewImageHandler);
  },
  initInteractionTools: function initInteractionTools() {
    /*
    For touch devices, by default we activate:
    - Pinch to zoom
    - Two-finger Pan
    - Three (or more) finger Stack Scroll
     We also enable the Length tool so it is always visible
     */
    cornerstoneTools.zoomTouchPinch.activate(this.element);
    cornerstoneTools.panMultiTouch.activate(this.element);
    cornerstoneTools.panMultiTouch.setConfiguration({
      testPointers: function testPointers(eventData) {
        return eventData.numPointers === 2;
      }
    });
    cornerstoneTools.stackScrollMultiTouch.activate(this.element);
    cornerstoneTools.length.enable(this.element);

    /* For mouse devices, by default we turn on:
    - Stack scrolling by mouse wheel
    - Stack scrolling by keyboard up / down arrow keys
    - Pan with middle click
    - Zoom with right click
     */
    cornerstoneTools.stackScrollWheel.activate(this.element);
    cornerstoneTools.stackScrollKeyboard.activate(this.element);
    cornerstoneTools.pan.activate(this.element, 2);
    cornerstoneTools.zoom.activate(this.element, 4);

    /*
    Set the tool color
     */
    cornerstoneTools.toolColors.setActiveColor('greenyellow');
    cornerstoneTools.toolColors.setToolColor('white');
    cornerstoneTools.length.setConfiguration({ shadow: true });

    // Stop users from zooming in or out too far
    cornerstoneTools.zoom.setConfiguration({
      minScale: 0.3,
      maxScale: 10,
      preventZoomOutsideImage: true
    });
  },
  toolClickHandler: function toolClickHandler(event) {
    var $element = $(event.currentTarget);
    var tool = $element.attr('data-tool');

    $('.active').removeClass('active');

    this.toggleTool(tool);

    $element.addClass('active');
  },
  attachEvents: function attachEvents() {
    // Extract which tool we are using and activating it
    $(this.toolsSelector).off('click', 'div[data-tool]', this.toolClickHandler.bind(this));
    $(this.toolsSelector).on('click', 'div[data-tool]', this.toolClickHandler.bind(this));

    // Limiting measurements to 1
    function handleMeasurementAdded(event) {
      // Only handle Length measurements
      var toolType = 'length';
      if (event.detail.toolType !== toolType) {
        return;
      }

      // Retrieve the current image
      var element = event.detail.element;
      var image = cornerstone.getImage(element);
      var currentImageId = image.imageId;

      // When a new measurement is added, retrieve the current tool state
      var toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;
      var toolState = toolStateManager.saveToolState();

      // Loop through all of the images (toolState is keyed by imageId)
      Object.keys(toolState).forEach(function (imageId) {
        // Delete all length measurements on images that are not the
        // current image
        if (imageId !== currentImageId) {
          delete toolState[imageId][toolType];
        }
      });

      // Retrieve all of the length measurements on the current image
      var lengthMeasurements = toolState[currentImageId][toolType].data;

      // If there is more than length measurement, remove the oldest one
      if (lengthMeasurements.length > 1) {
        lengthMeasurements.shift();

        // Re-save this data into the toolState object
        toolState[currentImageId][toolType].data = lengthMeasurements;
      }

      // Restore toolState into the toolStateManager
      toolStateManager.restoreToolState(toolState);

      // Update the image
      cornerstone.updateImage(element);
    }

    this.element.removeEventListener('cornerstonetoolsmeasurementadded', handleMeasurementAdded);
    this.element.addEventListener('cornerstonetoolsmeasurementadded', handleMeasurementAdded);
  },
  initTools: function initTools(imageIds) {
    cornerstoneTools.mouseInput.enable(this.element);
    cornerstoneTools.touchInput.enable(this.element);
    cornerstoneTools.mouseWheelInput.enable(this.element);
    cornerstoneTools.keyboardInput.enable(this.element);

    this.initStackTool(imageIds);

    // Set the element to focused, so we can properly handle keyboard events
    $(this.element).attr('tabindex', 0).focus();

    this.initInteractionTools();

    // If a previously active tool exists, re-enable it.
    // If not, use wwwc
    var toolToActivate = this.active || 'wwwc';
    this.toggleTool(toolToActivate);

    // Remove the 'active' highlight from the other tools
    $(this.toolsSelector + ' .active').removeClass('.active');

    // Add it to our desired tool
    $(this.toolsSelector + ' div[data-tool=' + toolToActivate + ']').addClass('active');

    this.attachEvents();
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2xzLmpzIl0sIm5hbWVzIjpbInRvb2xzIiwicGFuIiwibW91c2UiLCJjb3JuZXJzdG9uZVRvb2xzIiwidG91Y2giLCJwYW5Ub3VjaERyYWciLCJ3d3djIiwid3d3Y1RvdWNoRHJhZyIsInN0YWNrU2Nyb2xsIiwic3RhY2tTY3JvbGxUb3VjaERyYWciLCJsZW5ndGgiLCJsZW5ndGhUb3VjaCIsInpvb20iLCJ6b29tVG91Y2hEcmFnIiwiYWN0aXZlIiwidW5kZWZpbmVkIiwidG9vbHNTZWxlY3RvciIsIiRjb3JuZXJzdG9uZVZpZXdwb3J0IiwiJCIsInRvZ2dsZVRvb2wiLCJ0b29sVG9BY3RpdmF0ZSIsImNvbnNvbGUiLCJsb2ciLCJlbGVtZW50IiwicHJldmlvdXNNb3VzZVRvb2wiLCJwcmV2aW91c1RvdWNoVG9vbCIsImRlYWN0aXZhdGUiLCJtb3VzZVRvb2wiLCJ0b3VjaFRvb2wiLCJhY3RpdmF0ZSIsImluaXRTdGFja1Rvb2wiLCJpbWFnZUlkcyIsInNsaWRlciIsInN0YWNrIiwiY3VycmVudEltYWdlSWRJbmRleCIsIm1pbiIsIm1heCIsInN0ZXAiLCJ2YWx1ZSIsImNsZWFyVG9vbFN0YXRlIiwic3RhY2tQcmVmZXRjaCIsImRpc2FibGUiLCJhZGRTdGFja1N0YXRlTWFuYWdlciIsImFkZFRvb2xTdGF0ZSIsImVuYWJsZSIsInNsaWRlVGltZW91dFRpbWUiLCJzbGlkZVRpbWVvdXQiLCJzZWxlY3RJbWFnZSIsImV2ZW50IiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsIm5ld0ltYWdlSWRJbmRleCIsInBhcnNlSW50IiwiY3VycmVudFRhcmdldCIsInNjcm9sbFRvSW5kZXgiLCJvZmYiLCJvbiIsImNzcyIsImhlaWdodCIsImRlYm91bmNlV2luZG93UmVzaXplSGFuZGxlciIsIndpbmRvdyIsImNvcm5lcnN0b25lTmV3SW1hZ2VIYW5kbGVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImFkZEV2ZW50TGlzdGVuZXIiLCJpbml0SW50ZXJhY3Rpb25Ub29scyIsInpvb21Ub3VjaFBpbmNoIiwicGFuTXVsdGlUb3VjaCIsInNldENvbmZpZ3VyYXRpb24iLCJ0ZXN0UG9pbnRlcnMiLCJldmVudERhdGEiLCJudW1Qb2ludGVycyIsInN0YWNrU2Nyb2xsTXVsdGlUb3VjaCIsInN0YWNrU2Nyb2xsV2hlZWwiLCJzdGFja1Njcm9sbEtleWJvYXJkIiwidG9vbENvbG9ycyIsInNldEFjdGl2ZUNvbG9yIiwic2V0VG9vbENvbG9yIiwic2hhZG93IiwibWluU2NhbGUiLCJtYXhTY2FsZSIsInByZXZlbnRab29tT3V0c2lkZUltYWdlIiwidG9vbENsaWNrSGFuZGxlciIsIiRlbGVtZW50IiwidG9vbCIsImF0dHIiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiYXR0YWNoRXZlbnRzIiwiYmluZCIsImhhbmRsZU1lYXN1cmVtZW50QWRkZWQiLCJ0b29sVHlwZSIsImRldGFpbCIsImltYWdlIiwiY29ybmVyc3RvbmUiLCJnZXRJbWFnZSIsImN1cnJlbnRJbWFnZUlkIiwiaW1hZ2VJZCIsInRvb2xTdGF0ZU1hbmFnZXIiLCJnbG9iYWxJbWFnZUlkU3BlY2lmaWNUb29sU3RhdGVNYW5hZ2VyIiwidG9vbFN0YXRlIiwic2F2ZVRvb2xTdGF0ZSIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwibGVuZ3RoTWVhc3VyZW1lbnRzIiwiZGF0YSIsInNoaWZ0IiwicmVzdG9yZVRvb2xTdGF0ZSIsInVwZGF0ZUltYWdlIiwiaW5pdFRvb2xzIiwibW91c2VJbnB1dCIsInRvdWNoSW5wdXQiLCJtb3VzZVdoZWVsSW5wdXQiLCJrZXlib2FyZElucHV0IiwiZm9jdXMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNQSxRQUFRO0FBQ1pDLE9BQUs7QUFDSEMsV0FBT0MsaUJBQWlCRixHQURyQjtBQUVIRyxXQUFPRCxpQkFBaUJFO0FBRnJCLEdBRE87QUFLWkMsUUFBTTtBQUNKSixXQUFPQyxpQkFBaUJHLElBRHBCO0FBRUpGLFdBQU9ELGlCQUFpQkk7QUFG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cEUsTUFBakMsQ0FBd0MsS0FBS3JCLE9BQTdDO0FBQ0FwQixxQkFBaUI4RyxhQUFqQixDQUErQnJFLE1BQS9CLENBQXNDLEtBQUtyQixPQUEzQzs7QUFFQSxTQUFLTyxhQUFMLENBQW1CQyxRQUFuQjs7QUFFQTtBQUNBYixNQUFFLEtBQUtLLE9BQVAsRUFBZ0I2RCxJQUFoQixDQUFxQixVQUFyQixFQUFpQyxDQUFqQyxFQUFvQzhCLEtBQXBDOztBQUVBLFNBQUtsRCxvQkFBTDs7QUFFQTtBQUNBO0FBQ0EsUUFBTTVDLGlCQUFpQixLQUFLTixNQUFMLElBQWUsTUFBdEM7QUFDQSxTQUFLSyxVQUFMLENBQWdCQyxjQUFoQjs7QUFFQTtBQUNBRixNQUFLLEtBQUtGLGFBQVYsZUFBbUNxRSxXQUFuQyxDQUErQyxTQUEvQzs7QUFFQTtBQUNBbkUsTUFBSyxLQUFLRixhQUFWLHVCQUF5Q0ksY0FBekMsUUFBNERrRSxRQUE1RCxDQUFxRSxRQUFyRTs7QUFFQSxTQUFLQyxZQUFMO0FBQ0Q7QUEzT1ksQyIsImZpbGUiOiJ0b29scy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJvdW5jZSBmcm9tICcuL2RlYm91bmNlJztcblxuY29uc3QgdG9vbHMgPSB7XG4gIHBhbjoge1xuICAgIG1vdXNlOiBjb3JuZXJzdG9uZVRvb2xzLnBhbixcbiAgICB0b3VjaDogY29ybmVyc3RvbmVUb29scy5wYW5Ub3VjaERyYWdcbiAgfSxcbiAgd3d3Yzoge1xuICAgIG1vdXNlOiBjb3JuZXJzdG9uZVRvb2xzLnd3d2MsXG4gICAgdG91Y2g6IGNvcm5lcnN0b25lVG9vbHMud3d3Y1RvdWNoRHJhZ1xuICB9LFxuICBzdGFja1Njcm9sbDoge1xuICAgIG1vdXNlOiBjb3JuZXJzdG9uZVRvb2xzLnN0YWNrU2Nyb2xsLFxuICAgIHRvdWNoOiBjb3JuZXJzdG9uZVRvb2xzLnN0YWNrU2Nyb2xsVG91Y2hEcmFnXG4gIH0sXG4gIGxlbmd0aDoge1xuICAgIG1vdXNlOiBjb3JuZXJzdG9uZVRvb2xzLmxlbmd0aCxcbiAgICB0b3VjaDogY29ybmVyc3RvbmVUb29scy5sZW5ndGhUb3VjaFxuICB9LFxuICB6b29tOiB7XG4gICAgbW91c2U6IGNvcm5lcnN0b25lVG9vbHMuem9vbSxcbiAgICB0b3VjaDogY29ybmVyc3RvbmVUb29scy56b29tVG91Y2hEcmFnXG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZlOiB1bmRlZmluZWQsXG4gIHRvb2xzU2VsZWN0b3I6ICcudmlld2VyLXRvb2xzJyxcbiAgJGNvcm5lcnN0b25lVmlld3BvcnQ6ICQoJyNjb3JuZXJzdG9uZVZpZXdwb3J0JyksXG4gIHRvZ2dsZVRvb2wodG9vbFRvQWN0aXZhdGUpIHtcbiAgICBjb25zb2xlLmxvZyhgdG9nZ2xlVG9vbCAke3Rvb2xUb0FjdGl2YXRlfWApO1xuICAgIGlmICghdG9vbFRvQWN0aXZhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50O1xuXG4gICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICBjb25zdCBwcmV2aW91c01vdXNlVG9vbCA9IHRvb2xzW3RoaXMuYWN0aXZlXS5tb3VzZTtcbiAgICAgIGNvbnN0IHByZXZpb3VzVG91Y2hUb29sID0gdG9vbHNbdGhpcy5hY3RpdmVdLnRvdWNoO1xuICAgICAgcHJldmlvdXNNb3VzZVRvb2wuZGVhY3RpdmF0ZShlbGVtZW50LCAxKTtcbiAgICAgIHByZXZpb3VzVG91Y2hUb29sLmRlYWN0aXZhdGUoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgY29uc3QgbW91c2VUb29sID0gdG9vbHNbdG9vbFRvQWN0aXZhdGVdLm1vdXNlO1xuICAgIGNvbnN0IHRvdWNoVG9vbCA9IHRvb2xzW3Rvb2xUb0FjdGl2YXRlXS50b3VjaDtcblxuICAgIGlmICh0b29sVG9BY3RpdmF0ZSA9PT0gJ3BhbicpIHtcbiAgICAgIC8vIElmIHRoZSB1c2VyIGhhcyBzZWxlY3RlZCB0aGUgcGFuIHRvb2wsIGFjdGl2YXRlIGl0IGZvciBib3RoIGxlZnQgYW5kIG1pZGRsZVxuICAgICAgLy8gMyBtZWFucyBsZWZ0IG1vdXNlIGJ1dHRvbiBhbmQgbWlkZGxlIG1vdXNlIGJ1dHRvblxuICAgICAgY29ybmVyc3RvbmVUb29scy5wYW4uYWN0aXZhdGUoZWxlbWVudCwgMyk7XG4gICAgICBjb3JuZXJzdG9uZVRvb2xzLnpvb20uYWN0aXZhdGUoZWxlbWVudCwgNCk7XG4gICAgfSBlbHNlIGlmICh0b29sVG9BY3RpdmF0ZSA9PT0gJ3pvb20nKSB7XG4gICAgICAvLyBJZiB0aGUgdXNlciBoYXMgc2VsZWN0ZWQgdGhlIHpvb20gdG9vbCwgYWN0aXZhdGUgaXQgZm9yIGJvdGggbGVmdCBhbmQgcmlnaHRcbiAgICAgIC8vIDUgbWVhbnMgbGVmdCBtb3VzZSBidXR0b24gYW5kIHJpZ2h0IG1vdXNlIGJ1dHRvblxuICAgICAgY29ybmVyc3RvbmVUb29scy56b29tLmFjdGl2YXRlKGVsZW1lbnQsIDUpO1xuICAgICAgY29ybmVyc3RvbmVUb29scy5wYW4uYWN0aXZhdGUoZWxlbWVudCwgMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE90aGVyd2lzZSwgYWN0aXZlIHRoZSB0b29sIG9uIGxlZnQgbW91c2UsIHBhbiBvbiBtaWRkbGUsIGFuZCB6b29tIG9uIHJpZ2h0XG4gICAgICBtb3VzZVRvb2wuYWN0aXZhdGUoZWxlbWVudCwgMSk7XG4gICAgICBjb3JuZXJzdG9uZVRvb2xzLnBhbi5hY3RpdmF0ZShlbGVtZW50LCAyKTtcbiAgICAgIGNvcm5lcnN0b25lVG9vbHMuem9vbS5hY3RpdmF0ZShlbGVtZW50LCA0KTtcbiAgICB9XG5cbiAgICB0b3VjaFRvb2wuYWN0aXZhdGUoZWxlbWVudCk7XG5cbiAgICB0aGlzLmFjdGl2ZSA9IHRvb2xUb0FjdGl2YXRlO1xuICB9LFxuXG4gIGluaXRTdGFja1Rvb2woaW1hZ2VJZHMpIHtcbiAgICBjb25zdCBzbGlkZXIgPSAkKCcuaW1hZ2VTbGlkZXInKVswXTtcbiAgICBjb25zdCBzdGFjayA9IHtcbiAgICAgIGN1cnJlbnRJbWFnZUlkSW5kZXg6IDAsXG4gICAgICBpbWFnZUlkczogaW1hZ2VJZHNcbiAgICB9O1xuXG4gICAgLy8gSW5pdCBzbGlkZXIgY29uZmlndXJhdGlvbnNcbiAgICBzbGlkZXIubWluID0gMDtcbiAgICBzbGlkZXIubWF4ID0gc3RhY2suaW1hZ2VJZHMubGVuZ3RoIC0gMTtcbiAgICBzbGlkZXIuc3RlcCA9IDE7XG4gICAgc2xpZGVyLnZhbHVlID0gc3RhY2suY3VycmVudEltYWdlSWRJbmRleDtcblxuICAgIC8vIENsZWFyIGFueSBwcmV2aW91cyB0b29sIHN0YXRlXG4gICAgY29ybmVyc3RvbmVUb29scy5jbGVhclRvb2xTdGF0ZSh0aGlzLmVsZW1lbnQsICdzdGFjaycpO1xuXG4gICAgLy8gRGlzYWJsZSBzdGFjayBwcmVmZXRjaCBpbiBjYXNlIHRoZXJlIGFyZSBzdGlsbCBxdWV1ZWQgcmVxdWVzdHNcbiAgICBjb3JuZXJzdG9uZVRvb2xzLnN0YWNrUHJlZmV0Y2guZGlzYWJsZSh0aGlzLmVsZW1lbnQpO1xuXG4gICAgY29ybmVyc3RvbmVUb29scy5hZGRTdGFja1N0YXRlTWFuYWdlcih0aGlzLmVsZW1lbnQsIFsnc3RhY2snXSk7XG4gICAgY29ybmVyc3RvbmVUb29scy5hZGRUb29sU3RhdGUodGhpcy5lbGVtZW50LCAnc3RhY2snLCBzdGFjayk7XG4gICAgY29ybmVyc3RvbmVUb29scy5zdGFja1ByZWZldGNoLmVuYWJsZSh0aGlzLmVsZW1lbnQpO1xuXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcbiAgICBjb25zdCBzbGlkZVRpbWVvdXRUaW1lID0gNDA7XG4gICAgbGV0IHNsaWRlVGltZW91dDtcblxuICAgIC8vIEFkZGluZyBpbnB1dCBsaXN0ZW5lclxuICAgIGZ1bmN0aW9uIHNlbGVjdEltYWdlKGV2ZW50KSB7XG4gICAgICAvLyBOb3RlIHRoYXQgd2UgdGhyb3R0bGUgcmVxdWVzdHMgdG8gcHJldmVudCB0aGVcbiAgICAgIC8vIHVzZXIncyB1bHRyYWZhc3Qgc2Nyb2xsaW5nIGZyb20gZmlyaW5nIHJlcXVlc3RzIHRvbyBxdWlja2x5LlxuICAgICAgY2xlYXJUaW1lb3V0KHNsaWRlVGltZW91dCk7XG4gICAgICBzbGlkZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc3QgbmV3SW1hZ2VJZEluZGV4ID0gcGFyc2VJbnQoZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSwgMTApO1xuICAgICAgICBjb3JuZXJzdG9uZVRvb2xzLnNjcm9sbFRvSW5kZXgoZWxlbWVudCwgbmV3SW1hZ2VJZEluZGV4KTtcbiAgICAgIH0sIHNsaWRlVGltZW91dFRpbWUpO1xuICAgIH1cblxuICAgICQoc2xpZGVyKS5vZmYoJ2lucHV0Jywgc2VsZWN0SW1hZ2UpO1xuICAgICQoc2xpZGVyKS5vbignaW5wdXQnLCBzZWxlY3RJbWFnZSk7XG5cbiAgICAvLyBTZXR0aW5nIHRoZSBzbGlkZXIgc2l6ZVxuICAgICQoc2xpZGVyKS5jc3MoJ3dpZHRoJywgYCR7dGhpcy4kY29ybmVyc3RvbmVWaWV3cG9ydC5oZWlnaHQoKX1weGApO1xuXG4gICAgY29uc3QgZGVib3VuY2VXaW5kb3dSZXNpemVIYW5kbGVyID0gZGVib3VuY2UoKCkgPT4gJChzbGlkZXIpLmNzcygnd2lkdGgnLCBgJHt0aGlzLiRjb3JuZXJzdG9uZVZpZXdwb3J0LmhlaWdodCgpfXB4YCksIDE1MCk7XG4gICAgJCh3aW5kb3cpLm9mZigncmVzaXplJywgZGVib3VuY2VXaW5kb3dSZXNpemVIYW5kbGVyKTtcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGRlYm91bmNlV2luZG93UmVzaXplSGFuZGxlcik7XG5cbiAgICAvLyBMaXN0ZW5pbmcgdG8gdmlld3BvcnQgc3RhY2sgaW1hZ2UgY2hhbmdlLCBzbyB0aGUgc2xpZGVyIGlzIHN5bmNlZFxuICAgIGNvbnN0IGNvcm5lcnN0b25lTmV3SW1hZ2VIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gVXBkYXRlIHRoZSBzbGlkZXIgdmFsdWVcbiAgICAgIHNsaWRlci52YWx1ZSA9IHN0YWNrLmN1cnJlbnRJbWFnZUlkSW5kZXg7XG4gICAgfTtcblxuICAgIHRoaXMuJGNvcm5lcnN0b25lVmlld3BvcnRbMF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29ybmVyc3RvbmVuZXdpbWFnZScsIGNvcm5lcnN0b25lTmV3SW1hZ2VIYW5kbGVyKTtcbiAgICB0aGlzLiRjb3JuZXJzdG9uZVZpZXdwb3J0WzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2Nvcm5lcnN0b25lbmV3aW1hZ2UnLCBjb3JuZXJzdG9uZU5ld0ltYWdlSGFuZGxlcik7XG4gIH0sXG5cbiAgaW5pdEludGVyYWN0aW9uVG9vbHMoKSB7XG4gICAgLypcbiAgICBGb3IgdG91Y2ggZGV2aWNlcywgYnkgZGVmYXVsdCB3ZSBhY3RpdmF0ZTpcbiAgICAtIFBpbmNoIHRvIHpvb21cbiAgICAtIFR3by1maW5nZXIgUGFuXG4gICAgLSBUaHJlZSAob3IgbW9yZSkgZmluZ2VyIFN0YWNrIFNjcm9sbFxuXG4gICAgV2UgYWxzbyBlbmFibGUgdGhlIExlbmd0aCB0b29sIHNvIGl0IGlzIGFsd2F5cyB2aXNpYmxlXG4gICAgICovXG4gICAgY29ybmVyc3RvbmVUb29scy56b29tVG91Y2hQaW5jaC5hY3RpdmF0ZSh0aGlzLmVsZW1lbnQpO1xuICAgIGNvcm5lcnN0b25lVG9vbHMucGFuTXVsdGlUb3VjaC5hY3RpdmF0ZSh0aGlzLmVsZW1lbnQpO1xuICAgIGNvcm5lcnN0b25lVG9vbHMucGFuTXVsdGlUb3VjaC5zZXRDb25maWd1cmF0aW9uKHtcbiAgICAgICAgdGVzdFBvaW50ZXJzOiAoZXZlbnREYXRhKSA9PiAoZXZlbnREYXRhLm51bVBvaW50ZXJzID09PSAyKVxuICAgIH0pO1xuICAgIGNvcm5lcnN0b25lVG9vbHMuc3RhY2tTY3JvbGxNdWx0aVRvdWNoLmFjdGl2YXRlKHRoaXMuZWxlbWVudCk7XG4gICAgY29ybmVyc3RvbmVUb29scy5sZW5ndGguZW5hYmxlKHRoaXMuZWxlbWVudCk7XG5cbiAgICAvKiBGb3IgbW91c2UgZGV2aWNlcywgYnkgZGVmYXVsdCB3ZSB0dXJuIG9uOlxuICAgIC0gU3RhY2sgc2Nyb2xsaW5nIGJ5IG1vdXNlIHdoZWVsXG4gICAgLSBTdGFjayBzY3JvbGxpbmcgYnkga2V5Ym9hcmQgdXAgLyBkb3duIGFycm93IGtleXNcbiAgICAtIFBhbiB3aXRoIG1pZGRsZSBjbGlja1xuICAgIC0gWm9vbSB3aXRoIHJpZ2h0IGNsaWNrXG4gICAgICovXG4gICAgY29ybmVyc3RvbmVUb29scy5zdGFja1Njcm9sbFdoZWVsLmFjdGl2YXRlKHRoaXMuZWxlbWVudCk7XG4gICAgY29ybmVyc3RvbmVUb29scy5zdGFja1Njcm9sbEtleWJvYXJkLmFjdGl2YXRlKHRoaXMuZWxlbWVudCk7XG4gICAgY29ybmVyc3RvbmVUb29scy5wYW4uYWN0aXZhdGUodGhpcy5lbGVtZW50LCAyKTtcbiAgICBjb3JuZXJzdG9uZVRvb2xzLnpvb20uYWN0aXZhdGUodGhpcy5lbGVtZW50LCA0KTtcblxuXG4gICAgLypcbiAgICBTZXQgdGhlIHRvb2wgY29sb3JcbiAgICAgKi9cbiAgICBjb3JuZXJzdG9uZVRvb2xzLnRvb2xDb2xvcnMuc2V0QWN0aXZlQ29sb3IoJ2dyZWVueWVsbG93Jyk7XG4gICAgY29ybmVyc3RvbmVUb29scy50b29sQ29sb3JzLnNldFRvb2xDb2xvcignd2hpdGUnKTtcbiAgICBjb3JuZXJzdG9uZVRvb2xzLmxlbmd0aC5zZXRDb25maWd1cmF0aW9uKHtzaGFkb3c6IHRydWV9KTtcblxuICAgIC8vIFN0b3AgdXNlcnMgZnJvbSB6b29taW5nIGluIG9yIG91dCB0b28gZmFyXG4gICAgY29ybmVyc3RvbmVUb29scy56b29tLnNldENvbmZpZ3VyYXRpb24oe1xuICAgICAgICBtaW5TY2FsZTogMC4zLFxuICAgICAgICBtYXhTY2FsZTogMTAsXG4gICAgICAgIHByZXZlbnRab29tT3V0c2lkZUltYWdlOiB0cnVlXG4gICAgfSk7XG4gIH0sXG5cbiAgdG9vbENsaWNrSGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0ICRlbGVtZW50ID0gJChldmVudC5jdXJyZW50VGFyZ2V0KTtcbiAgICBjb25zdCB0b29sID0gJGVsZW1lbnQuYXR0cignZGF0YS10b29sJyk7XG5cbiAgICAkKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgdGhpcy50b2dnbGVUb29sKHRvb2wpO1xuXG4gICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICB9LFxuXG4gIGF0dGFjaEV2ZW50cygpIHtcbiAgICAvLyBFeHRyYWN0IHdoaWNoIHRvb2wgd2UgYXJlIHVzaW5nIGFuZCBhY3RpdmF0aW5nIGl0XG4gICAgJCh0aGlzLnRvb2xzU2VsZWN0b3IpLm9mZignY2xpY2snLCAnZGl2W2RhdGEtdG9vbF0nLCB0aGlzLnRvb2xDbGlja0hhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgJCh0aGlzLnRvb2xzU2VsZWN0b3IpLm9uKCdjbGljaycsICdkaXZbZGF0YS10b29sXScsIHRoaXMudG9vbENsaWNrSGFuZGxlci5iaW5kKHRoaXMpKTtcblxuICAgIC8vIExpbWl0aW5nIG1lYXN1cmVtZW50cyB0byAxXG4gICAgZnVuY3Rpb24gaGFuZGxlTWVhc3VyZW1lbnRBZGRlZCAoZXZlbnQpIHtcbiAgICAgIC8vIE9ubHkgaGFuZGxlIExlbmd0aCBtZWFzdXJlbWVudHNcbiAgICAgIGNvbnN0IHRvb2xUeXBlID0gJ2xlbmd0aCc7XG4gICAgICBpZiAoZXZlbnQuZGV0YWlsLnRvb2xUeXBlICE9PSB0b29sVHlwZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFJldHJpZXZlIHRoZSBjdXJyZW50IGltYWdlXG4gICAgICBjb25zdCBlbGVtZW50ID0gZXZlbnQuZGV0YWlsLmVsZW1lbnQ7XG4gICAgICBjb25zdCBpbWFnZSA9IGNvcm5lcnN0b25lLmdldEltYWdlKGVsZW1lbnQpO1xuICAgICAgY29uc3QgY3VycmVudEltYWdlSWQgPSBpbWFnZS5pbWFnZUlkO1xuXG4gICAgICAvLyBXaGVuIGEgbmV3IG1lYXN1cmVtZW50IGlzIGFkZGVkLCByZXRyaWV2ZSB0aGUgY3VycmVudCB0b29sIHN0YXRlXG4gICAgICBjb25zdCB0b29sU3RhdGVNYW5hZ2VyID0gY29ybmVyc3RvbmVUb29scy5nbG9iYWxJbWFnZUlkU3BlY2lmaWNUb29sU3RhdGVNYW5hZ2VyO1xuICAgICAgY29uc3QgdG9vbFN0YXRlID0gdG9vbFN0YXRlTWFuYWdlci5zYXZlVG9vbFN0YXRlKCk7XG5cbiAgICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgb2YgdGhlIGltYWdlcyAodG9vbFN0YXRlIGlzIGtleWVkIGJ5IGltYWdlSWQpXG4gICAgICBPYmplY3Qua2V5cyh0b29sU3RhdGUpLmZvckVhY2goaW1hZ2VJZCA9PiB7XG4gICAgICAgIC8vIERlbGV0ZSBhbGwgbGVuZ3RoIG1lYXN1cmVtZW50cyBvbiBpbWFnZXMgdGhhdCBhcmUgbm90IHRoZVxuICAgICAgICAvLyBjdXJyZW50IGltYWdlXG4gICAgICAgIGlmIChpbWFnZUlkICE9PSBjdXJyZW50SW1hZ2VJZCkge1xuICAgICAgICAgIGRlbGV0ZSB0b29sU3RhdGVbaW1hZ2VJZF1bdG9vbFR5cGVdO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gUmV0cmlldmUgYWxsIG9mIHRoZSBsZW5ndGggbWVhc3VyZW1lbnRzIG9uIHRoZSBjdXJyZW50IGltYWdlXG4gICAgICBjb25zdCBsZW5ndGhNZWFzdXJlbWVudHMgPSB0b29sU3RhdGVbY3VycmVudEltYWdlSWRdW3Rvb2xUeXBlXS5kYXRhO1xuXG4gICAgICAvLyBJZiB0aGVyZSBpcyBtb3JlIHRoYW4gbGVuZ3RoIG1lYXN1cmVtZW50LCByZW1vdmUgdGhlIG9sZGVzdCBvbmVcbiAgICAgIGlmIChsZW5ndGhNZWFzdXJlbWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBsZW5ndGhNZWFzdXJlbWVudHMuc2hpZnQoKTtcblxuICAgICAgICAvLyBSZS1zYXZlIHRoaXMgZGF0YSBpbnRvIHRoZSB0b29sU3RhdGUgb2JqZWN0XG4gICAgICAgIHRvb2xTdGF0ZVtjdXJyZW50SW1hZ2VJZF1bdG9vbFR5cGVdLmRhdGEgPSBsZW5ndGhNZWFzdXJlbWVudHM7XG4gICAgICB9XG5cbiAgICAgIC8vIFJlc3RvcmUgdG9vbFN0YXRlIGludG8gdGhlIHRvb2xTdGF0ZU1hbmFnZXJcbiAgICAgIHRvb2xTdGF0ZU1hbmFnZXIucmVzdG9yZVRvb2xTdGF0ZSh0b29sU3RhdGUpO1xuXG4gICAgICAvLyBVcGRhdGUgdGhlIGltYWdlXG4gICAgICBjb3JuZXJzdG9uZS51cGRhdGVJbWFnZShlbGVtZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29ybmVyc3RvbmV0b29sc21lYXN1cmVtZW50YWRkZWQnLCBoYW5kbGVNZWFzdXJlbWVudEFkZGVkKTtcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY29ybmVyc3RvbmV0b29sc21lYXN1cmVtZW50YWRkZWQnLCBoYW5kbGVNZWFzdXJlbWVudEFkZGVkKTtcbiAgfSxcblxuICBpbml0VG9vbHMoaW1hZ2VJZHMpIHtcbiAgICBjb3JuZXJzdG9uZVRvb2xzLm1vdXNlSW5wdXQuZW5hYmxlKHRoaXMuZWxlbWVudCk7XG4gICAgY29ybmVyc3RvbmVUb29scy50b3VjaElucHV0LmVuYWJsZSh0aGlzLmVsZW1lbnQpO1xuICAgIGNvcm5lcnN0b25lVG9vbHMubW91c2VXaGVlbElucHV0LmVuYWJsZSh0aGlzLmVsZW1lbnQpO1xuICAgIGNvcm5lcnN0b25lVG9vbHMua2V5Ym9hcmRJbnB1dC5lbmFibGUodGhpcy5lbGVtZW50KTtcblxuICAgIHRoaXMuaW5pdFN0YWNrVG9vbChpbWFnZUlkcyk7XG5cbiAgICAvLyBTZXQgdGhlIGVsZW1lbnQgdG8gZm9jdXNlZCwgc28gd2UgY2FuIHByb3Blcmx5IGhhbmRsZSBrZXlib2FyZCBldmVudHNcbiAgICAkKHRoaXMuZWxlbWVudCkuYXR0cigndGFiaW5kZXgnLCAwKS5mb2N1cygpO1xuXG4gICAgdGhpcy5pbml0SW50ZXJhY3Rpb25Ub29scygpO1xuXG4gICAgLy8gSWYgYSBwcmV2aW91c2x5IGFjdGl2ZSB0b29sIGV4aXN0cywgcmUtZW5hYmxlIGl0LlxuICAgIC8vIElmIG5vdCwgdXNlIHd3d2NcbiAgICBjb25zdCB0b29sVG9BY3RpdmF0ZSA9IHRoaXMuYWN0aXZlIHx8ICd3d3djJztcbiAgICB0aGlzLnRvZ2dsZVRvb2wodG9vbFRvQWN0aXZhdGUpO1xuXG4gICAgLy8gUmVtb3ZlIHRoZSAnYWN0aXZlJyBoaWdobGlnaHQgZnJvbSB0aGUgb3RoZXIgdG9vbHNcbiAgICAkKGAke3RoaXMudG9vbHNTZWxlY3Rvcn0gLmFjdGl2ZWApLnJlbW92ZUNsYXNzKCcuYWN0aXZlJyk7XG5cbiAgICAvLyBBZGQgaXQgdG8gb3VyIGRlc2lyZWQgdG9vbFxuICAgICQoYCR7dGhpcy50b29sc1NlbGVjdG9yfSBkaXZbZGF0YS10b29sPSR7dG9vbFRvQWN0aXZhdGV9XWApLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgIHRoaXMuYXR0YWNoRXZlbnRzKCk7XG4gIH1cbn07XG4iXX0=
},{"./debounce":27}],30:[function(require,module,exports){
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

var _menu = require('../menu/menu');

var _menu2 = _interopRequireDefault(_menu);

var _debounce = require('./debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.$ = $;
cornerstoneTools.external.$ = $;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstone.external.$ = $;

var config = {
  maxWebWorkers: navigator.hardwareConcurrency || 1,
  startWebWorkersOnDemand: true,
  webWorkerPath: 'node_modules/cornerstone-wado-image-loader/dist/cornerstoneWADOImageLoaderWebWorker.min.js',
  webWorkerTaskPaths: [],
  taskConfiguration: {
    decodeTask: {
      loadCodecsOnStartup: true,
      initializeCodecsOnStartup: false,
      codecsPath: 'cornerstoneWADOImageLoaderCodecs.min.js',
      usePDFJS: false,
      strict: false
    }
  }
};

var IMAGE_LOADED_EVENT = 'cornerstoneimageloaded';

exports.default = {
  $window: $(window),
  $viewer: $('.viewer-wrapper'),
  $overlay: $('.loading-overlay'),
  $loadingText: $('.loading-overlay .content .submit-text'),
  numImagesLoaded: 0,
  getNextCase: function getNextCase() {
    var _this = this;

    // Purge the old image cache, we don't expect to ever load the same case again
    cornerstone.imageCache.purgeCache();

    // TODO: Check this. Not sure this is necessary, actually, since things should be decached anyway
    cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.purge();

    // Clear any old requests in the request pool
    cornerstoneTools.requestPoolManager.clearRequestStack('interaction');
    cornerstoneTools.requestPoolManager.clearRequestStack('prefetch');

    // TODO: Cancel all ongoing requests

    // Remove all tool data in the tool state manager
    cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState({});

    return new Promise(function (resolve, reject) {
      var enabledElement = cornerstone.getEnabledElement(_this.element);

      _this.$loadingText.text('Retrieving case metadata...');
      _files2.default.getCaseImages().then(function (imageIds) {
        _this.$loadingText.text('Loading images...');
        console.time('Loading All Images');

        var loadingProgress = $('#loading-progress');
        var numImagesLoaded = 0;

        function handleImageLoaded() {
          numImagesLoaded += 1;
          var imagesLeft = imageIds.length - numImagesLoaded;
          loadingProgress.text(imagesLeft + ' images requested');
          if (numImagesLoaded === imageIds.length) {
            console.timeEnd('Loading All Images');
            loadingProgress.text('');
          }
        }

        cornerstone.events.removeEventListener(IMAGE_LOADED_EVENT, handleImageLoaded);
        cornerstone.events.addEventListener(IMAGE_LOADED_EVENT, handleImageLoaded);

        cornerstone.loadAndCacheImage(imageIds[0]).then(function (image) {
          resolve();

          // Set the default viewport parameters
          var viewport = cornerstone.getDefaultViewport(enabledElement.canvas, image);
          // e.g. lung window
          //viewport.voi.windowWidth = 1500;
          //viewport.voi.windowCenter = -300;

          cornerstone.displayImage(_this.element, image, viewport);
          _tools2.default.initTools(imageIds);

          _this.$loadingText.text('');
        }, reject);
      }, reject);
    });
  },
  initViewer: function initViewer() {
    var _this2 = this;

    this.$overlay.removeClass('invisible').addClass('loading');
    this.$loadingText.text('Initializing Viewer');
    this.element = $('#cornerstoneViewport')[0];

    _menu2.default.init();

    this.$viewer.removeClass('invisible');

    _tools2.default.element = this.element;
    _commands2.default.element = this.element;
    _menu2.default.element = this.element;

    _commands2.default.initCommands();

    var debounceCornerstoneResize = (0, _debounce2.default)(function () {
      return cornerstone.resize(_this2.element, true);
    }, 300);

    this.$window.off('resize', debounceCornerstoneResize);
    this.$window.on('resize', debounceCornerstoneResize);

    cornerstone.enable(this.element);

    // currentSeriesIndex = 0;//a hack to get series in order
    this.getNextCase().then(function () {
      _this2.$overlay.removeClass('loading').addClass('invisible');
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdlci5qcyJdLCJuYW1lcyI6WyJjb3JuZXJzdG9uZVdBRE9JbWFnZUxvYWRlciIsImV4dGVybmFsIiwiY29ybmVyc3RvbmUiLCIkIiwiY29ybmVyc3RvbmVUb29scyIsImNvbmZpZyIsIm1heFdlYldvcmtlcnMiLCJuYXZpZ2F0b3IiLCJoYXJkd2FyZUNvbmN1cnJlbmN5Iiwic3RhcnRXZWJXb3JrZXJzT25EZW1hbmQiLCJ3ZWJXb3JrZXJQYXRoIiwid2ViV29ya2VyVGFza1BhdGhzIiwidGFza0NvbmZpZ3VyYXRpb24iLCJkZWNvZGVUYXNrIiwibG9hZENvZGVjc09uU3RhcnR1cCIsImluaXRpYWxpemVDb2RlY3NPblN0YXJ0dXAiLCJjb2RlY3NQYXRoIiwidXNlUERGSlMiLCJzdHJpY3QiLCJJTUFHRV9MT0FERURfRVZFTlQiLCIkd2luZG93Iiwid2luZG93IiwiJHZpZXdlciIsIiRvdmVybGF5IiwiJGxvYWRpbmdUZXh0IiwibnVtSW1hZ2VzTG9hZGVkIiwiZ2V0TmV4dENhc2UiLCJpbWFnZUNhY2hlIiwicHVyZ2VDYWNoZSIsIndhZG91cmkiLCJkYXRhU2V0Q2FjaGVNYW5hZ2VyIiwicHVyZ2UiLCJyZXF1ZXN0UG9vbE1hbmFnZXIiLCJjbGVhclJlcXVlc3RTdGFjayIsImdsb2JhbEltYWdlSWRTcGVjaWZpY1Rvb2xTdGF0ZU1hbmFnZXIiLCJyZXN0b3JlVG9vbFN0YXRlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJlbmFibGVkRWxlbWVudCIsImdldEVuYWJsZWRFbGVtZW50IiwiZWxlbWVudCIsInRleHQiLCJnZXRDYXNlSW1hZ2VzIiwidGhlbiIsImltYWdlSWRzIiwiY29uc29sZSIsInRpbWUiLCJsb2FkaW5nUHJvZ3Jlc3MiLCJoYW5kbGVJbWFnZUxvYWRlZCIsImltYWdlc0xlZnQiLCJsZW5ndGgiLCJ0aW1lRW5kIiwiZXZlbnRzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImFkZEV2ZW50TGlzdGVuZXIiLCJsb2FkQW5kQ2FjaGVJbWFnZSIsImltYWdlIiwidmlld3BvcnQiLCJnZXREZWZhdWx0Vmlld3BvcnQiLCJjYW52YXMiLCJkaXNwbGF5SW1hZ2UiLCJpbml0VG9vbHMiLCJpbml0Vmlld2VyIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImluaXQiLCJpbml0Q29tbWFuZHMiLCJkZWJvdW5jZUNvcm5lcnN0b25lUmVzaXplIiwicmVzaXplIiwib2ZmIiwib24iLCJlbmFibGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBQSwyQkFBMkJDLFFBQTNCLENBQW9DQyxXQUFwQyxHQUFrREEsV0FBbEQ7QUFDQUYsMkJBQTJCQyxRQUEzQixDQUFvQ0UsQ0FBcEMsR0FBd0NBLENBQXhDO0FBQ0FDLGlCQUFpQkgsUUFBakIsQ0FBMEJFLENBQTFCLEdBQThCQSxDQUE5QjtBQUNBQyxpQkFBaUJILFFBQWpCLENBQTBCQyxXQUExQixHQUF3Q0EsV0FBeEM7QUFDQUEsWUFBWUQsUUFBWixDQUFxQkUsQ0FBckIsR0FBeUJBLENBQXpCOztBQUVBLElBQU1FLFNBQVM7QUFDYkMsaUJBQWVDLFVBQVVDLG1CQUFWLElBQWlDLENBRG5DO0FBRWJDLDJCQUF5QixJQUZaO0FBR2JDLGlCQUFlLDRGQUhGO0FBSWJDLHNCQUFvQixFQUpQO0FBS2JDLHFCQUFtQjtBQUNqQkMsZ0JBQVk7QUFDVkMsMkJBQXFCLElBRFg7QUFFVkMsaUNBQTJCLEtBRmpCO0FBR1ZDLGtCQUFZLHlDQUhGO0FBSVZDLGdCQUFVLEtBSkE7QUFLVkMsY0FBUTtBQUxFO0FBREs7QUFMTixDQUFmOztBQWdCQSxJQUFNQyxxQkFBcUIsd0JBQTNCOztrQkFFZTtBQUNiQyxXQUFTakIsRUFBRWtCLE1BQUYsQ0FESTtBQUViQyxXQUFTbkIsRUFBRSxpQkFBRixDQUZJO0FBR2JvQixZQUFVcEIsRUFBRSxrQkFBRixDQUhHO0FBSWJxQixnQkFBY3JCLEVBQUUsd0NBQUYsQ0FKRDtBQUtic0IsbUJBQWlCLENBTEo7QUFNYkMsYUFOYSx5QkFNQztBQUFBOztBQUNaO0FBQ0F4QixnQkFBWXlCLFVBQVosQ0FBdUJDLFVBQXZCOztBQUVBO0FBQ0E1QiwrQkFBMkI2QixPQUEzQixDQUFtQ0MsbUJBQW5DLENBQXVEQyxLQUF2RDs7QUFFQTtBQUNBM0IscUJBQWlCNEIsa0JBQWpCLENBQW9DQyxpQkFBcEMsQ0FBc0QsYUFBdEQ7QUFDQTdCLHFCQUFpQjRCLGtCQUFqQixDQUFvQ0MsaUJBQXBDLENBQXNELFVBQXREOztBQUVBOztBQUVBO0FBQ0E3QixxQkFBaUI4QixxQ0FBakIsQ0FBdURDLGdCQUF2RCxDQUF3RSxFQUF4RTs7QUFFQSxXQUFPLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsVUFBTUMsaUJBQWlCckMsWUFBWXNDLGlCQUFaLENBQThCLE1BQUtDLE9BQW5DLENBQXZCOztBQUVBLFlBQUtqQixZQUFMLENBQWtCa0IsSUFBbEIsQ0FBdUIsNkJBQXZCO0FBQ0Esc0JBQU1DLGFBQU4sR0FBc0JDLElBQXRCLENBQTJCLFVBQUNDLFFBQUQsRUFBYztBQUN2QyxjQUFLckIsWUFBTCxDQUFrQmtCLElBQWxCLENBQXVCLG1CQUF2QjtBQUNBSSxnQkFBUUMsSUFBUixDQUFhLG9CQUFiOztBQUVBLFlBQU1DLGtCQUFrQjdDLEVBQUUsbUJBQUYsQ0FBeEI7QUFDQSxZQUFJc0Isa0JBQWtCLENBQXRCOztBQUVBLGlCQUFTd0IsaUJBQVQsR0FBNkI7QUFDM0J4Qiw2QkFBbUIsQ0FBbkI7QUFDQSxjQUFNeUIsYUFBYUwsU0FBU00sTUFBVCxHQUFrQjFCLGVBQXJDO0FBQ0F1QiwwQkFBZ0JOLElBQWhCLENBQXdCUSxVQUF4QjtBQUNBLGNBQUl6QixvQkFBb0JvQixTQUFTTSxNQUFqQyxFQUF5QztBQUN2Q0wsb0JBQVFNLE9BQVIsQ0FBZ0Isb0JBQWhCO0FBQ0FKLDRCQUFnQk4sSUFBaEIsQ0FBcUIsRUFBckI7QUFDRDtBQUNGOztBQUVEeEMsb0JBQVltRCxNQUFaLENBQW1CQyxtQkFBbkIsQ0FBdUNuQyxrQkFBdkMsRUFBMkQ4QixpQkFBM0Q7QUFDQS9DLG9CQUFZbUQsTUFBWixDQUFtQkUsZ0JBQW5CLENBQW9DcEMsa0JBQXBDLEVBQXdEOEIsaUJBQXhEOztBQUVBL0Msb0JBQVlzRCxpQkFBWixDQUE4QlgsU0FBUyxDQUFULENBQTlCLEVBQTJDRCxJQUEzQyxDQUFnRCxVQUFDYSxLQUFELEVBQVc7QUFDekRwQjs7QUFFQTtBQUNBLGNBQU1xQixXQUFXeEQsWUFBWXlELGtCQUFaLENBQStCcEIsZUFBZXFCLE1BQTlDLEVBQXNESCxLQUF0RCxDQUFqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQXZELHNCQUFZMkQsWUFBWixDQUF5QixNQUFLcEIsT0FBOUIsRUFBdUNnQixLQUF2QyxFQUE4Q0MsUUFBOUM7QUFDQSwwQkFBTUksU0FBTixDQUFnQmpCLFFBQWhCOztBQUVBLGdCQUFLckIsWUFBTCxDQUFrQmtCLElBQWxCLENBQXVCLEVBQXZCO0FBQ0QsU0FiRCxFQWFHSixNQWJIO0FBY0QsT0FsQ0QsRUFrQ0dBLE1BbENIO0FBbUNELEtBdkNNLENBQVA7QUF3Q0QsR0E5RFk7QUFnRWJ5QixZQWhFYSx3QkFnRUE7QUFBQTs7QUFDWCxTQUFLeEMsUUFBTCxDQUFjeUMsV0FBZCxDQUEwQixXQUExQixFQUF1Q0MsUUFBdkMsQ0FBZ0QsU0FBaEQ7QUFDQSxTQUFLekMsWUFBTCxDQUFrQmtCLElBQWxCLENBQXVCLHFCQUF2QjtBQUNBLFNBQUtELE9BQUwsR0FBZXRDLEVBQUUsc0JBQUYsRUFBMEIsQ0FBMUIsQ0FBZjs7QUFFQSxtQkFBSytELElBQUw7O0FBRUEsU0FBSzVDLE9BQUwsQ0FBYTBDLFdBQWIsQ0FBeUIsV0FBekI7O0FBRUEsb0JBQU12QixPQUFOLEdBQWdCLEtBQUtBLE9BQXJCO0FBQ0EsdUJBQVNBLE9BQVQsR0FBbUIsS0FBS0EsT0FBeEI7QUFDQSxtQkFBS0EsT0FBTCxHQUFlLEtBQUtBLE9BQXBCOztBQUVBLHVCQUFTMEIsWUFBVDs7QUFFQSxRQUFNQyw0QkFBNEIsd0JBQVM7QUFBQSxhQUFNbEUsWUFBWW1FLE1BQVosQ0FBbUIsT0FBSzVCLE9BQXhCLEVBQWlDLElBQWpDLENBQU47QUFBQSxLQUFULEVBQXVELEdBQXZELENBQWxDOztBQUVBLFNBQUtyQixPQUFMLENBQWFrRCxHQUFiLENBQWlCLFFBQWpCLEVBQTJCRix5QkFBM0I7QUFDQSxTQUFLaEQsT0FBTCxDQUFhbUQsRUFBYixDQUFnQixRQUFoQixFQUEwQkgseUJBQTFCOztBQUVBbEUsZ0JBQVlzRSxNQUFaLENBQW1CLEtBQUsvQixPQUF4Qjs7QUFFQTtBQUNBLFNBQUtmLFdBQUwsR0FBbUJrQixJQUFuQixDQUF3QixZQUFNO0FBQzVCLGFBQUtyQixRQUFMLENBQWN5QyxXQUFkLENBQTBCLFNBQTFCLEVBQXFDQyxRQUFyQyxDQUE4QyxXQUE5QztBQUNELEtBRkQ7QUFHRDtBQTFGWSxDIiwiZmlsZSI6InZpZXdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBGaWxlcyBmcm9tICcuL2ZpbGVzJztcbmltcG9ydCBUb29scyBmcm9tICcuL3Rvb2xzJztcbmltcG9ydCBDb21tYW5kcyBmcm9tICcuL2NvbW1hbmRzJztcbmltcG9ydCBNZW51IGZyb20gJy4uL21lbnUvbWVudSc7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnLi9kZWJvdW5jZSc7XG5cbmNvcm5lcnN0b25lV0FET0ltYWdlTG9hZGVyLmV4dGVybmFsLmNvcm5lcnN0b25lID0gY29ybmVyc3RvbmU7XG5jb3JuZXJzdG9uZVdBRE9JbWFnZUxvYWRlci5leHRlcm5hbC4kID0gJDtcbmNvcm5lcnN0b25lVG9vbHMuZXh0ZXJuYWwuJCA9ICQ7XG5jb3JuZXJzdG9uZVRvb2xzLmV4dGVybmFsLmNvcm5lcnN0b25lID0gY29ybmVyc3RvbmU7XG5jb3JuZXJzdG9uZS5leHRlcm5hbC4kID0gJDtcblxuY29uc3QgY29uZmlnID0ge1xuICBtYXhXZWJXb3JrZXJzOiBuYXZpZ2F0b3IuaGFyZHdhcmVDb25jdXJyZW5jeSB8fCAxLFxuICBzdGFydFdlYldvcmtlcnNPbkRlbWFuZDogdHJ1ZSxcbiAgd2ViV29ya2VyUGF0aDogJ25vZGVfbW9kdWxlcy9jb3JuZXJzdG9uZS13YWRvLWltYWdlLWxvYWRlci9kaXN0L2Nvcm5lcnN0b25lV0FET0ltYWdlTG9hZGVyV2ViV29ya2VyLm1pbi5qcycsXG4gIHdlYldvcmtlclRhc2tQYXRoczogW10sXG4gIHRhc2tDb25maWd1cmF0aW9uOiB7XG4gICAgZGVjb2RlVGFzazoge1xuICAgICAgbG9hZENvZGVjc09uU3RhcnR1cDogdHJ1ZSxcbiAgICAgIGluaXRpYWxpemVDb2RlY3NPblN0YXJ0dXA6IGZhbHNlLFxuICAgICAgY29kZWNzUGF0aDogJ2Nvcm5lcnN0b25lV0FET0ltYWdlTG9hZGVyQ29kZWNzLm1pbi5qcycsXG4gICAgICB1c2VQREZKUzogZmFsc2UsXG4gICAgICBzdHJpY3Q6IGZhbHNlLFxuICAgIH1cbiAgfVxufTtcblxuY29uc3QgSU1BR0VfTE9BREVEX0VWRU5UID0gJ2Nvcm5lcnN0b25laW1hZ2Vsb2FkZWQnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICR3aW5kb3c6ICQod2luZG93KSxcbiAgJHZpZXdlcjogJCgnLnZpZXdlci13cmFwcGVyJyksXG4gICRvdmVybGF5OiAkKCcubG9hZGluZy1vdmVybGF5JyksXG4gICRsb2FkaW5nVGV4dDogJCgnLmxvYWRpbmctb3ZlcmxheSAuY29udGVudCAuc3VibWl0LXRleHQnKSxcbiAgbnVtSW1hZ2VzTG9hZGVkOiAwLFxuICBnZXROZXh0Q2FzZSgpIHtcbiAgICAvLyBQdXJnZSB0aGUgb2xkIGltYWdlIGNhY2hlLCB3ZSBkb24ndCBleHBlY3QgdG8gZXZlciBsb2FkIHRoZSBzYW1lIGNhc2UgYWdhaW5cbiAgICBjb3JuZXJzdG9uZS5pbWFnZUNhY2hlLnB1cmdlQ2FjaGUoKTtcblxuICAgIC8vIFRPRE86IENoZWNrIHRoaXMuIE5vdCBzdXJlIHRoaXMgaXMgbmVjZXNzYXJ5LCBhY3R1YWxseSwgc2luY2UgdGhpbmdzIHNob3VsZCBiZSBkZWNhY2hlZCBhbnl3YXlcbiAgICBjb3JuZXJzdG9uZVdBRE9JbWFnZUxvYWRlci53YWRvdXJpLmRhdGFTZXRDYWNoZU1hbmFnZXIucHVyZ2UoKTtcblxuICAgIC8vIENsZWFyIGFueSBvbGQgcmVxdWVzdHMgaW4gdGhlIHJlcXVlc3QgcG9vbFxuICAgIGNvcm5lcnN0b25lVG9vbHMucmVxdWVzdFBvb2xNYW5hZ2VyLmNsZWFyUmVxdWVzdFN0YWNrKCdpbnRlcmFjdGlvbicpO1xuICAgIGNvcm5lcnN0b25lVG9vbHMucmVxdWVzdFBvb2xNYW5hZ2VyLmNsZWFyUmVxdWVzdFN0YWNrKCdwcmVmZXRjaCcpO1xuXG4gICAgLy8gVE9ETzogQ2FuY2VsIGFsbCBvbmdvaW5nIHJlcXVlc3RzXG5cbiAgICAvLyBSZW1vdmUgYWxsIHRvb2wgZGF0YSBpbiB0aGUgdG9vbCBzdGF0ZSBtYW5hZ2VyXG4gICAgY29ybmVyc3RvbmVUb29scy5nbG9iYWxJbWFnZUlkU3BlY2lmaWNUb29sU3RhdGVNYW5hZ2VyLnJlc3RvcmVUb29sU3RhdGUoe30pO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGVuYWJsZWRFbGVtZW50ID0gY29ybmVyc3RvbmUuZ2V0RW5hYmxlZEVsZW1lbnQodGhpcy5lbGVtZW50KTtcblxuICAgICAgdGhpcy4kbG9hZGluZ1RleHQudGV4dCgnUmV0cmlldmluZyBjYXNlIG1ldGFkYXRhLi4uJyk7XG4gICAgICBGaWxlcy5nZXRDYXNlSW1hZ2VzKCkudGhlbigoaW1hZ2VJZHMpID0+IHtcbiAgICAgICAgdGhpcy4kbG9hZGluZ1RleHQudGV4dCgnTG9hZGluZyBpbWFnZXMuLi4nKTtcbiAgICAgICAgY29uc29sZS50aW1lKCdMb2FkaW5nIEFsbCBJbWFnZXMnKTtcblxuICAgICAgICBjb25zdCBsb2FkaW5nUHJvZ3Jlc3MgPSAkKCcjbG9hZGluZy1wcm9ncmVzcycpO1xuICAgICAgICBsZXQgbnVtSW1hZ2VzTG9hZGVkID0gMDtcblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVJbWFnZUxvYWRlZCgpIHtcbiAgICAgICAgICBudW1JbWFnZXNMb2FkZWQgKz0gMTtcbiAgICAgICAgICBjb25zdCBpbWFnZXNMZWZ0ID0gaW1hZ2VJZHMubGVuZ3RoIC0gbnVtSW1hZ2VzTG9hZGVkO1xuICAgICAgICAgIGxvYWRpbmdQcm9ncmVzcy50ZXh0KGAke2ltYWdlc0xlZnR9IGltYWdlcyByZXF1ZXN0ZWRgKTtcbiAgICAgICAgICBpZiAobnVtSW1hZ2VzTG9hZGVkID09PSBpbWFnZUlkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnTG9hZGluZyBBbGwgSW1hZ2VzJyk7XG4gICAgICAgICAgICBsb2FkaW5nUHJvZ3Jlc3MudGV4dCgnJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29ybmVyc3RvbmUuZXZlbnRzLnJlbW92ZUV2ZW50TGlzdGVuZXIoSU1BR0VfTE9BREVEX0VWRU5ULCBoYW5kbGVJbWFnZUxvYWRlZCk7XG4gICAgICAgIGNvcm5lcnN0b25lLmV2ZW50cy5hZGRFdmVudExpc3RlbmVyKElNQUdFX0xPQURFRF9FVkVOVCwgaGFuZGxlSW1hZ2VMb2FkZWQpO1xuXG4gICAgICAgIGNvcm5lcnN0b25lLmxvYWRBbmRDYWNoZUltYWdlKGltYWdlSWRzWzBdKS50aGVuKChpbWFnZSkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoKTtcblxuICAgICAgICAgIC8vIFNldCB0aGUgZGVmYXVsdCB2aWV3cG9ydCBwYXJhbWV0ZXJzXG4gICAgICAgICAgY29uc3Qgdmlld3BvcnQgPSBjb3JuZXJzdG9uZS5nZXREZWZhdWx0Vmlld3BvcnQoZW5hYmxlZEVsZW1lbnQuY2FudmFzLCBpbWFnZSk7XG4gICAgICAgICAgLy8gZS5nLiBsdW5nIHdpbmRvd1xuICAgICAgICAgIC8vdmlld3BvcnQudm9pLndpbmRvd1dpZHRoID0gMTUwMDtcbiAgICAgICAgICAvL3ZpZXdwb3J0LnZvaS53aW5kb3dDZW50ZXIgPSAtMzAwO1xuXG4gICAgICAgICAgY29ybmVyc3RvbmUuZGlzcGxheUltYWdlKHRoaXMuZWxlbWVudCwgaW1hZ2UsIHZpZXdwb3J0KTtcbiAgICAgICAgICBUb29scy5pbml0VG9vbHMoaW1hZ2VJZHMpO1xuXG4gICAgICAgICAgdGhpcy4kbG9hZGluZ1RleHQudGV4dCgnJyk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9LCByZWplY3QpO1xuICAgIH0pO1xuICB9LFxuXG4gIGluaXRWaWV3ZXIoKSB7XG4gICAgdGhpcy4kb3ZlcmxheS5yZW1vdmVDbGFzcygnaW52aXNpYmxlJykuYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICB0aGlzLiRsb2FkaW5nVGV4dC50ZXh0KCdJbml0aWFsaXppbmcgVmlld2VyJyk7XG4gICAgdGhpcy5lbGVtZW50ID0gJCgnI2Nvcm5lcnN0b25lVmlld3BvcnQnKVswXTtcblxuICAgIE1lbnUuaW5pdCgpO1xuXG4gICAgdGhpcy4kdmlld2VyLnJlbW92ZUNsYXNzKCdpbnZpc2libGUnKTtcblxuICAgIFRvb2xzLmVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XG4gICAgQ29tbWFuZHMuZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcbiAgICBNZW51LmVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XG5cbiAgICBDb21tYW5kcy5pbml0Q29tbWFuZHMoKTtcblxuICAgIGNvbnN0IGRlYm91bmNlQ29ybmVyc3RvbmVSZXNpemUgPSBkZWJvdW5jZSgoKSA9PiBjb3JuZXJzdG9uZS5yZXNpemUodGhpcy5lbGVtZW50LCB0cnVlKSwgMzAwKTtcblxuICAgIHRoaXMuJHdpbmRvdy5vZmYoJ3Jlc2l6ZScsIGRlYm91bmNlQ29ybmVyc3RvbmVSZXNpemUpO1xuICAgIHRoaXMuJHdpbmRvdy5vbigncmVzaXplJywgZGVib3VuY2VDb3JuZXJzdG9uZVJlc2l6ZSk7XG5cbiAgICBjb3JuZXJzdG9uZS5lbmFibGUodGhpcy5lbGVtZW50KTtcblxuICAgIC8vIGN1cnJlbnRTZXJpZXNJbmRleCA9IDA7Ly9hIGhhY2sgdG8gZ2V0IHNlcmllcyBpbiBvcmRlclxuICAgIHRoaXMuZ2V0TmV4dENhc2UoKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuJG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKS5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
},{"../menu/menu":22,"./commands":25,"./debounce":27,"./files":28,"./tools":29}]},{},[20])