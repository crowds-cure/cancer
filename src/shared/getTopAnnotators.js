import { getDB } from '../db';

async function getTopAnnotators() {
  const measurementsDB = getDB('measurements');

  // TODO: This is a very inefficient approach to get the top
  // three annotators. How can CouchDB use Sort and Limit on a view?
  const result = await measurementsDB.query('by/annotators', {
    reduce: true,
    group: true,
    level: 'exact'
  });

  let measByAnno = result.rows;
  console.log(JSON.stringify(measByAnno));

  // TODO: Clean up the database so this isn't required
  measByAnno = measByAnno.filter(a => a.key !== null);

  // TODO: Sort in the View
  measByAnno.sort((a, b) => b.value - a.value);

  // TODO: Skip the current user
  const annotators = measByAnno.map(r => {
    return {
      name: r.key,
      value: r.value
    };
  });

  return annotators.slice(0, 3);
}

export default getTopAnnotators;
