import { getDB } from '../db';
import {
  getTopAnnotatorsByDay,
  getTopAnnotatorsByWeek,
  getTopTeamsByWeek
} from './getTopAnnotators';
import getProfile from '../viewer/lib/getProfile';

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
  return topTeams.findIndex(topT => topT[0] === team) + 1;
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

export default getAchievementStatusForUser;
