import { getDB } from '../db';
import getAvailableCases from './getAvailableCases';

//
// Returns the status (how many measured out of total) for a given user on a collection
// for use on the dashboard page
//
async function annotatorCollectionStatus(collection, annotatorID) {
  const availableCasesPromise = getAvailableCases(collection);

  const measurementsDB = getDB('measurements');
  const byAnnotatorCollectionPromise = measurementsDB.query(
    'by/annotatorCollectionCaseId',
    {
      reduce: true,
      group: true,
      group_level: 3,
      start_key: [annotatorID, collection, ''],
      end_key: [annotatorID, collection, {}]
    }
  );

  return await Promise.all([
    availableCasesPromise,
    byAnnotatorCollectionPromise
  ]).then(results => {
    return {
      annotatorID,
      inCollection: results[0] && results[0].length,
      byAnnotator: results[1] && results[1].rows && results[1].rows.length
    };
  });
}

export default annotatorCollectionStatus;
