import * as DICOMwebClient from 'dicomweb-client';
import getAuthorizationHeader from '../openid-connect/getAuthorizationHeader.js';

async function getCaseImages(caseData) {
  const url = 'https://k8s-testing.ohif.org/dcm4chee-arc/aets/DCM4CHEE/rs';
  const dwc = new DICOMwebClient.api.DICOMwebClient({
    url,
    headers: getAuthorizationHeader()
  });

  const seriesDataPromises = caseData.map(series => {
    return dwc.searchForSeries(series);
  });

  const data = await Promise.all(seriesDataPromises);

  console.log(data);

  return data;
}

export default getCaseImages;
