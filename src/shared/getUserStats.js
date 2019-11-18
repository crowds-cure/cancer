import { getDB } from '../db.js';
import getUsername from '../viewer/lib/getUsername.js';

async function getTotalMeasurementsForUser(measurementsDB, username) {
  const result = await measurementsDB.query('by/annotators', {
    startkey: username,
    endkey: username
  });

  if (!result.rows || !result.rows[0]) {
    return 0;
  }

  return result.rows[0].value;
}

async function getRankForUser(measurementsDB, username) {
  const result = await measurementsDB.query('by/annotators', {
    reduce: true,
    group: true,
    level: 'exact'
  });

  let measByAnno = result.rows;

  // TODO: Clean up the database so this isn't required
  measByAnno = measByAnno.filter(a => a.key !== null);

  // TODO: Sort in the View
  measByAnno.sort((a, b) => b.value - a.value);

  const annotators = measByAnno.map(r => r.key);

  return annotators.indexOf(username) + 1;
}

async function getUserStats() {
  const measurementsDB = getDB('measurements');
  const username = getUsername();
  const current = await getTotalMeasurementsForUser(measurementsDB, username);
  const rank = await getRankForUser(measurementsDB, username);

  return {
    current,
    rank
  };
}

export default getUserStats;
