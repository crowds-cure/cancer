import { getDB } from '../db';
import getUsername from '../viewer/lib/getUsername';

async function getMaxMeasurementsForUser(
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

async function getMaxMeasurementsForUserInSession(sessionsDB, username) {
  const result = await sessionsDB.query('by/usernameMaxCases', {
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
  const maxMeasurementsInDay = await getMaxMeasurementsForUser(
    measurementsDB,
    'by/annotatorDay',
    username
  );
  const maxMeasurementsInWeek = await getMaxMeasurementsForUser(
    measurementsDB,
    'by/annotatorWeek',
    username
  );
  const maxMeasurementsInSession = await getMaxMeasurementsForUserInSession(
    sessionsDB,
    username
  );

  return {
    maxMeasurementsInDay,
    maxMeasurementsInWeek,
    maxMeasurementsInSession
  };
}

export default getAchievementStatusForUser;
