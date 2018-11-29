import { getDB } from '../db.js';
import getUsername from '../viewer/lib/getUsername.js';
import getUserStats from './getUserStats.js';

async function getTotalCasesForUser(sessionsDB, username) {
  const { current } = await getUserStats();
  const result = await sessionsDB.query('by/usernameSession', {
    startkey: username,
    endkey: username
  });
  const sessionsCount = result.rows.length;
  const userStatistics = {
    sessionCases: 0,
    sessionMinutes: 0
  };

  if (!result.rows || !result.rows[0]) {
    return 0;
  }

  result.rows.forEach(row => {
    userStatistics.sessionCases += row.value.cases;
    userStatistics.sessionMinutes += row.value.sessionDurationInMs;
  });

  const userStatisticsAvg = {
    sessionCases: Math.round(userStatistics.sessionCases / sessionsCount),
    sessionMinutes: Math.round(
      userStatistics.sessionMinutes / sessionsCount / 60
    ),
    minutesPerCase: Math.round(
      userStatistics.sessionMinutes / userStatistics.sessionCases / 60
    ),
    measurements: Math.round(current / sessionsCount)
  };
  debugger;
  return userStatisticsAvg;
}

async function getUserStatistics() {
  const sessionsDB = getDB('sessions');
  const username = getUsername();
  const userStatisticsAvg = await getTotalCasesForUser(sessionsDB, username);

  return userStatisticsAvg;
}

export default getUserStatistics;
