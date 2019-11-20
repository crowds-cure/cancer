import getNextCaseForAnnotator from './getNextCaseForAnnotator.js';
import getCaseImages from './getCaseImages.js';

async function getNextCase(collection, annotatorID, caseToIgnore) {
  return getNextCaseForAnnotator(collection, annotatorID, caseToIgnore).then(getCaseImages);
}

export default getNextCase;
