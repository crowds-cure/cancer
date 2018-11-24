import { getDB } from '../db';

async function getSessionsByTeam() {
  const sessionsDB = getDB('sessions');
  const result = await sessionsDB.query('by/teamUsername', {
    reduce: true,
    group: true,
    group_level: 1
  });

  const byTeam = {};
  result.rows.forEach(row => {
    byTeam[row.key[0]] = row.value;
  });

  return byTeam;
}

export default getSessionsByTeam;
