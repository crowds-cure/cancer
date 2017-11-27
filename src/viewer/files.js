import Connector from './connector';
import Login from '../login/login';
import {chronicleURL, chronicleDB, measurementsDB} from '../db/db';

export default {
  getCaseImages() {
    const $overlay = $('.loading-overlay');
    $overlay.addClass('loading');
    $overlay.removeClass('invisible');

    return this.getChronicleImageIDs().then((caseStudy) => {
      if (!caseStudy || !caseStudy.urls) {
        throw new Error('No case study or no URLs provided');
      }

      // where to store the case id for access during save?
      // I don't understand the model hierarchy, so let's stick it on the window
      window.rsnaCrowdQuantSeriesUID = caseStudy.seriesUID;
      window.rsnaCrowdQuantCaseStudy = caseStudy;

      return caseStudy.urls.map(url => url.replace('http', 'wadouri'));
    });
  },

  currentSeriesIndex: undefined,
  seriesUID_A: undefined,

  getChronicleImageIDs () {

    var allCases; // this could be cached
    var userCases; // filtered to user's anatChoices

    return chronicleDB.query("instances/bySeriesUID_j", { // bySeriesUID_j or byCollection
      reduce : true,
      //stale : 'update_after',
      group : true,
    }).then((cases) => {
      allCases = cases.rows;

      const annotatorID = Login.username;
      const anatomyChoices = Login.user.anatomyChoices;

      var categoryIdToLabelMap = {
          'TCGA-LUAD' : 'Lung',
          'TCGA-LIHC' : 'Liver',
          'TCGA_RN' : 'Renal',
          'TCGA_OV' : 'Ovarian'
      };

      userCases = allCases.filter(curCase => {
        var catLabel = categoryIdToLabelMap[curCase.key[1]];
        return anatomyChoices.indexOf(catLabel) !== -1;
      });

      return this.getNextSeriesForAnnotator(annotatorID, userCases);
  }).then ((seriesUID) => {

      if(!this.currentSeriesIndex) {
        this.currentSeriesIndex = 0;
      }
      this.currentSeriesIndex++;
      console.log('series Index:', this.currentSeriesIndex);

      //const key = data.rows[this.currentSeriesIndex].key;

      // if(currentSeriesIndex >= data.rows.length){
      //   currentSeriesIndex=0;
      // }

      this.seriesUID_A = seriesUID;
      console.log('series UID:', seriesUID);

      if (seriesUID === undefined) {
        alert('Congratulations - you have looked at all the series');
        window.location.reload();
      }

      return chronicleDB.query("instances/seriesInstances", {
        startkey : seriesUID,
        endkey : seriesUID + '\u9999',
        stale : 'update_after',
        reduce : false,
      });
    }).then((data) => {
      // console.log('instance data:', data);
      const instanceUIDs = [];
      data.rows.forEach((row) => {
        const instanceUID = row.value[1];
        instanceUIDs.push(instanceUID);
      });

      console.time('Metadata Retrieval from Chronicle DB');
      // TODO: Switch to some study or series-level call
      // It is quite slow to wait on metadata for every single image
      // each retrieved in separate calls
      return Promise.all(instanceUIDs.map((uid) => {
        return chronicleDB.get(uid);
      }));
    }).then((docs) => {
      console.timeEnd('Metadata Retrieval from Chronicle DB');
      const instanceNumberTag = "00200013";
      let instanceUIDsByImageNumber = {};
      docs.forEach((doc) => {
        const imageNumber = Number(doc.dataset[instanceNumberTag].Value);
        instanceUIDsByImageNumber[imageNumber] = doc._id;
      });

      const imageNumbers = Object.keys(instanceUIDsByImageNumber);
      imageNumbers.sort((a, b) => a - b);

      let instanceURLs = [];
      let instanceUIDs = [];
      imageNumbers.forEach((imageNumber) => {
        const instanceUID = instanceUIDsByImageNumber[imageNumber];
        const instanceURL = `${chronicleURL}/${instanceUID}/object.dcm`;
        instanceURLs.push(instanceURL);
        instanceUIDs.push(instanceUID);
      });

      return {
        name: "default_case",
        seriesUID: this.seriesUID_A,
        currentSeriesIndex: this.currentSeriesIndex - 1,
        urls: instanceURLs,
        instanceUIDs
      };
    }).catch((err) => {
      throw err;
    });
  },

  getNextSeriesForAnnotator(annotatorID, cases) {

    // filter cases by annotator's anatomyChoices


    let measurementsPerSeries = {};
    let annotatorMeasuredSeries = {};
    let seriesUIDs = cases.map(c => { return c.key[0] });

    // first, get list of all series (this should be factored out to be global and only queried once)
    // result.rows.forEach(row => {
    //   seriesUIDs.push(row.key[2][2]);
    // });

    // then get the list of all measurements per series and how many measurements
    // (not all series will have been measured)
    return measurementsDB.query('by/seriesUIDNoSkip', {
      reduce: true,
      group: true,
      level: 'exact'
    }).then(function (result) {

      result.rows.forEach(row => {
        measurementsPerSeries[row.key] = row.value;
      });

      return measurementsDB.query('by/annotators', {
        reduce: false,
        include_docs: true,
        start_key: annotatorID,
        end_key: annotatorID,
      })
    }).then(function (result) {

      // todo- remove duplication! store on a utils object? or the Login?
      let categoryIdToLabelMap = {
          'TCGA-LUAD' : 'Lung',
          'TCGA-LIHC' : 'Liver',
          'TCGA_RN' : 'Renal',
          'TCGA_OV' : 'Ovarian'
      };

      result.rows.forEach(row => {
        annotatorMeasuredSeries[row.doc.seriesUID] = true;
      });

      // now reconcile the data
      // - look through each available series
      // -- if nobody has measured it then use it
      // - if the user already measured it, ignore it
      // - otherwise find the least measured one
      let leastMeasured = {seriesUID: undefined, measurementCount: Number.MAX_SAFE_INTEGER};
      let caseDetails;

      for (let seriesIndex = 0; seriesIndex < seriesUIDs.length; seriesIndex++) {
        let seriesUID = seriesUIDs[seriesIndex];
        if ( ! (seriesUID in measurementsPerSeries) ) {
          caseDetails = (cases.find(c => c.key[0] === seriesUID).key);
          console.log('Next Case Category:', caseDetails);
          $('#patient-id-upper-right').text(caseDetails[2]);
          $('#category-upper-right').text(categoryIdToLabelMap[caseDetails[1]]);
          return seriesUID;

        }
        if ( (! (seriesUID in annotatorMeasuredSeries)) &&
              (measurementsPerSeries[seriesUID] < leastMeasured.measurementCount) ) {
          leastMeasured.seriesUID = seriesUID;
          leastMeasured.measurementCount = measurementsPerSeries[seriesUID];
        }
      }
      caseDetails = (cases.find(c => c.key[0] === leastMeasured.seriesUID).key);
      console.log('Next Case Category:', caseDetails);
      $('#patient-id-upper-right').text(caseDetails[2]);
      $('#category-upper-right').text(categoryIdToLabelMap[caseDetails[1]]);
      return leastMeasured.seriesUID;
    })
  }
}
