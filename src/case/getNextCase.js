import getNextCaseForAnnotator from './getNextCaseForAnnotator.js';
import getCaseImages from './getCaseImages.js';

async function getNextCase(collection, annotatorID) {
  return getNextCaseForAnnotator(collection, annotatorID).then(getCaseImages);
}

export default getNextCase;
