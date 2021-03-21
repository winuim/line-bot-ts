import {Request, Response} from 'express';
import ClientOAuth2 from 'client-oauth2';

const fitbitAuth = new ClientOAuth2({
  clientId: process.env.FITBIT_CLIENT_ID,
  clientSecret: process.env.FIBIT_CLIENT_SECRET,
  accessTokenUri: 'https://api.fitbit.com/oauth2/token',
  authorizationUri: 'https://www.fitbit.com/oauth2/authorize',
  redirectUri: 'https://winuim-line-bot.glitch.me/fitbit/callback',
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
  return fitbitAuth.code.getToken(req.originalUrl).then(user => {
    console.log(user);

    user.refresh().then(updatedUser => {
      console.log(updatedUser !== user);
      console.log(updatedUser.accessToken);
    });

    return res.send(user.accessToken);
  });
};
