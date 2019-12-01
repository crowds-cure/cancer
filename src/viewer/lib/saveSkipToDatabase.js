import guid from './guid.js';
import getProfile from './getProfile.js';
import { getDB } from '../../db.js';

async function saveSkipToDatabase(caseData, feedback) {
  const measurementsDB = getDB('measurements');
  const {
    name: annotatorPrincipalName = '',
    username: annotator = '',
    team: teamName = ''
  } = await getProfile();

  const doc = {
    _id: guid(),
    skip: true,
    teamName,
    annotator,
    annotatorPrincipalName,
    feedback,
    caseData: caseData.data,
    date: Math.floor(Date.now() / 1000),
    userAgent: navigator.userAgent
  };

  return measurementsDB.put(doc);
}

export default saveSkipToDatabase;
