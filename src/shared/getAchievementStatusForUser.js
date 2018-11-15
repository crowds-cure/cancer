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
    group_level: 3,
    start_key: [username, false, ''],
    end_key: [username, false, {}]
  });

  if (!result.rows || !result.rows.length) {
    return 0;
  }

  return result.rows.reduce(
    (max, row) => (row.value > max ? row.value : max),
    0
  );
}

async function getAchievementStatusForUser() {
  const measurementsDB = getDB('measurements');
  const username = getUsername();
  const maxMeasurementsInDay = await getMaxMeasurementsForUser(
    measurementsDB,
    'by/annotatorSkipDay',
    username
  );
  const maxMeasurementsInWeek = await getMaxMeasurementsForUser(
    measurementsDB,
    'by/annotatorSkipWeek',
    username
  );

  return {
    maxMeasurementsInDay,
    maxMeasurementsInWeek
  };
}

export default getAchievementStatusForUser;
