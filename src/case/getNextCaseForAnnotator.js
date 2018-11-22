//import { measurementsDB } from "../db.js";
import { getDB } from '../db.js';

//
// Returns the status the measurement documents for the user for a collection
// (only return datasets that have been skipped less than skipThreshold)
//
async function annotatorCollectionMeasurements(
  collection,
  annotatorID,
  skipThreshold = 5
) {
  // get all cases for this collection
  const casesDB = getDB('cases');
  const byCollectionPromise = casesDB.query('by/collectionCaseId', {
    reduce: false,
    start_key: [collection, ''],
    end_key: [collection, {}]
  });

  // get measurments for annotator
  const measurementsDB = getDB('measurements');
  const byAnnotatorCollectionPromise = measurementsDB.query(
    'by/annotatorCollection',
    {
      reduce: false,
      start_key: [annotatorID, collection],
      end_key: [annotatorID, collection],
      include_docs: true
    }
  );

  // get measurements for collection
  const byCollectionCaseIdSkipPromise = measurementsDB.query(
    'by/collectionCaseIdSkip',
    {
      reduce: true,
      group: true,
      start_key: [collection, ''],
      end_key: [collection, {}]
    }
  );

  // create collated table of results
  return await Promise.all([
    byCollectionPromise,
    byAnnotatorCollectionPromise,
    byCollectionCaseIdSkipPromise
  ]).then(results => {
    console.log(results);

    // first build table of all cases in collection
    const cases = {};
    results[0].rows.forEach(row => {
      cases[row.key[1]] = { measurements: 0, measured: false, skipped: false };
    });

    // now mark all the ones measured by this annotator
    results[1].rows.forEach(row => {
      cases[row.doc.caseData._id].measured = true;
      cases[row.doc.caseData._id].skipped = true;
    });

    // now mark the cases if skipped, or list count of other measurements
    results[2].rows.forEach(row => {
      const caseId = row.key[1];
      cases[caseId].measurements = row.value;
      const skipped = row.key[2];
      if (skipped) {
        cases[caseId].skipped |= row.value > skipThreshold;
      }
    });

    return cases;
  });
}

async function getNextCaseForAnnotator(collection, annotatorID) {
  // this logic returns the caseData for a case that the user
  // has not already measured and that has not been skipped more
  // than five times and has the least measurements of the cases
  // in the collection.
  //
  const cases = await annotatorCollectionMeasurements(collection, annotatorID);

  // sort keys by number of measurments
  const keys = Object.keys(cases);
  keys.sort((a, b) => {
    return cases[a].measurements - cases[b].measurements;
  });

  // find the first one not skipped or measured by the user
  for (let index = 0; index < keys.length; index++) {
    const caseId = keys[index];
    const caseData = cases[keys[index]];
    if (!caseData.measured && !caseData.skipped) {
      // return the document for that collection/caseId
      const casesDB = getDB('cases');
      const result = await casesDB.query('by/collectionCaseId', {
        reduce: false,
        start_key: [collection, caseId],
        end_key: [collection, caseId],
        include_docs: true
      });

      return result.rows[0].doc;
    }
  }

  // return null if there's no case - this means user is done with this
  // collection
  return null;
}

export default getNextCaseForAnnotator;
