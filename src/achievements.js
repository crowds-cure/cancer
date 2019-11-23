import collectionAllCasesBadge from './images/achievements/collection-all-cases.svg';
import day10MeasurementsBadge from './images/achievements/day-10-measurements.svg';
import day100MeasurementsBadge from './images/achievements/day-100-measurements.svg';
import day200MeasurementsBadge from './images/achievements/day-200-measurements.svg';
import day25MeasurementsBadge from './images/achievements/day-25-measurements.svg';
import day50MeasurementsBadge from './images/achievements/day-50-measurements.svg';
import day75MeasurementsBadge from './images/achievements/day-75-measurements.svg';
import rsna18Day1Badge from './images/achievements/rsna18-day-1.svg';
import rsna18DayTop10Badge from './images/achievements/rsna18-day-top10.svg';
import rsna18EventTop10Badge from './images/achievements/rsna18-event-top10.svg';
import rsna18Group1Badge from './images/achievements/rsna18-group-1.svg';
import rsna18Group2Badge from './images/achievements/rsna18-group-2.svg';
import rsna18Group3Badge from './images/achievements/rsna18-group-3.svg';
import rsna18TopBadge from './images/achievements/rsna18-top.svg';
import sessionMeasurements100Badge from './images/achievements/session-measurements-100.svg';
import sessionMeasurements200Badge from './images/achievements/session-measurements-200.svg';
import sessionMeasurements25Badge from './images/achievements/session-measurements-25.svg';
import sessionMeasurements50Badge from './images/achievements/session-measurements-50.svg';
import sessionMeasurements75Badge from './images/achievements/session-measurements-75.svg';
import timeSession15Badge from './images/achievements/time-session-15.svg';
import timeSession30Badge from './images/achievements/time-session-30.svg';
import timeSession3hBadge from './images/achievements/time-session-3h.svg';
import timeSession60Badge from './images/achievements/time-session-60.svg';
import timeSession6hBadge from './images/achievements/time-session-6h.svg';
import timeSession90Badge from './images/achievements/time-session-90.svg';
import timeSession9hBadge from './images/achievements/time-session-9h.svg';
import timeSession90mBadge from './images/achievements/time-session-90m.svg';
import weekMeasurements100Badge from './images/achievements/week-measurements-100.svg';
import weekMeasurements250Badge from './images/achievements/week-measurements-250.svg';
import weekMeasurements50Badge from './images/achievements/week-measurements-50.svg';
import weekMeasurements500Badge from './images/achievements/week-measurements-500.svg';

const achievements = {
  collectionAllCases: {
    img: collectionAllCasesBadge,
    description: 'Complete all cases in a collection'
  },
  rsna18DayTop10: {
    img: rsna18DayTop10Badge,
    description: 'Top 10 in a day of RSNA 2018'
  },
  rsna18Day1: {
    img: rsna18Day1Badge,
    description: 'Number 1 in a day of RSNA 2018'
  },
  rsna18WeekTop10: {
    img: rsna18EventTop10Badge,
    description: 'Top 10 in the week of RSNA 2018'
  },
  rsna18Week1: {
    img: rsna18TopBadge,
    description: 'Number 1 in the week of RSNA 2018'
  },
  rsna18Group1: {
    img: rsna18Group1Badge,
    description: 'Group number 1 in the week of RSNA 2018'
  },
  rsna18Group2: {
    img: rsna18Group2Badge,
    description: 'Group number 2 in the week of RSNA 2018'
  },
  rsna18Group3: {
    img: rsna18Group3Badge,
    description: 'Group number 3 in the week of RSNA 2018'
  },
  day10Measurements: {
    img: day10MeasurementsBadge,
    description: '10 measurements in a day',
    value: 10,
    statusKey: 'maxMeasurementsInDay',
    alertDiff: 5,
    alertTitle: 'Keep going!',
    alertMessage: diff => `${diff} more measurements today to earn this badge`
  },
  day25Measurements: {
    img: day25MeasurementsBadge,
    description: '25 measurements in a day',
    value: 25,
    statusKey: 'maxMeasurementsInDay',
    alertDiff: 5,
    alertTitle: 'Keep going!',
    alertMessage: diff => `${diff} more measurements today to earn this badge`
  },
  day50Measurements: {
    img: day50MeasurementsBadge,
    description: '50 measurements in a day',
    value: 50,
    statusKey: 'maxMeasurementsInDay',
    alertDiff: 5,
    alertTitle: 'Keep going!',
    alertMessage: diff => `${diff} more measurements today to earn this badge`
  },
  day75Measurements: {
    img: day75MeasurementsBadge,
    description: '75 measurements in a day',
    value: 75,
    statusKey: 'maxMeasurementsInDay',
    alertDiff: 5,
    alertTitle: 'Keep going!',
    alertMessage: diff => `${diff} more measurements today to earn this badge`
  },
  day100Measurements: {
    img: day100MeasurementsBadge,
    description: '100 measurements in a day',
    value: 100,
    statusKey: 'maxMeasurementsInDay',
    alertDiff: 10,
    alertTitle: 'Keep going!',
    alertMessage: diff => `${diff} more measurements today to earn this badge`
  },
  day200Measurements: {
    img: day200MeasurementsBadge,
    description: '200 measurements in a day',
    value: 200,
    statusKey: 'maxMeasurementsInDay',
    alertDiff: 25,
    alertTitle: 'Keep going!',
    alertMessage: diff => `${diff} more measurements today to earn this badge`
  },
  sessionMeasurements25: {
    img: sessionMeasurements25Badge,
    description: '25 measurements in a session',
    value: 25,
    statusKey: 'maxMeasurementsInSession',
    alertDiff: 5,
    alertTitle: 'Keep going!',
    alertMessage: diff => `${diff} more measurements in this session to earn this badge`
  },
  sessionMeasurements50: {
    img: sessionMeasurements50Badge,
    description: '50 measurements in a session',
    value: 50,
    statusKey: 'maxMeasurementsInSession',
    alertDiff: 5,
    alertTitle: 'Keep going!',
    alertMessage: diff => `${diff} more measurements in this session to earn this badge`
  },
  sessionMeasurements75: {
    img: sessionMeasurements75Badge,
    description: '75 measurements in a session',
    value: 75,
    statusKey: 'maxMeasurementsInSession',
    alertDiff: 5,
    alertTitle: 'Keep going!',
    alertMessage: diff => `${diff} more measurements in this session to earn this badge`
  },
  sessionMeasurements100: {
    img: sessionMeasurements100Badge,
    description: '100 measurements in a session',
    value: 100,
    statusKey: 'maxMeasurementsInSession',
    alertDiff: 10,
    alertTitle: 'Keep going!',
    alertMessage: diff => `${diff} more measurements in this session to earn this badge`
  },
  sessionMeasurements200: {
    img: sessionMeasurements200Badge,
    description: '200 measurements in a session',
    value: 200,
    statusKey: 'maxMeasurementsInSession',
    alertDiff: 25,
    alertTitle: 'Keep going!',
    alertMessage: diff => `${diff} more measurements in this session to earn this badge`
  },
  weekMeasurements50: {
    img: weekMeasurements50Badge,
    description: '50 measurements in a week',
    value: 50,
    statusKey: 'maxMeasurementsInWeek',
    alertDiff: 5,
    alertTitle: 'Keep going!',
    alertMessage: diff => `${diff} more measurements this week to earn this badge`
  },
  weekMeasurements100: {
    img: weekMeasurements100Badge,
    description: '100 measurements in a week',
    value: 100,
    statusKey: 'maxMeasurementsInWeek',
    alertDiff: 10,
    alertTitle: 'Keep going!',
    alertMessage: diff => `${diff} more measurements this week to earn this badge`
  },
  weekMeasurements250: {
    img: weekMeasurements250Badge,
    description: '250 measurements in a week',
    value: 250,
    statusKey: 'maxMeasurementsInWeek',
    alertDiff: 25,
    alertTitle: 'Keep going!',
    alertMessage: diff => `${diff} more measurements this week to earn this badge`
  },
  weekMeasurements500: {
    img: weekMeasurements500Badge,
    description: '500 measurements in a week',
    value: 500,
    statusKey: 'maxMeasurementsInWeek',
    alertDiff: 50,
    alertTitle: 'Keep going!',
    alertMessage: diff => `${diff} more measurements this week to earn this badge`
  },
  timeSession15: {
    img: timeSession15Badge,
    description: '15 minute active session'
  },
  timeSession30: {
    img: timeSession30Badge,
    description: '30 minute active session'
  },
  timeSession60: {
    img: timeSession60Badge,
    description: '60 minute active session'
  },
  timeSession90: {
    img: timeSession90Badge,
    description: '90 minute active session'
  },
  timeSessionWeek90m: {
    img: timeSession90mBadge,
    description: '90 minute total session in a week'
  },
  timeSessionWeek3h: {
    img: timeSession3hBadge,
    description: '3 hour total session in a week'
  },
  timeSessionWeek6h: {
    img: timeSession6hBadge,
    description: '6 hour total session in a week'
  },
  timeSessionWeek9h: {
    img: timeSession9hBadge,
    description: '9 hour total session in a week'
  }
};

export { achievements };
