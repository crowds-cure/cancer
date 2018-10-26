import guid from './guid.js';
import getUsername from './getUsername.js';
import { getDB } from '../../db.js';

// TODO: Add Feedback
async function saveSkipToDatabase(caseData) {
  const measurementsDB = getDB('measurements');
  const annotator = getUsername();

  const doc = {
    _id: guid(),
    skip: true,
    annotator,
    caseData: caseData.data,
    date: Math.floor(Date.now() / 1000),
    userAgent: navigator.userAgent
  };

  return measurementsDB.put(doc);
}

export default saveSkipToDatabase;
