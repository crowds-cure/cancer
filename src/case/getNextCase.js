import getNextCaseForAnnotator from './getNextCaseForAnnotator.js';
import getCaseImages from './getCaseImages.js';

async function getNextCase() {
  return getNextCaseForAnnotator().then(getCaseImages);
}

export default getNextCase;
