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

async function getCommunityStats() {
  const measurementsDB = getDB('measurements');

  const totalMeasurements = await getTotalMeasurements(measurementsDB);

  return {
    totalMeasurements
  };
}

export default getCommunityStats;
