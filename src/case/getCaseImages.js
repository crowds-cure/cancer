import * as DICOMwebClient from 'dicomweb-client';
import getAuthorizationHeader from '../openid-connect/getAuthorizationHeader.js';

async function getCaseImages(caseData) {
  const url = 'https://cancer.crowds-cure.org/dcm4chee-arc/aets/DCM4CHEE/rs';
  const dwc = new DICOMwebClient.api.DICOMwebClient({
    url,
    headers: getAuthorizationHeader()
  });

  const seriesDataPromises = caseData.map(series => {
    return dwc.retrieveSeriesMetadata(series);
  });

  const seriesData = await Promise.all(seriesDataPromises);

  return {
    data: caseData[0],
    seriesData
  };
}

export default getCaseImages;
