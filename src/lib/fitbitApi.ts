import ClientOAuth2 from 'client-oauth2';

export const FITBIT_API_BASE_URL = 'https://api.fitbit.com/1/user/-/';
export const FITBIT_API_PROFILE = '/profile.json';
export const FITBIT_API_ACTIVITY_DAILY = '/activities/date/[date].json';
export const FITBIT_API_ACTIVITY_TODAY =
  '/activities/[resource-path]/date/today/1d.json';
export const FITBIT_API_ACTIVITY_STEP = '/activities/steps/date/today/1d.json';
export const FITBIT_API_ACTIVITY_HEART_RATE =
  '/activities/heart/date/today/1d.json';
export const FITBIT_API_SLEEP =
  'https://api.fitbit.com/1.2/user/-/sleep/date/[date].json';

type FitbitUnknownType =
  | boolean
  | number
  | string
  | FitbitUnknownType[]
  | {[key: string]: FitbitUnknownType};

type FitbitClockTimeDisplayFormat = '12hour' | '24hour';

type FitbitGender = 'FEMALE' | 'MALE' | 'NA';

type FitbitLocale =
  | 'en_US'
  | 'fr_FR'
  | 'de_DE'
  | 'es_ES'
  | 'en_GB'
  | 'en_AU'
  | 'en_NZ'
  | 'ja_JP';

export type FitbitResponse =
  | ResponseFitbitProfile
  | ResponseFitbitDailyActivitySummary
  | ResponseFitbitActivityStep
  | ResponseFitbitHeartRate
  | ResponseFitbitSleep;

const isFitbitDailyActivitySummary = (
  arg: unknown
): arg is ResponseFitbitDailyActivitySummary => {
  return (
    arg !== null &&
    typeof arg === 'object' &&
    typeof (arg as ResponseFitbitDailyActivitySummary).activities ===
      'object' &&
    typeof (arg as ResponseFitbitDailyActivitySummary).goals === 'object' &&
    typeof (arg as ResponseFitbitDailyActivitySummary).summary === 'object'
  );
};

const isFitbitSleep = (arg: unknown): arg is ResponseFitbitSleep => {
  return (
    arg !== null &&
    typeof arg === 'object' &&
    typeof (arg as ResponseFitbitSleep).sleep === 'object' &&
    typeof (arg as ResponseFitbitSleep).summary === 'object'
  );
};

export interface ResponseFitbitProfile {
  user: FitibitUser;
}

export interface ResponseFitbitDailyActivitySummary {
  activities: FitbitActivity[];
  goals: FitbitGoals;
  summary: FitbitAcitivitySummary;
}

export interface ResponseFitbitActivityStep {
  'activities-steps': FitbitStep[];
  'activities-steps-intraday': FitbitActivitiesIntraday;
}

export interface ResponseFitbitHeartRate {
  'activities-heart': FitbitHeartRate[];
  'activities-heart-intraday': FitbitActivitiesIntraday;
}

export interface ResponseFitbitSleep {
  sleep: FitbitSleep[];
  summary: FitbitSleepSummary;
}

interface FitbitDataset {
  time: string;
  value: number;
}

interface FitbitActivitiesIntraday {
  dataset: FitbitDataset[];
  datasetInterval: number;
  datasetType: string;
}

export interface FitibitUser {
  age: number;
  ambassador: boolean;
  autoStrideEnabled: boolean;
  avatar: string;
  avatar150: string;
  avatar640: string;
  averageDailySteps: number;
  challengesBeta: boolean;
  clockTimeDisplayFormat: FitbitClockTimeDisplayFormat;
  corporate: boolean;
  corporateAdmin: boolean;
  country: string;
  dateOfBirth: string;
  displayName: string;
  displayNameSetting: string;
  distanceUnit: string;
  encodedId: string;
  features: {
    exerciseGoal: boolean;
  };
  foodsLocale: string;
  fullName: string;
  gender: FitbitGender;
  glucoseUnit: string;
  height: number;
  heightUnit: string;
  isBugReportEnabled: boolean;
  isChild: boolean;
  isCoach: boolean;
  languageLocale: string;
  legalTermsAcceptRequired: boolean;
  locale: FitbitLocale;
  memberSince: string;
  mfaEnabled: boolean;
  offsetFromUTCMillis: number;
  sdkDeveloper: boolean;
  sleepTracking: string;
  startDayOfWeek: string;
  strideLengthRunning: number;
  strideLengthRunningType: string;
  strideLengthWalking: number;
  strideLengthWalkingType: string;
  swimUnit: string;
  timezone: string;
  topBadges: FitibitBadges[];
  username: string;
  waterUnit: string;
  waterUnitName: string;
  weight: number;
  weightUnit: string;
}

interface FitibitBadges {
  badgeGradientEndColor: string;
  badgeGradientStartColor: string;
  badgeType: string;
  category: string;
  cheers: FitbitUnknownType[];
  dateTime: string;
  description: string;
  earnedMessage: string;
  encodedId: string;
  image100px: string;
  image125px: string;
  image300px: string;
  image50px: string;
  image75px: string;
  marketingDescription: string;
  mobileDescription: string;
  name: string;
  shareImage640px: string;
  shareText: string;
  shortDescription: string;
  shortName: string;
  timesAchieved: number;
  unit: string;
  value: number;
}

interface FitbitActivity {
  activityId: number;
  activityParentId: number;
  activityParentName: string;
  calories: number;
  description: string;
  duration: number;
  hasActiveZoneMinutes: boolean;
  hasStartTime: boolean;
  isFavorite: boolean;
  lastModified: string;
  logId: number;
  name: string;
  startDate: string;
  startTime: string;
  steps: number;
}

interface FitbitGoals {
  activeMinutes: number;
  caloriesOut: number;
  distance: number;
  floors: number;
  steps: number;
}

interface FitbitDistance {
  activity: string;
  distance: number;
}

interface FitbitHeartRateZone {
  caloriesOut: number;
  max: number;
  min: number;
  minutes: number;
  name: string;
}

interface FitbitAcitivitySummary {
  activeScore: number;
  activityCalories: number;
  caloriesBMR: number;
  caloriesOut: number;
  distances: FitbitDistance[];
  elevation: number;
  fairlyActiveMinutes: number;
  floors: number;
  heartRateZones: FitbitHeartRateZone[];
  lightlyActiveMinutes: number;
  marginalCalories: number;
  restingHeartRate: number;
  sedentaryMinutes: number;
  steps: number;
  veryActiveMinutes: number;
}

interface FitbitStep {
  dateTime: string;
  value: string;
}

interface FitbitHeartRate {
  dateTime: string;
  value: {
    customHeartRateZones: FitbitHeartRateZone[];
    heartRateZones: FitbitHeartRateZone[];
  };
}

interface FitbitSleepLevelData {
  dateTime: string;
  level: string;
  seconds: number;
}

interface FitbitSleepLevelSummaryData {
  count: number;
  minutes: number;
  thirtyDayAvgMinutes: number;
}

interface FitbitSleepLevelSummary {
  deep: FitbitSleepLevelSummaryData;
  light: FitbitSleepLevelSummaryData;
  rem: FitbitSleepLevelSummaryData;
  wake: FitbitSleepLevelSummaryData;
}

interface FitbitSleepLevels {
  data: FitbitSleepLevelData[];
  shortData: FitbitSleepLevelData[];
  summary: FitbitSleepLevelSummary;
}

interface FitbitSleep {
  dateOfSleep: string;
  duration: number;
  efficiency: number;
  endTime: string;
  infoCode: number;
  isMainSleep: boolean;
  levels: FitbitSleepLevels;
  logId: number;
  minutesAfterWakeup: number;
  minutesAsleep: number;
  minutesAwake: number;
  minutesToFallAsleep: number;
  startTime: string;
  timeInBed: number;
  type: string;
}

interface FitbitSleepSummaryStage {
  deep: number;
  light: number;
  rem: number;
  wake: number;
}

interface FitbitSleepSummary {
  stages: FitbitSleepSummaryStage;
  totalMinutesAsleep: number;
  totalSleepRecords: number;
  totalTimeInBed: number;
}

export const fitbitAuth = new ClientOAuth2({
  clientId: process.env.FITBIT_CLIENT_ID,
  clientSecret: process.env.FIBIT_CLIENT_SECRET,
  accessTokenUri: 'https://api.fitbit.com/oauth2/token',
  authorizationUri: 'https://www.fitbit.com/oauth2/authorize',
  redirectUri: process.env.BASE_URL + '/fitbit/callback',
  scopes: [
    'activity',
    'heartrate',
    'location',
    'nutrition',
    'profile',
    'settings',
    'sleep',
    'social',
    'weight',
  ],
  query: {
    expires_in: '86400',
  },
});

let fitbitToken: ClientOAuth2.Token;
let fitbitUser: FitibitUser;

export const setFitbitToken = (token: ClientOAuth2.Token) => {
  fitbitToken = token;
};

export const getFitbitToken = async () => {
  if (fitbitToken === undefined) {
    return fitbitAuth.code.getUri();
  } else {
    if (fitbitToken.expired()) {
      fitbitToken = await fitbitToken.refresh().then(updatedToken => {
        return updatedToken;
      });
    }
    return fitbitToken;
  }
};

export const setFitbitProfile = (response: ResponseFitbitProfile) => {
  fitbitUser = response.user;
};

export const getFitbitUser = () => {
  return fitbitUser;
};

export const getFitbitAuthText = (_url: string) => {
  return [
    'Fitbitデータへのアクセス許可が必要です\n下記URLからFitbitデータへのアクセス許可をお願いします',
    _url,
  ];
};

export const getFitbitAxiosConfig = (
  token: ClientOAuth2.Token,
  param: string
) => {
  switch (param) {
    case 'sleep': {
      return getFitbitSleepUrl(token);
    }
    default: {
      return getFitbitActivityUrl(token);
    }
  }
};

export const getFitbitResponseText = (fitbitResponse: FitbitResponse) => {
  switch (fitbitResponse) {
    case isFitbitDailyActivitySummary(fitbitResponse) && fitbitResponse: {
      return getFitbitDailyActivityText(fitbitResponse);
    }
    case isFitbitSleep(fitbitResponse) && fitbitResponse: {
      return getFitbitSleepText(fitbitResponse);
    }
    default: {
      return 'Unknown Fitbit Response, ' + JSON.stringify(fitbitResponse);
    }
  }
};

const replaceToday = (url_path: string) => {
  const today = new Date();
  const formatDate =
    today.getFullYear() +
    '-' +
    ('0' + (today.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + today.getDate()).slice(-2);
  return url_path.replace('[date]', formatDate);
};

const getFitbitUserDisplayName = () => {
  return getFitbitUser().displayName || 'unknown';
};

const getFitbitActivityUrl = (token: ClientOAuth2.Token) => {
  const _url = replaceToday(FITBIT_API_ACTIVITY_DAILY);
  return token.sign({
    baseURL: FITBIT_API_BASE_URL,
    url: _url,
  });
};

const getFitbitSleepUrl = (token: ClientOAuth2.Token) => {
  const _url = replaceToday(FITBIT_API_SLEEP);
  return token.sign({
    url: _url,
  });
};

const getFitbitDailyActivityText = (
  fitbitResponse: ResponseFitbitDailyActivitySummary
) => {
  return [
    getFitbitUserDisplayName() + "'s today activity summary ",
    ', sedentary minutes = ' + fitbitResponse.summary.sedentaryMinutes,
    ', lightly active minutes = ' + fitbitResponse.summary.lightlyActiveMinutes,
    ', fairly active minutes = ' + fitbitResponse.summary.fairlyActiveMinutes,
    ', very active minutes = ' + fitbitResponse.summary.veryActiveMinutes,
    ', calories BMR = ' + fitbitResponse.summary.caloriesBMR,
    ', calories Out = ' + fitbitResponse.summary.caloriesOut,
    ', activity calories = ' + fitbitResponse.summary.activityCalories,
    ', marginal calories = ' + fitbitResponse.summary.marginalCalories,
    ', elevation = ' + fitbitResponse.summary.elevation,
    ', floors = ' + fitbitResponse.summary.floors,
    ', resting heart rate = ' + fitbitResponse.summary.restingHeartRate,
    ', steps = ' + fitbitResponse.summary.steps,
  ].join('\n');
};

const getFitbitSleepText = (fitbitResponse: ResponseFitbitSleep) => {
  return [
    getFitbitUserDisplayName() + "'s today sleep summary ",
    ', total minutes asleep = ' + fitbitResponse.summary.totalMinutesAsleep,
    ', total time in bed = ' + fitbitResponse.summary.totalTimeInBed,
    ', stages wake = ' + fitbitResponse.summary.stages.wake,
    ', stages rem = ' + fitbitResponse.summary.stages.rem,
    ', stages light = ' + fitbitResponse.summary.stages.light,
    ', stages deep = ' + fitbitResponse.summary.stages.deep,
  ].join('\n');
};
