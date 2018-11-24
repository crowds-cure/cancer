import { getDB } from '../db';

async function getTeamUsers() {
  const sessionsDB = getDB('sessions');
  const result = await sessionsDB.query('by/teamUsername', {
    reduce: true,
    group: true,
    group_level: 2
  });

  const teamUsers = {};
  result.rows.forEach(row => {
    const team = row.key[0];
    const user = row.key[1];
    teamUsers[team] = teamUsers[team] || [];
    teamUsers[team].push(user);
  });

  return teamUsers;
}

export default getTeamUsers;
