import Connector from './connector';
import {chronicleURL, chronicleDB} from '../db/db';

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
        console.log('getCaseImages0');
        return Promise.all(caseStudy.urls.map(this.getFile)).then(function (files) {
          console.log('getCaseImages1');
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

  getChronicleImageIDs () {
    return chronicleDB.query("instances/context", {
      reduce : true,
      stale : 'update_after',
      // key: [["UnspecifiedInstitution", "TCGA-17-Z011"], ["UnspecifiedStudyDescription", "1.3.6.1.4.1.14519.5.2.1.7777.9002.242742387344636595876380532248"]],
      // startkey : [['UnspecifiedInstitution', 'TCGA-17-Z011']], // only show the prostates - they basically work
      // endkey: [['UnspecifiedInstitution', 'TCGA-17-Z013']],
      group_level : 3,
    }).then((data) => {
      console.log('data:', data);
      // [key.institution,key.patientID],
      // [key.studyDescription,key.studyUID],
      // [key.modality,key.seriesDescription,key.seriesUID],
      // key.instanceUID
      //
      // ["UnspecifiedInstitution", "TCGA-17-Z011"]
      // ["UnspecifiedStudyDescription", "1.3.6.1.4.1.14519.5.2.1.7777.9002.242742387344636595876380532248"]
      // ["CT", "UnspecifiedSeriesDescription", "1.3.6.1.4.1.14519.5.2.1.7777.9002.106684271246229903146411807044"]

      console.log('The number of series:', data.rows.length);
      const rand = Math.floor(data.rows.length*Math.random());
      console.log("random:", rand);
      console.log('row:', data.rows[rand]);

      const key = data.rows[rand].key;

      // return row;
      // return chronicleDb.query("instances/context", {
      //
      // }
      const seriesUID = key[2][2];
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

      let instanceIDs = [];
      imageNumbers.forEach((imageNumber) => {
        const instanceUID = instanceUIDsByImageNumber[imageNumber];
        const instanceURL = `${chronicleURL}/${instanceUID}/object.dcm`;
        instanceIDs.push(instanceURL);
      });

      return {
        name: "default_case",
        urls: instanceIDs
      };
    }).catch((err) => {
      throw err;
    });
  }
};
