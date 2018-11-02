const BADGE_TYPES = {
  NUM_CASES_NEWBIE: {
    name: 'Newbie',
    description: '< 10 Cases'
  },
  NUM_CASES_NOVICE: {
    name: 'Novice',
    description: '10 to 25 Cases'
  },
  NUM_CASES_ROOKIE: {
    name: 'Rookie',
    description: '25 to 50 Cases'
  },
  NUM_CASES_INTERMEDIATE: {
    name: 'Intermediate',
    description: '50 to 100 Cases'
  },
  NUM_CASES_PROFICIENT: {
    name: 'Proficient',
    description: '100 to 200 Cases'
  },
  NUM_CASES_EXPERIENCED: {
    name: 'Experienced',
    description: '200 to 300 Cases'
  },
  NUM_CASES_ADVANCED: {
    name: 'Advanced',
    description: '300 to 400 Cases'
  },
  NUM_CASES_SENIOR: {
    name: 'Senior',
    description: '400 to 500 Cases'
  },
  NUM_CASES_EXPERT: {
    name: 'Expert',
    description: '500 to 1000 Cases'
  },
  NUM_CASES_GURU: {
    name: 'Guru',
    description: '1000+ Cases'
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
