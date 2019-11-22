import { getDB } from '../db';

async function getTopAnnotators(limit = 10) {
  const measurementsDB = getDB('measurements');

  // TODO: This is a very inefficient approach to get the top
  // three annotators. How can CouchDB use Sort and Limit on a view?
  // ANS: yes, there is a way to do this by creating a little helper
  // that puts the reduced measurement counts into a new database that
  // has a has a view indexed by annotation count.  But for the number
  // of annotators we will have in the near future this is not required
  // (remember, we are fetching hundreds of CT images all the time, so
  // a few dozen lines of json is nothing!)
  const result = await measurementsDB.query('by/annotatorsInfo', {
    reduce: true,
    group: true,
    level: 'exact'
  });

  let measByAnno = result.rows;
  console.log(JSON.stringify(measByAnno));

  // TODO: Clean up the database so this isn't required
  measByAnno = measByAnno.filter(a => a.key !== null);

  // TODO: Sort in the View
  measByAnno = measByAnno.sort((a, b) => b.value.count - a.value.count);

  const annotators = measByAnno.map(instance => {
    const { key, value } = instance;
    return {
      name: key,
      principalName: value.principalName,
      value: value.count
    };
  });

  return annotators.slice(0, limit);
}

async function getTopTeams(limit = 10) {
  const measurementsDB = getDB('measurements');

  // TODO: This is a very inefficient approach to get the top
  // three annotators. How can CouchDB use Sort and Limit on a view?
  // ANS: yes, there is a way to do this by creating a little helper
  // that puts the reduced measurement counts into a new database that
  // has a has a view indexed by annotation count.  But for the number
  // of annotators we will have in the near future this is not required
  // (remember, we are fetching hundreds of CT images all the time, so
  // a few dozen lines of json is nothing!)
  const annotatorPromise = measurementsDB.query('by/annotators', {
    reduce: true,
    group: true,
    level: 'exact'
  });

  const sessionsDB = getDB('sessions');
  const teamUsernamePromise = sessionsDB.query('by/teamUsername', {
    reduce: true,
    group: true,
    group_level: 2
  });

  const topTeams = await Promise.all([
    annotatorPromise,
    teamUsernamePromise
  ]).then(results => {
    console.log(`getTopTeams results`, results);

    const annotators = results[0].rows;
    const teamUsers = results[1].rows;

    // make a map from user to team
    const userTeam = {};
    Object.values(teamUsers).forEach(teamUser => {
      userTeam[teamUser.key[1]] = teamUser.key[0];
    });
    console.log('userTeam', userTeam);

    const teamAnnotations = {};
    Object.values(annotators).forEach(annotations => {
      const user = annotations.key;
      const team = userTeam[user];
      const score = annotations.value;
      teamAnnotations[team] = teamAnnotations[team] || 0;
      teamAnnotations[team] += score;
    });
    const teamRanking = [];
    const teamsToIgnore = ['notApplicable', 'undefined', 'null', ' '];
    Object.keys(teamAnnotations).forEach(teamName => {
      if (!teamsToIgnore.includes(teamName)) {
        teamRanking.push([teamName, teamAnnotations[teamName]]);
      }
    });
    teamRanking.sort((a, b) => b[1] - a[1]);
    console.log('teamRanking', teamRanking);

    return teamRanking;
  });

  console.log(`top for teams: `, topTeams);

  return topTeams
    .map(topT => {
      return {
        name: topT[0],
        value: topT[1]
      };
    })
    .slice(0, limit);
}

// This is the same function used in the map function of the couchdb view.
// The logic in getTopAnnotatorsByWeek adjusts the month to compensate, and
//  it gets the actual month number (January as 1)
function getWeek(year, month, day) {
  function serial(days) {
    return 86400000 * days;
  }
  function dateserial(year, month, day) {
    return new Date(year, month - 1, day).valueOf();
  }
  function weekday(date) {
    return new Date(date).getDay() + 1;
  }
  function yearserial(date) {
    return new Date(date).getFullYear();
  }
  var date = dateserial(year, month, day);
  var date2 = dateserial(
    yearserial(date - serial(weekday(date - serial(1))) + serial(4)),
    1,
    3
  );
  return ~~((date - date2 + serial(weekday(date2) + 5)) / serial(7));
}

function getWeekKey(week) {
  const date = new Date();
  week =
    week || getWeek(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return `${date.getFullYear()}/${week}`;
}

// return the top annotators for the given year, month and day, where
// month is the actual month number (January as 1)
async function getTopAnnotatorsByDay(limit = 10, year, month, day) {
  const date = new Date();
  year = year || date.getFullYear();
  month = month || date.getMonth() + 1;
  day = day || date.getDate();

  const yearmonthday = [year, month, day].join('/');
  const measurementsDB = getDB('measurements');
  const result = await measurementsDB.query('by/dayAnnotator', {
    reduce: true,
    group: true,
    start_key: [yearmonthday, ''],
    end_key: [yearmonthday, {}],
    level: 'exact'
  });

  let dayAnnotators = result.rows;

  // TODO: Clean up the database so this isn't required
  dayAnnotators = dayAnnotators.filter(a => a.key[1] !== null);

  // TODO: Sort in the View
  dayAnnotators.sort((a, b) => b.value - a.value);

  const annotators = dayAnnotators.map(r => {
    return {
      name: r.key,
      value: r.value
    };
  });

  console.log(`top for day ${yearmonthday} annotators: `, annotators);

  return annotators.slice(0, limit);
}

// return the top annotators for the given week, where
// week is the week number as defined by getWeek above
// and in the couchdb view
async function getTopAnnotatorsByWeek(limit = 10, week) {
  const weekKey = getWeekKey(week);

  const measurementsDB = getDB('measurements');
  const result = await measurementsDB.query('by/weekAnnotator', {
    reduce: true,
    group: true,
    start_key: [weekKey, ''],
    end_key: [weekKey, {}],
    level: 'exact'
  });

  let weekAnnotators = result.rows;

  // TODO: Clean up the database so this isn't required
  weekAnnotators = weekAnnotators.filter(a => a.key[1] !== null);

  // TODO: Sort in the View
  weekAnnotators.sort((a, b) => b.value - a.value);

  const annotators = weekAnnotators.map(r => {
    return {
      name: r.key,
      value: r.value
    };
  });

  console.log(`top for week ${weekKey} annotators: `, annotators);

  return annotators.slice(0, limit);
}

// return the top teams for the given week, where
// week is the week number as defined by getWeek above
// and in the couchdb view
async function getTopTeamsByWeek(limit = 10, week) {
  const weekKey = getWeekKey(week);

  const measurementsDB = getDB('measurements');
  const weekAnnotatorPromise = measurementsDB.query('by/weekAnnotator', {
    reduce: true,
    group: true,
    start_key: [weekKey, ''],
    end_key: [weekKey, {}],
    level: 'exact'
  });

  const sessionsDB = getDB('sessions');
  const teamUsernamePromise = sessionsDB.query('by/teamUsername', {
    reduce: true,
    group: true,
    group_level: 2
  });

  const topTeams = await Promise.all([
    weekAnnotatorPromise,
    teamUsernamePromise
  ]).then(results => {
    console.log(`getTopTeamsByWeek results`, results);

    const annotatorsForWeek = results[0].rows;
    const teamUsers = results[1].rows;

    // make a map from user to team
    const userTeam = {};
    Object.values(teamUsers).forEach(teamUser => {
      userTeam[teamUser.key[1]] = teamUser.key[0];
    });
    console.log('userTeam', userTeam);

    const teamAnnotations = {};
    Object.values(annotatorsForWeek).forEach(annotations => {
      const user = annotations.key[1];
      const team = userTeam[user];
      const score = annotations.value;
      teamAnnotations[team] = teamAnnotations[team] || 0;
      teamAnnotations[team] += score;
    });
    const teamRanking = [];
    Object.keys(teamAnnotations).forEach(teamName => {
      teamRanking.push([teamName, teamAnnotations[teamName]]);
    });
    teamRanking.sort((a, b) => b[1] - a[1]);
    console.log('teamRanking', teamRanking);

    return teamRanking;
  });

  console.log(`top for teams week ${weekKey} teams: `, topTeams);

  return topTeams
    .map(topT => {
      return {
        name: topT[0],
        value: topT[1]
      };
    })
    .slice(0, limit);
}

export {
  getTopAnnotators,
  getTopTeams,
  getTopAnnotatorsByDay,
  getTopAnnotatorsByWeek,
  getTopTeamsByWeek
};
