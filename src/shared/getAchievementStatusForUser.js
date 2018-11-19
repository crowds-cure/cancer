import { getDB } from '../db';
import getUsername from '../viewer/lib/getUsername';

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

async function getAchievementStatusForUser() {
  const measurementsDB = getDB('measurements');
  const sessionsDB = getDB('sessions');
  const username = getUsername();

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

  return {
    maxMeasurementsInDay, // Max number of total measurements in a day
    maxMeasurementsInWeek, // Max number of total measurements in a week
    maxMeasurementsInSession, // Max number of total measurements in a session
    maxSessionDurationInMin, // Max session duration in minutes all time
    totalSessionDurationInMinInWeek // Total session duration in minutes in a week
  };
}

export default getAchievementStatusForUser;
