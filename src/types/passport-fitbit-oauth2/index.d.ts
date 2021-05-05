declare module 'passport-fitbit-oauth2' {
  import {Request} from 'express';
  import {Strategy} from 'passport';
  import {OAuth2} from 'oauth';
  import OAuth2Strategy from 'passport-oauth2';

  declare class FitbitOAuth2Strategy extends OAuth2Strategy {
    constructor(
      options: OAuth2Strategy.StrategyOptions,
      verify: OAuth2Strategy.VerifyFunction
    );
    constructor(
      options: OAuth2Strategy.StrategyOptionsWithRequest,
      verify: OAuth2Strategy.VerifyFunctionWithRequest
    );

    authenticate(req: Request, options?: any): void;

    authorizationParams(options: any): object;

    userProfile(
      accessToken: string,
      done: (err?: Error | null, profile?: any) => void
    ): void;
  }

  declare namespace FitbitOAuth2Strategy {
    type Strategy = FitbitOAuth2Strategy;
    const Strategy: typeof FitbitOAuth2Strategy;
  }
}
