import { getDB } from '../db.js';

/*
Session (for users who selected Not Applicable for Residency Program)
- Total Measurements
- Daily High
- Session Average (mins)
- Session Average (measurements)

Group (for users who are affiliated with a Residency Program)
- Total Measurements per group
- Daily high for group
- Average measurements per group reader
- Total readers per group

Community
- Total Measurements for the day
- Total Measurements for RSNA
- Total readers
- Average measurements per reader
*/

async function getTotalMeasurements(measurementsDB) {
  const result = await measurementsDB.query('by/_id');

  return result.rows[0].value;
}

async function getTotalMeasurementsInDateRange(
  measurementsDB,
  startDate,
  endDate
) {
  const result = await measurementsDB.query('by/date', {
    startkey: Math.floor(startDate.valueOf() / 1000),
    endkey: Math.floor(endDate.valueOf() / 1000)
  });

  return result.rows[0] && result.rows[0].value;
}

async function getNumAnnotators(measurementsDB) {
  // TODO: This is a very inefficient approach to get the number of
  // unique annotators [actually no, this is efficient because of the
  // way map-reduce works - sp]
  const result = await measurementsDB.query('by/annotators', {
    reduce: true,
    group: true
  });

  return result.rows.length;
}

async function getSessionsByTeam() {
  const sessionsDB = getDB('sessions');
  const result = await sessionsDB.query('by/teamUsername', {
    reduce: true,
    group: true,
    group_level: 1
  });

  const byTeam = {};
  result.rows.forEach(row => {
    byTeam[row.key[0]] = row.value;
  });
  return byTeam;
}

async function getTeamUsers() {
  const sessionsDB = getDB('sessions');
  const result = await sessionsDB.query('by/teamUsername', {
    reduce: true,
    group: true,
    group_level: 2
  });

  const teamUsers = {};
  result.rows.forEach(row => {
    const team = row.key[0];
    const user = row.key[1];
    teamUsers[team] = teamUsers[team] || [];
    teamUsers[team].push(user);
  });
  return teamUsers;
}

async function getCommunityStats() {
  const measurementsDB = getDB('measurements');

  const totalMeasurements = await getTotalMeasurements(measurementsDB);
  const numAnnotators = await getNumAnnotators(measurementsDB);
  const averageMeasurementsPerAnnotator = Math.round(
    totalMeasurements / numAnnotators
  );

  // TODO: Use entire week? Switch to RSNA dates?
  const today = new Date();
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

  const startDate = yesterday;
  const endDate = today;

  const recentMeasurements = await getTotalMeasurementsInDateRange(
    measurementsDB,
    startDate,
    endDate
  );

  // extra stat functions that can be added to dashboard / badges
  console.log('sessions by team', await getSessionsByTeam());
  console.log('users on each team', await getTeamUsers());

  return {
    totalMeasurements,
    averageMeasurementsPerAnnotator,
    numAnnotators,
    recentMeasurements
  };
}

export default getCommunityStats;
