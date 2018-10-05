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
  switch (numberOfCases) {
    case numberOfCases < 10:
      return BADGE_TYPES.NUM_CASES_NEWBIE;
    case numberOfCases < 25:
      return BADGE_TYPES.NUM_CASES_NOVICE;
    case numberOfCases < 50:
      return BADGE_TYPES.NUM_CASES_ROOKIE;
    case numberOfCases < 100:
      return BADGE_TYPES.NUM_CASES_INTERMEDIATE;
    case numberOfCases < 200:
      return BADGE_TYPES.NUM_CASES_PROFICIENT;
    case numberOfCases < 300:
      return BADGE_TYPES.NUM_CASES_EXPERIENCED;
    case numberOfCases < 400:
      return BADGE_TYPES.NUM_CASES_ADVANCED;
    case numberOfCases < 500:
      return BADGE_TYPES.NUM_CASES_SENIOR;
    case numberOfCases < 1000:
      return BADGE_TYPES.NUM_CASES_EXPERT;
    case numberOfCases > 1000:
      return BADGE_TYPES.NUM_CASES_GURU;
    default:
      return BADGE_TYPES.NUM_CASES_NEWBIE;
  }
}

export { BADGE_TYPES, getBadgeByNumberOfCases };
