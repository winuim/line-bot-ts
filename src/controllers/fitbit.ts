import {Request, Response} from 'express';
import axios from 'axios';
import {
  Fitbit,
  getFitbitAxiosConfig,
  getFitbitToken,
  ResponseFitbitProfile,
} from '../lib/fitbitApi';

export const initAuth = async (req: Request, res: Response) => {
  const fitbit = new Fitbit();
  const uri = fitbit.authorizeURL();
  res.redirect(uri);
};

export const authCallback = async (
  req: Request,
  res: Response
): Promise<Response> => {
  console.log(req.query);
  const fitbit = new Fitbit();
  return fitbit.authorizeCallback(req.originalUrl).then(token => {
    console.log(token);
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
