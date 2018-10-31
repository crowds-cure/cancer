import { getDB } from '../db.js';
import getUsername from '../viewer/lib/getUsername.js';

async function getTotalMeasurementsForUser(measurementsDB, username) {
  const result = await measurementsDB.query('by/annotators', {
    startkey: username,
    endkey: username
  });

  return result.rows[0].value;
}

async function getUserStats() {
  const measurementsDB = getDB('measurements');
  const username = getUsername();
  const current = await getTotalMeasurementsForUser(measurementsDB, username);

  return {
    current
  };
}

export default getUserStats;
