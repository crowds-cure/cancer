import getNextCaseForAnnotator from './getNextCaseForAnnotator.js';
import getCaseImages from './getCaseImages.js';

async function getNextCase(collection) {
  return getNextCaseForAnnotator(collection).then(getCaseImages);
}

export default getNextCase;
