const pointOptions = {
  alertTitle: () => `Keep going!`,
  alertDescription: number => `${number} more points to earn a new badge`,
  badgeTitle: () => 'Badge earned',
  badgeDescription: number => `${number} points`
};
const pointBadges = [
  { id: 'p75', value: 75, alertDiff: 10, options: pointOptions },
  { id: 'p125', value: 125, alertDiff: 10, options: pointOptions },
  { id: 'p250', value: 250, alertDiff: 10, options: pointOptions },
  { id: 'p500', value: 500, alertDiff: 50, options: pointOptions },
  { id: 'p750', value: 750, alertDiff: 50, options: pointOptions },
  { id: 'p1250', value: 1250, alertDiff: 50, options: pointOptions },
  { id: 'p2500', value: 2500, alertDiff: 100, options: pointOptions }
];

const measurementOptions = {
  alertTitle: () => `Keep going!`,
  alertDescription: number => `${number} more measurements to earn a new badge`,
  badgeTitle: () => 'Badge earned',
  badgeDescription: number => `${number} measurements`
};
const measurementBadges = [
  { id: 'm10', value: 10, alertDiff: 5, options: measurementOptions },
  { id: 'm25', value: 25, alertDiff: 5, options: measurementOptions },
  { id: 'm50', value: 50, alertDiff: 5, options: measurementOptions },
  { id: 'm75', value: 75, alertDiff: 5, options: measurementOptions },
  { id: 'm100', value: 100, alertDiff: 10, options: measurementOptions },
  { id: 'm200', value: 200, alertDiff: 25, options: measurementOptions },
  { id: 'm500', value: 500, alertDiff: 25, options: measurementOptions },
  { id: 'm750', value: 750, alertDiff: 50, options: measurementOptions },
  { id: 'm1000', value: 1000, alertDiff: 100, options: measurementOptions },
];

class BadgeNotification {
  constructor(type, text, notified=false) {
    this.type = type;
    this.notified = notified;
  }

  notify() {}
}

class BadgeNotificationManager {
  constructor() {
    this.notifications = new Map();
  }

  createNotifications(badgesSettings, badgeTemplate, alertTemplate) {
    badgesSettings.forEach(badgeSettings => {

    });
  }
}
