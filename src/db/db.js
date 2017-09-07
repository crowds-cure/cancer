// const baseUrl='http://127.0.0.1:5984';
import PouchDB from 'pouchdb';

const baseURL='http://rsnacrowdquant.cloudapp.net:5984';

const uuidUrl = `${baseURL}/_uuids`;
export const annotatorsURL = `${baseURL}/annotators`;
export const adjectivesURL = `${baseURL}/adjectives`;
export const animalsURL = `${baseURL}/animals`;
export const chronicleURL = `${baseURL}/chronicle`;
// console.log('url:', uuidUrl);

// var uuidDb = new PouchDB(uuidUrl);
export const adjectivesDB = new PouchDB(adjectivesURL);
export const animalsDB = new PouchDB(animalsURL);
export const annotatorsDB = new PouchDB(annotatorsURL);
export const chronicleDB = new PouchDB(chronicleURL);
