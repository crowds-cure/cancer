const BADGE_TYPES = {
  NUM_CASES_NEWBIE: {
    type: 'NUM_CASES_NEWBIE',
    name: 'Newbie',
    description: '< 10 Cases',
    min: 0,
    max: 10
  },
  NUM_CASES_NOVICE: {
    type: 'NUM_CASES_NOVICE',
    name: 'Novice',
    description: '10 to 25 Cases',
    min: 10,
    max: 25
  },
  NUM_CASES_ROOKIE: {
    type: 'NUM_CASES_ROOKIE',
    name: 'Rookie',
    description: '25 to 50 Cases',
    min: 25,
    max: 50
  },
  NUM_CASES_INTERMEDIATE: {
    type: 'NUM_CASES_INTERMEDIATE',
    name: 'Intermediate',
    description: '50 to 100 Cases',
    min: 50,
    max: 100
  },
  NUM_CASES_PROFICIENT: {
    type: 'NUM_CASES_PROFICIENT',
    name: 'Proficient',
    description: '100 to 200 Cases',
    min: 100,
    max: 200
  },
  NUM_CASES_EXPERIENCED: {
    type: 'NUM_CASES_EXPERIENCED',
    name: 'Experienced',
    description: '200 to 300 Cases',
    min: 200,
    max: 300
  },
  NUM_CASES_ADVANCED: {
    type: 'NUM_CASES_ADVANCED',
    name: 'Advanced',
    description: '300 to 400 Cases',
    min: 300,
    max: 400
  },
  NUM_CASES_SENIOR: {
    type: 'NUM_CASES_SENIOR',
    name: 'Senior',
    description: '400 to 500 Cases',
    min: 400,
    max: 500
  },
  NUM_CASES_EXPERT: {
    type: 'NUM_CASES_EXPERT',
    name: 'Expert',
    description: '500 to 1000 Cases',
    min: 500,
    max: 1000
  },
  NUM_CASES_GURU: {
    type: 'NUM_CASES_GURU',
    name: 'Guru',
    description: '1000+ Cases',
    min: 1000,
    max: 2000
  }
};

function getBadgeByNumberOfCases(numberOfCases) {
  if (numberOfCases < 10) {
    return BADGE_TYPES.NUM_CASES_NEWBIE;
  } else if (numberOfCases < 25) {
    return BADGE_TYPES.NUM_CASES_NOVICE;
  } else if (numberOfCases < 50) {
    return BADGE_TYPES.NUM_CASES_ROOKIE;
  } else if (numberOfCases < 100) {
    return BADGE_TYPES.NUM_CASES_INTERMEDIATE;
  } else if (numberOfCases < 200) {
    return BADGE_TYPES.NUM_CASES_PROFICIENT;
  } else if (numberOfCases < 300) {
    return BADGE_TYPES.NUM_CASES_EXPERIENCED;
  } else if (numberOfCases < 400) {
    return BADGE_TYPES.NUM_CASES_ADVANCED;
  } else if (numberOfCases < 500) {
    return BADGE_TYPES.NUM_CASES_SENIOR;
  } else if (numberOfCases < 1000) {
    return BADGE_TYPES.NUM_CASES_EXPERT;
  } else if (numberOfCases >= 1000) {
    return BADGE_TYPES.NUM_CASES_GURU;
  } else {
    return BADGE_TYPES.NUM_CASES_NEWBIE;
  }
}

export { BADGE_TYPES, getBadgeByNumberOfCases };
