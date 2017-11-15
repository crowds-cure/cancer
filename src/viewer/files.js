import Connector from './connector';
import {chronicleURL, chronicleDB, measurementsDB} from '../db/db';

export default {
  getFile(url) {
    return new Promise(function (resolve, reject) {
      const request = new XMLHttpRequest();

      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      request.onload = function(oEvent) {
        const arrayBuffer = request.response;
        if (arrayBuffer) {
          try {
            resolve(new Blob([arrayBuffer], { type: 'application/dicom' }));
          } catch (error) {
            reject(error);
          }
        }
      };

      request.send(null);
    });
  },

  getCaseImages() {
    const $overlay = $('.loading-overlay');
    $overlay.addClass('loading');
    $overlay.removeClass('invisible');

    // return new Promise((resolve, reject) => {

    return this.getChronicleImageIDs().then((caseStudy) => {
      if (caseStudy && caseStudy.urls) {
        // console.log('getCaseImages0');

        // where to store the case id for access during save?
        // I don't understand the model heirarchy, so let's stick it on the window
        window.rsnaCrowdQuantSeriesUID = caseStudy.seriesUID;
        window.rsnaCrowdQuantCaseStudy = caseStudy;

        return Promise.all(caseStudy.urls.map(this.getFile)).then(function (files) {
          // console.log('getCaseImages1');
          $overlay.addClass('invisible');
          $overlay.removeClass('loading');

          return Promise.all(files.map(cornerstoneWADOImageLoader.wadouri.fileManager.add));
        }).then((imageIds) => {
          return imageIds;
          // resolve(files.map(cornerstoneWADOImageLoader.wadouri.fileManager.add));
        });
      }
    }).catch(function(err) {
      throw err;
    });

      // Connector.getCase().then((caseStudy) => {
      //   if (caseStudy && caseStudy.urls) {
      //     Promise.all(caseStudy.urls.map(this.getFile)).then(function (files) {
      //       $overlay.addClass('invisible');
      //       $overlay.removeClass('loading');
      //
      //       resolve(files.map(cornerstoneWADOImageLoader.wadouri.fileManager.add));
      //     }).catch(reject);
      //   }
      // }).catch(function(error) {
      //   reject(error);
      // });
    // });
  },

  currentSeriesIndex: undefined,
  seriesUID_A: undefined,

  getChronicleImageIDs () {
    return chronicleDB.query("instances/context", {
      reduce : true,
      stale : 'update_after',
      // key: [["UnspecifiedInstitution", "TCGA-17-Z011"], ["UnspecifiedStudyDescription", "1.3.6.1.4.1.14519.5.2.1.7777.9002.242742387344636595876380532248"]],
      // startkey : [['UnspecifiedInstitution', 'TCGA-17-Z011']], // only show the prostates - they basically work
      // endkey: [['UnspecifiedInstitution', 'TCGA-17-Z013']],
      group_level : 3,
    }).then((data) => {
      var annotatorID='dismal_caribou';
      return this.getNextSeriesForAnnotator(annotatorID);
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
        // const instanceURL = `${chronicleURL}/${instanceUID}/object.dcm`;
        // imageIDs.push(instanceURL);
        instanceUIDs.push(instanceUID);
      });
      // console.log('instanceUIDs:', instanceUIDs);

      return Promise.all(instanceUIDs.map((uid) => {
        return chronicleDB.get(uid);
      }));
    }).then((docs) => {
      const instanceNumberTag = "00200013";
      let instanceUIDsByImageNumber = {};
      docs.forEach((doc) => {
        const imageNumber = Number(doc.dataset[instanceNumberTag].Value);
        instanceUIDsByImageNumber[imageNumber] = doc._id;
      });

      const imageNumbers = Object.keys(instanceUIDsByImageNumber);
      imageNumbers.sort((a, b) => {
        return a - b;
      });

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
        instanceUIDs: instanceUIDs
      };
    }).catch((err) => {
      throw err;
    });
  },

  getNextSeriesForAnnotator(annotatorID) {

    let measurementsPerSeries = {};
    let annotatorMeasuredSeries = {};
    let seriesUIDs = [];

    // first, get list of all series (this should be factored out to be global and only queried once)
    return chronicleDB.query('instances/context', {
      reduce: true,
      group: true,
      group_level: 3,
    }).then(function (result) {

      result.rows.forEach(row => {
        seriesUIDs.push(row.key[2][2]);
      });

      // then get the list of all measurements per series and how many measurements
      // (not all series will have been measured)
      return measurementsDB.query('by/seriesUID', {
        reduce: true,
        group: true,
        level: 'exact',
      })
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

      result.rows.forEach(row => {
        annotatorMeasuredSeries[row.doc.seriesUID] = true;
      });

      // now reconcile the data
      // - look through each available series
      // -- if nobody has measured it then use it
      // - if the user already measured it, ignore it
      // - otherwise find the least measured one
      let leastMeasured = {seriesUID: undefined, measurementCount: Number.MAX_SAFE_INTEGER};
      for (let seriesIndex = 0; seriesIndex < seriesUIDs.length; seriesIndex++) {
        let seriesUID = seriesUIDs[seriesIndex];
        if ( ! (seriesUID in measurementsPerSeries) ) {
          return seriesUID;

        }
        if ( (! (seriesUID in annotatorMeasuredSeries)) &&
              (measurementsPerSeries[seriesUID] < leastMeasured.measurementCount) ) {
          leastMeasured.seriesUID = seriesUID;
          leastMeasured.measurementCount = measurementsPerSeries[seriesUID];
        }
      }
      return leastMeasured.seriesUID;
    })
  }
}
