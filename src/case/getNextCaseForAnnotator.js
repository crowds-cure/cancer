import { getDB } from '../db.js';
import getAvailableCases from './getAvailableCases';

/**
 * Returns the status the measurement documents for the user for a collection
 * (only return datasets that have been skipped less than skipThreshold)
 * `caseToIgnore` is used by prefetching in order to prevent the viewer from
 * loading the same case twice
 * 
 * @param {*} collection Cases collection
 * @param {*} annotatorID ID of the annotator
 * @param {*} caseToIgnore Case to be ignored
 */
async function annotatorCollectionMeasurements(collection, annotatorID, caseToIgnore) {
  // get all available cases for this collection
  const availableCasesPromise = getAvailableCases(collection);

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

  // create collated table of results
  return await Promise.all([
    availableCasesPromise,
    byAnnotatorCollectionPromise
  ]).then(results => {
    console.log(results);

    // first build table of all cases in collection
    const cases = {};
    results[0].forEach(row => {
      if (row.key[1] !== caseToIgnore) {
        cases[row.key[1]] = { measurements: 0, measured: false, skipped: false };
      }
    });

    // now mark all the ones measured or skipped by this annotator
    results[1].rows.forEach(row => {
      const entry = cases[row.doc.caseData._id];
      if (entry) {
        entry.measured = true;
        entry.skipped = true;
      }
    });

    return cases;
  });
}

async function getNextCaseForAnnotator(collection, annotatorID, caseToIgnore) {
  // this logic returns the caseData for a case that the user
  // has not already measured and that has not been skipped more
  // than five times and has the least measurements of the cases
  // in the collection.
  //
  const cases = await annotatorCollectionMeasurements(collection, annotatorID, caseToIgnore);

  // sort keys by number of measurments
  const keys = Object.keys(cases);
  keys.sort((a, b) => {
    return cases[a].measurements - cases[b].measurements;
  });

  // make a list of the least measured cases that haven't
  // been measured or skipped by this annotator
  const leastMeasuredCaseIndices = [];
  let leastMeasuredCount = undefined;
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const caseData = cases[key];
    if (!caseData.measured && !caseData.skipped) {
      if (leastMeasuredCaseIndices.length === 0) {
        leastMeasuredCaseIndices.push(index);
        leastMeasuredCount = caseData.measurements;
      } else {
        if (caseData.measurements <= leastMeasuredCount) {
          leastMeasuredCaseIndices.push(index);
        } else {
          // we know the rest of the cases have more measurements
          // because it's sorted, so drop out here.
          break;
        }
      }
    }
  }

  // if there's anything on the list, return the case info for a random entry
  if (leastMeasuredCaseIndices.length > 0) {
    // now pick a random entry from the list of candidates cases
    const caseIndex =
      leastMeasuredCaseIndices[
        Math.floor(Math.random() * leastMeasuredCaseIndices.length)
      ];
    const caseId = keys[caseIndex];
    console.log(
      'picking random case ',
      caseIndex,
      'out of ',
      leastMeasuredCaseIndices.length
    );

    // and return the document for that collection/caseId
    const casesDB = getDB('cases');
    const result = await casesDB.query('by/collectionCaseId', {
      reduce: false,
      start_key: [collection, caseId],
      end_key: [collection, caseId],
      include_docs: true
    });

    return result.rows[0].doc;
  }

  // otherwise return null if there's no case - this means user is done with this collection
  // TODO: it looks like this is not handled and the user sees the same case over and over
  return null;
}

export default getNextCaseForAnnotator;
