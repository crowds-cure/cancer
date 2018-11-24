import { getDB } from '../db';

//
// Returns all available cases which are not skipped with certain feedback a specific number of times
//
async function getAvailableCases(collection, skipThreshold = 5) {
  // Get all cases for this collection
  const casesDB = getDB('cases');
  const byCollectionCaseIdPromise = casesDB.query('by/collectionCaseId', {
    reduce: false,
    start_key: [collection, ''],
    end_key: [collection, {}]
  });

  // Get all cases for this collection skipped with feedback other than
  //  NoneJustWantToSkip, DidntMeasureEverything, LikelyBenign and
  //   ContainsMultiPhaseImages
  const measurementsDB = getDB('measurements');
  const byCollectionCaseIdSkipCountPromise = measurementsDB.query(
    'by/collectionCaseIdSkipCount',
    {
      reduce: true,
      group: true,
      group_level: 2,
      start_key: [collection, ''],
      end_key: [collection, {}]
    }
  );

  return await Promise.all([
    byCollectionCaseIdPromise,
    byCollectionCaseIdSkipCountPromise
  ]).then(results => {
    // Do not show cases skipped with feedback other than NoneJustWantToSkip,
    //  DidntMeasureEverything, LikelyBenign or ContainsMultiPhaseImages
    //   at least "skipThreshold (5)" times
    return results[0].rows.filter(allCasesRow => {
      const caseId = allCasesRow.key[1];
      return !results[1].rows.some(skipCountRow => {
        return (
          skipCountRow.key[1] === caseId && skipCountRow.value >= skipThreshold
        );
      });
    });
  });
}

export default getAvailableCases;
