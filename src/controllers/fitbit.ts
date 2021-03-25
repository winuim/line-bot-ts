import {Request, Response} from 'express';
import ClientOAuth2 from 'client-oauth2';
import axios from 'axios';

const FITBIT_API_BASE_URL = 'https://api.fitbit.com/1/user/-/';
const FITBIT_API_PROFILE = '/profile.json';

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
});

let fitbitToken: ClientOAuth2.Token;

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

    token.refresh().then(updatedToken => {
      console.log(updatedToken !== token);
      console.log(updatedToken.accessToken);
    });

    return res.status(200).json({
      status: 'success',
      message: 'Authorized successfully!',
    });
  });
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  fitbitToken.refresh().then(updatedToken => {
    console.log(updatedToken !== fitbitToken);
    console.log(updatedToken.accessToken);
  });

  axios(
    fitbitToken.sign({
      baseURL: FITBIT_API_BASE_URL,
      url: FITBIT_API_PROFILE,
    })
  )
    .then(response => {
      // handle success
      console.log(response.data);
    })
    .catch(error => {
      // handle error
      console.log(error);
    })
    .then(() => {
      // always executed
    });

  return res.status(200).json({
    status: 'success',
    message: 'Authorized successfully!',
  });
};
