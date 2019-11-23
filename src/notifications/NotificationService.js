import { achievements as achievementsDetails } from "../achievements";
import NotificationManager from "./NotificationManager";

class NotificationService {

  constructor() {
    this.achievements = new Set();
    this.achievementStatus = {};
    this.alerted = new Set();
    this.earned = new Set();
  }

  updateAchievementStatus(achievementStatus, silent = false) {
    this.achievementStatus = achievementStatus;

    if (silent) {
      return;
    }

    let wait = 0;
    const achievements = this.getAlertAchievements();
    achievements.forEach(key => {
      const details = achievementsDetails[key];
      const { statusKey, img, value, alertTitle, alertMessage } = details;
      const current = achievementStatus[statusKey];
      if (!this.alerted.has(key)) {
        const diff = value - current;
        const opt = { wait, timeout: 7000 };
        NotificationManager.popup(alertTitle, alertMessage(diff), img, opt);
        this.alerted.add(key);
        wait += 750;
      }
    });
  }

  updateAchievements(achievements, silent = false) {
    const oldArray = this.achievements;

    this.achievements = new Set(achievements);

    if (silent) {
      return;
    }

    const diff = this.getAchievementsDifference(achievements, oldArray);
    if (diff.length) {
      diff.forEach(key => this.earned.add(key));
      this.notifyEarnedAchievements(diff);
    }
  }

  getAlertAchievements() {
    const achievements = [];

    Object.keys(achievementsDetails).forEach(key => {
      const details = achievementsDetails[key];
      if (!details) {
        return;
      }

      const { statusKey } = details;
      if (!details.statusKey) {
        return;
      }

      const { value, alertDiff } = details;
      const current = this.achievementStatus[statusKey];
      if (current >= value - alertDiff && current < value) {
        achievements.push(key);
      }
    });

    return achievements;
  }

  notifyEarnedAchievements(achievements) {
    const key = achievements.shift();
    const { description, img } = achievementsDetails[key];
    NotificationManager.box('Badge earned', description, img, {
      onRemove: () => {
        if (achievements.length) {
          this.notifyEarnedAchievements(achievements);
        }
      }
    });
  }

  getAchievementsDifference(newArray, oldArray) {
    return newArray.filter(achievement => !oldArray.has(achievement));
  }

  dumpEarned() {
    const earned = Array.from(this.earned);
    this.earned = new Set();
    return earned;
  }

  getAchievementProgress(achievementKey) {
    const details = achievementsDetails[achievementKey];
    if (!details.statusKey) {
      return null;
    }

    const currentValue = this.achievementStatus[details.statusKey] || 0;
    let start = 0;
    Object.keys(achievementsDetails).forEach(key => {
      const currentDetails = achievementsDetails[key];
      if (
        (details.statusKey !== currentDetails.statusKey) ||
        achievementKey === key
      ) {
        return;
      }

      const { value } = currentDetails;
      if (value > start && value < details.value) {
        start = value;
      }
    });

    const end = details.value;
    return {
      start,
      end,
      percent: ((currentValue - start) / (end - start)) * 100
    };
  }

}

export default new NotificationService();
