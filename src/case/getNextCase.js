import getNextCaseForAnnotator from './getNextCaseForAnnotator.js';
import getCaseImages from './getCaseImages.js';
import { getDB } from '../db.js';

async function getNextCase() {
  // This is just an example of how to use PouchDB
  // The docId specified here will be removed eventually
  const animalsDB = getDB('animals');
  const docId = '87efc26dc3637f6c736c758131000c1a';
  animalsDB.get(docId, function(error, doc) {
    if (error) {
      throw new Error(error);
    }

    // This will log details about an ostrich
    console.log(doc);
  });

  return getNextCaseForAnnotator().then(getCaseImages);
}

export default getNextCase;
