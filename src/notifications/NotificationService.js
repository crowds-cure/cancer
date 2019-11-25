import { achievements as achievementsDetails } from "../achievements";
import { BADGE_TYPES as rankBadgesDetails } from "../badges";
import { caseNotifications as caseNotificationsDetails } from "../caseNotifications";
import NotificationManager from "./NotificationManager";

class NotificationService {

  constructor() {
    this.totalMeasurements = NaN;
    this.caseMeasurements = 0;
    this.achievements = [];
    this.achievementStatus = {};
    this.alerted = new Set();
    this.earned = new Set();
    this.sessionEarned = new Set();
  }

  setTotalMeasurements(totalMeasurements) {
    this.totalMeasurements = totalMeasurements;

    Object.keys(rankBadgesDetails).forEach(key => {
      const details = rankBadgesDetails[key];
      if (totalMeasurements >= details.min) {
        this.alerted.add(details);
        this.earned.add(details);
      }
    });

    Object.keys(caseNotificationsDetails).forEach(key => {
      const details = caseNotificationsDetails[key];
      if (totalMeasurements >= details.min) {
        this.alerted.add(details);
        this.earned.add(details);
      }
    });
  }

  setAchievements(achievements) {
    this.achievements = Array.from(achievements);

    achievements.forEach(key => {
      const details = achievementsDetails[key];
      this.alerted.add(details);
      this.earned.add(details);
    });
  }

  setCaseMeasurements(caseMeasurements) {
    this.caseMeasurements = caseMeasurements;

    this.processCaseAlerts();
  }

  update(totalMeasurements, achievementStatus, achievements) {
    this.totalMeasurements = totalMeasurements;
    this.achievementStatus = achievementStatus;
    this.achievements = Array.from(achievements);

    this.processAlerts();
    this.processEarnedBadges();
  }

  processCaseAlerts() {
    const currentValue = this.totalMeasurements + this.caseMeasurements;
    if (isNaN(currentValue)) {
      return;
    }

    let wait = 0;
    Object.keys(caseNotificationsDetails).forEach(key => {
      const details = caseNotificationsDetails[key];
      if (this.alerted.has(details) || currentValue < details.min) {
        return;
      }

      const { img, alertTitle, alertMessage } = details;
      const opt = { wait, timeout: 7000 };
      NotificationManager.toast(alertTitle, alertMessage, img, opt);
      this.alerted.add(details);
      wait += 750;
    });
  }

  processAlerts() {
    const rankBadgeAlert = this.getRankBadgeAlert();
    const achievementAlerts = this.getAchievementAlerts();
    const alerts = Array.from(achievementAlerts);
    if (rankBadgeAlert) {
      alerts.unshift(rankBadgeAlert);
    }

    let wait = 0;
    alerts.forEach(details => {
      if (this.alerted.has(details)) {
        return;
      }

      const { img, min, alertTitle, alertMessage } = details;
      let current = this.totalMeasurements;
      if (!details.type) {
        current = this.achievementStatus[details.statusKey];
      }

      const diff = min - current;
      const opt = { wait, timeout: 7000 };
      NotificationManager.toast(alertTitle, alertMessage(diff), img, opt);
      this.alerted.add(details);
      wait += 750;
    });
  }

  processEarnedBadges() {
    const mapFunction = key => achievementsDetails[key];
    const newAchievements = this.achievements.map(mapFunction) || [];
    const diff = newAchievements.filter(details => !this.earned.has(details));
    const toNotify = [];
    diff.forEach(details => {
      this.earned.add(details);
      this.sessionEarned.add(details);
      toNotify.push(details);
    });

    Object.keys(rankBadgesDetails).every(key => {
      const details = rankBadgesDetails[key];
      if (this.earned.has(details)) {
        return true;
      }

      const current = this.totalMeasurements;
      const { min, max } = details;
      if (current >= min && current < max) {
        toNotify.unshift(details);
        this.earned.add(details);
        this.sessionEarned.add(details);
        return false;
      }

      return true;
    });

    this.notifyEarnedBadges(toNotify);
  }

  notifyEarnedBadges(toNotify) {
    if (!toNotify || !toNotify.length) {
      return;
    }

    const details = toNotify.shift();
    const { name, description, img } = details;
    const text = name ? `${name} (${description})` : description;
    const onRemove = () => this.notifyEarnedBadges(toNotify);
    NotificationManager.box('Badge earned', text, img, { onRemove });
  }

  getRankBadgeAlert() {
    let badgeToAlert;

    Object.keys(rankBadgesDetails).forEach(key => {
      const details = rankBadgesDetails[key];
      if (!details || this.alerted.has(details)) {
        return true;
      }

      const { min, alertDiff } = details;
      const current = this.totalMeasurements;
      if (current >= min - alertDiff && current < min) {
        badgeToAlert = details;
        return false;
      }

      return true;
    });

    return badgeToAlert;
  }

  getAchievementAlerts() {
    const toAlert = [];

    Object.keys(achievementsDetails).forEach(key => {
      const details = achievementsDetails[key];
      if (!details) {
        return;
      }

      const { statusKey } = details;
      if (!details.statusKey) {
        return;
      }

      const { min, alertDiff } = details;
      const current = this.achievementStatus[statusKey];
      if (current >= min - alertDiff && current < min) {
        toAlert.push(details);
      }
    });

    return toAlert;
  }

  dumpSessionEarned() {
    const sessionEarned = Array.from(this.sessionEarned);
    this.sessionEarned = new Set();
    return sessionEarned;
  }

  getAchievementProgress(details) {
    if (!details.statusKey) {
      return null;
    }

    const currentValue = this.achievementStatus[details.statusKey] || 0;
    let start = 0;
    Object.keys(achievementsDetails).forEach(key => {
      const currentDetails = achievementsDetails[key];
      if (
        (details.statusKey !== currentDetails.statusKey) ||
        details === currentDetails
      ) {
        return;
      }

      const { min } = currentDetails;
      if (min > start && min < details.min) {
        start = min;
      }
    });

    const end = details.min;
    return {
      start,
      end,
      percent: ((currentValue - start) / (end - start)) * 100
    };
  }

}

export default new NotificationService();
