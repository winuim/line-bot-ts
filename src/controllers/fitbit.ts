import {Request, Response} from 'express';
import axios from 'axios';
import {
  getFitbitAuth,
  getFitbitAxiosConfig,
  getFitbitToken,
  ResponseFitbitProfile,
  setFitbitProfile,
  setFitbitToken,
} from '../lib/fitbitApi';

export const initAuth = async (req: Request, res: Response) => {
  const _fitbitAuth = getFitbitAuth();
  const uri = _fitbitAuth.code.getUri();
  res.redirect(uri);
};

export const authCallback = async (
  req: Request,
  res: Response
): Promise<Response> => {
  console.log(req.path);
  const _fitbitAuth = getFitbitAuth();
  return _fitbitAuth.code
    .getToken(req.originalUrl)
    .then(token => {
      console.log(token);
      setFitbitToken(token);
      const _axiosConfig = getFitbitAxiosConfig(token, 'profile');
      return axios(_axiosConfig)
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
  const _axiosConfig = getFitbitAxiosConfig(token, 'profile');
  return axios(_axiosConfig)
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
  const _axiosConfig = getFitbitAxiosConfig(token, 'activity');
  return axios(_axiosConfig)
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
  const _axiosConfig = getFitbitAxiosConfig(token, 'step');
  return axios(_axiosConfig)
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
  const _axiosConfig = getFitbitAxiosConfig(token, 'heartrate');
  return axios(_axiosConfig)
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

export const getSleep = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const token = await getFitbitToken();
  if (typeof token === 'string') {
    return res.redirect(token);
  }
  const _axiosConfig = getFitbitAxiosConfig(token, 'sleep');
  return axios(_axiosConfig)
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
