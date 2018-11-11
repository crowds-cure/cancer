import PouchDB from 'pouchdb-browser';
import plugin from 'pouchdb-find';
import getAuthorizationHeader from './openid-connect/getAuthorizationHeader.js';
import 'whatwg-fetch';

PouchDB.plugin(plugin);

const baseURL = 'https://db.crowds-cure.org';

export const uuidURL = `${baseURL}/_uuids`;
export const annotatorsURL = `${baseURL}/annotators`;
export const adjectivesURL = `${baseURL}/adjectives`;
export const animalsURL = `${baseURL}/animals`;
export const chronicleURL = `${baseURL}/chronicle`;
export const measurementsURL = `${baseURL}/measurements`;

export function getDB(name = 'animals') {
  const authHeader = getAuthorizationHeader();

  const options = {
    fetch: function(url, opts) {
      opts.headers.set('Authorization', authHeader.Authorization);
      return PouchDB.fetch(url, opts);
    }
  };

  const url = `${baseURL}/${name}`;

  return new PouchDB(url, options);
}
