import { getDB } from '../db';

async function getCollectionMeasurementStats() {
  console.warn('getCollectionMeasurementStats');
  const measurementsDB = getDB('measurements');
  const caseDataPromise = measurementsDB.query('by/caseDataCollection', {
    reduce: true,
    group: true
  });

  const casesDB = getDB('cases');
  const casesPromise = casesDB.query('by/collection', {
    reduce: true,
    group: true
  });

  const results = await Promise.all([caseDataPromise, casesPromise]);

  const caseData = results[0].rows;
  const cases = results[1].rows;

  const statsByCollection = {
    measurementCount: {},
    caseCount: {},
    averageMeasurements: {}
  };

  cases.forEach(entry => {
    statsByCollection.measurementCount[entry.key] = entry.value;
  });

  caseData.forEach(entry => {
    statsByCollection.caseCount[entry.key] = entry.value;
    statsByCollection.averageMeasurements[entry.key] =
      statsByCollection.measurementCount[entry.key] / entry.value;
  });

  return statsByCollection;
}

export default getCollectionMeasurementStats;
