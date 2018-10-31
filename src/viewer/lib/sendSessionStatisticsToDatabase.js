import guid from './guid.js';
import getProfile from './getProfile.js';
import { getDB } from '../../db.js';

// TODO: Add Feedback
async function saveSessionStatisticsToDatabase(currentSession) {
  const measurementsDB = getDB('sessions');

  // TODO: Check 'currentSession'. If start / end dates are very short
  // we may not want to send this to the database

  const { occupation, team, experience, username } = getProfile();

  const doc = {
    _id: guid(),
    username,
    occupation,
    team,
    experience,
    currentSession,
    sessionDurationInMs: currentSession.end - currentSession.start,
    date: Math.floor(Date.now() / 1000),
    userAgent: navigator.userAgent
  };

  return measurementsDB.put(doc);
}

export default saveSessionStatisticsToDatabase;
