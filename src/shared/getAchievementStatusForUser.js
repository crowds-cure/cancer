import { getDB } from '../db';
import getUsername from '../viewer/lib/getUsername';

async function getMaxForUserInMeasuremenents(
  measurementsDB,
  measurementsDBView,
  username
) {
  const result = await measurementsDB.query(measurementsDBView, {
    reduce: true,
    group: true,
    group_level: 2,
    start_key: [username, ''],
    end_key: [username, {}]
  });

  if (!result.rows || !result.rows.length) {
    return 0;
  }

  return result.rows.reduce(
    (max, row) => (row.value > max ? row.value : max),
    0
  );
}

async function getMaxForUserInSessions(sessionsDB, sessionsDBView, username) {
  const result = await sessionsDB.query(sessionsDBView, {
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

  const maxMeasurementsInDay = await getMaxForUserInMeasuremenents(
    measurementsDB,
    'by/annotatorDay',
    username
  );
  const maxMeasurementsInWeek = await getMaxForUserInMeasuremenents(
    measurementsDB,
    'by/annotatorWeek',
    username
  );

  const maxMeasurementsInSession = await getMaxForUserInSessions(
    sessionsDB,
    'by/usernameMaxCases',
    username
  );
  const maxSessionDurationInMin = await getMaxForUserInSessions(
    sessionsDB,
    'by/usernameMaxSessionDurationInMin',
    username
  );

  return {
    maxMeasurementsInDay, // Max number of measurements in a day
    maxMeasurementsInWeek, // Max number of measurements in a week
    maxMeasurementsInSession, // Max number of measurements in a session
    maxSessionDurationInMin // Max session duration in minutes all time
  };
}

export default getAchievementStatusForUser;
