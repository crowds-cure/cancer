import { achievements as achievementsDetails } from "../achievements";
import NotificationManager from "./NotificationManager";

class NotificationService {

  constructor() {
    this.achievements = new Set();
    this.achievementStatus = null;
    this.alerted = new Set();
  }

  reset() {
    this.achievements = new Set();
    this.achievementStatus = null;
    this.alerted = new Set();
  }

  updateAchievementStatus(achievementStatus, silent = false) {
    this.achievementStatus = achievementStatus;

    if (silent) {
      return;
    }

    let wait = 0;
    Object.keys(achievementsDetails).forEach(key => {
      const details = achievementsDetails[key];
      if (!details) {
        return;
      }

      const { statusKey } = details;
      if (!details.statusKey) {
        return;
      }

      const { img, value, alertDiff, alertTitle, alertMessage } = details;
      const current = achievementStatus[statusKey];
      const min = value - alertDiff
      if (current >= min && current < value && !this.alerted.has(key)) {
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
      this.notifyEarnedAchievements(diff);
    }
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

}

export default new NotificationService();
