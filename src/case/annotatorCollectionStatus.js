import { getDB } from '../db';

//
// Returns the status (how many measured out of total) for a given user on a collection
// for use on the dashboard page
//
async function annotatorCollectionStatus(collection, annotatorID) {
  const casesDB = getDB('cases');
  const byCollectionPromise = casesDB.query('by/collection', {
    reduce: true,
    group: true,
    start_key: collection,
    end_key: collection
  });

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
    byCollectionPromise,
    byAnnotatorCollectionPromise
  ]).then(results => {
    return {
      annotatorID,
      byAnnotator: results[1].rows.length,
      inCollection: results[0].rows.length && results[0].rows[0].value
    };
  });
}

export default annotatorCollectionStatus;
