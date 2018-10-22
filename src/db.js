import PouchDB from 'pouchdb';
import $ from 'jquery';

const baseURL = 'https://db.crowds-cure.org';

export const uuidURL = `${baseURL}/_uuids`;
export const annotatorsURL = `${baseURL}/annotators`;
export const adjectivesURL = `${baseURL}/adjectives`;
export const animalsURL = `${baseURL}/animals`;
export const chronicleURL = `${baseURL}/chronicle`;
export const measurementsURL = `${baseURL}/measurements`;
export const adjectivesDB = new PouchDB(adjectivesURL);
export const animalsDB = new PouchDB(animalsURL);
export const annotatorsDB = new PouchDB(annotatorsURL);
export const chronicleDB = new PouchDB(chronicleURL);
export const measurementsDB = new PouchDB(measurementsURL);

export const getUUID = () => {
  return new Promise((resolve, reject) => {
    // TODO: Remove jQuery
    $.get(uuidURL, ({ uuids }) => {
      resolve(uuids[0]);
    });
  });
};
