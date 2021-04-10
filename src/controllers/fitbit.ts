import {Request, Response} from 'express';
import axios from 'axios';
import {
  fitbitAuth,
  FITBIT_API_ACTIVITY_DAILY,
  FITBIT_API_ACTIVITY_HEART_RATE,
  FITBIT_API_ACTIVITY_STEP,
  FITBIT_API_BASE_URL,
  FITBIT_API_PROFILE,
  getFitbitToken,
  ResponseFitbitProfile,
  setFitbitProfile,
  setFitbitToken,
} from '../lib/fitbitApi';

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
  return fitbitAuth.code
    .getToken(req.originalUrl)
    .then(token => {
      console.log(token);
      setFitbitToken(token);
      return axios(
        token.sign({
          baseURL: FITBIT_API_BASE_URL,
          url: FITBIT_API_PROFILE,
        })
      )
        .then(response => {
          // handle success
          console.log(response.data);
          const profile = response.data as ResponseFitbitProfile;
          setFitbitProfile(profile);
          return res.status(200).json({
            status: 'success',
            message: 'Authorized successfully!',
            displayName: profile.user.displayName,
          });
        })
        .catch(error => {
          // handle error
          console.log(error);
          return res.status(error.response.status).send(error.message);
        });
    })
    .catch(error => {
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
      return res.status(error.response.status).send(error.message);
    });
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const token = await getFitbitToken();
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
      const profile = response.data as ResponseFitbitProfile;
      return res.status(200).json(profile.user);
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
  const token = await getFitbitToken();
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

export const getSteps = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const token = await getFitbitToken();
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
  const token = await getFitbitToken();
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
