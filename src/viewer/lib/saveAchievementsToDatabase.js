import guid from './guid.js';
import getProfile from './getProfile.js';
import { getDB } from '../../db.js';
import determineAchievementsForUser from '../../shared/determineAchievementsForUser';

async function saveAchievementsToDatabase(totalCompleteCollection) {
  const achievementsDB = getDB('achievements');
  const { username } = getProfile();

  // Determine the earned achievements
  const achievements = await determineAchievementsForUser(
    totalCompleteCollection
  );
  if (!achievements || !achievements.length) {
    return;
  }

  const doc = {
    _id: guid(),
    username,
    achievements
  };

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

  // Set the existing id and rev to update doc if exists
  if (
    achievementsDocRow &&
    achievementsDocRow.doc &&
    achievementsDocRow.doc._id &&
    achievementsDocRow.doc._rev
  ) {
    doc._id = achievementsDocRow.doc._id;
    doc._rev = achievementsDocRow.doc._rev;
  }

  // Do not lose the earned achievements if exists
  if (
    achievementsDocRow &&
    achievementsDocRow.doc &&
    achievementsDocRow.doc.achievements
  ) {
    doc.achievements = [
      ...doc.achievements,
      ...achievementsDocRow.doc.achievements
    ];
  }

  // Distinct achievements
  doc.achievements = [...new Set(doc.achievements)];

  achievementsDB.put(doc);
}

export default saveAchievementsToDatabase;
