import ClientOAuth2 from 'client-oauth2';

const FITBIT_API_BASE_URL = 'https://api.fitbit.com/1/user/-/';
const FITBIT_API_PROFILE = '/profile.json';
const FITBIT_API_ACTIVITY_DAILY = '/activities/date/[date].json';
const FITBIT_API_SLEEP =
  'https://api.fitbit.com/1.2/user/-/sleep/date/[date].json';
const FITBIT_API_ACTIVITY_STEP = '/activities/steps/date/today/1d.json';
const FITBIT_API_ACTIVITY_HEART_RATE = '/activities/heart/date/today/1d.json';
const FITBIT_API_ACTIVITY_TODAY =
  '/activities/[resource-path]/date/today/1d.json';

type FitbitUnknownType =
  | boolean
  | number
  | string
  | FitbitUnknownType[]
  | {[key: string]: FitbitUnknownType};

export type FitbitClockTimeDisplayFormat = '12hour' | '24hour';

export type FitbitGender = 'FEMALE' | 'MALE' | 'NA';

export type FitbitLocale =
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

export interface FitbitDataset {
  time: string;
  value: number;
}

export interface FitbitActivitiesIntraday {
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

export interface FitibitBadges {
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

export interface FitbitActivity {
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

export interface FitbitGoals {
  activeMinutes: number;
  caloriesOut: number;
  distance: number;
  floors: number;
  steps: number;
}

export interface FitbitDistance {
  activity: string;
  distance: number;
}

export interface FitbitHeartRateZone {
  caloriesOut: number;
  max: number;
  min: number;
  minutes: number;
  name: string;
}

export interface FitbitAcitivitySummary {
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

export interface FitbitStep {
  dateTime: string;
  value: string;
}

export interface FitbitHeartRate {
  dateTime: string;
  value: {
    customHeartRateZones: FitbitHeartRateZone[];
    heartRateZones: FitbitHeartRateZone[];
  };
}

export interface FitbitSleepLevelData {
  dateTime: string;
  level: string;
  seconds: number;
}

export interface FitbitSleepLevelSummaryData {
  count: number;
  minutes: number;
  thirtyDayAvgMinutes: number;
}

export interface FitbitSleepLevelSummary {
  deep: FitbitSleepLevelSummaryData;
  light: FitbitSleepLevelSummaryData;
  rem: FitbitSleepLevelSummaryData;
  wake: FitbitSleepLevelSummaryData;
}

export interface FitbitSleepLevels {
  data: FitbitSleepLevelData[];
  shortData: FitbitSleepLevelData[];
  summary: FitbitSleepLevelSummary;
}

export interface FitbitSleep {
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

export interface FitbitSleepSummaryStage {
  deep: number;
  light: number;
  rem: number;
  wake: number;
}

export interface FitbitSleepSummary {
  stages: FitbitSleepSummaryStage;
  totalMinutesAsleep: number;
  totalSleepRecords: number;
  totalTimeInBed: number;
}

interface FitbitModel {
  auth: ClientOAuth2;
  token?: ClientOAuth2.Token;
  user?: FitibitUser;
}

interface FitbitModles {
  [userId: string]: FitbitModel;
}

const defaultOAuthOptions: ClientOAuth2.Options = {
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
};

export interface FitbitOptionModel {
  redirectUri: string;
  scopes: string[];
  state: string;
  expires_in: number;
}
export interface IFitbit {
  authorizeURL(): string;
  authorizeCallback(originalUrl: string): Promise<ClientOAuth2.Token>;
  setToken(token: ClientOAuth2.Token): void;
  getToken(): ClientOAuth2.Token;
}

export class Fitbit implements IFitbit {
  private _config: ClientOAuth2.Options = defaultOAuthOptions;
  private _auth: ClientOAuth2;
  private _expires_in = 86400;
  private _token!: ClientOAuth2.Token;

  constructor(private opt?: Partial<FitbitOptionModel>) {
    if (opt) {
      this._config.redirectUri =
        opt.redirectUri || defaultOAuthOptions.redirectUri;
      this._config.scopes = opt.scopes || defaultOAuthOptions.scopes;
      this._config.state = opt.state || undefined;
      this._expires_in = opt.expires_in || this._expires_in;
    }
    console.log(this._config);
    this._auth = new ClientOAuth2(this._config);
  }
  authorizeURL(): string {
    const _url = this._auth.code.getUri();
    console.log('authorizeURL = ' + _url);
    return _url;
  }
  authorizeCallback(originalUrl: string): Promise<ClientOAuth2.Token> {
    console.log('authorizeCallback = ' + originalUrl);
    return this._auth.code
      .getToken(originalUrl)
      .then(token => {
        console.log('authorizeCallback success');
        console.log(token);
        return token;
      })
      .catch(error => {
        console.log('authorizeCallback error');
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
        return error.message;
      });
  }
  setToken(token: ClientOAuth2.Token): void {
    this._token = token;
  }
  getToken(): ClientOAuth2.Token {
    return this._token;
  }
}

const fitbit: FitbitModles = {};

const initFitbit = (userId: string) => {
  const _model: FitbitModel = {
    auth: new ClientOAuth2(defaultOAuthOptions),
  };
  fitbit[userId] = _model;
  return _model;
};

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
  const _user = getFitbitUser();
  return _user?.displayName || 'unknown';
};

const getFitbitProfileUrl = (token: ClientOAuth2.Token) => {
  return token.sign({
    baseURL: FITBIT_API_BASE_URL,
    url: FITBIT_API_PROFILE,
  });
};

const getFitbitActivityUrl = (token: ClientOAuth2.Token) => {
  const _url = replaceToday(FITBIT_API_ACTIVITY_DAILY);
  return token.sign({
    baseURL: FITBIT_API_BASE_URL,
    url: _url,
  });
};

const getFitbitHeartRateUrl = (token: ClientOAuth2.Token) => {
  return token.sign({
    baseURL: FITBIT_API_BASE_URL,
    url: FITBIT_API_ACTIVITY_HEART_RATE,
  });
};

const getFitbitSleepUrl = (token: ClientOAuth2.Token) => {
  const _url = replaceToday(FITBIT_API_SLEEP);
  return token.sign({
    url: _url,
  });
};

const getFitbitStepUrl = (token: ClientOAuth2.Token) => {
  return token.sign({
    baseURL: FITBIT_API_BASE_URL,
    url: FITBIT_API_ACTIVITY_STEP,
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

export const getFitbitAuth = (userId?: string) => {
  const _userId: string = userId ?? '';
  let _userModel: FitbitModel = fitbit[_userId];
  if (_userModel === undefined) {
    _userModel = initFitbit(_userId);
  }
  return _userModel.auth;
};

export const getFitbitToken = async (userId?: string) => {
  const _userId: string = userId ?? '';
  let _userModel: FitbitModel = fitbit[_userId];
  if (_userModel === undefined) {
    _userModel = initFitbit(_userId);
  }
  if (_userModel.token) {
    if (_userModel.token.expired()) {
      const _updateToken = await _userModel.token
        .refresh()
        .then(updateToken => {
          setFitbitToken(updateToken, _userId);
          return updateToken;
        });
      return _updateToken;
    }
    return _userModel.token;
  } else {
    return _userModel.auth.code.getUri();
  }
};

export const setFitbitToken = (token: ClientOAuth2.Token, userId?: string) => {
  const _userId: string = userId ?? '';
  fitbit[_userId].token = token;
};

export const setFitbitProfile = (
  response: ResponseFitbitProfile,
  userId?: string
) => {
  const _userId: string = userId ?? '';
  fitbit[_userId].user = response.user;
};

export const getFitbitUser = (userId?: string) => {
  const _userId: string = userId ?? '';
  return fitbit[_userId].user;
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
    case 'heartrate': {
      return getFitbitHeartRateUrl(token);
    }
    case 'profile': {
      return getFitbitProfileUrl(token);
    }
    case 'sleep': {
      return getFitbitSleepUrl(token);
    }
    case 'step': {
      return getFitbitStepUrl(token);
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
      return 'Fitbit Response, ' + JSON.stringify(fitbitResponse);
    }
  }
};
