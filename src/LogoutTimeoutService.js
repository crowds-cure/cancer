const LogoutTimeoutService = new function() {
  const eventsToResetTimeout = [
    'load',
    'mousemove',
    'mousedown',
    'mouseup',
    'resize',
    'focus',
    'keydown',
    'keyup',
    'touchstart',
    'touchmove',
    'touchend'
  ];

  const routesToSkipTimeout = ['/leaderboard'];
  const logoutTimeoutIn = 5 * 60 * 1000; // 5 mins

  const isValidRouteToLogout = () => {
    const { pathname } = (window || {}).location || {};

    if (!pathname) {
      return;
    }

    return !routesToSkipTimeout.some(routeToSkip => {
      const routeToSkipRegExp = new RegExp(routeToSkip);
      return routeToSkipRegExp.test(pathname);
    });
  };

  this.init = () => {
    // register listeners
    for (var event in eventsToResetTimeout) {
      window.addEventListener(eventsToResetTimeout[event], this.resetTimeout);
    }
    // register timeout
    this.setTimeout();
  };

  this.destroy = () => {
    this.clearTimeout();
    this.logoutTimeout = undefined;
  };

  this.clearTimeout = () => {
    if (this.logoutTimeout) {
      clearTimeout(this.logoutTimeout);
    }
  };

  this.setTimeout = () => {
    if (logoutTimeoutIn) {
      this.logoutTimeout = setTimeout(this.logout, logoutTimeoutIn);
    }
  };

  this.resetTimeout = () => {
    this.clearTimeout();
    this.setTimeout();
  };

  this.logout = () => {
    if (isValidRouteToLogout()) {
      this.clearTimeout();
      window.auth.logout();
    } else {
      this.resetTimeout();
    }
  };

  return this;
}();

export default LogoutTimeoutService;
