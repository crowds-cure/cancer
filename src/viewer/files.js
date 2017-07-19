import Connector from './connector';

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
    return new Promise((resolve, reject) => {
      Connector.getCase().then((caseStudy) => {
        if (caseStudy && caseStudy.urls) {
          Promise.all(caseStudy.urls.map(this.getFile)).then(function (files) {
            resolve(files.map(cornerstoneWADOImageLoader.wadouri.fileManager.add));
          }).catch(reject);
        }
      }).catch(function(error) {
        reject(error);
      });
    });
  }
};
