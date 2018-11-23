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
    const inCollection = results[0] && results[0].length;
    const byAnnotator = results[1] && results[1].rows && results[1].rows.length;

    // Users who has already completed the ignored cases before such cases are ignored
    //  can have the number of completed cases more than the number of currently available cases,
    //  so inCollection should be the number of all available cases including the cases user completed
    return {
      annotatorID,
      byAnnotator,
      inCollection: Math.max(byAnnotator, inCollection)
    };
  });
}

export default annotatorCollectionStatus;
