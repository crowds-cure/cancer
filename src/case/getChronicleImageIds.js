import { chronicleURL, getDB } from '../db.js';

export default function getChronicleImageIds() {
  let allCases; // this could be cached
  let userCases; // filtered to user's anatChoices
  let seriesUID_A;

  return Promise.resolve(
    '1.3.6.1.4.1.14519.5.2.1.3098.4963.202287948568406289093737485605'
  )
    .then(seriesUID => {
      seriesUID_A = seriesUID;

      if (seriesUID === undefined) {
        alert('Congratulations - you have looked at all the series');
        window.location.reload();
      }

      return chronicleDB.query('instances/seriesInstances', {
        startkey: seriesUID,
        endkey: seriesUID + '\u9999',
        stale: 'update_after',
        reduce: false
      });
    })
    .then(data => {
      // console.log('instance data:', data);
      const instanceUIDs = [];
      data.rows.forEach(row => {
        const instanceUID = row.value[1];
        instanceUIDs.push(instanceUID);
      });

      console.time('Metadata Retrieval from Chronicle DB');
      // TODO: Switch to some study or series-level call
      // It is quite slow to wait on metadata for every single image
      // each retrieved in separate calls
      return Promise.all(
        instanceUIDs.map(uid => {
          return chronicleDB.get(uid);
        })
      );
    })
    .then(docs => {
      console.timeEnd('Metadata Retrieval from Chronicle DB');
      const instanceNumberTag = '00200013';
      let instanceUIDsByImageNumber = {};
      docs.forEach(doc => {
        const imageNumber = Number(doc.dataset[instanceNumberTag].Value);
        instanceUIDsByImageNumber[imageNumber] = doc._id;
      });

      const imageNumbers = Object.keys(instanceUIDsByImageNumber);
      imageNumbers.sort((a, b) => a - b);

      let instanceURLs = [];
      let instanceUIDs = [];
      imageNumbers.forEach(imageNumber => {
        const instanceUID = instanceUIDsByImageNumber[imageNumber];
        const instanceURL = `${chronicleURL}/${instanceUID}/object.dcm`;
        instanceURLs.push(instanceURL);
        instanceUIDs.push(instanceUID);
      });

      return {
        name: 'default_case',
        seriesUID: seriesUID_A,
        urls: instanceURLs,
        instanceUIDs
      };
    })
    .catch(err => {
      throw err;
    });
}
