import {Request, Response} from 'express';
import ClientOAuth2 from 'client-oauth2';
import axios from 'axios';

const FITBIT_API_BASE_URL = 'https://api.fitbit.com/1/user/-/';
const FITBIT_API_PROFILE = '/profile.json';
const FITBIT_API_ACTIVITY_DAILY = '/activities/date/[date].json';
const FITBIT_API_ACTIVITY_STEP = '/activities/steps/date/today/1d.json';

type FitbitUnknownType =
  | boolean
  | number
  | string
  | FitbitUnknownType[]
  | {[key: string]: FitbitUnknownType};
type FitBitClockTimeDisplayFormat = '12hour' | '24hour';
type FitBitGender = 'FEMALE' | 'MALE' | 'NA';
type FitBitLocale =
  | 'en_US'
  | 'fr_FR'
  | 'de_DE'
  | 'es_ES'
  | 'en_GB'
  | 'en_AU'
  | 'en_NZ'
  | 'ja_JP';

interface FitibitUser {
  age: number;
  ambassador: boolean;
  autoStrideEnabled: boolean;
  avatar: string;
  avatar150: string;
  avatar640: string;
  averageDailySteps: number;
  challengesBeta: boolean;
  clockTimeDisplayFormat: FitBitClockTimeDisplayFormat;
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
  gender: FitBitGender;
  glucoseUnit: string;
  height: number;
  heightUnit: string;
  isBugReportEnabled: boolean;
  isChild: boolean;
  isCoach: boolean;
  languageLocale: string;
  legalTermsAcceptRequired: boolean;
  locale: FitBitLocale;
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

const getToken = async () => {
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

export const initAuth = async (req: Request, res: Response) => {
  const uri = fitbitAuth.code.getUri();
  res.redirect(uri);
};

export const authCallback = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return fitbitAuth.code.getToken(req.originalUrl).then(token => {
    console.log(token);
    fitbitToken = token;
    return res.status(200).json({
      status: 'success',
      message: 'Authorized successfully!',
      accessToken: token.accessToken,
    });
  });
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const token = await getToken();
  if (typeof token === 'string') {
    return res.redirect(token);
  }

  return axios(
    token.sign({
      baseURL: FITBIT_API_BASE_URL,
      url: FITBIT_API_PROFILE,
    })
  )
    .then(response => {
      // handle success
      console.log(response.data);
      return res.status(200).json(response.data);
    })
    .catch(error => {
      // handle error
      console.log(error);
      return res.status(400).json(error);
    });
};

export const getActivity = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const token = await getToken();
  if (typeof token === 'string') {
    return res.redirect(token);
  }

  const today = new Date();
  const formattedDate =
    today.getFullYear() +
    '-' +
    ('0' + (today.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + today.getDate()).slice(-2);
  const _url = FITBIT_API_ACTIVITY_DAILY.replace('[date]', formattedDate);
  console.log(_url);
  return axios(
    token.sign({
      baseURL: FITBIT_API_BASE_URL,
      url: _url,
    })
  )
    .then(response => {
      // handle success
      console.log(response.data);
      return res.status(200).json(response.data);
    })
    .catch(error => {
      // handle error
      console.log(error);
      return res.status(400).json(error);
    });
};

export const getStep = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const token = await getToken();
  if (typeof token === 'string') {
    return res.redirect(token);
  }

  const _url = FITBIT_API_ACTIVITY_STEP;
  console.log(_url);
  return axios(
    token.sign({
      baseURL: FITBIT_API_BASE_URL,
      url: _url,
    })
  )
    .then(response => {
      // handle success
      console.log(response.data);
      return res.status(200).json(response.data);
    })
    .catch(error => {
      // handle error
      console.log(error);
      return res.status(400).json(error);
    });
};
