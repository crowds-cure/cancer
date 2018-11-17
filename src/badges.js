import rank01NewbieBadge from './images/rank-badges/rank-01-newbie.svg';
import rank02NoviceBadge from './images/rank-badges/rank-02-novice.svg';
import rank03RookieBadge from './images/rank-badges/rank-03-rookie.svg';
import rank04IntermediateBadge from './images/rank-badges/rank-04-intermediate.svg';
import rank05ProficientBadge from './images/rank-badges/rank-05-proficient.svg';
import rank06ExperiencedBadge from './images/rank-badges/rank-06-experienced.svg';
import rank07AdvancedBadge from './images/rank-badges/rank-07-advanced.svg';
import rank08SeniorBadge from './images/rank-badges/rank-08-senior.svg';
import rank09ExpertBadge from './images/rank-badges/rank-09-expert.svg';
import rank10GuruBadge from './images/rank-badges/rank-10-guru.svg';

const BADGE_TYPES = {
  NUM_CASES_NEWBIE: {
    type: 'NUM_CASES_NEWBIE',
    name: 'Newbie',
    description: '< 10 Cases',
    img: rank01NewbieBadge,
    min: 0,
    max: 10
  },
  NUM_CASES_NOVICE: {
    type: 'NUM_CASES_NOVICE',
    name: 'Novice',
    description: '10 to 25 Cases',
    img: rank02NoviceBadge,
    min: 10,
    max: 25
  },
  NUM_CASES_ROOKIE: {
    type: 'NUM_CASES_ROOKIE',
    name: 'Rookie',
    description: '25 to 50 Cases',
    img: rank03RookieBadge,
    min: 25,
    max: 50
  },
  NUM_CASES_INTERMEDIATE: {
    type: 'NUM_CASES_INTERMEDIATE',
    name: 'Intermediate',
    description: '50 to 100 Cases',
    img: rank04IntermediateBadge,
    min: 50,
    max: 100
  },
  NUM_CASES_PROFICIENT: {
    type: 'NUM_CASES_PROFICIENT',
    name: 'Proficient',
    description: '100 to 200 Cases',
    img: rank05ProficientBadge,
    min: 100,
    max: 200
  },
  NUM_CASES_EXPERIENCED: {
    type: 'NUM_CASES_EXPERIENCED',
    name: 'Experienced',
    description: '200 to 300 Cases',
    img: rank06ExperiencedBadge,
    min: 200,
    max: 300
  },
  NUM_CASES_ADVANCED: {
    type: 'NUM_CASES_ADVANCED',
    name: 'Advanced',
    description: '300 to 400 Cases',
    img: rank07AdvancedBadge,
    min: 300,
    max: 400
  },
  NUM_CASES_SENIOR: {
    type: 'NUM_CASES_SENIOR',
    name: 'Senior',
    description: '400 to 500 Cases',
    img: rank08SeniorBadge,
    min: 400,
    max: 500
  },
  NUM_CASES_EXPERT: {
    type: 'NUM_CASES_EXPERT',
    name: 'Expert',
    description: '500 to 1000 Cases',
    img: rank09ExpertBadge,
    min: 500,
    max: 1000
  },
  NUM_CASES_GURU: {
    type: 'NUM_CASES_GURU',
    name: 'Guru',
    description: '1000+ Cases',
    img: rank10GuruBadge,
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
