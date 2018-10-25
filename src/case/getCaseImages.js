import * as DICOMwebClient from 'dicomweb-client';
import getAuthorizationHeader from '../openid-connect/getAuthorizationHeader.js';

async function getCaseImages(caseData) {
  const studies = caseData.studies;
  const url = 'https://cancer.crowds-cure.org/dcm4chee-arc/aets/DCM4CHEE/rs';
  const dwc = new DICOMwebClient.api.DICOMwebClient({
    url,
    headers: getAuthorizationHeader()
  });

  let seriesToRetrieve = [];
  studies.forEach(study => {
    study.series.forEach(series => {
      seriesToRetrieve.push({
        studyInstanceUID: study.StudyInstanceUID,
        seriesInstanceUID: series.SeriesInstanceUID
      });
    });
  });

  console.log(JSON.stringify(seriesToRetrieve, null, 2));

  const seriesDataPromises = seriesToRetrieve.map(data => {
    try {
      return dwc.retrieveSeriesMetadata(data);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  seriesDataPromises.map(p =>
    p.catch(error => {
      console.error(error);
    })
  );

  const seriesData = await Promise.all(seriesDataPromises);

  return {
    data: caseData,
    seriesData
  };
}

export default getCaseImages;
