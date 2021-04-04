import {Request, Response} from 'express';
import ClientOAuth2 from 'client-oauth2';
import axios from 'axios';
import {
  FITBIT_API_ACTIVITY_DAILY,
  FITBIT_API_ACTIVITY_HEART_RATE,
  FITBIT_API_ACTIVITY_STEP,
  FITBIT_API_BASE_URL,
  FITBIT_API_PROFILE,
} from '../lib/fitbitApi';

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

  const _url = replaceToday(FITBIT_API_ACTIVITY_DAILY);
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

export const getHeartRate = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const token = await getToken();
  if (typeof token === 'string') {
    return res.redirect(token);
  }

  const _url = FITBIT_API_ACTIVITY_HEART_RATE;
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
