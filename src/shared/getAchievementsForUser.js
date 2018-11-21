import getProfile from '../viewer/lib/getProfile';
import { getDB } from '../db';

async function getAchievementsForUser() {
  const achievementsDB = getDB('achievements');
  const { username } = getProfile();

  const achievementsDoc = await achievementsDB.query('by/username', {
    reduce: false,
    start_key: username,
    end_key: username,
    include_docs: true
  });

  const achievementsDocRow =
    achievementsDoc.rows &&
    achievementsDoc.rows.length &&
    achievementsDoc.rows[0];
  return (
    (achievementsDocRow &&
      achievementsDocRow.doc &&
      achievementsDocRow.doc.achievements) ||
    []
  );
}

export default getAchievementsForUser;
