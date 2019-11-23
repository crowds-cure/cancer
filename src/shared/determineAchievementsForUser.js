import { getDB } from '../db';
import {
  getTopAnnotatorsByDay,
  getTopAnnotatorsByWeek,
  getTopTeamsByWeek
} from './getTopAnnotators';
import getProfile from '../viewer/lib/getProfile';
import NotificationService from '../notifications/NotificationService';

async function getMaxWithTwoGroupLevelForUser(db, dbView, username) {
  const result = await db.query(dbView, {
    reduce: true,
    group: true,
    group_level: 2,
    start_key: [username, ''],
    end_key: [username, {}]
  });

  if (!result.rows || !result.rows.length) {
    return 0;
  }

  // Return max of the values grouped by
  return result.rows.reduce(
    (max, row) => (row.value > max ? row.value : max),
    0
  );
}

async function getValueWithOneGroupLevelForUser(db, dbView, username) {
  const result = await db.query(dbView, {
    reduce: true,
    group: true,
    group_level: 1,
    start_key: username,
    end_key: username
  });

  if (!result.rows || !result.rows.length) {
    return 0;
  }

  return result.rows[0].value;
}

async function getTopIndivNumberInRSNA18DayForUser(username) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Determine only for RSNA 2018 (Nov 25 - 30)
  if (year !== 2018 || month !== 11 || day < 25 || day > 30) {
    return -1;
  }

  const topAnnotators = await getTopAnnotatorsByDay(10, year, month, day);
  return topAnnotators.findIndex(topA => topA.name[1] === username) + 1;
}

async function getTopIndivNumberInRSNA18WeekForUser(username) {
  const date = new Date();
  const year = date.getFullYear();
  const week = 48;

  // Determine only for RSNA 2018 (Week 48)
  if (year !== 2018) {
    return -1;
  }

  const topAnnotators = await getTopAnnotatorsByWeek(10, week);
  return topAnnotators.findIndex(topA => topA.name[1] === username) + 1;
}

async function getTopTeamNumberInRSNA18WeekForUser(team) {
  const date = new Date();
  const year = date.getFullYear();
  const week = 48;

  // Determine only for RSNA 2018 (Week 48)
  if (year !== 2018) {
    return -1;
  }

  const topTeams = await getTopTeamsByWeek(10, week);
  return topTeams.findIndex(topT => topT.name === team) + 1;
}

async function getAchievementStatusForUser() {
  const measurementsDB = getDB('measurements');
  const sessionsDB = getDB('sessions');
  const { team, username } = getProfile();

  const maxMeasurementsInDay = await getMaxWithTwoGroupLevelForUser(
    measurementsDB,
    'by/annotatorDay',
    username
  );
  const maxMeasurementsInWeek = await getMaxWithTwoGroupLevelForUser(
    measurementsDB,
    'by/annotatorWeek',
    username
  );

  const maxMeasurementsInSession = await getValueWithOneGroupLevelForUser(
    sessionsDB,
    'by/usernameMaxCases',
    username
  );
  const maxSessionDurationInMin = await getValueWithOneGroupLevelForUser(
    sessionsDB,
    'by/usernameMaxSessionDurationInMin',
    username
  );
  const totalSessionDurationInMinInWeek = await getMaxWithTwoGroupLevelForUser(
    sessionsDB,
    'by/usernameWeekSessionDurationInMin',
    username
  );

  const topIndivNumberInRSNA18Day = await getTopIndivNumberInRSNA18DayForUser(
    username
  );
  const topIndivNumberInRSNA18Week = await getTopIndivNumberInRSNA18WeekForUser(
    username
  );
  const topTeamNumberInRSNA18Week = await getTopTeamNumberInRSNA18WeekForUser(
    team
  );

  return {
    maxMeasurementsInDay, // Max number of total measurements in a day
    maxMeasurementsInWeek, // Max number of total measurements in a week
    maxMeasurementsInSession, // Max number of total measurements in a session
    maxSessionDurationInMin, // Max session duration in minutes all time
    totalSessionDurationInMinInWeek, // Total session duration in minutes in a week
    topIndivNumberInRSNA18Day, // Top Leaderboard Individual Number in a day of RSNA 2018
    topIndivNumberInRSNA18Week, // Top Leaderboard Individual Number in the week of RSNA 2018
    topTeamNumberInRSNA18Week // Top Leaderboard Team Number in the week of RSNA 2018
  };
}

async function determineAchievementsForUser(totalCompleteCollection) {
  const achievements = [];

  const achievementStatus = await getAchievementStatusForUser();

  // Collection Badge
  if (totalCompleteCollection > 0) {
    achievements.push('collectionAllCases');
  }

  // Productivity Badges - Day
  if (achievementStatus.maxMeasurementsInDay >= 10) {
    achievements.push('day10Measurements');
  }
  if (achievementStatus.maxMeasurementsInDay >= 25) {
    achievements.push('day25Measurements');
  }
  if (achievementStatus.maxMeasurementsInDay >= 50) {
    achievements.push('day50Measurements');
  }
  if (achievementStatus.maxMeasurementsInDay >= 75) {
    achievements.push('day75Measurements');
  }
  if (achievementStatus.maxMeasurementsInDay >= 100) {
    achievements.push('day100Measurements');
  }
  if (achievementStatus.maxMeasurementsInDay >= 200) {
    achievements.push('day200Measurements');
  }

  // Productivity Badges - Week
  if (achievementStatus.maxMeasurementsInWeek >= 50) {
    achievements.push('weekMeasurements50');
  }
  if (achievementStatus.maxMeasurementsInWeek >= 100) {
    achievements.push('weekMeasurements100');
  }
  if (achievementStatus.maxMeasurementsInWeek >= 250) {
    achievements.push('weekMeasurements250');
  }
  if (achievementStatus.maxMeasurementsInWeek >= 500) {
    achievements.push('weekMeasurements500');
  }

  // Productivity Badges - Session
  if (achievementStatus.maxMeasurementsInSession >= 25) {
    achievements.push('sessionMeasurements25');
  }
  if (achievementStatus.maxMeasurementsInSession >= 50) {
    achievements.push('sessionMeasurements50');
  }
  if (achievementStatus.maxMeasurementsInSession >= 75) {
    achievements.push('sessionMeasurements75');
  }
  if (achievementStatus.maxMeasurementsInSession >= 100) {
    achievements.push('sessionMeasurements100');
  }
  if (achievementStatus.maxMeasurementsInSession >= 200) {
    achievements.push('sessionMeasurements200');
  }

  // Persistence Badges - Session
  if (achievementStatus.maxSessionDurationInMin >= 15) {
    achievements.push('timeSession15');
  }
  if (achievementStatus.maxSessionDurationInMin >= 30) {
    achievements.push('timeSession30');
  }
  if (achievementStatus.maxSessionDurationInMin >= 60) {
    achievements.push('timeSession60');
  }
  if (achievementStatus.maxSessionDurationInMin >= 90) {
    achievements.push('timeSession90');
  }

  // Persistence Badges - Week
  if (achievementStatus.totalSessionDurationInMinInWeek >= 90) {
    achievements.push('timeSessionWeek90m');
  }
  if (achievementStatus.totalSessionDurationInMinInWeek >= 100) {
    achievements.push('timeSessionWeek3h');
  }
  if (achievementStatus.totalSessionDurationInMinInWeek >= 360) {
    achievements.push('timeSessionWeek6h');
  }
  if (achievementStatus.totalSessionDurationInMinInWeek >= 540) {
    achievements.push('timeSessionWeek9h');
  }

  // Individual Leader Badge - Day
  if (achievementStatus.topIndivNumberInRSNA18Day === 1) {
    achievements.push('rsna18Day1');
  }
  if (
    achievementStatus.topIndivNumberInRSNA18Day > 0 &&
    achievementStatus.topIndivNumberInRSNA18Day < 11
  ) {
    achievements.push('rsna18DayTop10');
  }

  // Individual Leader Badge - Week
  if (achievementStatus.topIndivNumberInRSNA18Week === 1) {
    achievements.push('rsna18Week1');
  }
  if (
    achievementStatus.topIndivNumberInRSNA18Week > 0 &&
    achievementStatus.topIndivNumberInRSNA18Week < 11
  ) {
    achievements.push('rsna18WeekTop10');
  }

  // Group Badge
  if (achievementStatus.topTeamNumberInRSNA18Week === 1) {
    achievements.push('rsna18Group1');
  }
  if (achievementStatus.topTeamNumberInRSNA18Week === 2) {
    achievements.push('rsna18Group2');
  }
  if (achievementStatus.topTeamNumberInRSNA18Week === 3) {
    achievements.push('rsna18Group3');
  }

  NotificationService.updateAchievementStatus(achievementStatus);
  NotificationService.updateAchievements(achievements);

  return achievements;
}

export default determineAchievementsForUser;
