import {Request, Response} from 'express';
import ClientOAuth2 from 'client-oauth2';
import axios from 'axios';

const fitbitAuth = new ClientOAuth2({
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

    token.refresh().then(updatedToken => {
      console.log(updatedToken !== token);
      console.log(updatedToken.accessToken);
    });

    token.sign({
      method: 'get',
      url: 'https://api.fitbit.com/1/user/-/',
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
  return fitbitAuth.credentials.getToken().then(token => {
    console.log(token);

    token.refresh().then(updatedToken => {
      console.log(updatedToken !== token);
      console.log(updatedToken.accessToken);
    });

    axios(
      token.sign({
        baseUrl: 'https://api.fitbit.com/1/user/-',
        url: '/profile.json',
      })
    )
      .then(response => {
        // handle success
        console.log(response);
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
  });
};
