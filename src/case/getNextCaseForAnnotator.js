//import { measurementsDB } from "../db.js";

import { getDB } from '../db';

async function getNextCaseForAnnotator(annotatorID, cases) {
  const promise = new Promise((resolve, reject) => {
    // TODO: This just gets a random doc from the entire array of cases.
    // We should switch this to add some case selection logic based on number of measurements, skips, etc...
    const db = getDB('cases');
    db.allDocs({ include_docs: true }, function(error, docs) {
      if (error || !docs || !docs.rows) {
        return reject(error);
      }

      const rows = docs.rows;
      const doc = rows[Math.floor(Math.random() * rows.length)].doc;

      console.warn(doc);

      resolve(doc);
    });
  });

  return promise;

  /*
  // filter cases by annotator's anatomyChoices
  let measurementsPerSeries = {};
  let annotatorMeasuredSeries = {};
  let seriesUIDs = cases.map(c => {
    return c.key[0];
  });

  // then get the list of all measurements per series and how many measurements
  // (not all series will have been measured)
  return measurementsDB
    .query("by/seriesUIDNoSkip", {
      reduce: true,
      group: true,
      level: "exact"
    })
    .then(function(result) {
      result.rows.forEach(row => {
        measurementsPerSeries[row.key] = row.value;
      });

      return measurementsDB.query("by/annotators", {
        reduce: false,
        include_docs: true,
        start_key: annotatorID,
        end_key: annotatorID
      });
    })
    .then(function(result) {
      // todo- remove duplication! store on a utils object? or the Login?
      let categoryIdToLabelMap = {
        "TCGA-LUAD": "Lung",
        "TCGA-LIHC": "Liver",
        TCGA_RN: "Renal",
        TCGA_OV: "Ovarian"
      };

      result.rows.forEach(row => {
        annotatorMeasuredSeries[row.doc.seriesUID] = true;
      });

      // now reconcile the data
      // - look through each available series
      // -- if nobody has measured it then use it
      // - if the user already measured it, ignore it
      // - otherwise find the least measured one
      let leastMeasured = {
        seriesUID: undefined,
        measurementCount: Number.MAX_SAFE_INTEGER
      };
      let caseDetails;

      for (
        let seriesIndex = 0;
        seriesIndex < seriesUIDs.length;
        seriesIndex++
      ) {
        let seriesUID = seriesUIDs[seriesIndex];
        if (!(seriesUID in measurementsPerSeries)) {
          caseDetails = cases.find(c => c.key[0] === seriesUID).key;
          return seriesUID;
        }
        if (
          !(seriesUID in annotatorMeasuredSeries) &&
          measurementsPerSeries[seriesUID] < leastMeasured.measurementCount
        ) {
          leastMeasured.seriesUID = seriesUID;
          leastMeasured.measurementCount = measurementsPerSeries[seriesUID];
        }
      }
      caseDetails = cases.find(c => c.key[0] === leastMeasured.seriesUID).key;
      return leastMeasured.seriesUID;
    });*/
}

export default getNextCaseForAnnotator;
