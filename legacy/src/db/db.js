import PouchDB from 'pouchdb';

const baseURL='https://k8s-testing.ohif.org/couchdb';

export const uuidURL = `${baseURL}/_uuids`;
export const annotatorsURL = `${baseURL}/annotators`;
export const adjectivesURL = `${baseURL}/adjectives`;
export const animalsURL = `${baseURL}/animals`;
export const chronicleURL = `${baseURL}/chronicle`;
//export const chronicleURL = `${baseURL}/compressed-chronicle2`;

export const measurementsURL = `${baseURL}/measurements`;

// console.log('url:', uuidUrl);

// export const uuidDB = new PouchDB(uuidURL);
export const adjectivesDB = new PouchDB(adjectivesURL);
export const animalsDB = new PouchDB(animalsURL);
export const annotatorsDB = new PouchDB(annotatorsURL);
export const chronicleDB = new PouchDB(chronicleURL);
export const measurementsDB = new PouchDB(measurementsURL);

export const getUUID = () => {
  return new Promise((resolve, reject) => {
    $.get(uuidURL, ({uuids}) => {resolve(uuids[0])});
      // const uuid = doc.uuids[0];
      // console.log('uuid:', uuid);
  });
};
